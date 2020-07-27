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
		const email = _.get(payload, 'email', '')
    const user = await Users.findOne({
      email
    })
    if (!user) {
			payload.password = Helpers.hashPassword(payload.password);
			const newUser = new Users(payload)
			await newUser.save();
      const token = Helpers.createJwt(newUser);
      return reply({
        status: true,
        message: 'User created successfully',
        data: token,
        userData: newUser ? newUser : {}
      })
		} else {
			return reply({
				status: false,
				message: 'Email already exists',
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
  path: '/user/signup',
  config: {
    tags: ['api', 'users'],
    description: 'Create FlyFriends User Account.',
    notes: ['On success'],
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
				phone: Joi.string().required(),
				role: Joi.string().required(), 
				countryCode: Joi.string().required() 
      }
    },
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}