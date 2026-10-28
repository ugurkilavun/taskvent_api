import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  token: String,
  type: String,
  status: String,
  invitedBy: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  mainResourceId: mongoose.Schema.Types.ObjectId,
  secondarySourceId: mongoose.Schema.Types.ObjectId,
  role: {
    type: String,
    enum: ['projectManagers', 'teamLeaders', 'members'],
    default: undefined
  },
  expiresAt: Date,
  createdAt: Date,
}, {
  timestamps: false,
  versionKey: false,
  collection: 'invitations'
});

// Collection name
const invitation = mongoose.model('invitations', Schema);

export default invitation;