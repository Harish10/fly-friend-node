import _, { isEmpty, get } from 'lodash';
import Hoek from 'hoek';
import Joi from 'joi';
import Helpers from '../../helpers';
import Posts from '../../models/posts';
import LikePost from '../../models/likePost';
import { ObjectID } from 'mongodb';

// import AwsServices from '../../services/aws_service'
// const awsServices = new AwsServices()
// import PostImages from '../../models/postimages'
// var imageBaseUrl = "D:/balram/projects/linkites/fly-friends-node/uploads/";
// var imageBaseUrl= __dirname+"/uploads/";

/** 
Api to create new post
**/

var defaults = {};
const handler = async (request, reply) => {
  try {
    const token = await Helpers.extractUserId(request);
    // let posts = await Posts.find({ userId: token })
    let linkHref = request.query.href
    let findObj = {}
    if(linkHref.includes('profile')) {
      findObj = { userId: ObjectID(token) }
    }
    let posts = await Posts.find(findObj).limit(Number(request.query.limit)).populate('userId').populate('comments').lean().sort({createdAt:-1});
      
      // .skip(request.query.limit - 5)
    if (!isEmpty(posts)) {
      let setReactions = posts.map(async (p, i) => {
        let reactions = [];
        let setp = p.reactions.map(async (r) => {
          let reaction = await LikePost.findOne({ _id: r })
            .populate('userId')
            .lean();
          reaction.by = `${get(reaction, 'userId.firstName')} ${get(
            reaction,
            'userId.lastName'
          )}`;
          reactions.push(reaction);
        });

        await Promise.all(setp);

        p.reactions = reactions;
      });

      await Promise.all(setReactions);
    }

    return reply({
      status: true,
      message: 'Your Newsfeed',
      data: posts,
    });
  } catch (error) {
    return reply({
      status: false,
      message: error.message,
      data: [],
    });
  }
};

const routeConfig = {
  method: 'GET',
  path: '/newsfeed',
  config: {
    auth: 'jwt',
    tags: ['api', 'newsfeed'],
    description: 'Create new post.',
    notes: ['On success'],
    handler,
  },
};

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts);
  server.route(routeConfig);
};
