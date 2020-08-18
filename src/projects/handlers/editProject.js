import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Project from '../../models/projects'
import Users from '../../models/users'

/** 
Api to edit project
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
        var projectData=await Project.findOne({
          _id:projectId
        })
        if(projectData){
        // console.log(tagLength);
        if(payload.title){
         var title=payload.title;
        }else{
          var title=projectData.title;
        }
        if(payload.description){
         var description=payload.description;
        }else{
          var description=projectData.description;
        }
        if(payload.projectImage){
         var projectImage=payload.projectImage;
        }else{
          var projectImage=projectData.projectImage;
        }
        if(payload.tags){
          var tags=payload.tags;
        }else{
          var tags=projectData.tags
        }
        var payloadData={
          title:title,
          description:description,
          projectImage:projectImage,
          tags:tags
        }
        var project=await Project.findOneAndUpdate({_id:projectId},{$set:payloadData},{new:true});
        if(project){
        return reply({
          status: true,
          message: "Updated Project Successfully..."
        })
        }   
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
  path: '/user/editProject',
  config: {
    auth:'jwt',
    tags: ['api', 'users'],
    description: 'Update FlyFriends project.',
    notes: ['On success'],
    validate: {
      payload: {
        projectId:Joi.string().optional(),
        title: Joi.string().optional(),
        description: Joi.string().optional(),
        tags: Joi.array().optional(),
        projectImage: Joi.array().optional()
        }
    },
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}