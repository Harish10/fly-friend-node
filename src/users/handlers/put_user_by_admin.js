import Hoek from 'hoek'
import Joi from 'joi'
import Users from '../../models/users'

let defaults = {}

const handler = async (request, reply) => {
  const payload = request.payload
  try {
    const id = request.params.id
    await Users.findOneAndUpdate({
      _id: id
    }, {
      $set: payload
    }, {
      new: true
    })
    return reply({
      status: true,
      message: 'Changes saved successfully.',
      data: Users
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
  method: 'PUT',
  path: '/user/{id}',
  config: {
    tags: ['api', 'update user'],
    description: 'To update user details by admin',
    notes: [],
    validate: {
      payload: {
        managerId: Joi.any().optional(),
        firstname: Joi.string().optional(),
        lastname: Joi.string().optional(),
        // image: Joi.string().optional(),
        email: Joi.any().optional(),
        phone: Joi.string().optional(),
        buildings: Joi.any().optional()
      }
    },
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}