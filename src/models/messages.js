import Mongoose from 'mongoose';
var Schema=Mongoose.Schema;
var MessageSchema=new Schema({
	body:{
		type:String,
		default:''
	},
	userId:{
		type:Schema.Types.ObjectId,
		ref:'Users'
	},
	channelId:{
		type:Schema.Types.ObjectId,
		ref:'Channels'
	},
	user:{
	type:Schema.Types.ObjectId,
		ref:'Users'	
	},
	createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

var message="Messages";
export default Mongoose.model(message,MessageSchema);
