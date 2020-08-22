import _ from 'lodash'
import Hoek from 'hoek'
import Users from '../../models/users'
import Posts from '../../models/posts'
import Comments from '../../models/commentPost'
import Joi from 'joi'
import Helpers from '../../helpers.js'

/** 
Api to Get all post comment.
**/

var defaults = {};

const handler = async (request, reply) => {
    try {
    const userId = await Helpers.extractUserId(request);
        var payload = request.payload;
        var data = await Users.findOne({
            _id: userId
        })
        if (data) {
            console.log(payload.postId);
        var commentData=await Comments.find({postId:payload.postId}).sort({createdAt:-1});
        if(commentData.length>0){
            return reply({
                status:true,
                message:"Get All Comments.",
                data:commentData
            })
            }else{
              return reply({
                status:false,
                message:"No Data Found.",
                data:[]
            })  
            }
        }
        }
 catch (error) {
        return reply({
            status: false,
            message: error.message
        })
    }
};

const routeConfig = {
    method: 'POST',
    path: '/post/getPostComments',
    config: {
        auth:'jwt',
        tags: ['api', 'posts'],
        description: 'Get All Post Comments.',
        notes: ['On success'],
        validate: {
            payload: {
                postId: Joi.string().required(),
            }
        },
        handler
    }
}


export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts);
    server.route(routeConfig);
}