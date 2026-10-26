import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., 'LOGIN', 'REGISTER', 'UPDATE_DOC', 'CREATE_DOC'
  userName: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'history'
});

export default mongoose.model('History', historySchema);
