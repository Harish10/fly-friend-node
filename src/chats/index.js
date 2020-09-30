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
const mongoose = require('mongoose');
import Chats from '../models/chat';
import Users from '../models/users';
import Messages from '../models/messages';
import Channels from '../models/channels';
import _ from 'lodash';
import UpdateMessageCount from './handlers/UpdateMessageCount';
import UpdateGroupMessageCount from './handlers/UpdateGroupMessageCount'
const {Howl,Howler}=require("howler");
var Hapi = require('hapi');
var server2 = new Hapi.Server();

exports.register = (server, options, next) => {
    //connection with socket.
    var io = server.plugins['hapi-io'].io;
    // var socket;
    // var connection = [];
    // const rooms={};
    // var io = require('socket.io')(server.listener);


    // var socket;
    var connection = [];
    const rooms={};
    io.on('connection', function(socket) {
      console.log('connected')
    socket.on('offerPing',(userId,senderData,roomid)=>{
    		io.emit('offer1',userId,senderData,roomid);
    })
    socket.on('join room', (roomID)=>{
        // console.log("joinedRoom",roomID);
        // console.log(rooms[roomID]);
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

    socket.on('userOffline',(payload)=>{
          // console.log('user-offline1',payload)
            socket.emit('userOffline1',payload);
            // socket.to(payload).emit('user joined',payload);
    });

    socket.on('callreject',(roomid)=>{
          // console.log('callreject1',roomid)
            // socket.emit('callreject1',roomid);
        io.emit('callreject1',roomid);

    });

    socket.on('offer',(payload)=>{
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
            // console.log("sss",socket.id)
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

            payload.isRead=true;
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
            io.emit('chatMessage', chatData);
            }
        });

      socket.on('getAllChatUserList1',async function(userId){
        const id=userId.userId;
         const totalCount=await Users.aggregate([
      {
          $lookup: {
            from: Chats.collection.name,
            let: { recipient: "$_id" },
            pipeline: [
              {
                $match: {
                       $and: [
                        { $expr: { $eq: ["$senderId", "$$recipient"] } },
                        { $expr: { $eq: ["$receiverId",  mongoose.Types.ObjectId(id)] } },
                        { $expr: { $eq: ["$isRead",true ] } }
                      ],
             } 
           },
              { $sort: { createdAt: -1 } }
            
            ],
            as: "TotalCount",
          },
        }
        ])
      // console.log(totalCount);
      var totalCountArray=[];
      for(var i=0;i<totalCount.length;i++){
        var totalCount1=totalCount[i].TotalCount;
        totalCountArray.push(totalCount1.length);
      }
      // console.log(totalCountArray)
      const user = await Users.aggregate([
        {
          $lookup: {
            from: Chats.collection.name,
            let: { recipient: "$_id" },
            pipeline: [
              {
                $match: {
                  $or: [
                    {
                      $and: [
                        { $expr: { $eq: ["$senderId", "$$recipient"] } },
                        { $expr: { $eq: ["$receiverId", mongoose.Types.ObjectId(id) ] } },
                      ],
                    },
                    {
                      $and: [
                        { $expr: { $eq: ["$senderId", mongoose.Types.ObjectId(id) ] } },
                        { $expr: { $eq: ["$receiverId", "$$recipient"] } },
                      ],
                    },
                  ],
                },
              },
              { $sort: { createdAt: -1 } },
              { $limit: 1 },
            ],
            as: "lastMessage",
          },
        },
        {
          $lookup: {
            from: Users.collection.name,
            let: { recipient: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$$recipient", "$_id"] } } },
              {
                $project: {
                  firstName: 1,
                  lastName: 1,
                  profileImage: 1,
                  isOnline: 1,
                  full_name: { $concat: ["$firstName", " ", "$lastName"] },
                  currentCity: 1,
                  city: 1,
                  workDetails: 1
                },
              },
            ],
            as: "users",
          },
        },
        { $unwind: "$users" },
        { $addFields: { "users.lastMessage": { $arrayElemAt:["$lastMessage.message", 0] }}},
        // { $addFields: { "users.lastMessageDate": { $arrayElemAt:["$lastMessage.createdAt", 0] }}},
        { $addFields: { "users.lastMessageDate": {$ifNull:[{ $arrayElemAt:["$lastMessage.createdAt", 0] },'']}}},
        { $addFields: { "users.messageType": { $arrayElemAt:["$lastMessage.type", 0] }}},
        {
          $replaceRoot: {
            newRoot: "$users",
          },
        },
      ]);
      // console.log(user);
      for(var j=0;j<user.length;j++){
        if(totalCountArray.length>0){
        for(var k =j;k<=j;k++){
          // console.log(user[j].firstName);
          // console.log(totalCount[j].firstName);
          user[j].messageCount=totalCountArray[k];
        }          
        }else{
          user[j].messageCount=0;
        }
      }
    //when last message date key availabel so push first one
    let orderList = []
    user && user.map((data, i)=>{
      if(data.lastMessageDate){
        orderList.push(data)
      }
    })

    orderList = _.orderBy(orderList, ['lastMessageDate'],['desc'])

    user && user.map((data, i)=>{
      if(!data.lastMessageDate){
        orderList.push(data)
      }
    })
    var payload={
        userId:userId.userId,
        getAllChatUserList:orderList
    }
      io.emit('getAllChatUserList2',payload);
      })
        // user friends list
       socket.on('getUserFriendList',async function(userId){
        // console.log('userId',userId)
        var id=userId.userId;
        const totalCount=await Friend.aggregate([
        {
            $match:{requester:ObjectID(id),status:3}
        },
        {
          $lookup: {
            from: Chats.collection.name,
            let: { recipient: "$recipient" },
            pipeline: [
              {
                $match: {
                      // $and: [
                      //   { $expr: { $eq: ["$senderId", mongoose.Types.ObjectId(id) ] } },
                      //   { $expr: { $eq: ["$receiverId", "$$recipient"] } },
                      //   { $expr: { $eq: ["$isRead",true ] } },
                      // ],
                //   },
                       $and: [
                        { $expr: { $eq: ["$senderId", "$$recipient"] } },
                        { $expr: { $eq: ["$receiverId", ObjectID(id) ] } },
                        { $expr: { $eq: ["$isRead",true ] } }
                      ],
                // $or: [
                //     {
                //       $and: [
                //         { $expr: { $eq: ["$senderId", "$$recipient"] } },
                //         { $expr: { $eq: ["$receiverId", mongoose.Types.ObjectId(id) ] } },
                //         { $expr: { $eq: ["$isRead",true ] } }
                //       ],
                //     },
                //     {
                //       $and: [
                //         { $expr: { $eq: ["$senderId", mongoose.Types.ObjectId(id) ] } },
                //         { $expr: { $eq: ["$receiverId", "$$recipient"] } },
                //         { $expr: { $eq: ["$isRead",true ] } }
                //       ],
                //     },
                //   ]
             } 
           },
              { $sort: { createdAt: -1 } }
            
            ],
            as: "TotalCount",
          },
        }
        // { $unwind: "$TotalCount" },
        // { $addFields: { "TotalCount.messageCount": { $arrayElemAt:["$lastMessage.message", 0] }}},
        ])
      // console.log('total',totalCount.length);
      // console.log(totalCount)
      var totalCountArray=[];
      for(var i=0;i<totalCount.length;i++){
        var totalCount1=totalCount[i].TotalCount;
        totalCountArray.push(totalCount1.length);
      }
      // console.log(totalCountArray);
      // console.log('total',totalCount.TotalCount);
      const user = await Friend.aggregate([
       { $match: { requester: ObjectID(id), status: 3 } },
        {
          $lookup: {
            from: Chats.collection.name,
            let: { recipient: "$recipient" },
            pipeline: [
              {
                $match: {
                  $or: [
                    {
                      $and: [
                        { $expr: { $eq: ["$senderId", "$$recipient"] } },
                        { $expr: { $eq: ["$receiverId", ObjectID(id) ] } },
                      ],
                    },
                    {
                      $and: [
                        { $expr: { $eq: ["$senderId", mongoose.Types.ObjectId(id) ] } },
                        { $expr: { $eq: ["$receiverId", "$$recipient"] } },
                      ],
                    },
                  ],
                },
              },
              { $sort: { createdAt: -1 } },
              { $limit: 1 },
            ],
            as: "lastMessage",
          },
        },
        {
          $lookup: {
            from: Users.collection.name,
            let: { recipient: "$recipient" },
            pipeline: [
              { $match: { $expr: { $eq: ["$$recipient", "$_id"] } } },
              {
                $project: {
                  firstName: 1,
                  lastName: 1,
                  profileImage: 1,
                  isOnline: 1,
                  full_name: { $concat: ["$firstName", " ", "$lastName"] },
                },
              },
            ],
            as: "users",
          },
        },
        { $unwind: "$users" },
        { $addFields: { "users.lastMessage": { $arrayElemAt:["$lastMessage.message", 0] }}},
        // { $addFields: { "users.lastMessageDate": { $arrayElemAt:["$lastMessage.createdAt", 0] }}},
        { $addFields: { "users.lastMessageDate": {$ifNull:[{ $arrayElemAt:["$lastMessage.createdAt", 0] },'']}}},
        // {
        //   $unwind:"$TotalCount"
        // },
        // { $addFields: { "users.messageCount":{$count:"$TotalCount.isRead" }}},
        {
          $replaceRoot: {
            newRoot: "$users",
          },
        },
      ]);
      for(var j=0;j<user.length;j++){
        if(totalCountArray.length>0){
        for(var k =j;k<=j;k++){
          user[j].messageCount=totalCountArray[k];
        }          
        }else{
          user[j].messageCount=0;
        }
      }
      var payload={
        userId:userId.userId,
        user:user
      }
      io.emit('getUserFriendList1',payload);
    })

  //getGroupChatData
  socket.on('getAllGroupChatList',async function(userId1){
    // console.log("Blaram",userId1)
    var userId=userId1.userId;
    // console.log("Blaram",userId)
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
        for(var m=0;m<channelData.length;m++){
            var messageData=await Messages.find({channelId:channelData[m]._id},{messageRead:1});
            var membersArray=[];
            for(var w=0;w<channelData[m].members.length;w++){
                var mm={
                    userId:channelData[m].members[w],
                    messcount:0
                }
                membersArray.push(mm);
            }
            // console.log(membersArray)
            for(var v=0;v<messageData.length;v++){
                var ss=messageData[v].messageRead;
                for(var s=0;s<ss.length;s++){
                    for(var z=0;z<membersArray.length;z++){
                        // console.log(typeof(membersArray[z].userId),"www")
                        // console.log(typeof(ss[s].userId),"www22")
                        if(membersArray[z].userId.toString()===ss[s].userId.toString()){
                            // console.log('enter',ss[s])
                            if(ss[s].isRead){
                                // console.log(ss[s].userId)
                                membersArray[z].messcount++;
                            }
                        }else{

                        }
                    }                    
                }
            }
            channelData[m].messageCount=membersArray
        }
     var payload={
        userId:userId,
        channelData:channelData
      }
      // console.log(payload);
      io.emit('getAllGroupChatList1',payload);
  })
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
            // console.log(socket.id);
            // console.log('eeeeeeeeeeee=?>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>1')
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
                            var memberData = await Channels.findOne({
                            _id: channelId
                            },{members:1});
                            // balram
                            var messageReadArray=[];
                            for(m=0;m<memberData.length;m++){
                              if(memberData[m]==userId){

                              }else{
                                var messageRead={
                                  userId:memberData[m],
                                  isRead:true
                                }
                                messageReadArray.push(messageRead)
                              }
                            }
                            // console.log(messageReadArray)
                            var messagePayload = {
                                userId: userId,
                                channelId: channelId,
                                body: message,
                                messageRead:messageReadArray
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
                                    // console.log("success");
                                })
                            }
                        }
                    }
                }
            }
        });
            //CREATE NEW MESSAGE 
        socket.on('create_message', async (payload) => {
            // console.log("sss",socket.id)
            // console.log('eeeeeeeeeeee=?>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>2', payload)
            
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
            var memberData = await Channels.findOne({
              _id: channelId
            },{members:1});
            // console.log(memberData,"wwwww")
            // console.log("userId",userId);
            var messageReadArray=[]
            for(m=0;m<memberData.members.length;m++){
              if(memberData.members[m]==userId){
                // console.log('ssss')
              }else{
                // console.log('ggggg')
                 var messageRead={
                    userId:memberData.members[m],
                    isRead:true
                  }
              messageReadArray.push(messageRead)
              }
            }
            // console.log(messageReadArray)
            var payloadMessage = {

                channelId: channelId,
                userId: userId,
                body: body,
                type: type,
                emoji: '',
                messageRead:messageReadArray
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
                  // console.log("success");
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
    })

    // io.on('connection', function(socket) {
    // socket.on('offer',(userId,roomID)=>{
    // })
    // socket.on('join room', (roomID)=>{
    //     console.log("joinedRoom",roomID);
    //     console.log(rooms[roomID]);
    //     if(rooms[roomID]){
    //         // console.log('enter')
    //         rooms[roomID].push(socket.id);
    //         // console.log('rooms',rooms);
    //     }else{
    //         rooms[roomID]=[socket.id];
    //     }
    //     const otherUser= rooms[roomID].find((id)=> id!==socket.id);
    //     // console.log("otherUser",otherUser);
    //     if(otherUser){
    //         socket.emit('other user',otherUser);
    //         socket.to(otherUser).emit('user joined',socket.id);
    //     }   
    // });

    // socket.on('offer',(payload)=>{
    //     // console.log("offer",payload);
    //     io.to(payload.target).emit('offer',payload);
    // });
    // socket.on('answer',(payload)=>{
    //     // console.log('answer',payload)
    //     io.to(payload.target).emit('answer',payload);
    // });
    // socket.on('ice-candidate',(incoming)=>{
    //     // console.log('ice',incoming.candidate)
    //     // console.log('candidate',incoming)
    //     io.to(incoming.target).emit('ice-candidate',incoming.candidate);
    // });
    //     socket.on('disconnected-user',(s)=>{
    //     // console.log('ss',s);
    //     var ss=rooms[s];
    //     // console.log(ss);
    //     var roomArray=[];
    //     for(var i=0;i<ss.length;i++){
    //         if(ss[i]==socket.id){

    //         }else{
    //             roomArray.push(ss[i]);
    //         }
    //     }
    //     rooms[s]=roomArray;
    // })
    //     socket.on('chatMessage', async function(payload) {
    //         console.log("sss",socket.id)
    //         const userId = payload.senderId
    //         // const token = payload.token
    //         var data = await Users.findOne({
    //             _id: userId
    //         })
    //         if (!data) {
    //             console.log("Please check your userId1.")
    //         }
    //         // if (data.token != token) {
    //         //     console.log("Token is invalid.")
    //         // }
    //         var chatObj = await new Chats(payload);
    //         var data = await chatObj.save();
    //         var message = payload.message
    //         var receiverId = payload.receiverId;
    //         var query = {
    //             $or: [{
    //                     $and: [{
    //                         senderId: userId
    //                     }, {
    //                         receiverId: receiverId
    //                     }]
    //                 },
    //                 {
    //                     $and: [{
    //                         senderId: receiverId
    //                     }, {
    //                         receiverId: userId
    //                     }]
    //                 }
    //             ]
    //         };
    //         await Chats.updateMany(query, {
    //             $set: {
    //                 lastMessage: message
    //             }
    //         }, {
    //             new: true
    //         })
    //         if (data) {
    //             console.log('success');

    //             const chatData = await Chats.aggregate([
    //               {$match: {
    //                 _id: data._id
    //               }},
    //               { "$lookup": {
    //                 "from": Users.collection.name,
    //                 "let": { "senderId": "$senderId" },
    //                 "pipeline": [
    //                   { "$match": { "$expr": { "$eq": [ "$_id", "$$senderId" ] } } },
    //                   { "$project": { "firstName": 1, "lastName": 1, "profileImage": 1 }}
    //                 ],
    //                 "as": "sender"
    //               }},{ "$lookup": {
    //                 "from": Users.collection.name,
    //                 "let": { "receiverId": "$receiverId" },
    //                 "pipeline": [
    //                   { "$match": { "$expr": { "$eq": [ "$_id", "$$receiverId" ] } } },
    //                   { "$project": { "firstName": 1, "lastName": 1, "profileImage": 1 }}
    //                 ],
    //                 "as": "receiver"
    //               }}])

    //             // var data = await Chats.find({
    //             //     $or: [{
    //             //         senderId: userId,
    //             //         receiverId: receiverId
    //             //     }, {
    //             //         senderId: receiverId,
    //             //         receiverId: userId
    //             //     }]
    //             // });
    //             io.emit('chatMessage', chatData);
    //         }
    //     });
    //     //ONLINE STATUS CHANGE
    //     socket.on('online', async function(payload) {
    //         const userId = payload.id
    //         // const token = payload.token
    //         connection.push(userId);
    //         var data = await Users.findOne({
    //             _id: userId
    //         })
    //         if (!data) {
    //             console.log("Please check your userId2.")
    //         }
    //         // if (data.token != token) {
    //         //     console.log("Token is invalid.")
    //         // }
    //         await Users.findOneAndUpdate({
    //             _id: userId
    //         }, {
    //             $set: {
    //                 isOnline: 1
    //             }
    //         }, {
    //             new: true
    //         });
    //     });
    //     //OFLINE STATUS AND LASTONLIMETIME CHANGE
    //     socket.on('offline', async function(payload) {

    //         const userId = payload.userId
    //         // const token = payload.token
    //         var data = await Users.findOne({
    //             _id: userId
    //         })
    //         if (!data) {
    //             console.log("Please check your userId3.")
    //         }
    //         // if (data.token != token) {
    //         //     console.log("Token is invalid.")
    //         // }
    //         var lastOnlineTime = Date.now()
    //         await Users.findOneAndUpdate({
    //             _id: userId
    //         }, {
    //             $set: {
    //                 isOnline: 0,
    //                 lastOnlineTime: lastOnlineTime
    //             }
    //         }, {
    //             new: true
    //         });
    //     });
    //     // const socketId=new ObjectID().toString();
    //     // console.log('someone connected to the server via socket',socketId);
    //     // socket.on('close',()=>{
    //     //     console.log('someone disconnected to the server')
    //     // });

    //     //CREATE CHANNEL
    //     socket.on('create_channel', async (payload) => {
    //         const userId = payload.userId
    //         console.log(socket.id);
    //         var socketId = socket.id
    //         // const token = payload.token
    //         var data = await Users.findOne({
    //             _id: userId
    //         })
    //         if (!data) {
    //             console.log("Please check your userId4.")
    //         }
    //         // if (data.token != token) {
    //         //     console.log("Token is invalid.")
    //         // }
    //         // var members=[];
    //         // _.each(_.get(payload,'members',[]),(key)=>{
    //         //     members.push(key);
    //         // })
    //         var title = payload.title;
    //         const message = payload.message;
    //         var members = payload.members;
    //         var payload = {
    //             userId: userId,
    //             title: title,
    //             lastMessage: message,
    //             groupImage: ''
    //         }
    //         const createChannel = await new Channels(payload);
    //         var data = await createChannel.save();
    //         if (data) {
    //             var channelId = data._id;
    //             var count = 0;
    //             var membersLength = members.length;
    //             if (membersLength > 0) {
    //                 for (var i = 0; i < membersLength; i++) {
    //                     var channel = await Channels.findOne({
    //                         _id: channelId
    //                     });
    //                     channel.members.push(members[i]);
    //                     await channel.save();
    //                     count++;
    //                     if (count == membersLength) {
    //                         channel.members.push(userId);
    //                         await channel.save();
    //                         var messagePayload = {
    //                             userId: userId,
    //                             channelId: channelId,
    //                             body: message
    //                         }
    //                         const messageObj = await new Messages(messagePayload);
    //                         var result = await messageObj.save();
    //                         if (result) {
    //                             //update lastmessage
    //                             //let send back to all member in this channel with new channel created     
    //                             let memberConnection = [];
    //                             var channelObject = await Channels.findOne({
    //                                 _id: channelId
    //                             });
    //                             var user = await Users.findOne({
    //                                 _id: userId
    //                             }, {
    //                                 _id: 1,
    //                                 firstName: 1,
    //                                 lastName: 1
    //                             });
    //                             channelObject.users = user
    //                             //fetch all users  has memberId
    //                             const query = {
    //                                 _id: {
    //                                     $in: members
    //                                 }
    //                             }
    //                             const options = {
    //                                 _id: 1,
    //                                 firstName: 1,
    //                                 lastName: 1
    //                             }
    //                             var userData = await Users.find(query, options);

    //                             channelObject.members = userData;
    //                             _.each(members, (id) => {
    //                                 // var user_id=id;
    //                                 // var memberConnection=connection.filter((con)=>con === user_id && con !== userId);
    //                                 //     if(memberConnection.size){
    //                                 //         memberConnection.forEach((con)=>{
    //                                 //             //send to socket  client matching  userId in channel members
    //                                 //             socket.emit('message',channelObject); 

    //                                 //         console.log('success');
    //                                 //         })
    //                                 //     }
    //                                 if (id !== userId) {
    //                                     socket.emit('message', channelObject);
    //                                 }
    //                                 // console.log(channelObject);
    //                                 console.log("success");
    //                             })
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     });
    //         //CREATE NEW MESSAGE 
    //     socket.on('create_message', async (payload) => {
    //         console.log("sss",socket.id)
            
    //         // console.log(payload);
    //         const userId = payload.userId
    //         // console.log(socket.id);
    //         // const token = payload.token
    //         var data = await Users.findOne({
    //             _id: userId
    //         })
    //         if (!data) {
    //             console.log("Please check your userId4.")
    //         }
    //         // if (data.token != token) {
    //         //     console.log("Token is invalid.")
    //         // }
    //         var channelId = payload.channelId;
    //         var body = payload.message;
    //         var type = payload.type
    //         var payloadMessage = {
    //             channelId: channelId,
    //             userId: userId,
    //             body: body,
    //             type: type,
    //             emoji: ''
    //         }
    //         var messageObj = await new Messages(payloadMessage);
    //         var result = await messageObj.save();
    //         if (result) {
    //             //update lastmessage value
    //             await Channels.findOneAndUpdate({
    //                 _id: channelId
    //             }, {
    //                 $set: {
    //                     lastMessage: body,
    //                     updatedAt: new Date()
    //                 }
    //             }, {
    //                 new: true
    //             });
    //             //let send back to all member in this channel with new channel created     
    //             let memberConnection = [];
    //             var channelObject = await Channels.findOne({
    //                 _id: channelId
    //             });
    //             var user = await Users.findOne({
    //                 _id: userId
    //             }, {
    //                 _id: 1,
    //                 firstName: 1,
    //                 lastName: 1
    //             });
    //             channelObject.users = user
    //             //fetch all users  has memberId
    //             var members = channelObject.members

    //             //this is query for get message using channel id
    //             const query = {
    //                     _id: {
    //                         $in: members
    //                     }
    //                 }
    //                 const options = {
    //                     _id: 1,
    //                     firstName: 1,
    //                     lastName: 1
    //                 }
    //                 var userData = await Users.find(query, options);
    //                 channelObject.members = userData;

    //                 const query2 = [{
    //                     $lookup: {
    //                         from: 'users',
    //                         localField: 'userId',
    //                         foreignField: '_id',
    //                         as: 'user'
    //                     }
    //                 },
    //                 {
    //                     $match: {
    //                         channelId: {
    //                             $eq: ObjectID(channelId)
    //                         }
    //                     }
    //                 },
    //                 {
    //                     $project: {
    //                         _id: true,
    //                         channelId: true,
    //                         user: {
    //                             _id: true,
    //                             firstName: true,
    //                             lastName: true,
    //                             profileImage: true,
    //                             isOnline: true,
    //                             lastOnlineTime: true
    //                         },
    //                         userId: true,
    //                         body: true,
    //                         type: true,
    //                         createdAt: true
    //                     }
    //                 },
    //                 {
    //                     $sort: {
    //                         createdAt: 1
    //                     }
    //                 }
    //             ]

    //             // const messageArray = await Messages.find({
    //             //     channelId: channelId
    //             // });
    //             var channelMessageData = await Messages.aggregate(query2);
    //             if (channelMessageData.length > 0) {
    //                 // socket.emit('create_message', channelMessageData);
    //                 io.emit('create_message', channelMessageData);
    //                 // count1++;
    //               console.log("success");
    //             }

    //             // channelObject.messages = messageArray
    //             // _.each(members, (id) => {
    //             //     // var user_id=id;
    //             //     // var memberConnection=connection.filter((con)=>con === user_id && con !== userId);
    //             //     //     if(memberConnection.size){
    //             //     //         memberConnection.forEach((con)=>{
    //             //     //             //send to socket  client matching  userId in channel members
    //             //     //             socket.emit('message',channelObject); 

    //             //     //         console.log('success');
    //             //     //         })
    //             //     //     }
    //             //     if (id != userId) {
    //             //         socket.emit('create_message', channelObject);
    //             //         // count1++;
    //             //     }
    //             //     console.log("success");
    //             // })
    //         }
    
    //     });
    // });
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