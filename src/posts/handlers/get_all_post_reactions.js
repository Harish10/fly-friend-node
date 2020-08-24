import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers.js'
import Posts from '../../models/posts'
import Users from '../../models/users'
import _, { isEmpty, get } from 'lodash';
import LikePost from '../../models/likePost';

/** 
Api to get all post.
**/

var defaults={};

const handler=async (request,reply)=>{
	try {
    const token = await Helpers.extractUserId(request);
    let userId = request.payload.userId
    let posts = await Posts.find({ userId: userId }).populate('userId').populate('comments').lean().sort({createdAt:-1});
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
      message: 'Your reactions',
      data: posts,
    });
  } catch (error) {
    return reply({
      status: false,
      message: error.message,
      data: [],
    });
  }
}
const routeConfig={
	method:'POST',
	path:'/posts/get_all_post_reactions',
	config:{
		tags:['api','posts'],
		description:'Get all posts.',
    notes:['On success'],
    // validate:{
    //   payload:{
    //     userId:Joi.string().required()
    //   }
    // },
    handler
  }
}

export default (server,opts)=>{
  defaults=Hoek.applyToDefaults(defaults,opts)
  server.route(routeConfig)
}