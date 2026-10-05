import React from 'react';
import { FileText, Plus, FolderCog, Settings, Download, Upload, Menu } from 'lucide-react';

export function Header({
  siteTitle,
  onNewDoc,
  onManageCategories,
  onOpenSettings,
  onExport,
  onImport,
  onToggleMobileSidebar
}) {
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        onImport(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="h-16 border-b border-neutral-200 bg-white px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg text-neutral-900 tracking-tight">{siteTitle}</span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-600 rounded-full border border-blue-200">
              v2.0
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onNewDoc}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow-sm hover:shadow"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Document</span>
        </button>

        <button
          onClick={onManageCategories}
          className="hidden md:flex items-center space-x-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-sm font-medium transition"
          title="Manage Categories"
        >
          <FolderCog className="w-4 h-4" />
          <span>Categories</span>
        </button>

        <button
          onClick={onExport}
          className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition"
          title="Export JSON backup"
        >
          <Download className="w-5 h-5" />
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition"
          title="Import JSON backup"
        >
          <Upload className="w-5 h-5" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />

        <button
          onClick={onOpenSettings}
          className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
