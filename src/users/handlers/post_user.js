import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'

import Helpers from '../../helpers'
import Users from '../../models/users'
// import AwsServices from '../../services/aws_service'
// const awsServices = new AwsServices()
/*
 * Api to create new user
 **/
let defaults = {}

const handler = async (request, reply) => {
  // const email = _.get(request, 'payload.email', '')
  try {
    let payload = request.payload
    console.log(payload, 'payload======>')
    // const user = await Users.findOne({
    //   email
    // })
    // if (!user) {
    //   let payload = request.payload
    //   // if (_.get(payload, 'image', '') !== '' && await Helpers.checkBase64(payload.image)) {
    //   //   let originalBlobArray = payload.image.split(',')
    //   //   var buf = new Buffer(originalBlobArray[1], 'base64')
    //   //   const imageUrl = await awsServices.uploadImage(payload.imageName, buf, 'user')
    //   //   delete payload.image
    //   //   payload.image = imageUrl
    //   // }
    //   const newUser = await new Users(payload)
    //   await newUser.save()
    //   const token = await Helpers.createJwt(newUser)
    //   if (_.get(newUser, 'usertype', '') === 'user') {
    //     return reply({
    //       status: true,
    //       message: 'User created successfully',
    //       data: token
    //     })
    //   } else {
    //     _.get(newUser, 'buildings', []).map(async (buildingId) => {
    //       await Buildings.findOneAndUpdate({
    //         _id: buildingId
    //       }, {
    //         $addToSet: {
    //           managerId: _.get(newUser, '_id', '')
    //         }
    //       })
    //     })
    //     return reply({
    //       status: true,
    //       message: 'User Created Successfully',
    //       data: token
    //     })
    //   }
    // } else {
    //   return reply({
    //     status: false,
    //     message: 'User already exists.',
    //     data: {}
    //   })
    // }
    return reply({
      status: true,
      message: 'User',
      data: payload
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
  path: '/user',
  config: {
    tags: ['api', 'users'],
    description: 'Create rentcity Account.',
    notes: ['On success'],
    // validate: {
    //   payload: {
    //     firstname: Joi.string().required(),
    //     lastname: Joi.any().optional(),
    //     email: Joi.string().required(),
    //     phone: Joi.any().optional(),
    //     username: Joi.any().optional(),
    //     image: Joi.any().optional(),
    //     imageName: Joi.any().optional(),
    //     usertype: Joi.string().required(),
    //     company: Joi.string().optional(),
    //     buildings: Joi.any().optional()
    //   }
    // },
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}