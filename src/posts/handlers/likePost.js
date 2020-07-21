import _ from 'lodash';
import Hoek from 'hoek';
import Joi from 'joi';
import Helpers from '../../helpers';
import Posts from '../../models/posts';
import Users from '../../models/users';
import LikePost from '../../models/likePost';
import { ObjectID } from 'mongodb';

/** 
Api to like on post
**/

var defaults = {};
const handler = async (request, reply) => {
  try {
    let payload = request.payload;
    const token = await Helpers.extractUserId(request);

    let reaction = await LikePost.findOne({ postId: payload.postId, userId: token })
    if(reaction) {
      await LikePost.findOneAndUpdate({ _id: reaction._id }, { by: token, ...payload, userId: token }, { upsert: true })
    } 

    if(!reaction) {
      reaction = await LikePost.create({ by: token, ...payload, userId: token })
      console.log(reaction)
    } 

   await Posts.findOneAndUpdate({ _id: ObjectID(payload.postId) }, { $addToSet: { reactions: reaction._id } })

   return reply({
        status: true,
        message: 'Reacted!',
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
  path: '/post/react',
  config: {
    auth: 'jwt',
    tags: ['api', 'posts'],
    description: 'React To post.',
    notes: ['On success'],
    handler,
  },
};

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts);
  server.route(routeConfig);
};
