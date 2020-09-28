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
      // console.log(userId);
      const user = await Users.findOne({
      _id: userId
      });
      if(user){
        var payload=request.payload;
        // console.log("payload",payload)
        var commentId=payload.commentId;
        var projectCommentData=await CommentProjects.findOne({_id:commentId});
        if(projectCommentData){
        var projectId=projectCommentData.projectId;
        // console.log(projectId);
        var projectData=await Project.findOne({_id:projectId});
        // console.log("projectData",projectData)
        var projectComment=projectData.comments;
        var projectCommentArray=[];
        for(var i=0;i<projectComment.length;i++){
          if(projectComment[i]==commentId){

          }else{
            projectCommentArray.push(projectComment[i]);
          }
        }
        await Project.findOneAndUpdate({_id:projectId},{$set:{comments:projectCommentArray}},{new:true});
        var project=await CommentProjects.findOneAndRemove({_id:commentId});
        if(project){
          // console.log(project);
        return reply({
          status: true,
          message: "Remove Project Comment Successfully..."
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
  path: '/user/removeProjectComment',
  config: {
    auth:'jwt',
    tags: ['api', 'users'],
    description: 'Remove FlyFriends project comment.',
    notes: ['On success'],
    validate: {
      payload: {
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