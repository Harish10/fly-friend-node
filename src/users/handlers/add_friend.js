import Hoek from 'hoek'

import Helpers from '../../helpers'
import Users from '../../models/users'
import Friend from '../../models/friends'

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
        const updateUserA = await Friend.findOneAndUpdate(
                                { requester: requesterId, recipient: recipientId },
                                { $set: { status: 3 }}
                            )
        const updateUserB = await Friend.findOneAndUpdate(
                                { recipient: requesterId, requester: recipientId },
                                { $set: { status: 3 }}
                            )
    }else if(payload.requestType === 'delete_request' || payload.requestType === 'cancel_request'){
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
    }else if(payload.requestType === 'friends'){

    }
    return reply({
      status: true,
      message: 'Sent add freind request',
      // data: {}
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