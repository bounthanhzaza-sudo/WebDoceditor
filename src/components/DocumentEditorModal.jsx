import React, { useState, useEffect } from 'react';
import { X, Save, Eye, Code } from 'lucide-react';

export function DocumentEditorModal({ isOpen, onClose, onSave, doc, categories, defaultCategory }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: categories[0] || 'General',
    badge: 'Guide',
    badgeColor: 'blue',
    description: '',
    readTime: '3 min read',
    author: 'DocEditor Admin',
    content: ''
  });

  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'

  useEffect(() => {
    if (doc) {
      setFormData({
        title: doc.title || '',
        slug: doc.slug || '',
        category: doc.category || categories[0] || 'General',
        badge: doc.badge || 'Guide',
        badgeColor: doc.badgeColor || 'blue',
        description: doc.description || '',
        readTime: doc.readTime || '3 min read',
        author: doc.author || 'DocEditor Admin',
        content: doc.content || ''
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        category: defaultCategory || categories[0] || 'General',
        badge: 'Guide',
        badgeColor: 'blue',
        description: '',
        readTime: '3 min read',
        author: 'DocEditor Admin',
        content: '<h2>Heading</h2>\n<p>Write your documentation content here in HTML or rich format.</p>'
      });
    }
    setActiveTab('edit');
  }, [doc, categories, defaultCategory, isOpen]);

  if (!isOpen) return null;

  const handleTitleChange = (e) => {
    const val = e.target.value;
    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, title: val, slug }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...doc,
      ...formData,
      id: doc ? doc.id : `doc-${Date.now()}`,
      createdAt: doc ? doc.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <h2 className="text-lg font-bold text-neutral-900">
            {doc ? 'Edit Document' : 'Create New Document'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Document Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Authentication Setup"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">URL Slug</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="e.g. authentication-setup"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono bg-neutral-50 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Badge Text</label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                placeholder="e.g. Guide, API, Overview"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Badge Color</label>
              <select
                value={formData.badgeColor}
                onChange={(e) => setFormData(prev => ({ ...prev, badgeColor: e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="blue">Blue</option>
                <option value="emerald">Emerald</option>
                <option value="purple">Purple</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Short Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief summary of what this document covers..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Read Time / Author</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                  placeholder="3 min"
                  className="w-1/2 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Author"
                  className="w-1/2 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Content Editor & Preview Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <label className="text-xs font-semibold text-neutral-700 uppercase">Document Content (HTML / Markdown)</label>
              <div className="flex bg-neutral-100 p-1 rounded-lg space-x-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium transition ${
                    activeTab === 'edit' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium transition ${
                    activeTab === 'preview' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Preview</span>
                </button>
              </div>
            </div>

            {activeTab === 'edit' ? (
              <textarea
                rows={10}
                required
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="<h2>Section Title</h2><p>Paragraph content...</p>"
                className="w-full font-mono text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            ) : (
              <div className="min-h-[240px] p-4 border border-neutral-300 rounded-lg bg-neutral-50 overflow-y-auto prose">
                <div dangerouslySetInnerHTML={{ __html: formData.content }} />
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 rounded-lg text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Document</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
