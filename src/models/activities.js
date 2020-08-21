import Mongoose from 'mongoose'
import Constant from '../constants.js'
import validator from 'validator'

const Schema = Mongoose.Schema;
const ActivitySchema = new Schema({
    projectTitle: {
        type: String,
        default:""
    },
    userId: {
        ref: "Users",
        type: Mongoose.Schema.Types.ObjectId
    },
    projectId:{
        type:String,
        default:''
    },
    projectImages: {
        type: Array,
        default: []
    },
    description:{
        type:String,
        default:''
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }
}, { timestamps: true });

const activity = 'Activities'
export default Mongoose.model(activity, ActivitySchema);