import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Project from '../../models/projects'
import Users from '../../models/users'
import CommentProjects from '../../models/commentProjects'

/** 
Api to edit project comment
**/

let defaults = {}
const handler = async (request, reply) => {
  try {
      const userId = await Helpers.extractUserId(request)
      console.log(userId);
      const user = await Users.findOne({
      _id: userId
      });
      if(user){
        var payload=request.payload;
        // console.log("payload",payload)
        var commentId=payload.commentId;
        var projectCommentData=await CommentProjects.findOne({$and:[{_id:commentId},{userId:userId}]});
        if(projectCommentData){
        // console.log(projectCommentData);
        var project=await CommentProjects.findOneAndUpdate({_id:commentId},{$set:{comment:payload.comment}},{new:true});
        if(project){
          // console.log(project);
        return reply({
          status: true,
          message: "Updated Project Comment Successfully..."
        })
        }else{
          console.log('ss')
        }   
        }else{
        return reply({
          status: true,
          message: "Please enter valid commentId..."
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
  path: '/user/editProjectComment',
  config: {
    auth:'jwt',
    tags: ['api', 'users'],
    description: 'Update FlyFriends project comment.',
    notes: ['On success'],
    validate: {
      payload: {
        comment:Joi.string().optional(),
        commentId:Joi.string().optional(),
        }
    },
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}