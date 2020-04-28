import createUser from './handlers/post_user'
// import getUsers from './handlers/get_users'
// import getCounts from './handlers/get_counts'
// import getMe from './handlers/get_me'
// import updateUser from './handlers/put_user'
// import deleteUser from './handlers/delete_user'
// import updateUserByAdmin from './handlers/put_user_by_admin'
// import updatePropertyManager from './handlers/put_property_manager'

exports.register = (server, options, next) => {
  createUser(server, options)
  // getUsers(server, options)
  // getMe(server, options)
  // getCounts(server, options)
  // updateUser(server, options)
  // deleteUser(server, options)
  // updateUserByAdmin(server, options)
  // updatePropertyManager(server, options)
  next()
}

exports.register.attributes = {
  name: 'users'
}