/* eslint-disable complexity */

import _ from 'lodash'
import Boom from 'boom'
import Jwt from 'jsonwebtoken'
import Hoek from 'hoek'

import constants from './constants'
import Config from './config'
// import GoogleService from './services/google_service'
// import slugify from 'slugify'
// import isBase64 from 'is-base64'
// import Mongoose from 'mongoose'
// import axios from 'axios'
import AwsServices from './services/aws_service'
// const awsServices = new AwsServices()
// const storeFile = require('request').defaults({
//   encoding: null
// })

/*eslint-disable no-magic-numbers */
/*eslint camelcase: [2, {properties: "never"}]*/
/*eslint no-nested-ternary: 0*/

const extractUserId = (request) => {
  return _.get(request, 'auth.credentials.id', false)
}

export const createJwt = (user) => {
  const contents = {
    id: user._id,
    scope: user.roles,
    createdAt: Date.now()
  }

  const options = Hoek.applyToDefaults({
    key: null,
    // expires: '3min',
    verifyOptions: {
      algorithms: ['HS256']
    }
  }, Config.get('/auth'))

  const token = Jwt.sign(
    contents,
    options.key, {
      algorithm: options.verifyOptions.algorithms[0],
      expiresIn: options.expires
    }
  )

  return token
}


export const boomify = (err) => {
  const statusCode = Number(_.get(err, 'statusCode', _.get(err, 'raw.statusCode', constants.HTTP400)))
  const strErr = `${err}`
  const message = _.get(err, 'message', _.get(err, 'raw.message', _.get(err, 'error_message', strErr === '' ? 'Bad Request' : strErr)))

  let boom = null
  if (_.get(err, 'isBoom', false)) {
    boom = err
  } else if (!_.isError(err)) {
    boom = Boom.create(statusCode, message, {
      timestamp: Date.now()
    })
  } else if (_.isError(err)) {
    boom = Boom.wrap(err, statusCode, message)
  } else { // err.isBoom
    boom = err
  }
  if (!_.get(boom, 'response', false)) {
    console.error('error', boom) // eslint-disable-line no-console
  } else {
    console.error('error', _.get(boom, 'output', '')) // eslint-disable-line no-console
  }
  return boom
}



export default {
  boomify,
  createJwt,
  extractUserId
}