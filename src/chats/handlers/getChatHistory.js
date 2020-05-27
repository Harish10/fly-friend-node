import _ from 'lodash';
import Hoek from 'hoek';
import Joi from 'joi';
import Chats from '../../models/chat';
import Users from '../../models/users';
import Channels from '../../models/channels.js';

/** 
Api to Get chat history.
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
            
    } catch (error) {
        reply({
            status: false,
            message: error.message
        })
    }
}

const routeConfig = {
    method: 'POST',
    path: '/getChatHistory',
    config: {
        tags: ['api', 'posts'],
        description: 'Get chat history.',
        notes: ['On success'],
        validate: {
            payload: {
                userId: Joi.string().required(),
                token: Joi.string().required(),
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts);
    server.route(routeConfig);
}