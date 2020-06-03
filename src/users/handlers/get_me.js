import Hoek from 'hoek'

import Helpers from '../../helpers'
import Users from '../../models/users'

let defaults = {}
/*
 * Here is the api for get login user record based on jwt token
 **/
const handler = async (request, reply) => {
  try {
    const id = await Helpers.extractUserId(request)
    const user = await Users.findOne({
      _id: id
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
  method: 'GET',
  path: '/me',
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