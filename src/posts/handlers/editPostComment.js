import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Project from '../../models/projects'
import Users from '../../models/users'
import CommentPost from '../../models/commentPost'

/** 
Api to edit post comment
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
        var postCommentData=await CommentPost.findOne({$and:[{_id:commentId},{userId:userId}]});
        if(postCommentData){
        // console.log(projectCommentData);
        var project=await CommentPost.findOneAndUpdate({_id:commentId},{$set:{comment:payload.comment}},{new:true});
        if(project){
          // console.log(project);
        return reply({
          status: true,
          message: "Updated Post Comment Successfully..."
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
  path: '/post/editPostComment',
  config: {
    auth:'jwt',
    tags: ['api', 'users'],
    description: 'Update FlyFriends post comment.',
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