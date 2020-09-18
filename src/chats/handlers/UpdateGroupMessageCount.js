import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/users'
import Channel from '../../models/channels'
import mongoose from 'mongoose';
import Messages from '../../models/messages';
import _ from 'lodash'

let defaults = {}
/*
 * Here is the api for get record based on object id
 **/
const handler = async (request, reply) => {
  const payload = request.payload
  try {
      var MessageData=await Messages.find({channelId:payload.channelId},{messageRead:1});
      for(var i=0;i<MessageData.length;i++){
      var messageReadArray=[];
      var count=0;
      // console.log(MessageData[i].messageRead,"messageRead");
      for(var j=0;j<MessageData[i].messageRead.length;j++){
        if(MessageData[i].messageRead[j].userId.toString()==payload.userId.toString()){
          var payload1={
            userId:payload.userId,
            isRead:false
          }
          messageReadArray.push(payload1)
          count++;
        }else{
          messageReadArray.push(MessageData[i].messageRead[j]);
          count++;
        }
        if(MessageData[i].messageRead.length==count){
        // console.log('enter')
        var MessageDataUpdate=await Messages.findOneAndUpdate({_id:MessageData[i]._id},{$set:{messageRead:messageReadArray}},{new:true});
        if(MessageDataUpdate){
        // console.log(MessageDataUpdate)
        }
      }
      }
      }
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
  path: '/chat/updateGroupMessageCount',
  config: {
    // auth: 'jwt',
    tags: ['api', 'me'],
    description: 'Returns a user object.',
    notes: [],
    validate:{
      payload:{
        userId:Joi.string().optional(),
        channelId:Joi.string().optional(),
      }
    },
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}