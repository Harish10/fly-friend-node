//import getChatHistory from './handlers/getChatHandler';
import socketcheck from './handlers/socketcheck';
import createChannel from './handlers/createChannel';
import addNewMember from './handlers/addNewMember';
import getChannelById from './handlers/getChannelById';
// import getChannelHistory from './handlers/getChannelHistory';
import {
    ObjectID
} from 'mongodb';
import Chats from '../models/chat';
import Users from '../models/users';
import _ from 'lodash';
exports.register = (server, options, next) => {
    //connection with socket.
    var io = require('socket.io')(server.listener);
    var socket;
    io.on('connection', function(socket) {
        //ONE TO ONE CHAT , ONLINE , OFLINE AND LASTONLINE TIME
        socket.on('chatMessage', async function(payload) {
            const userId = payload.senderId
            const token = payload.token
            var data = await Users.findOne({
                _id: userId
            })
            if (!data) {
                console.log("Please check your userId.")
            }
            if (data.token != token) {
                console.log("Token is invalid.")
            }
            var chatObj = await new Chats(payload);
            var data = await chatObj.save();
            var message = payload.message
            var receiverId = payload.receiverId;
            var query = {
                $or: [{
                        $and: [{
                            senderId: userId
                        }, {
                            receiverId: receiverId
                        }]
                    },
                    {
                        $and: [{
                            senderId: receiverId
                        }, {
                            receiverId: userId
                        }]
                    }
                ]
            };
            await Chats.updateMany(query, {
                $set: {
                    lastMessage: message
                }
            }, {
                new: true
            })
            if (data) {
                console.log('success');
                var data = await Chats.find({
                    $or: [{
                        senderId: userId,
                        receiverId: receiverId
                    }, {
                        senderId: receiverId,
                        receiverId: userId
                    }]
                });
                io.emit('chatMessage', data);
            }
        });
        //ONLINE STATUS CHANGE
        socket.on('online', async function(payload) {
            const userId = payload.id
            const token = payload.token
            var data = await Users.findOne({
                _id: userId
            })
            if (!data) {
                console.log("Please check your userId.")
            }
            if (data.token != token) {
                console.log("Token is invalid.")
            }
            await Users.findOneAndUpdate({
                _id: userId
            }, {
                $set: {
                    isOnline: 1
                }
            }, {
                new: true
            });
        });
        //OFLINE STATUS AND LASTONLIMETIME CHANGE
        socket.on('ofline', async function(payload) {
            const userId = payload.id
            const token = payload.token
            var data = await Users.findOne({
                _id: userId
            })
            if (!data) {
                console.log("Please check your userId.")
            }
            if (data.token != token) {
                console.log("Token is invalid.")
            }
            var lastOnlineTime = Date.now()
            await Users.findOneAndUpdate({
                _id: userId
            }, {
                $set: {
                    isOnline: 0,
                    lastOnlineTime: lastOnlineTime
                }
            }, {
                new: true
            });
        });


    });
  //  getChannelHistory(server, options);
    getChannelById(server, options);
    //getChatHistory(server, options);
    socketcheck(server, options);
    createChannel(server, options);
    addNewMember(server, options);
    next();
}


exports.register.attributes = {
    name: "chat"
}