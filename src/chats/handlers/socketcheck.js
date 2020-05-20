import _ from 'lodash';
import Hoek from 'hoek';
import Joi from 'joi';
import Chats from '../../models/chat';

var defaults={};

const handler=async (request,reply)=>{
try{
reply.file('D:/balram/projects/linkites/fly-friends-node/src/index.html');
}catch(error){
	reply({status:false,message:error.message})
}
}

const routeConfig={
	method: 'GET',
    path: '/sendMessage',
    config: {
        tags: ['api', 'posts'],
        description: 'Added comment on this post.',
        notes: ['On success'],
        // validate: {
        //     payload: {
        //         message: Joi.string().required(),
        //         senderUserId: Joi.string().required(),
        //         reciverUserId:Joi.string().required(),
        //         token: Joi.string().required()
        //     }
        // },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts);
    server.route(routeConfig);
}

// exports.hello = function () {

//     this.emit('Hi back at you');
// };

// exports.newMessage = function (newMessage) {

//     console.log('Got message', newMessage);
// };

// exports.goodbye = function () {

//     this.emit('Take it easy, pal');
// };