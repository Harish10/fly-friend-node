import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Project from '../../models/projects'
import Users from '../../models/users'
// import ProjectFavourites from '../../models/projectFavourites'
// const EmailService=require('../../services/email_service.js');
// import EmailService from '../../services/email_service.js';

/** 
Api to get all projects 
**/

let defaults = {}
const handler = async (request, reply) => {
  try {
      const userId = await Helpers.extractUserId(request)
      const user = await Users.findOne({
      _id: userId
      });
      if(user){
        var payload = request.query;
        var page = request.query.page || 1;
        var page_size= request.query.page_size ||10;
        var skip=(page-1)*page_size;
        var totallength=await Project.find({}).count();
        var projectData=await Project.find({}).populate('comments').skip(skip).limit(page_size);
        // var projectData=await Project.find({}).populate('comments').populate('donors');
        // console.log(projectData);
        if(projectData.length>0){
        return reply({
          status: true,
          message: "Get All Project...",
          data:projectData,
          totallength:totallength
        })
        }else{
        return reply({
          status: false,
          message: "No Data Found...",
          data:[],
          totallength:0
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
  method: 'POST',
  path: '/user/getAllProjects',
  config: {
    auth:'jwt',
    tags: ['api', 'users'],
    description: 'Get All Projects.',
    notes: ['On success'],
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}