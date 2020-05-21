import _ from 'lodash';
import Hoek from 'hoek';
import Joi from 'joi';
import Chats from '../../models/chat';

/** 
Api to create new post
**/

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
        description: 'Check Socket connection.',
        notes: ['On success'],   
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts);
    server.route(routeConfig);
}
