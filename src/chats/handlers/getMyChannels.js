import Channels from '../../models/channels';
import Users from '../../models/users';
import Joi from 'joi';
import Hoek from 'hoek';
import _ from 'lodash';
import {
    ObjectID
} from 'mongodb';

/** 
Api to get my channels.
**/

var defaults = {};

const handler = async (request, reply) => {
    try {

        let payload = request.payload;
        const userId = payload.userId
        const token = payload.token
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
        // if (data.token != token) {
        //     return reply({
        //         status: false,
        //         status_msg: "error",
        //         message: "Token is invalid."
        //     })
        // }
        var Objid = ObjectID(userId);
        const query = [{
                $lookup: {
                    from: 'users',
                    localField: 'members',
                    foreignField: '_id',
                    as: 'users'
                }

            },
            {
                $match: {
                    members: {
                        $all: [Objid]
                    }
                }
            },
            {
                $project: {
                    _id: true,
                    title: true,
                    userId: true,
                    groupImage: true,
                    createdAt: true,
                    updatedAt: true,
                    lastMessage: true,
                    members: true,
                    users: {
                        _id: true,
                        firstName: true,
                        lastName: true,
                        isOnline: true,
                        profileImage: true,
                        lastOnlineTime: true
                    }
                }
            },
            {
                $sort: {
                    updatedAt: -1,
                    createdAt: -1
                }
            },
            {
                $limit: 50
            }
        ]
        const channelData = await Channels.aggregate(query);
        // console.log(channelData);
        return reply({
            status: true,
            message: "Get my channels.",
            data: channelData
        })
    } catch (error) {
        return reply({
            status: false,
            message: error.message
        })
    }
}


const routeConfig = {
    method: 'POST',
    path: '/getMyChannels',
    config: {
        tags: ['api', 'posts'],
        description: 'Get my channels.',
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