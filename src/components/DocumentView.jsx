import React from 'react';
import { Edit3, Trash2, Clock, User, Calendar, Folder } from 'lucide-react';

export function DocumentView({ doc, onEdit, onDelete }) {
  if (!doc) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-white text-neutral-400">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-neutral-600">No document selected</p>
          <p className="text-sm">Select a document from the sidebar or create a new one to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-white p-6 lg:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Document Header */}
        <div className="space-y-4 border-b border-neutral-200 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs font-medium text-neutral-500">
              <span className="flex items-center space-x-1 bg-neutral-100 px-2.5 py-1 rounded-md">
                <Folder className="w-3.5 h-3.5 text-neutral-400" />
                <span>{doc.category}</span>
              </span>
              {doc.badge && (
                <span className={`px-2.5 py-1 rounded-md font-semibold ${
                  doc.badgeColor === 'emerald' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  doc.badgeColor === 'purple' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                  'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {doc.badge}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(doc)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-sm font-medium transition"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete(doc.id)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight">
            {doc.title}
          </h1>

          {doc.description && (
            <p className="text-lg text-neutral-600 leading-relaxed">
              {doc.description}
            </p>
          )}

          {/* Metadata bar */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-neutral-500">
            {doc.author && (
              <div className="flex items-center space-x-1.5">
                <User className="w-4 h-4 text-neutral-400" />
                <span>{doc.author}</span>
              </div>
            )}
            {doc.readTime && (
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span>{doc.readTime}</span>
              </div>
            )}
            {doc.updatedAt && (
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <span>Updated {new Date(doc.updatedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Document Body Content */}
        <div
          className="prose max-w-none text-neutral-800"
          dangerouslySetInnerHTML={{ __html: doc.content }}
        />
      </div>
    </main>
  );
}
