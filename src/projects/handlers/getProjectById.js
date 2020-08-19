import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Project from '../../models/projects'
import Users from '../../models/users'
import ProjectFavourites from '../../models/projectFavourites'
import Comments from '../../models/commentProjects'

/** 
Api to get project details
**/

let defaults = {}
const handler = async (request, reply) => {
    try {
        const userId = await Helpers.extractUserId(request)
        const user = await Users.findOne({
            _id: userId
        });
        if (user) {
            var payload = request.payload;
            var projectId = payload.projectId;
            // console.log(projectId);
            var projectData = await Project.findOne({
                _id: projectId
            }).populate('comments')
            // console.log(projectData);
            if (projectData) {
                var commentArray = [];
                var comments = projectData.comments;
                var commentLength = comments.length;
                for (var i = 0; i < commentLength; i++) {
                    const commentData = await Comments.findOne({
                        _id: comments[i]._id
                    }).populate('replyComments')
                    var replyComments = commentData.replyComments;
                    var replyLength = replyComments.length;
                    // var replyCommentsArray=[];  
                    for (var j = 0; j < replyLength; j++) {
                        var userData = await Users.findOne({
                            _id: replyComments[j].userId
                        }, {
                            firstName: 1
                        });
                        replyComments[j].userName = userData.firstName;
                    }
                    commentData.replyComments = replyComments;
                    commentArray.push(commentData);
                }
                projectData.comments = commentArray;
                return reply({
                    status: true,
                    message: "Get Project Details...",
                    data: projectData
                })
            } else {
                return reply({
                    status: false,
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
    path: '/user/getProjectById',
    config: {
        auth: 'jwt',
        tags: ['api', 'users'],
        description: 'Delete FlyFriends project.',
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