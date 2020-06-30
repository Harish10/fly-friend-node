import Mongoose from 'mongoose'
import validator from 'validator'
const Schema = Mongoose.Schema;
var CommentPostSchema = new Schema({
    comment: {
        type: String,
        default:''
    },
    // user_id:{type:String,max:255},
    // post_id:{type:String,max:255},
    userId: {
        ref: "Users",
        type: Schema.Types.ObjectId
    },
    postId: {
        ref: "Posts",
        type: Schema.Types.ObjectId
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