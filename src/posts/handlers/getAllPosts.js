import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'Joi'
import Helpers from '../../helpers.js'
import Posts from '../../models/posts'
import Users from '../../models/users'

var defaults={};

const handler=async (request,reply)=>{
	try{
		let payload=request.payload;
		const userId=_.get(request,'payload.userId','');
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
		await Posts.find({userId:userId}).populate('comments').populate('likes').populate('images').exec(function(err,postData){
				if(err){
					return reply({
						status:false,
						message:err
					})
				}else{
					if(postData.length>0){
						var postData=JSON.parse(JSON.stringify(postData));
						return reply({
							status:true,
							message:"Get all posts.",
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
	path:'/getAllPosts',
	config:{
		tags:['api','posts'],
		description:'Get all posts successfully.',
    	notes:['On success'],
    		validate:{
      				payload:{
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