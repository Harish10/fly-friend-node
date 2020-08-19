import Mongoose from 'mongoose';
import validator from 'validator';
const Schema = Mongoose.Schema;
var ReplyCommentMessageSchema = new Schema({
  comment: {
    type: String,
    default: '',
  },
  userId:{
    ref: 'Users',
    type: Mongoose.Schema.Types.ObjectId,
  },
  userName:{
    type:String,
    default:""
  },
  commentId: {
    ref: 'ProjectComments',
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
const replyMessage = 'ReplyComments';
export default Mongoose.model(replyMessage, ReplyCommentMessageSchema);
