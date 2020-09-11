import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/users'

let defaults = {}
/*
 * Here is the api for get search records
 **/
const handler = async (request, reply) => {
  const payload = request.payload
// <<<<<<< HEAD
//   // console.log(payload.search);
// =======
//   console.log(payload.search);
// >>>>>>> 56abc03a1855fa1d9961e82ca51d098d507929ea
  try {
    // const user = await Users.findOne({
    //   _id: Object(payload) 
    // }).lean()

    const user = await Users.find({
        "$expr": {
          "$regexMatch": {
            "input": { "$concat": ["$firstName", " ", "$lastName"] },
            "regex": payload.search,  //Your text search here
            "options": "i"
          }
        }
      })
// const user = await Users.find({ "firstName": { "$regex": payload, "$options": "i" } })
    return reply({
      status: true,
      message: 'user search successfully',
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
  path: '/search_users',
  config: {
    auth: 'jwt',
    tags: ['api', 'sarch'],
    description: 'Returns a search object',
    notes: [],
// <<<<<<< HEAD
    // validate:{
    //   payload:{
    //     search:Joi.string().optional()
    //   }
    // },
// =======
//     validate:{
//       payload:{
//         search:Joi.string().optional()
//       }
//     },
// >>>>>>> 56abc03a1855fa1d9961e82ca51d098d507929ea
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}