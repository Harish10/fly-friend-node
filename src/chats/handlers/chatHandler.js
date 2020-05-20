import _ from 'lodash';
import Hoek from 'hoek';
import Joi from 'joi';
import Chats from '../../models/chat';
import Users from '../../models/users';
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
        var data = await Chats.find({
            senderId: userId
        });

        var final_data = _.uniqBy(data, 'receiverId');
        return reply({
            status: true,
            message: "Get all chat history.",
            data: final_data
        })

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
        description: 'Get Chat history.',
        notes: ['On success'],
        validate: {
            payload: {
                userId: Joi.string().required(),
                token: Joi.string().required()
            }
        },
        handler
    }
}

export default (server, opts, socket) => {
    defaults = Hoek.applyToDefaults(defaults, opts);
    server.route(routeConfig);
}