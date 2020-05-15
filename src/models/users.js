import Mongoose from 'mongoose'
import Constants from '../constants'
import validator from 'validator';
const Schema = Mongoose.Schema;
const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        max: 255
    },
    lastName: {
        type: String,
        required: true,
        max: 255
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
        type: Schema.Types.Mixed,
        required: true,
        max: 255
    },
    salt: {
        type: String,
        required: true,
        max: 255
    },
    countryCode: {
        type: String,
        required: true,
        max: 255
    },
    mobileNo: {
        type: String,
        max: 255
    },
    dob: {
        type: String,
        max: 255,
        default: ""
    },
    address: {
        type: String,
        required: false,
        max: 255,
        default: ""
    },
    lat: {
        type: String,
        max: 255,
        default: ""
    },
    long: {
        type: String,
        max: 255,
        default: ""
    },
    userImage: {
        type: String,
        max: 255,
        default: ""
    },
    city: {
        type: String,
        max: 255,
        default: ""
    },
    state: {
        type: String,
        max: 255,
        default: ""
    },
    country: {
        type: String,
        max: 255,
        default: ""
    },
    deviceToken: {
        type: String,
        max: 255,
        default: ""
    },
    deviceId: {
        type: String,
        max: 255,
        default: ""
    },
    deviceType: {
        type: String,
        max: 255,
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
        max: 50,
        default: 1
    },
    verified: {
        type: Number,
        max: 20,
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
        max: 255,
        required: false
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