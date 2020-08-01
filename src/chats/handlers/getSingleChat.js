import Chat from '../../models/chat';
import Users from '../../models/users';
import Joi from 'joi';
import Hoek from 'hoek';
import _ from 'lodash';
import {
    ObjectID
} from 'mongodb';

/** 
Api to single chat.
**/

var defaults = {};

const handler = async (request, reply) => {
    try {
        let payload = request.payload;
        const userId = _.get(request, 'payload.userId', '');
        const otherUserId = _.get(request, 'payload.otherUserId', '');
        const token = _.get(request, 'payload.token', '');
        const data = await Users.findOne({
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
        let userObjid = ObjectID(userId);
        let otherUserObjid = ObjectID(otherUserId);
        // const query = {
        //     $or: [{
        //         $and: [{
        //             senderId: userObjid
        //         }, {
        //             receiverId: otherUserObjid
        //         }]
        //     }, {
        //         $and: [{
        //             senderId: otherUserObjid
        //         }, {
        //             receiverId: userObjid
        //         }]
        //     }]
        // }
        // const chatData = await Chat.find(query);
        const chatData = await Chat.aggregate([
          {$match: {
            $or: [{
              $and: [{
                senderId: userObjid
              }, {
                receiverId: otherUserObjid
              }]
              }, {
              $and: [{
                senderId: otherUserObjid
              }, {
                receiverId: userObjid
              }]
            }]
          }},
          { "$lookup": {
            "from": Users.collection.name,
            "let": { "senderId": "$senderId" },
            "pipeline": [
              { "$match": { "$expr": { "$eq": [ "$_id", "$$senderId" ] } } },
              { "$project": { "firstName": 1, "lastName": 1, "profileImage": 1 }}
            ],
            "as": "sender"
          }},{ "$lookup": {
            "from": Users.collection.name,
            "let": { "receiverId": "$receiverId" },
            "pipeline": [
              { "$match": { "$expr": { "$eq": [ "$_id", "$$receiverId" ] } } },
              { "$project": { "firstName": 1, "lastName": 1, "profileImage": 1 }}
            ],
            "as": "receiver"
          }}])

        return reply({
            status: true,
            message: "Get my chats.",
            data: chatData
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
    path: '/chat/getSingleChat',
    config: {
        tags: ['api', 'posts'],
        description: 'Get single chat.',
        notes: ['On success'],
        validate: {
            payload: {
                userId: Joi.string().required(),
                otherUserId: Joi.string().required()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts);
    server.route(routeConfig);
}