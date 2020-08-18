import Mongoose from 'mongoose';
import validator from 'validator';
const Schema = Mongoose.Schema;
var ProjectFavouriteSchema = new Schema({
  isFavourite: {
    type: String,
    default: '',
  },
  userId: {
    ref: 'Users',
    type: Mongoose.Schema.Types.ObjectId,
  },
  projectId: {
    ref: 'Projects',
    type: Mongoose.Schema.Types.ObjectId,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});
const favourite = 'FavouriteProjects';
export default Mongoose.model(favourite, ProjectFavouriteSchema);
