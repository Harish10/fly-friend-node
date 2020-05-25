import Mongoose from 'mongoose';
var Schema=Mongoose.Schema;
var ChannelSchema=new Schema({
	title:{
		type:String,
		default:''
	},
	lastMessage:{
		type:String,
		default:''
	},
	members:[{
		type:Schema.Types.ObjectId,
		ref:"Users"
	}],
	userId:{
		type:Schema.Types.ObjectId,
		ref:"Users"
	},
	users:[{
		type:Schema.Types.ObjectId,
		ref:'Users'
	}],
	messages:[],
	createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
const channel="Channels";
export default Mongoose.model(channel,ChannelSchema);