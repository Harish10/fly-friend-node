import Hoek from 'hoek'
import Joi from 'joi'
import _ from 'lodash'
import Helpers from '../../helpers'
import Users from '../../models/users'
import AwsServices from '../../services/aws_service'
const awsServices = new AwsServices()
/*
 * Api to update user through token
 **/
let defaults = {}

const handler = async (request, reply) => {
  let payload = request.payload
try {
    const userId = await Helpers.extractUserId(request)
    let user = []
    if(payload.type === 'work_edit'){
      user = await Users.findOneAndUpdate(
                    { _id: userId, 'workDetails._id': payload.id }, 
                    { $set: { 'workDetails.$.privacy': payload.privacy } }
                  )
    }else if(payload.type === 'college_edit'){
      user = await Users.findOneAndUpdate(
                    { _id: userId, 'collegeDetails._id': payload.id }, 
                    { $set: { 'collegeDetails.$.privacy': payload.privacy } }
                  )
    }else if(payload.type === 'school_edit'){
      user = await Users.findOneAndUpdate(
                        { _id: userId, 'schoolDetails._id': payload.id }, 
                        { $set: { 'schoolDetails.$.privacy': payload.privacy } }
                      )
    }else if(payload.type === 'fav_edit'){
      user = await Users.findOneAndUpdate(
                        { _id: userId, 'favouriteQuotes._id': payload.id }, 
                        { $set: { 'favouriteQuotes.$.privacy': payload.privacy } }
                      )
    }
    return reply({
      status: true,
      message: 'User info updated successfully.'
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
  path: '/user/update_user_privacey',
  config: {
    auth: 'jwt',
    tags: ['api', 'register_users_update'],
    description: 'update own data',
    notes: ['On success, returns { "data": [ { "users" } ]}'],
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}