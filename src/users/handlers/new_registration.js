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
  const updateData = {
    hasSsnOrItin: payload.value === '1' ? true : false,             
    SsnOrItinNumber: payload.ssn,             
    zip: payload.zipCode,         
    holdingNumber: payload.holdingNo,       
    userImage: payload.profilePhoto,  
    coverImage: payload.coverPhoto,    
    aboutUser: '',       
    countryCode: payload.country_code,  
    phone: payload.phone,  
}
console.log('updateData', updateData)
console.log('holdingNumber',typeof updateData.holdingNumber)
try {
    const userId = await Helpers.extractUserId(request)
    console.log('fdsfdf', userId)
    const user = await Users.findOneAndUpdate({
      _id: userId
    }, {
      $set: updateData
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
  path: '/new/register_user_data',
  config: {
    auth: 'jwt',
    tags: ['api', 'register_users'],
    description: 'New user update own data',
    notes: ['On success, returns { "data": [ { "users" } ]}'],
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}