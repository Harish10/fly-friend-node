import Mongoose from 'mongoose'
import validator from 'validator'
const Schema = Mongoose.Schema;

var NotifyUserSchema = new Schema({
  isNotify: {
    type: Boolean,
    default: false
  },
  email: {
    type: String,
    lowercase: true,
		validate: (value) => {
			if (value.length == 0) {
				return true;
			}
			return validator.isEmail(value);
		},
		required: false,
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

const notify = "NotifyUsers";
export default Mongoose.model(notify, NotifyUserSchema)