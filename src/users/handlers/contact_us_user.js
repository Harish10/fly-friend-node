import _ from "lodash";
import Hoek from "hoek";
import Joi from "joi";
import Helpers from "../../helpers";
import Users from "../../models/users";
import EmailService from "../../services/contact_mail_service.js";

/** 
Api to send contact us user details
**/

let defaults = {};
const handler = async (request, reply) => {
    const payload = request.payload
  try {
      // email service
      var body = {
        email: payload.email,
        name: payload.name,
        subject: payload.subject,
        message: payload.message

      };
      await EmailService.sendMail(body, function (err, data) {
        console.log("mail sent");
      });
      return reply({
        status: true,
        message: "Information sent successfully...",
      });
  } catch (error) {
    return reply({
      status: false,
      message: error.message,
    });
  }
};

const routeConfig = {
  method: "POST",
  path: "/user/contact_us",
  config: {
    tags: ["api", "users"],
    description: "Contact Us User.",
    notes: ["On success"],
    validate: {
      payload: {
        name: Joi.string().required(),
        email: Joi.string().required(),
        subject: Joi.string().required(),
        message: Joi.string().required(),
      },
    },
    handler,
  },
};

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts);
  server.route(routeConfig);
};
