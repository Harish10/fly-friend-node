import Hoek from 'hoek'

import Helpers from '../../helpers'
import Users from '../../models/users'
import Friend from '../../models/friends'
import FollowFriends from '../../models/followers'

let defaults = {}
/*
 * Here is the api for send friend request
 **/
const handler = async (request, reply) => {
  const payload = request.payload
  const requesterId = payload.requester
  const recipientId = payload.recipient
  try {
    if(payload.requestType === 'add_friend'){
        const docA =  await Friend.findOneAndUpdate(
                        { requester: requesterId, recipient: recipientId },
                        { $set: { status: 1 }},
                        { upsert: true, new: true }
                      )
        const docB =  await Friend.findOneAndUpdate(
                          { recipient: requesterId, requester: recipientId },
                          { $set: { status: 2 }},
                          { upsert: true, new: true }
                      )
        const updateUserA = await Users.findOneAndUpdate(
                                { _id: requesterId },
                                { $push: { friends: docA._id }}
                            )
        const updateUserB = await Users.findOneAndUpdate(
                                { _id: recipientId },
                                { $push: { friends: docB._id }}
                            )
    }else if(payload.requestType === 'confirm_request'){
      // this is for accept friend request
        const updateUserA = await Friend.findOneAndUpdate(
                                { requester: requesterId, recipient: recipientId },
                                { $set: { status: 3 }}
                            )
        const updateUserB = await Friend.findOneAndUpdate(
                                { recipient: requesterId, requester: recipientId },
                                { $set: { status: 3 }}
                            )
      // when accept friend request after start follow friend automatically
      const followDoc =  await FollowFriends.findOneAndUpdate(
                            { requester: recipientId, recipient: requesterId },
                            { $set: { status: 1 }},
                            { upsert: true, new: true }
                          )
      const updateFollowUser = await Users.findOneAndUpdate(
                            { _id: recipientId },
                            { $push: { followers: followDoc._id }}
                        )
      //this is end of follow firend automatically
    }else if(payload.requestType === 'delete_request' || payload.requestType === 'cancel_request'){
      //this is for delete and cancel add friend request  
      const docA =  await Friend.findOneAndRemove(
                        { requester: requesterId, recipient: recipientId }
                      )
        const docB =  await Friend.findOneAndRemove(
                          { recipient: requesterId, requester: recipientId }
                      )
        const updateUserA = await User.findOneAndUpdate(
                                { _id: requesterId },
                                { $pull: { friends: docA._id }}
                            )
        const updateUserB = await User.findOneAndUpdate(
                                { _id: recipientId },
                                { $pull: { friends: docB._id }}
                            )
        
        // this is for follow friends delete request
        const followDocA =  await FollowFriends.findOneAndRemove(
                              { requester: requesterId, recipient: recipientId }
                            )
      
        const updateFollowUser = await User.findOneAndUpdate(
                              { _id: requesterId },
                              { $pull: { friends: followDocA._id }}
                          )

    }else if(payload.requestType === 'follow_friend'){
      const followDoc =  await FollowFriends.findOneAndUpdate(
                          { requester: requesterId, recipient: recipientId },
                          { $set: { status: 1 }},
                          { upsert: true, new: true }
                        )
      const updateFollowUser = await Users.findOneAndUpdate(
                                  { _id: requesterId },
                                  { $push: { followers: followDoc._id }}
                               )
    }else if(payload.requestType === 'delete_follower_friend'){
      const followDocA =  await FollowFriends.findOneAndRemove(
              { requester: requesterId, recipient: recipientId }
            )
     
      const updateUserA = await User.findOneAndUpdate(
                            { _id: requesterId },
                            { $pull: { friends: followDocA._id }}
                        )
    }

    return reply({
      status: true,
      message: 'friend request done...',
      data: []
    })
  } catch (error) {
    return reply({
      status: false,
      message: error.message,
      data: {}
    })
  }
}

const routeConfig = {
  method: 'POST',
  path: '/add_friend_request',
  config: {
    auth: 'jwt',
    tags: ['api', 'add_friend'],
    description: 'Returns a add friend object',
    notes: [],
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}