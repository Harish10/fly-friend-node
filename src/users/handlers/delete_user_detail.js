import Hoek from 'hoek'
import Joi from 'joi'
import _ from 'lodash'
import Helpers from '../../helpers'
import Users from '../../models/users'
import AwsServices from '../../services/aws_service'
const awsServices = new AwsServices()
/*
 * Api to delete user through token
 **/
let defaults = {}

const handler = async (request, reply) => {
  let payload = request.payload
try {
    const userId = await Helpers.extractUserId(request)
    let user = []
    if(payload.type === 'work_delete'){
      user = await Users.findOneAndUpdate(
                        { _id: userId,  }, 
                        { $pull: { 'workDetails': {_id: payload.id} }},
                    )
    }else if(payload.type === 'college_delete'){
      user = await Users.findOneAndUpdate(
                        { _id: userId,  }, 
                        { $pull: { 'collegeDetails': {_id: payload.id} }},
                    )
    }else if(payload.type === 'school_delete'){
      user = await Users.findOneAndUpdate(
                        { _id: userId,  }, 
                        { $pull: { 'schoolDetails': {_id: payload.id} }},
                    )
    }else if(payload.type === 'activity_delete'){
      user = await Users.findOneAndUpdate(
                        { _id: userId,  }, 
                        { $pull: { 'activities': {_id: payload.id} }},
                    )
    }else if(payload.type === 'fav_delete'){
      user = await Users.findOneAndUpdate(
                        { _id: userId,  }, 
                        { $pull: { 'favouriteQuotes': {_id: payload.id} }},
                    )
    }
    return reply({
      status: true,
      message: 'User info deleted successfully...',
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
  path: '/user/delete_user_detail',
  config: {
    auth: 'jwt',
    tags: ['api', 'delete_user'],
    description: 'New user delete own data',
    notes: ['On success, returns { "data": [ { "users" } ]}'],
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}