import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Posts from '../../models/posts'
import Users from '../../models/users'

/** 
Api to get single post info.
**/

var defaults={};

const handler=async (request,reply)=>{
	try{
   		// const token = await Helpers.extractUserId(request);
		let payload= request.params.id
		// var user =await Users.findOne({_id:token});
		// if(!user){
		// 		return reply({
		// 			status:false,
		// 			message:"Please check your UserId."
		// 		})
		// }
		await Posts.findOne({_id: payload}).populate('comments').populate('userId').exec(async function(err,postData){
				if(err){
					return reply({
						status:false,
						message:err
					})
				}else{
					if(postData){
						let reactions = [];
				        let setp = postData.reactions.map(async (r) => {
				          let reaction = await LikePost.findOne({ _id: r })
				            .populate('userId')
				            .lean();
				          reaction.by = `${get(reaction, 'userId.firstName')} ${get(
				            reaction,
				            'userId.lastName'
				          )}`;
				          reactions.push(reaction);
				        });
				        postData.reactions=reactions;
				        var postComment=postData.comments;
                var commentsArray=[];
                for(var i=0;i<postComment.length;i++){
                const userData = await Users.findOne({
                    _id: postComment[i].userId
                }, {
                    firstName: 1,
                    email: 1,
                    userImage: 1,
                    lastName:1
                });
                postComment[i].userDetails=userData;
                commentsArray.push(postComment[i]);
                }
                postData.comments = commentsArray;
						return reply({
							status:true,
							message:"Get post info.",
							data:postData
						})
					}else{
							return reply({
							status:false,
							message:"No data found.",
							data:{}
						})
					}
				}
		})

	}catch(err){
		return reply({
			status:false,
			message:err.message
		})
	}
}
const routeConfig={
	method:'GET',
	path:'/post/getPostDetailsById/{id}',
	config:{
		// auth: 'jwt',
		tags:['api','get'],
		description:'Get single posts info.',
    	notes:['On success'],
    		// validate:{
      		// 		payload:{
			// 		postId:Joi.string().required(),
			// 	}
			// },
		handler
	}
}

export default (server,opts)=>{
  defaults=Hoek.applyToDefaults(defaults,opts)
  server.route(routeConfig)
}