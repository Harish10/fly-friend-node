import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Posts from '../../models/posts'
import Users from '../../models/users'
// import AwsServices from '../../services/aws_service'
// const awsServices = new AwsServices()
import fs from 'fs'
import path from 'path'
import PostImages from '../../models/postImages'
var imageBaseUrl = "D:/balram/projects/linkites/fly-friends-node/uploads/";
// var imageBaseUrl=__dirname+"/uploads/";

/** 
Api to create new post
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
        const createPost = await new Posts(payload);
        // await createPost.save(async function(err, data1) {
        await createPost.save(async function(err, data1) {
            if (err) {
                return reply({
                    status: false,
                    message: err
                });
            } else {
                var user = await Users.findOne({
                    _id: data1.userId
                })
                user.posts.push(data1._id);
                await user.save(async function(err, result) {
                    if (err) {
                        return reply({
                            status: false,
                            message: err
                        });
                    } else {
                        var count = 0;
                        var imageLength = payload['postImage'].length;
                        if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
                        for (var i = 0; i < imageLength; i++) {
                            // payload['postImage'][i].pipe(fs.createWriteStream("D:/balram/projects/linkites/fly-friends-node/uploads/",payload['postImage'][i].hapi.filename))  
                            var imageData = payload['postImage'][i];
                            var imageName = payload['postImage'][i].hapi.filename;
                            var path = imageBaseUrl + imageName;
                            var file = fs.createWriteStream(path);
                            file.on('error', function(err) {
                                console.log(err);
                            })
                            var uploadsData = {
                                //postImage:payload['postImage'][i].hapi.filename,
                                postImage: imageBaseUrl + imageName,
                                postId: data1._id
                            }
                            var postImages = await new PostImages(uploadsData);
                            postImages.save(async function(err, dataImage) {
                                if (!err) {
                                    var post = await Posts.findOne({
                                        _id: data1._id
                                    });
                                    post.images.push(dataImage._id);
                                    await post.save(async function(err, savePostImage) {
                                        if (err) {
                                            console.log("err1=======>" + err);
                                        } else {
                                            count++
                                            if (count == imageLength) {
                                                return reply({
                                                    status: true,
                                                    message: "Created new post successfully."
                                                });
                                            }
                                        }
                                    })
                                } else {
                                    console.log("err2=======>" + err);
                                }
                            })
                        }

                    }
                })

            }
        });

    } catch (error) {
        return reply({
            status: false,
            message: error.message
        })
    }
};


const routeConfig = {
    method: 'POST',
    path: '/createPost',
    config: {
        tags: ['api', 'posts'],
        description: 'Create new post successfully.',
        notes: ['On success'],
        validate: {
            payload: {
                postTitle: Joi.string().optional(),
                userId: Joi.string().required(),
                postImageName: Joi.string().optional(),
                postImage: Joi.any().optional(),
                token: Joi.string().required()
            }
        },
        payload: {
            output: "stream",
            parse: true,
            allow: "multipart/form-data",
            maxBytes: 2 * 1000 * 1000
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts);
    server.route(routeConfig);
}