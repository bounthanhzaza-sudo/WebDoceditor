import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  slug: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  order: { type: Number, default: 1 },
  badge: { type: String, default: '' },
  badgeColor: { type: String, default: 'blue' },
  description: { type: String, default: '' },
  readTime: { type: String, default: '3 min read' },
  author: { type: String, default: 'DocEditor Team' },
  content: { type: String, default: '' }
}, {
  timestamps: true
});

export default mongoose.model('Document', documentSchema);
