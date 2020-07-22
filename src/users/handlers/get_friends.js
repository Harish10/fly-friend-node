import Hoek from 'hoek'

import Helpers from '../../helpers'
import Users from '../../models/users'
import Friend from '../../models/friends'
import mongoose from 'mongoose';

let defaults = {}
/*
 * Here is the api for get record based on object id
 **/
const handler = async (request, reply) => {
  const payload = request.payload
  try {
      const id = await Helpers.extractUserId(request)

      const user = await Friend.aggregate([
                        { $match: { requester: mongoose.Types.ObjectId(payload.requester), status: 3 }},
                            { "$lookup": {
                                "from": Users.collection.name,
                                let: { recipient :"$recipient"},
                                "pipeline": [
                                    { $match: { $expr: { $eq: ["$$recipient", "$_id"] }}},
                                    { $project: { firstName: 1, lastName: 1, profileImage: 1 }}
                                ],
                                "as": "users"
                            }}
                        ])
    
    return reply({
      status: true,
      message: 'Get friend successfully',
      data: user ? user : {}
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
  path: '/get_add_friends',
  config: {
    auth: 'jwt',
    tags: ['api', 'me'],
    description: 'Returns a user object.',
    notes: [],
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}