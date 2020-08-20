import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/users'
import EmailService from '../../services/email_service.js';

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
      return reply({
        status: true,
        message: 'Email not found'
      }) 
    } else {
      const resetPasswordToken = Helpers.generateSalt()
      await Users.findOneAndUpdate({ _id: user._id }, {$set: { resetPasswordToken }});
      // email service
      var body={
          email:email,
          // link:`${process.env.WEB_HOST}/updatePassword/`+resetPasswordToken
          link:`http://localhost:3002/updatePassword/`+resetPasswordToken
      }
      await EmailService.sendMail(body,function(err,data){
        console.log('mail sent');
      })      
      return reply({
        status: true,
        message: 'Please check your inbox.'
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
  path: '/user/forgotPassword',
  config: {
    tags: ['api', 'users'],
    description: 'Forgot User.',
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