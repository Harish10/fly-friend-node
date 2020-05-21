import _ from 'lodash';
import Hoek from 'hoek';
import Joi from 'joi';
import Chats from '../../models/chat';
import Users from '../../models/users';
import Channels from '../../models/channels.js';

/** 
Api to Get Channel History.
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

                const query = [
                    {
                        $lookup: {
                            from: 'Users',
                            localField: 'members',
                            foreignField: '_id',
                            as: 'Users',
                        }
                    },
                    {
                        $match: {
                            members: {$all:[userId]}
                        }
                    },
                    {
                        $project: {
                            _id: true,
                            title: true,
                            lastMessage: true,
                            createdAt: true,
                            updatedAt: true,
                            userId: true,
                            members: true,
                        }   
                    },
                    {   
                        $sort: {updatedAt: -1, createdAt: -1}
                    },
                    {
                        $limit: 50,
                    }
                ];
                console.log(userId);
                const channelData=await Channels.aggregate(query);
                return reply({
                    status:true,
                    message:"Get all channels",
                    data:channelData
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
    path: '/getChannelHistory',
    config: {
        tags: ['api', 'posts'],
        description: 'Get Channel history.',
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

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts);
    server.route(routeConfig);
}