import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import NotifyUsers from '../../models/notifyUsers'

/** 
Api to create new user
**/

let defaults = {}
const handler = async (request, reply) => {
  try {
		let payload = request.payload
		const email = _.get(payload, 'email', '')
    const user = await NotifyUsers.findOne({
      email
    })
    if (!user) {
      await NotifyUsers.create(payload)
    }
    return reply({
      status: true,
      message: 'Notify successfully'
    }) 
  } catch (error) {
		return reply({
			status: false,
			message: error.message
		})
  }
}

const routeConfig = {
  method: 'POST',
  path: '/user/notify',
  config: {
    tags: ['api', 'users'],
    description: 'Notify User.',
    notes: ['On success'],
    validate: {
      payload: {
        email: Joi.string().required()    
      }
    },
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}