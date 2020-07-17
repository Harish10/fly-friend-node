import Hoek from 'hoek'

import Helpers from '../../helpers'
import Users from '../../models/users'

let defaults = {}
/*
 * Here is the api for get search records
 **/
const handler = async (request, reply) => {
  const payload = request.payload
  try {
    // const user = await Users.findOne({
    //   _id: Object(payload) 
    // }).lean()

    const user = await Users.find({
        "$expr": {
          "$regexMatch": {
            "input": { "$concat": ["$firstName", " ", "$lastName"] },
            "regex": payload,  //Your text search here
            "options": "i"
          }
        }
      })

    return reply({
      status: true,
      message: 'user fetched successfully',
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
  path: '/search_users',
  config: {
    auth: 'jwt',
    tags: ['api', 'sarch'],
    description: 'Returns a search object',
    notes: [],
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}