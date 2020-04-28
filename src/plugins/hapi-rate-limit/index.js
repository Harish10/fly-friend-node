import Hoek from 'hoek'
/*
 * Here is the mongodb connection based on condition
 **/
let defaults = {
  pathLimit: 100 //,
  //userLimit: 300
}
exports.register = (server, options, next) => {
  defaults = Hoek.applyToDefaults(defaults, options)
  next()
}

exports.register.attributes = {
  name: 'hapi-rate-limit'
}