import _ from 'lodash';
import Hoek from 'hoek';
import Joi from 'joi';
import Chats from '../../models/chat';
import Users from '../../models/users';
var defaults={};

const handler=async (request,reply)=>{
try{
    let payload=request.payload;
     const userId = _.get(request, 'payload.senderId', '');
        const token = _.get(request, 'payload.token', '');
        var data = await Users.findOne({
            userId
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
        var chatObj=await new Chats(payload);

        var data =await chatObj.save();
        console.log(data)
        if(data){
            var senderId=_.get(request,'payload.senderId','');
            var reciverId=_.get(request,'payload.reciverId','');
            var messageData = await Chats.find({$and:[{senderId:senderId},{reciverId:reciverId}]});
            if(messageData){
                console.log('sss');
                io.emit('message',messageData);
            }else{
                messageData="no data";
                console.log('sss');
                io.emit('message',messageData);
            }

        }

}catch(error){
	reply({status:false,message:error.message})
}
}

const routeConfig={
	method: 'POST',
    path: '/sendMessage',
    config: {
        tags: ['api', 'posts'],
        description: 'Added message on this post.',
        notes: ['On success'],
        validate: {
            payload: {
                message: Joi.string().required(),
                senderId: Joi.string().required(),
                receiverId:Joi.string().required(),
                token: Joi.string().required()
            }
        },
        handler
    }
}

export default (server, opts,io) => {
    defaults = Hoek.applyToDefaults(defaults, opts);
    server.route(routeConfig);
}