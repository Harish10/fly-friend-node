import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Posts from '../../models/posts'
import Users from '../../models/users'
import CommentPost from '../../models/commentPost'

/** 
Api to remove Post  comment
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
        var postCommentData=await CommentPost.findOne({_id:commentId});
        if(postCommentData){
        var postId=postCommentData.postId;
        console.log("post",postId);
        var postData=await Posts.findOne({_id:postId});
        // console.log("projectData",projectData)
        var postComment=postData.comments;
        var postCommentArray=[];
        for(var i=0;i<postComment.length;i++){
          if(postComment[i]==commentId){

          }else{
            postCommentArray.push(postComment[i]);
          }
        }
        await Posts.findOneAndUpdate({_id:postId},{$set:{comments:postCommentArray}},{new:true});
        var Post=await CommentPost.findOneAndRemove({_id:commentId});
        if(Post){
          // console.log(project);
        return reply({
          status: true,
          message: "Remove Post Comment Successfully..."
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
  path: '/post/removePostComment',
  config: {
    auth:'jwt',
    tags: ['api', 'users'],
    description: 'Remove FlyFriends Post comment.',
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