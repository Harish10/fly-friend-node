import Hoek from 'hoek'
import Mongoose from 'mongoose'
/*
 * Here Auth Server details
 * Validate Function checking here
 **/
let defaults = {
  key: null,
  verifyOptions: {
    algorithms: ['HS256']
  },
  validateFunc: (decoded, request, callback) => {
    // validate the mongo id
    if (!Mongoose.Types.ObjectId.isValid(decoded.id)) {
      return callback(null, false)
    }
    return callback(null, true)
  }
}

exports.register = (server, options, next) => {
  defaults = Hoek.applyToDefaults(defaults, options)
  server.auth.strategy('jwt', 'jwt', defaults)
  next()
}

exports.register.attributes = {
  name: 'auth'
}