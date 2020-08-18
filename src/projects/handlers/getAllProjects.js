import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Project from '../../models/projects'
import Users from '../../models/users'
// import ProjectFavourites from '../../models/projectFavourites'

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
        var payload=request.payload;
        var projectId=payload.projectId;
        // console.log(projectId);
        var projectData=await Project.find({}).populate('comments').populate('donors');
        // console.log(projectData);
        if(projectData.length>0){
        return reply({
          status: true,
          message: "Get All Project...",
          data:projectData
        })
        }else{
        return reply({
          status: false,
          message: "No Data Found...",
          data:[]
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
    description: 'Delete FlyFriends project.',
    notes: ['On success'],
    validate: {
      payload: {
        projectId:Joi.string().required()
        }
    },
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}