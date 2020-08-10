import Hoek from 'hoek'

import Helpers from '../../helpers'
import Users from '../../models/users'
import Friend from '../../models/friends'
import mongoose from 'mongoose';
import Chat from '../../models/chat';
import _ from 'lodash'

let defaults = {}
/*
 * Here is the api for get record based on object id
 **/
const handler = async (request, reply) => {
  const payload = request.payload
  try {
      const id = await Helpers.extractUserId(request)
      const user = await Users.aggregate([
        {
          $lookup: {
            from: Chat.collection.name,
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
                },
              },
            ],
            as: "users",
          },
        },
        { $unwind: "$users" },
        { $addFields: { "users.lastMessage": { $arrayElemAt:["$lastMessage.message", 0] }}},
        { $addFields: { "users.lastMessageDate": { $arrayElemAt:["$lastMessage.createdAt", 0] }}},
        { $addFields: { "users.messageType": { $arrayElemAt:["$lastMessage.type", 0] }}},
        {
          $replaceRoot: {
            newRoot: "$users",
          },
        },
      ]);
    
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

    return reply({
      status: true,
      message: 'Get chat friends...',
      data: orderList ? orderList : {}
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
  path: '/chat/get_all_chat_user',
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