import Confidence from 'confidence'

/*
 * Rentcity Config files includes here
 **/
import pkg from '../../package.json'

import api from './api'
import auth from './auth'
import aws from './aws'
import general from './general'
import logging from './logging'
import mongo from './mongo'
import server from './server'
import sendgrid from './sendgrid'
import ratelimit from './ratelimit'
import google from './google'

const criteria = {
  env: process.env.NODE_ENV
}

const config = {
  $meta: 'Our main server config',
  pkg,
  server,
  api,
  auth,
  aws,
  general,
  logging,
  mongo,
  sendgrid,
  ratelimit,
  google
}

config.payload = {
  maxBytes: 100000000
}

const store = new Confidence.Store(config)
export default {
  get: (key) => store.get(key, criteria)
}