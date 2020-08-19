import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import CommentProjects from '../../models/commentProjects'
import Users from '../../models/users'
import ReplyComments from '../../models/replyCommentMessage'

/** 
Api to create project comment
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
        var payloadData={
          comment:payload.comment,
          commentId:payload.commentId,
          userId:userId
        }
        var obj=await new ReplyComments(payloadData);
        // console.log(obj)
        var replyComment=await obj.save();
        if(replyComment){
          // console.log(project)
          var CommentPush=await CommentProjects.findOneAndUpdate({_id:payload.commentId},{$push:{replyComments:replyComment._id}})
        return reply({
          status: true,
          message: "Reply Comment On Project Successfully..."
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
  path: '/user/replyComment',
  config: {
    auth:'jwt',
    tags: ['api', 'users'],
    description: 'Reply On Project Comment .',
    notes: ['On success'],
    validate: {
      payload: {
        commentId: Joi.string().optional(),
        comment: Joi.string().optional()
        }
    },
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}