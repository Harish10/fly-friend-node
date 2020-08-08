import getFriendsList from './handlers/get_friends_for_chat';
import addEditGorupFriend from './handlers/add_edit_group_friend';
import getAllFriends from './handlers/get_all_friends';

exports.register = (server, option, next) => {
    getFriendsList(server, option);
    addEditGorupFriend(server, option);
    getAllFriends(server, option);
  next();
};

exports.register.attributes = {
  name: 'friends',
};
