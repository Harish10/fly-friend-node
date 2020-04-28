import 'babel-polyfill'

/**
 * Module imports
 *
 **/

import Glue from 'glue'

/**
 * Project imports
 *
 **/

import Manifest from './manifest'


const composeOptions = {
  relativeTo: __dirname
}

const composer = Glue.compose.bind(Glue, Manifest.get('/'), composeOptions)

composer((err, server) => {
  if (err) throw err
  server.initialize((errInit) => {
    if (err) throw errInit
    const register = (hapiRaven, options, next) => {
      return next()
    }
    register.attributes = {
      name: 'hapi-raven',
      version: '1.0.1',
      options: {}
    }
    server.register([register])
    server.start(() => {
      // const env = process.env.NODE_ENV
      // const msg = `${env} server started at ${server.info.uri}`
      console.log('Server started at ' + server.info.uri + ' ');
      // server.log(['server', 'info'], msg)
    })
  })


})

export default composer