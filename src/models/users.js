import Mongoose from 'mongoose'
import Constants from '../constants'

const Schema = Mongoose.Schema
const schema = new Schema({
  firstname: {
    type: String,
    default: ''
  },
  lastname: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    sparse: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    default: ''
  },
  usertype: {
    type: String,
    default: Constants.USERTYPES.USER,
    required: true
  },
  company: {
    type: String,
    default: ''
  },
  buildings: [{
    type: Schema.Types.ObjectId,
    ref: 'Buildings'
  }],
  phone: {
    type: String,
    default: ''
  },
  status: {
    type: Number,
    default: 10
  },
  code: {
    type: String,
    default: ''
  },
  last_login: {
    type: Date,
    default: Date.now
  },
  code_expiration: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

schema.index({
  createdAt: 1
})
schema.index({
  email: 1
})
schema.index({
  username: 1
})
schema.index({
  firstname: 1
})


schema.methods.setLastLogin = function () {
  this.lastLogin = Date.now()
}

const users = 'Users'
export default Mongoose.model(users, schema)