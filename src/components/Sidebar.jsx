import React, { useState } from 'react';
import { Search, ChevronRight, FileText, Folder, Plus } from 'lucide-react';

export function Sidebar({
  categories,
  documents,
  activeDocId,
  onSelectDoc,
  onNewDocInCategory,
  isOpen,
  onCloseMobile
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/20 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-white border-r border-neutral-200 flex flex-col shrink-0
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Search Bar */}
        <div className="p-4 border-b border-neutral-200">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-neutral-100 hover:bg-neutral-150 focus:bg-white border border-transparent focus:border-blue-500 rounded-lg text-sm outline-none transition"
            />
          </div>
        </div>

        {/* Categories & Documents List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {categories.map((category) => {
            const catDocs = filteredDocs.filter(d => d.category === category);
            if (searchQuery && catDocs.length === 0) return null;

            return (
              <div key={category} className="space-y-1">
                <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  <span className="flex items-center space-x-1.5">
                    <Folder className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{category}</span>
                  </span>
                  <button
                    onClick={() => onNewDocInCategory(category)}
                    className="p-0.5 hover:bg-neutral-100 rounded text-neutral-500 hover:text-neutral-900 transition"
                    title={`Add document to ${category}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-0.5 mt-1">
                  {catDocs.map((doc) => {
                    const isActive = doc.id === activeDocId;
                    return (
                      <button
                        key={doc.id}
                        onClick={() => {
                          onSelectDoc(doc.id);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className={`
                          w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition
                          ${isActive
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          <FileText className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-neutral-400'}`} />
                          <span className="truncate">{doc.title}</span>
                        </div>
                        {doc.badge && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 font-medium ${
                            doc.badgeColor === 'emerald' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            doc.badgeColor === 'purple' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                            'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {doc.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                  {catDocs.length === 0 && !searchQuery && (
                    <div className="px-3 py-2 text-xs text-neutral-400 italic">
                      No documents in this category
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50/50 text-xs text-neutral-500 flex items-center justify-between">
          <span>DocEditor Studio</span>
          <span className="font-mono">v2.0</span>
        </div>
      </aside>
    </>
  );
}
