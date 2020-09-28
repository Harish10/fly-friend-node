import Hoek from 'hoek'
import Joi from 'joi'
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
      var update=await Chat.updateMany({$or: [
                    {
                      $and: [
                        { senderId: payload.senderId },
                        { receiverId:payload.receiverId  },
                      ],
                    },
                    {
                      $and: [
                        {senderId: payload.receiverId  },
                        {receiverId: payload.senderId},
                      ],
                    },
                  ]},{$set:{isRead:false}});
      // console.log('update',update)
      return reply({
        status:true,
        message:"Update message count."
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
  method: 'POST',
  path: '/chat/updateMessageCount',
  config: {
    // auth: 'jwt',
    tags: ['api', 'me'],
    description: 'Returns a user object.',
    notes: [],
    validate:{
      payload:{
        senderId:Joi.string().optional(),
        receiverId:Joi.string().optional(),
      }
    },
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}