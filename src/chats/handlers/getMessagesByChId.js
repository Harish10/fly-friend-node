import Channels from '../../models/channels';
import Users from '../../models/users';
import Messages from '../../models/messages';
import Joi from 'joi';
import Hoek from 'hoek';
import _ from 'lodash';
import {
    ObjectID
} from 'mongodb';

/** 
Api to get all messages by channel id.
**/

var defaults = {};

const handler = async (request, reply) => {
    try {
        const userId = request.query.userId;
        const token = request.query.token;
        const channelId = request.query.channelId;
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
        const limit = _.get(request, 'query.limit', 1);
        const offset = _.get(request, 'query.offset', 1);
        var objId = ObjectID(channelId);
        var channelData = await Channels.findOne({
            _id: objId
        });
        const memberIds = _.get(channelData, 'members');
        const members = [];
        _.each(memberIds, (id) => {
            members.push(_.toString(id));
        })
        if (!_.includes(members, _.toString(userId))) {
            return reply({
                status: false,
                message: "Access Denied."
            })
        }

        const query = [{
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $match: {
                    channelId: {
                        $eq: objId
                    }
                }
            },
            {
                $project: {
                    _id: true,
                    channelId: true,
                    user: {
                        _id: true,
                        firstName: true,
                        lastName: true,
                        isOnline: true,
                        lastOnlineTime: true
                    },
                    userId: true,
                    body: true,
                    createdAt: true
                }
            },
            {
                $facet: {
                    data: [{
                            $skip: offset
                        },
                        {
                            $limit: parseInt(limit)
                        }
                    ]
                }
            },

            {
                $sort: {
                    createdAt: -1
                }
            }
        ]
        // var channelMessageData=await Messages.find({channelId:channelId}).skip(offset).limit(limit); 
        var channelMessageData = await Messages.aggregate(query);
        // console.log(channelMessageData);
        if (channelMessageData.length > 0) {
            return reply({
                status: true,
                message: "Get all messages by channel id.",
                data: channelMessageData
            })
        } else {
            return reply({
                status: false,
                data: []
            })
        }

    } catch (error) {
        return reply({
            status: false,
            message: error.message
        })
    }
}

const queryshcema = Joi.object({
    userId: Joi.string().required(),
    token: Joi.string().required(),
    channelId: Joi.string().required(),
    limit: Joi.number().optional(),
    offset: Joi.number().optional(),

});

const routeConfig = {
    method: 'GET',
    path: '/getMessagesByChId',
    config: {
        tags: ['api', 'gets'],
        description: 'Get all messages by channel id.',
        notes: ['On success'],
        validate: {
            // payload: {

            //    },
            query: queryshcema
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts);
    server.route(routeConfig);
}