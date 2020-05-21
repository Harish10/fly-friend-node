import _ from 'lodash';
import Hoek from 'hoek';
import Joi from 'joi';
import Channels from '../../models/channels.js';
import Users from '../../models/users';

/** 
Api to add new member in the group.
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
        const members = _.get(request, 'payload.members', '');
        var count = 0;
        var membersLength = members.length;
        const channelId = _.get(request, 'payload.channelId', '');
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
                        message: "New member added."
                    })
                }
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
    path: '/addNewMembers',
    config: {
        tags: ['api', 'posts'],
        description: 'Add new member.',
        notes: ['On success'],
        validate: {
            payload: {
                userId: Joi.string().required(),
                token: Joi.string().required(),
                members: Joi.any().required(),
                channelId: Joi.string().required()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts);
    server.route(routeConfig);
}