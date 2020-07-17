import Hoek from 'hoek'

import Helpers from '../../helpers'
import Users from '../../models/users'

let defaults = {}
/*
 * Here is the api for get record based on object id
 **/
const handler = async (request, reply) => {
  const payload = request.payload
  try {
    // const id = await Helpers.extractUserId(request)
    const user = await Users.findOne({
      _id: Object(payload) 
    }).lean()
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