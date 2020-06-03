import Mongoose from 'mongoose'
import validator from 'validator'

const Schema = Mongoose.Schema;

const UserSchema = new Schema({
  userName: {
    type: String,
    default:''
  },
  firstName:{
    type:String,
    default:''
  },
  lastName: {
    type: String,
    default:''
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
  password: {
    type: String,
    default:''
	},
	role: {
    type: String,
    default:'user'
	},
  countryCode: {
    type: String,
    default:''
	},
	phone: {
    type: String,
    default:''
  },
  mobileNo: {
    type: String,
    default:''
  },
  dob: {
    type: String,
    default: ""
  },
  address: {
    type: String,
    default: ""
  },
  lat: {
    type: String,
    default: ""
  },
  lng: {
    type: String,
    default: ""
  },
  userImage: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    default: ""
  },
  state: {
    type: String,
    default: ""
  },
	country: {
    type: String,
    default: ""
  },
  deviceToken: {
    type: String,
    default: ""
  },
  lastOnlineTime: {
    type: Date,
    default: Date.now
  },
  deviceType: {
    type: String,
    default: ""
  },
	posts: [{
		ref: "Post",
		type: Schema.Types.ObjectId
	}],
	lastLogin: {
		type: String,
		default: ''
	},
	isOnline:{
		type:Number,
		default:0
	},
	status: {
		type: Number,
		default: 1
	},
	verified: {
		type: Number,
		default: 0
	},
	token: {
		type: String,
		default:''
  },
  resetPasswordToken: {
    type: String,
    required: false
  },
  resetPasswordExpires: {
    type: Date,
    required: false
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

UserSchema.index({
  createdAt: 1
})
UserSchema.index({
  email: 1
})
UserSchema.index({
  userName: 1
})


UserSchema.methods.setLastLogin = function() {
  this.lastLogin = Date.now()
}

const users = 'Users'
export default Mongoose.model(users, UserSchema)