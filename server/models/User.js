import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true } // In production, hash with bcrypt. For prototype simplicity, plain or hashed.
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
