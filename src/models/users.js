import Mongoose from 'mongoose';
import validator from 'validator';

const Schema = Mongoose.Schema;

const UserSchema = new Schema(
  {
    userName: {
      type: String,
      default: '',
    },
    firstName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
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
      default: '',
    },
    role: {
      type: String,
      default: 'user',
    },
    countryCode: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    mobileNo: {
      type: String,
      default: '',
    },
    dob: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    lat: {
      type: String,
      default: '',
    },
    lng: {
      type: String,
      default: '',
    },
    userImage: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    currentCity: {
      type: String,
      default: '',
    },
    gender: { 
      type: String, 
      default: '' 
    },
    dob: {
      type: Date,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    deviceToken: {
      type: String,
      default: '',
    },
    lastOnlineTime: {
      type: Date,
      default: Date.now,
    },
    deviceType: {
      type: String,
      default: '',
    },
    posts: [
      {
        ref: 'Post',
        type: Schema.Types.ObjectId,
      },
    ],
    lastLogin: {
      type: String,
      default: '',
    },
    isOnline: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 1,
    },
    verified: {
      type: Number,
      default: 0,
    },
    token: {
      type: String,
      default: '',
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },

    // Profile Details
    holdingNumber: { type: String, default: '' },
    hasSsnOrItin: { type: Boolean, default: false },
    SsnOrItinNumber: { type: Number, default: 0 },
    SsnOrItinNumber: { type: Number, default: 0 },
    zip: { type: Number, default: 0 },
    profileImage: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    workDetails: { type: [{
      companyName: { type: String, default: '' },
      position: { type: String, default: '' },
      city: { type: String, default: '' },
      description: { type: String, default: '' },
      currentlyWorkCheck: { type: Boolean, default: true },
      fromDate: {type: Date, default: Date.now },
      toDate: {type: Date, default: Date.now },
      privacy: { type: String, default: '' }
    }], default: [] },
    // Work Details Object
    // {
    //     'title': String,
    //     fromDate: Date,
    //     toDate: Date,
    //     location
    // }

    collegeDetails: { type: [{
      collegeName : { type: String, default: '' },
      courseName : { type: String, default: '' },
      degreeName : { type: String, default: '' },
      description : { type: String, default: '' },
      graduated : { type: Boolean, default: true },
      fromDate : {type: Date, default: Date.now },
      toDate : {type: Date, default: Date.now },
      privacy : { type: String, default: '' }
    }], default: [] },
    // College Details Object
    // {
    //     'title': String,
    //     fromDate: Date,
    //     toDate: Date,
    //     location
    // }

    schoolDetails: { type: [{
      schoolName: { type: String, default: '' },
       graduated: { type: Boolean, default: true },
       description: { type: String, default: '' },
       fromDate: {type: Date, default: Date.now },
       toDate: {type: Date, default: Date.now },
       privacy: { type: String, default: '' }
    }], default: [] },
    // School Details Object
    // {
    //     'title': String,
    //     fromDate: Date,
    //     toDate: Date,
    //     location
    // }

    about: { type: String, default: '' },
    
    favouriteQuotes: { type: [{
      title: { type: String, default: '' },
      privacy: { type: String, default: '' }
    }], default: [] },

    activities: { type: [{
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      image: { type: String, default: '' },
    }], default: [] },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    versionKey: false,
  }
);

UserSchema.index({
  createdAt: 1,
});
UserSchema.index({
  email: 1,
});
UserSchema.index({
  userName: 1,
});

UserSchema.methods.setLastLogin = function () {
  this.lastLogin = Date.now();
};

const users = 'Users';
export default Mongoose.model(users, UserSchema);
