//import getChatHistory from './handlers/getChatHandler';
import socketcheck from './handlers/socketcheck';
import socketcheck1 from './handlers/socketcheck1';

import createChannel from './handlers/createChannel';
import addNewMember from './handlers/addNewMember';
import getChannelById from './handlers/getChannelById';
import getUserSearch from './handlers/getUserSearch';
// import getChannelHistory from './handlers/getChannelHistory';
import {
    ObjectID
} from 'mongodb';
import Chats from '../models/chat';
import Users from '../models/users';
import Messages from '../models/messages';
import Channels from '../models/channels';
import _ from 'lodash';
exports.register = (server, options, next) => {
    //connection with socket.
    var io = require('socket.io')(server.listener);
    var socket;
    var connection=[];
    io.on('connection', function(socket) {
        //ONE TO ONE CHAT , ONLINE , OFLINE AND LASTONLINE TIME

        socket.on('chatMessage', async function(payload) {
            const userId = payload.senderId
            const token = payload.token
            var data = await Users.findOne({
                _id: userId
            })
            if (!data) {
                console.log("Please check your userId1.")
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
            connection.push(userId); 
            var data = await Users.findOne({
                _id: userId
            })
            if (!data) {
                console.log("Please check your userId2.")
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
            
            const userId = payload.userId
            const token = payload.token
            var data = await Users.findOne({
                _id: userId
            })
            if (!data) {
                console.log("Please check your userId3.")
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
        // const socketId=new ObjectID().toString();
        // console.log('someone connected to the server via socket',socketId);
        // socket.on('close',()=>{
        //     console.log('someone disconnected to the server')
        // });

        //CREATE CHANNEL
        socket.on('create_channel',async (payload)=>{
            const userId = payload.userId
            // console.log(socket.id);
            var socketId=socket.id
            const token = payload.token
            var data = await Users.findOne({
                _id: userId
            })
            if (!data) {
                console.log("Please check your userId4.")
            }
            if (data.token != token) {
                console.log("Token is invalid.")
            }
            // var members=[];
            // _.each(_.get(payload,'members',[]),(key)=>{
            //     members.push(key);
            // })
            var title=payload.title;
            const message=payload.message;
            var members = payload.members;
        var payload = {
            userId: userId,
            title: title,
            lastMessage:message
        }
        const createChannel = await new Channels(payload);
        var data = await createChannel.save();
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
                        var messagePayload={
                            userId:userId,
                            channelId:channelId,
                            body:message
                        }
                        const messageObj=await new Messages(messagePayload);
                        var result=await messageObj.save();
                        if(result){
                       //let send back to all member in this channel with new channel created     
                    let memberConnection=[];
                    var channelObject = await Channels.findOne({
                        _id: channelId
                    });
                    var user = await Users.findOne({
                        _id: userId
                    },{_id:1,firstName:1,lastName:1});
                    channelObject.users=user
                    //fetch all users  has memberId
                    const query={
                        _id:{$in:members}
                    }
                    const options={
                        _id:1,
                        firstName:1,
                        lastName:1
                    }
                       var userData=await Users.find(query,options);
                       channelObject.members=userData;
                    _.each(members,(id)=>{
                    // var user_id=id;
                    // var memberConnection=connection.filter((con)=>con === user_id && con !== userId);
                    //     if(memberConnection.size){
                    //         memberConnection.forEach((con)=>{
                    //             //send to socket  client matching  userId in channel members
                    //             socket.emit('message',channelObject); 
                                
                    //         console.log('success');
                    //         })
                    //     }
                             socket.emit('message',channelObject); 
                             // console.log(channelObject);
                             console.log("success");
                     })           
                        }
                    }
                }
            }
        }      
});
        socket.on('create_message',(payload)=>{
            // console.log(payload);
            const userId = payload.userId
            // console.log(socket.id);
            const token = payload.token
            var data = await Users.findOne({
                _id: userId
            })
            if (!data) {
                console.log("Please check your userId4.")
            }
            if (data.token != token) {
                console.log("Token is invalid.")
            }
            var channelId=payload.channelId;
            var body=payload.message;
            var payloadMessage={
                channelId:channelId,
                userId:userId,
                body:body
            }
            var messageObj=await new Messages(payloadMessage);
            var result=await messageObj.save();
                        if(result){
                       //let send back to all member in this channel with new channel created     
                    let memberConnection=[];
                    var channelObject = await Channels.findOne({
                        _id: channelId
                    });
                    var user = await Users.findOne({
                        _id: userId
                    },{_id:1,firstName:1,lastName:1});
                    channelObject.users=user
                    //fetch all users  has memberId
                    const query={
                        _id:{$in:members}
                    }
                    const options={
                        _id:1,
                        firstName:1,
                        lastName:1
                    }
                       var userData=await Users.find(query,options);
                       channelObject.members=userData;
                    _.each(members,(id)=>{
                    // var user_id=id;
                    // var memberConnection=connection.filter((con)=>con === user_id && con !== userId);
                    //     if(memberConnection.size){
                    //         memberConnection.forEach((con)=>{
                    //             //send to socket  client matching  userId in channel members
                    //             socket.emit('message',channelObject); 
                                
                    //         console.log('success');
                    //         })
                    //     }
                             socket.emit('message',channelObject); 
                             // console.log(channelObject);
                             console.log("success");
                     })           
                        }
        });
    });
    getUserSearch(server,options);
  // getChannelHistory(server, options);
    getChannelById(server, options);
    //getChatHistory(server, options);
    //socketcheck1(server, options);
    socketcheck(server, options);
    createChannel(server, options);
    addNewMember(server, options);
    next();
}


exports.register.attributes = {
    name: "chat"
}