import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Project from '../../models/projects'
import Users from '../../models/users'
import Activity from '../../models/activities';
// import ProjectFavourites from '../../models/projectFavourites'
// const EmailService=require('../../services/email_service.js');
// import EmailService from '../../services/email_service.js';
import {
    ObjectID
} from 'mongodb';

/** 
Api to get all activities 
**/

let defaults = {}
const handler = async (request, reply) => {
    try {
        const userId = await Helpers.extractUserId(request)
        const user = await Users.findOne({
            _id: userId
        });
        if (user) {
          console.log(userId)
            var payload = request.query.search;
            var page = parseInt(request.query.page) || 1;
            var page_size = parseInt(request.query.page_size) || 10;
            var skip = parseInt((page - 1) * page_size);
            var totallength = await Activity.find({}).count();
            // var activityData=await Activity.find({}).skip(skip).limit(page_size);
            var activityData = await Activity.find({}).skip(skip).limit(page_size);
            var datas = await Activity.aggregate([
            {
              "$match":{
                  "userId":ObjectID(userId)
              }
            },
            {       
                    "$sort": {
                        "createdAt": -1
                    }
                },
                {
                    "$group": {

                        "_id": {
                            "projectId": "$projectId",
                            "userId": "$userId"
                        },
                        "projectCount": {
                            "$sum": 1
                        },
                        "project": {
                            "$push": "$$ROOT"
                        },

                    }
                },
                {
                    "$skip": skip
                },
                {
                    "$limit": page_size
                }
            ]);
            // console.log(datas)
            var recentData = await Activity.find({}).sort({
                createdAt: -1
            }).limit(3);
            if (activityData.length > 0) {
                return reply({
                    status: true,
                    message: "Get All Activities...",
                    data: datas,
                    recentActivity: recentData,
                    totallength: datas.length
                })
            } else {
                return reply({
                    status: false,
                    message: "No Data Found...",
                    data: [],
                    recentActivity: recentData,
                    totallength: 0
                })
            }
        }
    } catch (error) {
        return reply({
            status: false,
            message: error.message
        })
    }
}

const routeConfig = {
    method: 'GET',
    path: '/user/getAllActivities',
    config: {
        auth: 'jwt',
        tags: ['api', 'users'],
        description: 'Get All Activities.',
        notes: ['On success'],
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}