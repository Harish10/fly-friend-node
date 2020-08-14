import Hoek from 'hoek'

import Helpers from '../../helpers'
import mongoose from 'mongoose';
import Chat from '../../models/chat';

let defaults = {}
/*
 * Here is the api for edit chat record based on chatId
 **/
const handler = async (request, reply) => {
  const payload = request.payload
  const chatId = payload.chatId
  try {
    // const id = await Helpers.extractUserId(request)
    const user = await Chat.findOneAndUpdate(
                  { _id: chatId }, 
                  { $set: payload }
                )
    return reply({
      status: true,
      message: 'Update chat...',
      data: user ? user : []
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
  path: '/chat/edit_one_to_one_chat',
  config: {
    auth: 'jwt',
    tags: ['api', 'me'],
    description: 'Returns a edit chat object.',
    notes: [],
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}