import Channels from '../../models/channels';
import Messages from '../../models/messages';
import Users from '../../models/users';
import Joi from 'joi';
import Hoek from 'hoek';
import _ from 'lodash';
import {
    ObjectID
} from 'mongodb';

/** 
Api to get my channels.
**/

var defaults = {};

const handler = async (request, reply) => {
    try {

        let payload = request.payload;
        const userId = payload.userId
        const token = payload.token
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
        // if (data.token != token) {
        //     return reply({
        //         status: false,
        //         status_msg: "error",
        //         message: "Token is invalid."
        //     })
        // }
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
        
        // var messageCountArray=[];
        for(var m=0;m<channelData.length;m++){
            // console.log('emmmm')
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
            // var channelObject={
            //     channelId:channelData[m]._id,
            //     members:membersArray
            // }
            // console.log(channelObject);
            // messageCountArray.push(channelObject)
            channelData[m].messageCount=membersArray
            // var messageCount={
            //     channelId:channelData[m]._id,
            //     members:messageData[k].messageRead
            // }
        //     console.log("fffffffffff=?????????????",messageData.messageRead);
        }
        // console.log(channelData)
        return reply({
            status: true,
            message: "Get my channels.",
            data: channelData
        })
    } catch (error) {
        return reply({
            status: false,
            message: error.message
        })
    }
}


const routeConfig = {
    method: 'POST',
    path: '/getMyChannels',
    config: {
        tags: ['api', 'posts'],
        description: 'Get my channels.',
        notes: ['On success'],
        validate: {
            payload: {
                userId: Joi.string().required(),
                token: Joi.string().required(),
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts);
    server.route(routeConfig);
}