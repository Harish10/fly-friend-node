import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Project from '../../models/projects'
import Users from '../../models/users'

/** 
Api to create project
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
        var tags= payload.tags;
        var tagLength=tags.length;
        // console.log(tagLength);
        var payloadData={
          title:payload.title,
          tags:payload.tags,
          description:payload.description,
          projectImage:payload.projectImage,
          userId:userId
        }
        var obj=await new Project(payloadData);
        var project=await obj.save();
        if(project){
        return reply({
          status: true,
          message: "Added New Project Successfully..."
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
  path: '/user/addProject',
  config: {
    auth:'jwt',
    tags: ['api', 'users'],
    description: 'Create FlyFriends project.',
    notes: ['On success'],
    validate: {
      payload: {
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