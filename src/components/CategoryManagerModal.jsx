import React, { useState } from 'react';
import { X, Plus, Trash2, Folder } from 'lucide-react';

export function CategoryManagerModal({ isOpen, onClose, categories, onAddCategory, onDeleteCategory }) {
  const [newCatName, setNewCatName] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (newCatName.trim()) {
      onAddCategory(newCatName.trim());
      setNewCatName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <h2 className="text-lg font-bold text-neutral-900">Manage Categories</h2>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <form onSubmit={handleAdd} className="flex space-x-2">
            <input
              type="text"
              required
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="New category name..."
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit"
              className="flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Existing Categories</h3>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <div key={cat} className="flex items-center justify-between px-3 py-2 bg-neutral-50 rounded-lg border border-neutral-200 text-sm">
                  <span className="flex items-center space-x-2 font-medium text-neutral-800">
                    <Folder className="w-4 h-4 text-neutral-400" />
                    <span>{cat}</span>
                  </span>
                  {categories.length > 1 && (
                    <button
                      onClick={() => onDeleteCategory(cat)}
                      className="p-1 text-neutral-400 hover:text-red-600 rounded transition"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-lg text-sm font-medium transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
