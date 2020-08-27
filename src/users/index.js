import createUser from './handlers/post_user'
import loginUser from './handlers/sign_in'
import getUsers from './handlers/get_users'
import notifyUsers from './handlers/notify_user'
// import getCounts from './handlers/get_counts'
import getMe from './handlers/get_me'
import forgotUser from './handlers/forgot_user'
import resetUser from './handlers/reset_user'
import updateUser from './handlers/put_user'
import newRegistration from './handlers/new_registration'
import updateUserDetail from './handlers/update_user_details'
import deleteUserDetail from './handlers/delete_user_detail'
import updateUserPrivacy from './handlers/update_user_privacy'
import getUserById from './handlers/get_user_by_id'
import searchUser from './handlers/search_user'
import addFriendRequest from './handlers/add_friend'
import getFriends from './handlers/get_friends'
import uploadFile from './handlers/upload_image'
import changeProfile from './handlers/change_profile_picture'
import contactUsInformation from './handlers/contact_us_user'
// import deleteUser from './handlers/delete_user'
// import updateUserByAdmin from './handlers/put_user_by_admin'
// import updatePropertyManager from './handlers/put_property_manager'
exports.register = (server, options, next) => {
    createUser(server, options);
    loginUser(server, options);
    getUsers(server, options);
    notifyUsers(server, options);
    getMe(server, options);
    forgotUser(server, options);
    resetUser(server, options);
    // getCounts(server, options)
    updateUser(server, options)
    newRegistration(server, options)
    updateUserDetail(server, options)
    deleteUserDetail(server, options)
    updateUserPrivacy(server, options)
    getUserById(server, options)
    searchUser(server, options)
    addFriendRequest(server, options)
    getFriends(server, options)
    uploadFile(server, options)
    changeProfile(server, options)
    contactUsInformation(server, options)
    // deleteUser(server, options)
    // updateUserByAdmin(server, options)
    // updatePropertyManager(server, options)
    next()
}

exports.register.attributes = {
    name: 'users'
}