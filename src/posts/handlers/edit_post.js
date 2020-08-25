import _ from 'lodash';
import Hoek from 'hoek';
import Posts from '../../models/posts';


/** 
Api to create new post
**/


var defaults = {};
const handler = async (request, reply) => {
  try {
	let payload = request.payload;
   await Posts.findOneAndUpdate({ _id: payload._id }, payload)
    return reply({
      status: true,
      message: 'Your post is updated',
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
  path: '/post/edit',
  config: {
    auth: 'jwt',
    tags: ['api', 'posts'],
    description: 'Edit post.',
    notes: ['On success'],
    handler,
  },
};

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts);
  server.route(routeConfig);
};
