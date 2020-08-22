import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import CommentProjects from '../../models/commentProjects'
import ReplyComments from '../../models/replyCommentMessage'
import Users from '../../models/users'
import mongoose from 'mongoose';

/** 
Api to get project comments
**/

let defaults = {}
const handler = async (request, reply) => {
  try {
    const userId = await Helpers.extractUserId(request)
    const user = await Users.findOne({
        _id: userId
    });
    if(user) {
      var payload = request.payload;
      var projectId = payload.projectId;
      const projectComments = await CommentProjects.aggregate([
        { $match: { projectId: mongoose.Types.ObjectId(projectId) } },
         {
           $lookup: {
             from: Users.collection.name,
             let: { userId: "$userId" },
             pipeline: [
               { $match: { $expr: { $eq: ["$$userId", "$_id"] } } },
               {
                 $project: {
                   profileImage: 1,
                 },
               },
             ],
             as: "users",
           },
         },
         {
          $lookup: {
            from: ReplyComments.collection.name,
            let: { replyComments: "$replyComments" },
            pipeline: [
              { $match: { $expr: { $in: ["$_id", "$$replyComments"] } } },
              {
                "$lookup": {
                  "from": Users.collection.name,
                  "let": { "userId": "$userId" },
                  "pipeline": [
                    { "$match": { "$expr": { "$eq": ["$_id", "$$userId"] } } },
                    {
                      $project: {
                        profileImage: 1,
                        firstName: 1,
                        lastName: 1
                      },
                    },
                  ],
                  "as": "users"
                }
              }
            ],
            as: "replies",
          },
        },
       ]);
      if(projectComments) {
        return reply({
          status: true,
          message: "Get Project comments...",
          data: projectComments
        })
      }else {
        return reply({
          status: false,
          message: "Please enter valid projectId..."
        })
      }
    }
  }catch (error) {
    return reply({
      status: false,
      message: error.message
    })
  }
}

const routeConfig = {
  method: 'POST',
  path: '/user/get_project_all_comments',
  config: {
    auth: 'jwt',
    tags: ['api', 'users'],
    description: 'get project comments.',
    notes: ['On success'],
    validate: {
        payload: {
            projectId: Joi.string().required()
        }
    },
    handler
  }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}