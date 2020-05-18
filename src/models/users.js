import Mongoose from 'mongoose'
import Constants from '../constants'
import validator from 'validator';
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
    salt: {
        type: String,
        default:''
    },
    countryCode: {
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
    long: {
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
    deviceId: {
        type: String,
        default: ""
    },
    deviceType: {
        type: String,
        default: ""
    },
    // like:[{ref:"LikePost",type:mongoose.Schema.Types.ObjectId}],
    posts: [{
        ref: "Post",
        type: Schema.Types.ObjectId
    }],
    // comment:[{ref:"Comment",type:mongoose.Schema.Types.ObjectId}],
    lastLogin: {
        type: String,
        default: ''
    },
    status: {
        type: Number,
        default: 1
    },
    verified: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String,
        default:''
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