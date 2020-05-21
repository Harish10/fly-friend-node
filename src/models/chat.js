import Mongoose from 'mongoose';
const Schema=Mongoose.Schema;
const ChatSchema=new Schema({
	message:{
		type:String,
		default:''
	},
	lastMessage:{
		type:String,
		default:''
	},
	senderId:{
		type:Schema.Types.ObjectId,
		ref:'Users'
	},
	receiverId:{
		type:Schema.Types.ObjectId,
		ref:'Users'
	},
	createdAt:{
		type:Date,
		default:Date.now()
	},
	updatedAt:{
		type:Date,
		default:Date.now()
	}
});

const chat="Chats"
export default Mongoose.model(chat,ChatSchema);