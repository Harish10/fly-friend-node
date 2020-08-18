import Mongoose from 'mongoose'
import Constant from '../constants.js'
import validator from 'validator'

const Schema = Mongoose.Schema;
const ProjectSchema = new Schema({
    title: {
        type: String,
        default:""
    },
    userId: {
        ref: "Users",
        type: Mongoose.Schema.Types.ObjectId
    },
    tags:{
        type: Array,
        default: []
    },
    description:{
        type:String,
        default:""
    },
    projectImage:{
        type:Array,
        default:[]
    },
    comments: [{
        ref: "ProjectComments",
        type: Mongoose.Schema.Types.ObjectId
    }],
    donors:[{
        ref:"Donors",
        type:Mongoose.Schema.Types.ObjectId
    }],
    favourites:{
        type:Array,
        default:[]
    },
    isFavourite:{
        type:Boolean,
        default:false
    },
    status:{
        type:Boolean,
        default:true
    }
},   {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    versionKey: false,
  });

ProjectSchema.index({
  createdAt: 1,
});

const project = 'Projects'
export default Mongoose.model(project, ProjectSchema);