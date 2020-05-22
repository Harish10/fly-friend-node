import _ from 'lodash';
import Hoek from 'hoek';
import Joi from 'joi';
import Chats from '../../models/chat';
import Users from '../../models/users';
import Channels from '../../models/channels.js';

/** 
Api to Get User Search.
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
        const keyword=_.get(request,'payload.search','');
        const regex=new RegExp(keyword,'i'); 
        const query={
            $or:[{firstName:{$regex:regex}},{email:{$regex:regex}},{lastName:{$regex:regex}}]
        }
        var userData = await Users.find(query,{_id:true,firstName:true,lastName:true});
            if(!userData ||!userData.length){
                return reply({
                    status:false,
                    message:"User not found."
                });
            }else{
                return reply({
                    status:true,
                    data:userData
                })
            }
               
    } catch (error) {
        reply({
            status: false,
            message: error.message
        })
    }
}

const routeConfig = {
    method: 'POST',
    path: '/getUserSearch',
    config: {
        tags: ['api', 'posts'],
        description: 'Get User Search.',
        notes: ['On success'],
        validate: {
            payload: {
                userId: Joi.string().required(),
                token: Joi.string().required(),
                search:Joi.string().required()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts);
    server.route(routeConfig);
}