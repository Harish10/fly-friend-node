import Hoek from 'hoek'

import Helpers from '../../helpers'
import mongoose from 'mongoose';
import Channels from '../../models/channels';

let defaults = {}
/*
 * Here is the api for group friend record based on channel id
 **/
const handler = async (request, reply) => {
  const payload = request.payload
  const channelId = payload.channelId
  const members = payload.members
  try {
    const id = await Helpers.extractUserId(request)
    const user = await Channels.findOneAndUpdate(
                  { _id: channelId }, 
                  { $set: { 'members': members} }
                )
    return reply({
      status: true,
      message: 'Update gorup friends...',
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
  path: '/chat/add_edit_group_friends',
  config: {
    auth: 'jwt',
    tags: ['api', 'me'],
    description: 'Returns a group friend object.',
    notes: [],
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}