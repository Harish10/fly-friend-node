import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/users'

/** 
Api to create new user
**/

let defaults = {}
const handler = async (request, reply) => {
  try {
		let payload = request.payload
    const user = await Users.findOne({
      resetPasswordToken: payload.resetToken
    })
    if (!user) {
      return reply({
        status: true,
        message: 'Your reset token is expired'
      }) 
    } else {
      const hash = Helpers.hashPassword(payload.password)
      await Users.findOneAndUpdate({ _id: user._id }, { $set:{ resetPasswordToken: '', password: hash } })
      // email service
      return reply({
        status: true,
        message: 'Password updated successfully.'
      })
    }
  } catch (error) {
		return reply({
			status: false,
			message: error.message
		})
  }
}

const routeConfig = {
  method: 'POST',
  path: '/user/reset',
  config: {
    tags: ['api', 'users'],
    description: 'Reset User.',
    notes: ['On success'],
    validate: {
      payload: {
        password: Joi.string().required(),
        resetToken: Joi.string().required()     
      }
    },
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}