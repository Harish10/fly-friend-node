import getFriendsList from './handlers/get_friends_for_chat';
import addEditGorupFriend from './handlers/add_edit_group_friend';

exports.register = (server, option, next) => {
    getFriendsList(server, option);
    addEditGorupFriend(server, option);
  next();
};

exports.register.attributes = {
  name: 'friends',
};
