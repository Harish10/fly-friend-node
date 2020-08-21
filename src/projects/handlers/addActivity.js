import _ from "lodash";
import Hoek from "hoek";
import Joi from "joi";
import Helpers from "../../helpers";
import Project from "../../models/projects";
import Activity from "../../models/activities";
import Users from "../../models/users";

/** 
Api to create activity
**/

let defaults = {};
const handler = async (request, reply) => {
  try {
    const userId = await Helpers.extractUserId(request);
    const user = await Users.findOne({
      _id: userId,
    });
    if (user) {
      var payload = request.payload;
      var projectId = payload.projectId;
      var projectData = await Project.findOne({ _id: projectId });
      if (projectData) {
        var payloadData = {
          projectId: projectData._id,
          projectTitle: projectData.title,
          projectImages: projectData.projectImage,
          description: projectData.description,
          companyName: payload.companyName,
          companyDescription: payload.companyDescription,
          userId: userId,
        };
        var obj = await new Activity(payloadData);
        var activity = await obj.save();
        if (activity) {
          return reply({
            status: true,
            message: "Added New Activity Successfully...",
          });
        }
      }else{
        return reply({
          status: false,
          message: "Project Id is not available...",
        });
      }
    }
  } catch (error) {
    return reply({
      status: false,
      message: error.message,
    });
  }
};

const routeConfig = {
  method: "POST",
  path: "/user/addActivity",
  config: {
    auth: "jwt",
    tags: ["api", "users"],
    description: "Create FlyFriend Activity",
    notes: ["On success"],
    // validate: {
    //   payload: {
    //     projectId: Joi.string().required(),
    //   },
    // },
    handler,
  },
};

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts);
  server.route(routeConfig);
};
