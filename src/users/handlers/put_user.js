import Hoek from 'hoek'
import Joi from 'joi'
import _ from 'lodash'
import Helpers from '../../helpers'
import Users from '../../models/users'
import AwsServices from '../../services/aws_service'
const awsServices = new AwsServices()
/*
 * Api to edit user through token
 **/
let defaults = {}

const handler = async (request, reply) => {
  let payload = request.payload
  try {
    const userId = await Helpers.extractUserId(request)
    const user = await Users.findOneAndUpdate({
      _id: userId
    }, {
      $set: payload
    }, {
      new: true
    })
    return reply({
      status: true,
      message: 'User info updated successfully.',
      data: user
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
  path: '/user/update',
  config: {
    auth: 'jwt',
    tags: ['api', 'users'],
    description: 'To update user details',
    notes: ['On success, returns { "data": [ { "users" } ]}'],
    validate: {
      payload: {
        firstname: Joi.string().optional(),
        lastname: Joi.any().optional(),
        image: Joi.any().optional(),
        imageName: Joi.any().optional(),
        email: Joi.string().optional(),
        username: Joi.string().optional(),
        status: Joi.any().optional()
      }
    },
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}