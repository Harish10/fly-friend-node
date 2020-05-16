import createPost from './handlers/create_posts'
import getAllPostsByUserId from './handlers/getAllPosts'
import getSinglePostInfo from './handlers/getSinglePostInfo'
import commentOnPost from './handlers/commentOnPost'
import likePost from './handlers/likePost'

exports.register=(server,option,next)=>{
createPost(server,option);
getAllPostsByUserId(server,option);
getSinglePostInfo(server,option);
commentOnPost(server,option);
likePost(server,option);
next();
}

// exports.posts.attributes={
// 	name:'posts'
// }


exports.register.attributes = {
    name: 'posts'
}