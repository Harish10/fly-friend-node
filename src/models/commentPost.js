import Mongoose from 'mongoose'
import validator from 'validator'
const Schema = Mongoose.Schema;
var CommentPostSchema = new Schema({
    comment: {
        type: String,
        default:''
    },
    userId: {
        ref: "Users",
        type: Schema.Types.ObjectId
    },
    postId: {
        ref: "Posts",
        type: Schema.Types.ObjectId
    },
    userDetails:{
        type:Object,
        default:{}
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }

});
const comment = "Comments";
export default Mongoose.model(comment, CommentPostSchema)