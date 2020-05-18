import Mongoose from 'mongoose'
import Constant from '../constants.js'
import validator from 'validator'

const Schema = Mongoose.Schema;
const PostSchema = new Schema({
    postTitle: {
        type: String,
        default:""
    },
    userId: {
        ref: "Users",
        type: Mongoose.Schema.Types.ObjectId
    },
    images: [{
        ref: "PostImages",
        type: Mongoose.Schema.Types.ObjectId
    }],
    //postImage:{type:String,max:255,default:''},
    //postImageName:{type:String,max:255,default:''},
    comments: [{
        ref: "Comments",
        type: Mongoose.Schema.Types.ObjectId
    }],
    likes: [{
        ref: "LikePosts",
        type: Mongoose.Schema.Types.ObjectId
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const posts = 'Posts'
export default Mongoose.model(posts, PostSchema);