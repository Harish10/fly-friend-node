import Hoek from 'hoek'

import Helpers from '../../helpers'
import Users from '../../models/users'
import Friend from '../../models/friends'
import FollowFriends from '../../models/followers'
import mongoose from 'mongoose';

let defaults = {}
/*
 * Here is the api for get record based on object id
 **/
const handler = async (request, reply) => {
  console.log(payload)
  const payload = request.payload
  try {
    const id = await Helpers.extractUserId(request)
    console.log("id",id)
    // const user = await Users.findOne({
    //   _id: payload
    // }).lean()

    const user = await Users.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(payload) }},
      { "$lookup": {
        "from": Friend.collection.name,
        "pipeline": [
          { "$match": {
            "recipient": mongoose.Types.ObjectId(payload),
            "requester": mongoose.Types.ObjectId(id)
          }},
          { "$project": { "status": 1 } }
        ],
        "as": "friends"
      }},
      { "$lookup": {
        "from": FollowFriends.collection.name,
        "pipeline": [
          { "$match": {
            "recipient": mongoose.Types.ObjectId(payload),
            "requester": mongoose.Types.ObjectId(id)
          }},
          { "$project": { "status": 1 } }
        ],
        "as": "followers"
      }},
    ])

    console.log("user",user[0])

    return reply({
      status: true,
      message: 'user fetched successfully',
      data: user[0] ? user[0] : {}
    })
  } catch (error) {
    console.log(error)
    return reply({
      status: false,
      message: error.message,
      data: {}
    })
  }
}

const routeConfig = {
  method: 'POST',
  path: '/get_user_by_id',
  config: {
    auth: 'jwt',
    tags: ['api', 'me'],
    description: 'Returns a user object based on JWT along with a new token.',
    notes: [],
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}