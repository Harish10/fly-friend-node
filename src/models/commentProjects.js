import Mongoose from 'mongoose'
import validator from 'validator'
const Schema = Mongoose.Schema;
var CommentProjectSchema = new Schema({
    comment: {
        type: String,
        default:''
    },
    userId: {
        ref: "Users",
        type: Schema.Types.ObjectId
    },
    postId: {
        ref: "Projects",
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
const comment = "ProjectComments";
export default Mongoose.model(comment, CommentProjectSchema)