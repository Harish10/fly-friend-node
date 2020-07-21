import Mongoose from 'mongoose';
import validator from 'validator';
const Schema = Mongoose.Schema;
var CommentPostSchema = new Schema({
  isLike: {
    type: String,
    default: '',
  },
  // user_id:{type:String,max:255},
  // post_id:{type:String,max:255},
  emoji: {
    type: String,
    default: '  ',
  },
  by: {
    ref: 'Users',
    type: Mongoose.Schema.Types.ObjectId,
  },
  userId: {
    ref: 'Users',
    type: Mongoose.Schema.Types.ObjectId,
  },
  postId: {
    ref: 'Posts',
    type: Mongoose.Schema.Types.ObjectId,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});
const comment = 'LikePosts';
export default Mongoose.model(comment, CommentPostSchema);
