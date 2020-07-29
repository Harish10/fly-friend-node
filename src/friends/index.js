import getFriendsList from './handlers/get_friends_for_chat';

exports.register = (server, option, next) => {
    getFriendsList(server, option);
  next();
};

exports.register.attributes = {
  name: 'friends',
};
