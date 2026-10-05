import React, { useState } from 'react';
import { X, RotateCcw, Save } from 'lucide-react';

export function SettingsModal({ isOpen, onClose, currentTitle, onUpdateTitle, onReset }) {
  const [title, setTitle] = useState(currentTitle);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onUpdateTitle(title.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <h2 className="text-lg font-bold text-neutral-900">Workspace Settings</h2>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Site Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-neutral-700">Reset to Defaults</p>
              <p className="text-[11px] text-neutral-500">Restore starter template articles</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all documentation to default?')) {
                  onReset();
                  onClose();
                }
              }}
              className="flex items-center space-x-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>

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
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
