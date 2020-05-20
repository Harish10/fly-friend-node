import chatHandler from './handlers/chatHandler'
import socketcheck from './handlers/socketcheck'
import {
    ObjectID
} from 'mongodb';
import Chats from '../models/chat';
import Users from '../models/users';
import _ from 'lodash'
exports.register = (server, options, next) => {
    // console.log(server);

    var io = require('socket.io')(server.listener);
    var socket;
    io.on('connection', function(socket) {
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
            var message=payload.message
            var receiverId = payload.receiverId;
            // await Chats.findOneAndUpdate({$or:[{senderId:userId,receiverId:receiverId},{senderId:receiverId,receiverId:userId}]},{$set:{lastMessage:message}},{new:true})
            if (data) {
                console.log('success');
                var data = await Chats.find({
                    senderId: userId,
                    receiverId: receiverId
                });
                io.emit('chatMessage', data);
            }
        })
    });
    chatHandler(server, options);
    socketcheck(server, options);
    next();
}


exports.register.attributes = {
    name: "chat"
}