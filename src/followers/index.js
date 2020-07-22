import getFollowersList from './handlers/get_followers';

exports.register = (server, option, next) => {
    getFollowersList(server, option);
  next();
};

exports.register.attributes = {
  name: 'followers',
};
