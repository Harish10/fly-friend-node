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
    let user = []
    if(payload.type === 'work_edit'){
      user = await Users.findOneAndUpdate(
                    { _id: userId, 'workDetails._id': payload.id }, 
                    { $set: {  'workDetails.$.companyName': payload.companyName, 'workDetails.$.position': payload.position, 'workDetails.$.city': payload.city, 'workDetails.$.description': payload.description, 'workDetails.$.currentlyWorkCheck': payload.currentlyWorkCheck, 'workDetails.$.fromDate': payload.fromDate, 'workDetails.$.toDate': payload.toDate, 'workDetails.$.privacy': payload.privacy } }
                  )
    }else if(payload.type === 'college_edit'){
      user = await Users.findOneAndUpdate(
                    { _id: userId, 'collegeDetails._id': payload.id }, 
                    { $set: {  'collegeDetails.$.collegeName': payload.collegeName, 'collegeDetails.$.courseName': payload.courseName, 'collegeDetails.$.degreeName': payload.degreeName, 'collegeDetails.$.description': payload.description, 'collegeDetails.$.graduated': payload.graduated, 'collegeDetails.$.fromDate': payload.fromDate, 'collegeDetails.$.toDate': payload.toDate, 'collegeDetails.$.privacy': payload.privacy } }
                  )
    }else if(payload.type === 'school_edit'){
      user = await Users.findOneAndUpdate(
                        { _id: userId, 'schoolDetails._id': payload.id }, 
                        { $set: {  'schoolDetails.$.schoolName': payload.schoolName, 'schoolDetails.$.description': payload.description, 'schoolDetails.$.graduated': payload.graduated, 'schoolDetails.$.fromDate': payload.fromDate, 'schoolDetails.$.toDate': payload.toDate, 'schoolDetails.$.privacy': payload.privacy } }
                      )
    }else if(payload.type === 'activity_edit'){
      user = await Users.findOneAndUpdate(
                        { _id: userId, 'activities._id': payload.id }, 
                        { $set: {  'activities.$.title': payload.activityTitle, 'activities.$.description': payload.description, 'activities.$.image': payload.activityImage } }
                      )
    }else if(payload.type === 'fav_edit'){
      user = await Users.findOneAndUpdate(
                        { _id: userId, 'favouriteQuotes._id': payload.id }, 
                        { $set: {  'favouriteQuotes.$.title': payload.favTitle, 'favouriteQuotes.$.privacy': payload.privacy } }
                      )
    }
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
  path: '/new/register_update_user_details',
  config: {
    auth: 'jwt',
    tags: ['api', 'register_users_update'],
    description: 'New user update own data',
    notes: ['On success, returns { "data": [ { "users" } ]}'],
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}