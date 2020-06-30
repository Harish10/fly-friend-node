import Bluebird from 'bluebird'
import Hoek from 'hoek'
import Mongoose from 'mongoose'
/**
 * Project imports
 *
 */
/**
 * Setup
 *
 **/

Mongoose.Promise = Bluebird
let defaults = {
  url: ''
}
/*
 * Here is the mongodb connection based on condition
 **/
exports.register = (server, options, next) => {
  defaults = Hoek.applyToDefaults(defaults, options)
  if (!Mongoose.connection.readyState) {
    // setup our connection
    server.log(`${process.env.NOED_ENV} server connecting to ${defaults.url}`)
    Mongoose.set('useFindAndModify', false)
    Mongoose.set('useCreateIndex', true)
    const options = {
      promiseLibrary: Bluebird,
      useNewUrlParser: true
    }
    Mongoose.connect(defaults.url, options, () => {
      console.log("Database connected")
    })
  }
  next()
}

exports.register.attributes = {
  name: 'mongo'
}