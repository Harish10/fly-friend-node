import _ from 'lodash';
import Hoek from 'hoek';
import Joi from 'joi';
import Helpers from '../../helpers'
import Posts from '../../models/posts';
import Users from '../../models/users';
// import AwsServices from '../../services/aws_service'
// const awsServices = new AwsServices()
import fs from 'fs';
import path from 'path';
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
	const token = await Helpers.extractUserId(request);
	payload.userId = token
	await Posts.create(payload);
    return reply({
      status: true,
      message: 'Your post is created',
    });
  } catch (error) {
    return reply({
      status: false,
      message: error.message,
    });
  }
};

const routeConfig = {
  method: 'POST',
  path: '/post/create',
  config: {
    auth: 'jwt',
    tags: ['api', 'posts'],
    description: 'Create new post.',
    notes: ['On success'],
    handler,
  },
};

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts);
  server.route(routeConfig);
};
