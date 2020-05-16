import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Posts from '../../models/posts'
import Users from '../../models/users'
import LikePost from '../../models/likePost'
/** 
Api to like on post
**/

var defaults = {};
const handler = async (request, reply) => {
    try {
        let payload = request.payload;
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

        // const userId=_.get(request,'payload.userId','');
        const postId = _.get(request, 'payload.userId', '');
        var where = {
            postId: postId,
            userId: userId
        }
        var likeData = await LikePost.find({
            $and: [{
                userId: userId
            }, {
                postId: postId
            }]
        });
        console.log(likeData)
        if (likeData) {
            console.log(likeData);
            if (likeData.isLike == 1) {
                payload.isLike = 0;
                var upload_data = {
                    isLike: payload.isLike
                }
                // console.log("if"+likeData[0].isLike);
                var likeObj = new LikePost(upload_data);
                await LikePost.findOneAndUpdate(where, upload_data).exec(function(error, data) {
                    return reply({
                        status: true,
                        message: "Unlike the post successfully."
                    })
                })
            } else {
                payload.isLike = 1;
                var upload_data = {
                    isLike: payload.isLike
                }
                // console.log("else"+likeData[0].isLike);
                var likeObj = new LikePost(upload_data);
                await LikePost.findOneAndUpdate(where, upload_data).exec(function(data) {
                    return reply({
                        status: true,
                        message: "Like the post successfully."
                    });
                })
            }
        } else {
            const user = await Users.findOne({
                _id: payload.userId
            });
            const post = await Posts.findOne({
                _id: payload.postId
            });
            // console.log("post"+post);
            var upload_data = {
                userId: user._id,
                postId: post._id,
                isLike: payload.isLike
            }
            var likeObj = new LikePost(upload_data);
            likeObj.save(async function(error, data) {
                if (error) {
                    return reply({
                        status: false,
                        message: error
                    });
                } else {
                    post.likes.push(likeObj._id);
                    await post.save(function(err, data) {
                        if (!err) {
                            return reply({
                                status: "true",
                                message: "Like the post successfully."
                            })
                        }
                    })
                }
            });
        };



    } catch (error) {
        return reply({
            status: false,
            message: error.message
        })
    }
};


const routeConfig = {
    method: 'POST',
    path: '/likePost',
    config: {
        tags: ['api', 'posts'],
        description: 'Create new post successfully.',
        notes: ['On success'],
        validate: {
            payload: {
                isLike: Joi.string().optional(),
                userId: Joi.string().required(),
                //postImageName:Joi.string().optional(),
                postId: Joi.string().optional(),
                token: Joi.string().required()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts);
    server.route(routeConfig);
}