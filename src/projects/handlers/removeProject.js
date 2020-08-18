import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Project from '../../models/projects'
import Users from '../../models/users'

/** 
Api to remove project
**/

let defaults = {}
const handler = async (request, reply) => {
  try {
      const userId = await Helpers.extractUserId(request)
      const user = await Users.findOne({
      _id: userId
      });
      if(user){
        var payload=request.payload;
        var projectId=payload.projectId;
         var project=await Project.findOneAndRemove({_id:projectId});
        if(project){
        return reply({
          status: true,
          message: "Deleted Project Successfully..."
        })
           
        }else{
        return reply({
          status: true,
          message: "Please enter valid projectId..."
        })
        }  
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
  path: '/user/removeProject',
  config: {
    auth:'jwt',
    tags: ['api', 'users'],
    description: 'Delete FlyFriends project.',
    notes: ['On success'],
    validate: {
      payload: {
        projectId:Joi.string().required()
        }
    },
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}