import _ from 'lodash';
import Hoek from 'hoek';
import Joi from 'joi';
import Channels from '../../models/channels.js';
import Users from '../../models/users';

/** 
Api to add new member in the group.
**/

var defaults = {};
	
const handler=async (request,reply)=>{
	try{
        // console.log(request.payload);
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
        const channelId = _.get(request, 'payload.channelId', '');
            const channel=await Channels.findOne({_id:channelId});
            const members=channel.members;
                const query={_id:{$in:members}};                
                const options={_id:1,firstName:1}; 
                const users=await Users.find(query,options);
                channel.members=users;
                return reply({
                    status:true,
                    message:"Get Channels info.",
                    data:channel
                })
	}catch(error){
		return reply({
			status:false,
			message:error.message
		})
	}
}


const routeConfig = {
    method: 'POST',
    path: '/getChannelById',
    config: {
        tags: ['api', 'posts'],
        description: 'Get Channels.',
        notes: ['On success'],
        validate: {
            payload: {
                userId: Joi.string().required(),
                token: Joi.string().required(),
            	channelId:Joi.string().required()
            }
        },
        handler
    }
}

export default (server,opts)=>{
	defaults = Hoek.applyToDefaults(defaults, opts);
    server.route(routeConfig);
}