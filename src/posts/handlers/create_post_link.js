import _ from "lodash";
import Hoek from "hoek";
import Users from "../../models/users";
import Posts from "../../models/posts";
import Comments from "../../models/commentPost";
import Joi from "joi";
import Helpers from "../../helpers.js";
const path = require('path')
const fs = require('fs')
// import CreatePostLink from '../../utils/createPostLink.js'

/** 
Api to create comment on post.
**/

var defaults = {};

const handler = async (request, reply) => {
  try {
    const payload = request.payload
    console.log('>>>>>  ', payload._id)
    const sPart = {
        VideoSnapUrl: 'https://ashishbhangade.com/video589653254544',
        Description: "THis is my first post please don't ignore please please please",
        awsUrl: 'https://aws.key.heeee'
    }
    const sObject = {
        SessionDescription: 'THis is section description jdljfl djlkfjdl'
    }
    const Id = payload._id
    let createLinkData = CreateLink("LINkkk", Id, sPart, sObject, "Ashish Heee Namee")
    console.log('linnnnnnkkkkkkkk=========>>>>> ', createLinkData)
  } catch (error) {
    return reply({
      status: false,
      message: error.message,
    });
  }
};

function CreateLink(req, Id, sPart, sObject, userName) {
    return new Promise(function(resolve) {
      var htmldata;
      var templateFile = path.resolve(__dirname, "../../postIndex.html")
      fs.readFile(templateFile, function(err, html) {
        if (err) {
            throw err; }
        htmldata = html.toString()
        htmldata = htmldata.replace(/datatitle/g, (req ? req : sObject.SessionDescription) + ', as posted on #Fyndario by ' + userName)
        htmldata = htmldata.replace(/datathumbLink/g, sPart.VideoSnapUrl !== "" ? sPart.VideoSnapUrl : "https://aws.in")
        htmldata = htmldata.replace(/datapDescription/g, sPart.Description + ', as posted on #Fyndario by ' + userName)
        htmldata = htmldata.replace(/datavideoLink/g, sPart.awsUrl)
        htmldata = htmldata.replace(/sessionId/g, Id)
        var saveTo = path.join(__dirname, "../../" + Id + ".html")
        fs.openSync(saveTo, 'w');
        fs.writeFile(saveTo, htmldata, function(err, results) {
            if (err != null) { console.error(err); }
        });
        var videoUrl = "http://" + "34.228.172.82:3000" + "/" + Id + ".html" ;
        console.log('vvvvvvvvvvvvvvvvvv', videoUrl)
        resolve(videoUrl)
      });
    });
  }

const routeConfig = {
  method: "POST",
  path: "/create_post_link",
  config: {
    auth: "jwt",
    tags: ["api", "posts"],
    description: "Create post link",
    notes: ["On success"],
    // validate: {
    //   payload: {
    //     postId: Joi.string().required(),
    //     comment: Joi.string().required(),
    //   },
    // },
    handler,
  },
};

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts);
  server.route(routeConfig);
};
