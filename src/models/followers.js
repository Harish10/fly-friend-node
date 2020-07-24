import Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

const followersSchema = new Schema({
    requester: { type: Schema.Types.ObjectId, ref: 'Users'},
    recipient: { type: Schema.Types.ObjectId, ref: 'Users'},
    status: {
      type: Number,
      enums: [
          0,    //'follow',
          1,    //'requested',
          2,    //'unfollow',
      ]
    }
  }, {timestamps: true})
  
  module.exports = Mongoose.model('followers', followersSchema)
