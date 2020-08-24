import createPost from './handlers/create_posts';
import getAllPostsByUserId from './handlers/getAllPosts';
import getSinglePostInfo from './handlers/getSinglePostInfo';
import commentOnPost from './handlers/commentOnPost';
import likePost from './handlers/likePost';
import fetchNewsFeed from './handlers/fetch_newsfeed'
import getPostComments from './handlers/getPostComments';
import getAllPostReactions from './handlers/get_all_post_reactions';
import removePostComment from './handlers/removePostComment';
import editPostComment from './handlers/editPostComment';

exports.register = (server, option, next) => {
  createPost(server, option);
  getAllPostsByUserId(server, option);
  getSinglePostInfo(server, option);
  commentOnPost(server, option);
  likePost(server, option);
  fetchNewsFeed(server, option)
  getPostComments(server,option)
  getAllPostReactions(server,option)
  editPostComment(server,option)
  removePostComment(server,option)
  next();
};

// exports.posts.attributes={
// 	name:'posts'
// }

exports.register.attributes = {
  name: 'posts',
};
