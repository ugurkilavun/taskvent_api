import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  owner: mongoose.Schema.Types.ObjectId,
  // teamID: [mongoose.Schema.Types.ObjectId],
  teamID: { type: [mongoose.Schema.Types.ObjectId], required: false },
  title: String,
  description: String,
  tags: [String],
  createdAt: Date
}, {
  timestamps: false,
  versionKey: false,
  collection: 'projects'
});

// Collection name
const project = mongoose.model('projects', Schema);

export default project;