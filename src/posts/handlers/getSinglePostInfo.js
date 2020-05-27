import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers.js'
import Posts from '../../models/posts'
import Users from '../../models/users'

/** 
Api to get single post info.
**/

var defaults={};

const handler=async (request,reply)=>{
	try{
		let payload=request.payload;
		const userId=_.get(request,'payload.userId','');
		const postId=_.get(request,'payload.postId','');
		const token=_.get(request,'payload.token','');
		var user =await Users.findOne({_id:userId});
		if(!user){
				return reply({
					status:false,
					message:"Please check your UserId."
				})
		}if(user.token!=token){
				return reply({
					status:false,
					message:"Your token is invalid."
				})
		}
		await Posts.findOne({_id:postId}).populate('images').populate('comments').populate('likes').exec(function(err,postData){
				if(err){
					return reply({
						status:false,
						message:err
					})
				}else{
					if(postData){
						var postData=JSON.parse(JSON.stringify(postData));
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
	method:'POST',
	path:'/getSinglePostInfo',
	config:{
		tags:['api','posts'],
		description:'Get single posts info.',
    	notes:['On success'],
    		validate:{
      				payload:{
      						postId:Joi.string().required(),
	        				userId:Joi.string().required(),
	        				token:Joi.string().required()
      						}
					},
					handler
			}
		}

export default (server,opts)=>{
  defaults=Hoek.applyToDefaults(defaults,opts)
  server.route(routeConfig)
}