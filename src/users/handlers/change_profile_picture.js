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
const userId = await Helpers.extractUserId(request)
let payload = request.payload
try {
    const user = await Users.findOneAndUpdate({
        _id: userId
      }, {
        $set: { 'profileImage': payload.data.image, 'userImage': payload.data.image }
      }, {
        new: true
      })
      return reply({
        status: true,
        message: 'User profile picture updated successfully.',
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
  path: '/user/change_profile_picture',
  config: {
    auth: 'jwt',
    tags: ['api', 'upload_image'],
    description: 'update own image',
    notes: ['On success, returns { "data": [ { "users" } ]}'],
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}