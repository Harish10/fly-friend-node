import Hoek from 'hoek'

import Helpers from '../../helpers'
import Users from '../../models/users'

let defaults = {}
/*
 * Here is the api for get all friends records
 **/
const handler = async (request, reply) => {
  const payload = request.payload
  try {
    const user = await Users.find({})
    return reply({
      status: true,
      message: 'user search successfully',
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
  path: '/friends/get_all_friends',
  config: {
    auth: 'jwt',
    tags: ['api', 'allFriends'],
    description: 'Returns a all friends object',
    notes: [],
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}