import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/users'

/** 
Api to Sign in user
**/

let defaults = {}
const handler = async (request, reply) => {
  try {
    let payload = request.payload;
		// console.log(payload)
		const email = _.get(payload, 'username',"");
		const password = _.get(payload, 'password',"");
		const user = await Users.findOne({
			email
		});
		if (user){
			const match = Helpers.matchPassword(password, user.password);
			if(match) {
				const token = Helpers.createJwt(user);
				console.log(user)
				return reply({
					status: true,
					message: "Login successfully",
					data: token,
					userData: user ? user : {}
				}) 
			} else {
				return reply({
					status: false,
					message: "Your password is incorrect"
				})   
			}
		} else {
			return reply({
				status: false,
				message: "Your email is incorrect"
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
  path: '/user/login',
  config: {
  	tags: ['api', 'users'],
    description: 'Login FlyFriends Account.',
    notes: ['On success'],
    validate: {
    	payload: {
        username:Joi.string().required(),
        password: Joi.string().required()
      }
    },
    handler
  }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}