import _ from 'lodash'
import Hoek from 'hoek'
import Users from '../../models/users'
import Posts from '../../models/posts'
import Comments from '../../models/commentPost'
import Joi from 'joi'

/** 
Api to create comment on post.
**/

var defaults = {};

const handler = async (request, reply) => {
    try {
        var payload = request.payload;

        const userId = _.get(request, 'payload.userId', '');
        const token = _.get(request, 'payload.token', '');
        var data = await Users.findOne({
            _id: userId
        })
        if (!data) {
            return reply({
                status: false,
                status_msg: "error",
                message: "Please check your UserId!"
            })
        }
        if (data.token != token) {
            return reply({
                status: false,
                status_msg: "error",
                message: "Token is invalid."
            })
        }
    
    const postId = _.get(request, 'payload.postId', '');
    const post = await Posts.findOne({
        _id: postId
    });
    const user = await Users.findOne({
        _id: userId
    });
    var commentObj = await new Comments(payload);
    var data=  await commentObj.save();
            if(data){
            post.comments.push(commentObj._id);
            var saveData = await post.save();
                    if(saveData){
                        return reply({
                        status: true,
                        message: "Comment On post successfully."
                    })    
                    }    
                }
            } catch (error) {
        return reply({
            status: false,
            message: error.message
        })

    }
};

const routeConfig = {
    method: 'POST',
    path: '/commentOnPost',
    config: {
        tags: ['api', 'posts'],
        description: 'Added comment on this post.',
        notes: ['On success'],
        validate: {
            payload: {
                postId: Joi.string().required(),
                userId: Joi.string().required(),
                token: Joi.string().required(),
                comment: Joi.string().required()
            }
        },
        handler
    }
}


export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts);
    server.route(routeConfig);
}