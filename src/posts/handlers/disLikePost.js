import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Posts from '../../models/Posts'
import Users from '../../models/users'
import LikePost from '../../models/likePost';

/** 
Api to dis like post
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
        var likeId=payload.likeId;
        var commentId=payload.likeId;
        var postId=payload.postId;
        var postCommentData=await LikePost.findOneAndRemove({_id:likeId});
        if(postCommentData){
        // console.log(projectCommentData);
        var postData=await Posts.findOne({_id:postId});
        if(postData){
          var reactionsArray=[];
          var reactions=postData.reactions;
          for(var i=0;i<reactions.length;i++){
            if(reactions[i]==likeId){

            }else{
              reactionsArray.push(reactions[i]);
            }
          }
          await Posts.findOneAndUpdate({_id:postId},{$set:{reactions:reactionsArray}},{new:true});
          // console.log(project);
        return reply({
          status: true,
          message: "DisLike Post Successfully..."
        })
        }   
        }else{
        return reply({
          status: true,
          message: "Please enter valid likeId..."
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
  path: '/post/disLikePost',
  config: {
    auth:'jwt',
    tags: ['api', 'users'],
    description: 'DisLike Posts.',
    notes: ['On success'],
    validate: {
      payload: {
        postId:Joi.string().required(),
        likeId:Joi.string().required(),
        }
    },
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}