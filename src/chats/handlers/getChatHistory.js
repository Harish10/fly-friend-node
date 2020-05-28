import _ from 'lodash';
import Hoek from 'hoek';
import Joi from 'joi';
// import Channels from '../../models/channels.js';
import Users from '../../models/users';
import Chat from '../../models/chat';
import {
    ObjectID
} from 'mongodb';

/** 
Api to Get chat history.
**/

var defaults = {};

const handler = async (request, reply) => {
    try {
        console.log(request.payload);
        let payload = request.payload;
        const userId = _.get(request, 'payload.userId', '');
        // const token = _.get(request, 'payload.token', '');
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
        var userIdNew = ObjectID(userId);
        // const query = [{
        //     $project: {
        //         message: true,
        //         lastMessage: true,
        //         senderId: true,
        //         receiverId: true,
        //         createdAt: true,
        //         result: {
        //             $or: [{
        //                 senderId: userIdNew
        //             }, {
        //                 receiverId: userIdNew
        //             }]
        //         },
        //     }
        // } {
        //     $sort: {
        //         createdAt: -1
        //     }
        // }]
        const query = [

            {
                $match: {
                    $or: [{
                        senderId: userIdNew
                    }, {
                        receiverId: userIdNew
                    }]
                }
            },
            {
                $group: {
                    _id: "$receiverId",
                    message: {
                        "$first": "$message"
                    },
                    lastMessage: {
                        "$first": "$lastMessage"
                    },
                    senderId: {
                        "$first": "$senderId"
                    },
                    receiverId: {
                        "$first": "$receiverId"
                    },
                    // user:{
                    //     // _id:{"$first":"$id"},
                    //     firstName:{"$first":"$firstName"},
                    //     lastName:{"$first":"$lastName"}
                    // },
                    createdAt: {
                        "$first": "$createdAt"
                    }
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]
        var chatResult = await Chat.aggregate(query); // var chatResult=await Chat.find({$or:[{senderId:userIdNew},{receiverId:userIdNew}]});
        console.log(chatResult)
        // Declare a new array 
        let newArray = [];
        // Declare a empty Object 
        let uniqueObject = {};
        //Look for the array elements
        for (let i in chatResult) {
            var objReceiver = chatResult[i]['receiverId'];
            uniqueObject[objReceiver] = chatResult[i];
        }
        for (let i in uniqueObject) {
            newArray.push(uniqueObject[i]);
        }
        // const finalData=_.uniqBy(chatResult,"receiverId");
        return reply({
            status: true,
            data: newArray
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
    path: '/chat/getChatHistory',
    config: {
        tags: ['api', 'posts'],
        description: 'Get chat history.',
        notes: ['On success'],
        validate: {
            payload: {
                userId: Joi.string().required(),
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts);
    server.route(routeConfig);
}