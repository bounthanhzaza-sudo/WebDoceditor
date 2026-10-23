import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'main_settings' },
  version: { type: String, default: '2.0.0' },
  siteTitle: { type: String, default: 'DocEditor' },
  categories: { type: [String], default: ['Getting Started', 'Course Management', 'API & Integrations', 'Advanced Customization'] }
}, {
  timestamps: true
});

export default mongoose.model('Settings', settingsSchema);
