import getChatHistory from './handlers/getChatHistory';
import getSingleChat from './handlers/getSingleChat';
import socketcheck from './handlers/socketcheck';
import getChannelById from './handlers/getChannelById';
import getUserSearch from './handlers/getUserSearch';
import getMyChannels from './handlers/getMyChannels';
import getMessagesByChId from './handlers/getMessagesByChId';
import getAllChatUsers from './handlers/getAllChatUsers';
import editSingleChat from './handlers/editSingleChat';
import {
    ObjectID
} from 'mongodb';
import Chats from '../models/chat';
import Users from '../models/users';
import Messages from '../models/messages';
import Channels from '../models/channels';
import _ from 'lodash';
import UpdateMessageCount from './handlers/UpdateMessageCount';
import UpdateGroupMessageCount from './handlers/UpdateGroupMessageCount'
const {Howl,Howler}=require("howler");
exports.register = (server, options, next) => {
    //connection with socket.
    var io = require('socket.io')(server.listener);
    var socket;
    var connection = [];
    const rooms={};
    io.on('connection', function(socket) {
    socket.on('offer',(userId,roomID)=>{
    })
    socket.on('join room', (roomID)=>{
        console.log("joinedRoom",roomID);
        console.log(rooms[roomID]);
        if(rooms[roomID]){
            // console.log('enter')
            rooms[roomID].push(socket.id);
            // console.log('rooms',rooms);
        }else{
            rooms[roomID]=[socket.id];
        }
        const otherUser= rooms[roomID].find((id)=> id!==socket.id);
        // console.log("otherUser",otherUser);
        if(otherUser){
            socket.emit('other user',otherUser);
            socket.to(otherUser).emit('user joined',socket.id);
        }   
    });

    socket.on('offer',(payload)=>{
        // console.log("offer",payload);
        io.to(payload.target).emit('offer',payload);
    });
    socket.on('answer',(payload)=>{
        // console.log('answer',payload)
        io.to(payload.target).emit('answer',payload);
    });
    socket.on('ice-candidate',(incoming)=>{
        // console.log('ice',incoming.candidate)
        // console.log('candidate',incoming)
        io.to(incoming.target).emit('ice-candidate',incoming.candidate);
    });
        socket.on('disconnected-user',(s)=>{
        // console.log('ss',s);
        var ss=rooms[s];
        // console.log(ss);
        var roomArray=[];
        for(var i=0;i<ss.length;i++){
            if(ss[i]==socket.id){

            }else{
                roomArray.push(ss[i]);
            }
        }
        rooms[s]=roomArray;
    })
        socket.on('chatMessage', async function(payload) {
            console.log("sss",socket.id)
            const userId = payload.senderId
            // const token = payload.token
            var data = await Users.findOne({
                _id: userId
            })
            if (!data) {
                console.log("Please check your userId1.")
            }
            // if (data.token != token) {
            //     console.log("Token is invalid.")
            // }
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

                const chatData = await Chats.aggregate([
                  {$match: {
                    _id: data._id
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

                // var data = await Chats.find({
                //     $or: [{
                //         senderId: userId,
                //         receiverId: receiverId
                //     }, {
                //         senderId: receiverId,
                //         receiverId: userId
                //     }]
                // });
                io.emit('chatMessage', chatData);
            }
        });
        //ONLINE STATUS CHANGE
        socket.on('online', async function(payload) {
            const userId = payload.id
            // const token = payload.token
            connection.push(userId);
            var data = await Users.findOne({
                _id: userId
            })
            if (!data) {
                console.log("Please check your userId2.")
            }
            // if (data.token != token) {
            //     console.log("Token is invalid.")
            // }
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
        socket.on('offline', async function(payload) {

            const userId = payload.userId
            // const token = payload.token
            var data = await Users.findOne({
                _id: userId
            })
            if (!data) {
                console.log("Please check your userId3.")
            }
            // if (data.token != token) {
            //     console.log("Token is invalid.")
            // }
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
        socket.on('create_channel', async (payload) => {
            const userId = payload.userId
            console.log(socket.id);
            var socketId = socket.id
            // const token = payload.token
            var data = await Users.findOne({
                _id: userId
            })
            if (!data) {
                console.log("Please check your userId4.")
            }
            // if (data.token != token) {
            //     console.log("Token is invalid.")
            // }
            // var members=[];
            // _.each(_.get(payload,'members',[]),(key)=>{
            //     members.push(key);
            // })
            var title = payload.title;
            const message = payload.message;
            var members = payload.members;
            var payload = {
                userId: userId,
                title: title,
                lastMessage: message,
                groupImage: ''
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
                            channel.members.push(userId);
                            await channel.save();
                            var messagePayload = {
                                userId: userId,
                                channelId: channelId,
                                body: message
                            }
                            const messageObj = await new Messages(messagePayload);
                            var result = await messageObj.save();
                            if (result) {
                                //update lastmessage
                                //let send back to all member in this channel with new channel created     
                                let memberConnection = [];
                                var channelObject = await Channels.findOne({
                                    _id: channelId
                                });
                                var user = await Users.findOne({
                                    _id: userId
                                }, {
                                    _id: 1,
                                    firstName: 1,
                                    lastName: 1
                                });
                                channelObject.users = user
                                //fetch all users  has memberId
                                const query = {
                                    _id: {
                                        $in: members
                                    }
                                }
                                const options = {
                                    _id: 1,
                                    firstName: 1,
                                    lastName: 1
                                }
                                var userData = await Users.find(query, options);

                                channelObject.members = userData;
                                _.each(members, (id) => {
                                    // var user_id=id;
                                    // var memberConnection=connection.filter((con)=>con === user_id && con !== userId);
                                    //     if(memberConnection.size){
                                    //         memberConnection.forEach((con)=>{
                                    //             //send to socket  client matching  userId in channel members
                                    //             socket.emit('message',channelObject); 

                                    //         console.log('success');
                                    //         })
                                    //     }
                                    if (id !== userId) {
                                        socket.emit('message', channelObject);
                                    }
                                    // console.log(channelObject);
                                    console.log("success");
                                })
                            }
                        }
                    }
                }
            }
        });
            //CREATE NEW MESSAGE 
        socket.on('create_message', async (payload) => {
            console.log("sss",socket.id)
            
            // console.log(payload);
            const userId = payload.userId
            // console.log(socket.id);
            // const token = payload.token
            var data = await Users.findOne({
                _id: userId
            })
            if (!data) {
                console.log("Please check your userId4.")
            }
            // if (data.token != token) {
            //     console.log("Token is invalid.")
            // }
            var channelId = payload.channelId;
            var body = payload.message;
            var type = payload.type
            var payloadMessage = {
                channelId: channelId,
                userId: userId,
                body: body,
                type: type,
                emoji: ''
            }
            var messageObj = await new Messages(payloadMessage);
            var result = await messageObj.save();
            if (result) {
                //update lastmessage value
                await Channels.findOneAndUpdate({
                    _id: channelId
                }, {
                    $set: {
                        lastMessage: body,
                        updatedAt: new Date()
                    }
                }, {
                    new: true
                });
                //let send back to all member in this channel with new channel created     
                let memberConnection = [];
                var channelObject = await Channels.findOne({
                    _id: channelId
                });
                var user = await Users.findOne({
                    _id: userId
                }, {
                    _id: 1,
                    firstName: 1,
                    lastName: 1
                });
                channelObject.users = user
                //fetch all users  has memberId
                var members = channelObject.members

                //this is query for get message using channel id
                const query = {
                        _id: {
                            $in: members
                        }
                    }
                    const options = {
                        _id: 1,
                        firstName: 1,
                        lastName: 1
                    }
                    var userData = await Users.find(query, options);
                    channelObject.members = userData;

                    const query2 = [{
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
                                $eq: ObjectID(channelId)
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
                                profileImage: true,
                                isOnline: true,
                                lastOnlineTime: true
                            },
                            userId: true,
                            body: true,
                            type: true,
                            createdAt: true
                        }
                    },
                    {
                        $sort: {
                            createdAt: 1
                        }
                    }
                ]

                // const messageArray = await Messages.find({
                //     channelId: channelId
                // });
                var channelMessageData = await Messages.aggregate(query2);
                if (channelMessageData.length > 0) {
                    // socket.emit('create_message', channelMessageData);
                    io.emit('create_message', channelMessageData);
                    // count1++;
                  console.log("success");
                }

                // channelObject.messages = messageArray
                // _.each(members, (id) => {
                //     // var user_id=id;
                //     // var memberConnection=connection.filter((con)=>con === user_id && con !== userId);
                //     //     if(memberConnection.size){
                //     //         memberConnection.forEach((con)=>{
                //     //             //send to socket  client matching  userId in channel members
                //     //             socket.emit('message',channelObject); 

                //     //         console.log('success');
                //     //         })
                //     //     }
                //     if (id != userId) {
                //         socket.emit('create_message', channelObject);
                //         // count1++;
                //     }
                //     console.log("success");
                // })
            }
    
        });
    });
    getSingleChat(server,options);
    getChatHistory(server,options);
    getUserSearch(server, options);
    getMessagesByChId(server, options);
    getChannelById(server, options);
    getMyChannels(server, options);
    socketcheck(server, options);
    getAllChatUsers(server, options);
    editSingleChat(server, options);
    UpdateMessageCount(server,options);
    UpdateGroupMessageCount(server,options);
    next();
}

exports.register.attributes = {
    name: "chat"
}