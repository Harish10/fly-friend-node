import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
// import Helpers from '../../helpers'
import Posts from '../../models/posts'
import Users from '../../models/users'
// import AwsServices from '../../services/aws_service'
// const awsServices = new AwsServices()
import fs from 'fs'
import path from 'path'
// import PostImages from '../../models/postimages'
// var imageBaseUrl = "D:/balram/projects/linkites/fly-friends-node/uploads/";
// var imageBaseUrl= __dirname+"/uploads/";

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
    var data1 = await createPost.save();
		if (data1) {
			var user = await Users.findOne({
				_id: data1.userId
			})
			user.posts.push(data1._id);
			var result = await user.save();
			if (result) {
				return reply({
					status: true,
					message: "Created new post successfully."
				});
			}
		}
  } catch (error) {
		return reply({
			status: false,
			message: error.message
		});
  }
};


const routeConfig = {
	method: 'POST',
	path: '/createPost',
	config: {
		tags: ['api', 'posts'],
		description: 'Create new post.',
		notes: ['On success'],
		validate: {
			payload: {
				postTitle: Joi.string().optional(),
				userId: Joi.string().required(),
				// postImageName: Joi.string().optional(),
				// postImage: Joi.any().optional(),
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