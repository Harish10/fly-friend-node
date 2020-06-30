import Joi from 'joi'
import Hoek from 'hoek'
import Users from '../../models/users'
import Reviews from '../../models/reviews'
/*
 * Api to delete user
 **/
let defaults = {}

const handler = async (request, reply) => {
  try {
    await Users.deleteOne({
      _id: request.params.id
    })
    await Reviews.remove({
      "userId": request.params.id
    }, {
      multi: true
    })
    return reply({
      status: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    return reply({
      status: false,
      message: error.message
    })
  }
}


const routeConfig = {
  method: 'DELETE',
  path: '/user/{id}',
  config: {
    auth: 'jwt',
    tags: ['api', 'users', 'delete'],
    description: 'delete user',
    notes: [],
    validate: {
      params: {
        id: Joi.string().required()
      }
    },
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}