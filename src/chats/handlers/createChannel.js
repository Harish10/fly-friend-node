import _ from 'lodash';
import Hoek from 'hoek';
import Joi from 'joi';
import Channels from '../../models/channels';
import Users from '../../models/users';
import Message from '../../models/messages.js'

/** 
Api to create channel(Group).
**/

var defaults = {};

const handler = async (request, reply) => {
    try {
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
        const title = _.get(request, 'payload.title', '');
        var payload = {
            userId: userId,
            title: title
        }
        const createChannel = await new Channels(payload);
        var data = await createChannel.save();
        const members = _.get(request, 'payload.members', '');
        if (data) {
            var channelId = data._id;
            var count = 0;
            var membersLength = members.length;
            if (membersLength > 0) {
                for (var i = 0; i < membersLength; i++) {
                    var channel = await Channels.findOne({
                        _id: channelId
                    });
                    channel.members.push(members[i]);
                    await channel.save();
                    count++;
                    if (count == membersLength) {
                        return reply({
                            status: true,
                            message: "Created channel for chat."
                        })
                    }
                }
            } else {
                return reply({
                    status: true,
                    message: "Created channel for chat."
                });
            }
        }
    } catch (error) {
        return reply({
            "status": false,
            "message": error.message
        })
    }
}


const routeConfig = {
    method: 'POST',
    path: '/createChannel',
    config: {
        tags: ['api', 'posts'],
        description: 'Create chat group.',
        notes: ['On success'],
        validate: {
            payload: {
                title: Joi.string().optional(),
                userId: Joi.string().required(),
                token: Joi.string().required(),
                members: Joi.any().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts);
    server.route(routeConfig);
}