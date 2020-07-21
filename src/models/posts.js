import Mongoose from 'mongoose'
import Constant from '../constants.js'
import validator from 'validator'

const Schema = Mongoose.Schema;
const PostSchema = new Schema({
    post: {
        type: String,
        default:""
    },
    userId: {
        ref: "Users",
        type: Mongoose.Schema.Types.ObjectId
    },
    images: {
        type: Array,
        default: []
    },
    //postImage:{type:String,max:255,default:''},
    //postImageName:{type:String,max:255,default:''},
    comments: [{
        ref: "Comments",
        type: Mongoose.Schema.Types.ObjectId
    }],
    reactions: {
        type: Array,
        default: []
    }
},   {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    versionKey: false,
  });

const posts = 'Posts'
export default Mongoose.model(posts, PostSchema);