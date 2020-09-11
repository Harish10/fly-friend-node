import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/users'

let defaults = {}
/*
 * Here is the api for get login user record based on jwt token
 **/
const handler = async (request, reply) => {
  try {
    // const id = await Helpers.extractUserId(request)
    const id=request.payload.userId;
    // console.log("id",id)

    const user = await Users.findOne({
      _id: id
    }).lean()
    // console.log(user)
    return reply({
      status: true,
      message: 'user fetched successfully',
      data: user ? user : {}
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
  path: '/getUserDataById',
  config: {
    // auth: 'jwt',
    tags: ['api', 'me'],
    description: 'Returns a user object based on JWT along with a new token.',
    notes: [],
    validate:{
      payload:{
        userId:Joi.string().optional()
      }
    },
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}