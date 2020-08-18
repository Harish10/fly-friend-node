import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import CommentProjects from '../../models/commentProjects'
import Users from '../../models/users'
import Project from '../../models/projects'

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
        // var tags= payload.tags;
        // var tagLength=tags.length;
        // // console.log(tagLength);
        var payloadData={
          name:payload.name,
          email:payload.email,
          comment:payload.comment,
          projectId:payload.projectId,
          userId:userId
        }
        var obj=await new CommentProjects(payloadData);
        // console.log(obj)
        var project=await obj.save();
        if(project){
          // console.log(project)
          var ProjectPush=await Project.findOneAndUpdate({_id:payload.projectId},{$push:{comments:project._id}})
        return reply({
          status: true,
          message: "Added Comment On Project Successfully..."
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
  path: '/user/addCommentProject',
  config: {
    auth:'jwt',
    tags: ['api', 'users'],
    description: 'Create  Comment on FlyFriends project.',
    notes: ['On success'],
    validate: {
      payload: {
        comment: Joi.string().optional(),
        projectId: Joi.string().optional(),
        name: Joi.string().optional(),
        email: Joi.string().optional()
        }
    },
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}