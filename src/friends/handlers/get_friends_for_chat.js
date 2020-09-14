import Hoek from 'hoek'

import Helpers from '../../helpers'
import Users from '../../models/users'
import Friend from '../../models/friends'
import mongoose from 'mongoose';
import Chat from '../../models/chat';

let defaults = {}
/*
 * Here is the api for get record based on object id
 **/
const handler = async (request, reply) => {
  const payload = request.payload
  try {
      const id = await Helpers.extractUserId(request)
      // console.log('sssss',id);
      const totalCount=await Friend.aggregate([
      {
        $match:{requester:mongoose.Types.ObjectId(id),status:3}
      },
      {
          $lookup: {
            from: Chat.collection.name,
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
                        { $expr: { $eq: ["$receiverId", mongoose.Types.ObjectId(id) ] } },
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
       { $match: { requester: mongoose.Types.ObjectId(id), status: 3 } },
        {
          $lookup: {
            from: Chat.collection.name,
            let: { recipient: "$recipient" },
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
        { $addFields: { "users.lastMessageDate": { $arrayElemAt:["$lastMessage.createdAt", 0] }}},
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
      // console.log(user);
    return reply({
      status: true,
      message: 'Get chat friends...',
      data: user ? user : {}
    })
  } catch (error) {
    return reply({
      status: false,
      message: error.message,
      data: {}
    })
  }
}

const routeConfig = {
  method: 'GET',
  path: '/get_current_user_friend_list',
  config: {
    auth: 'jwt',
    tags: ['api', 'me'],
    description: 'Returns a user object.',
    notes: [],
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}