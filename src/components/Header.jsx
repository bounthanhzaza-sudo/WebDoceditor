import React from 'react';
import { FileText, Plus, FolderCog, Settings, Download, Upload, Menu } from 'lucide-react';

export function Header({
  siteTitle,
  onNewDoc,
  onManageCategories,
  onOpenSettings,
  onExport,
  onImport,
  onImportSingleFile,
  onToggleMobileSidebar,
  currentUser,
  onOpenLogin,
  onLogout
}) {
  const fileInputRef = React.useRef(null);

  const escapeHtml = (str) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const fileType = file.type;
    const fileExt = fileName.split('.').pop()?.toLowerCase();

    // Helper to import as single document
    const importAsDoc = (docData) => {
      if (onImportSingleFile) {
        onImportSingleFile(docData);
      }
    };

    // If it's JSON, check if it's a workspace backup
    if (fileExt === 'json' || fileType === 'application/json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === 'string') {
          try {
            const parsed = JSON.parse(content);
            if (parsed && Array.isArray(parsed.documents) && Array.isArray(parsed.categories)) {
              onImport(content);
              e.target.value = '';
              return;
            }
          } catch {
            // Not workspace JSON, treat as JSON code/data file
          }
          importAsDoc({
            title: fileName.replace(/\.[^/.]+$/, ''),
            badge: 'JSON',
            badgeColor: 'purple',
            description: `Imported JSON file: ${fileName}`,
            content: `<h2>JSON File: ${fileName}</h2><pre><code>${escapeHtml(content)}</code></pre>`
          });
        }
      };
      reader.readAsText(file);
    } else if (fileType.startsWith('image/')) {
      // Image files
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        importAsDoc({
          title: fileName.replace(/\.[^/.]+$/, ''),
          badge: 'Image',
          badgeColor: 'purple',
          description: `Imported image: ${fileName} (${(file.size / 1024).toFixed(2)} KB)`,
          content: `<h2>Image: ${fileName}</h2><p>Uploaded on ${new Date().toLocaleString()}</p><div style="margin: 20px 0; text-align: center;"><img src="${dataUrl}" alt="${fileName}" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" /></div>`
        });
      };
      reader.readAsDataURL(file);
    } else if (['txt', 'md', 'html', 'js', 'jsx', 'ts', 'tsx', 'py', 'css', 'csv', 'xml', 'yml', 'yaml'].includes(fileExt || '')) {
      // Text, Markdown, HTML, Code files
      const reader = new FileReader();
      reader.onload = (event) => {
        const textContent = event.target?.result || '';
        let formatted = '';
        if (fileExt === 'md') {
          formatted = `<h2>${fileName}</h2><p><em>Markdown File</em></p><pre><code>${escapeHtml(textContent)}</code></pre>`;
        } else if (fileExt === 'html') {
          formatted = textContent;
        } else if (['js', 'jsx', 'ts', 'tsx', 'py', 'css', 'csv', 'xml', 'yml', 'yaml'].includes(fileExt || '')) {
          formatted = `<h2>Code File: ${fileName}</h2><p>Language: <strong>${fileExt.toUpperCase()}</strong></p><pre><code>${escapeHtml(textContent)}</code></pre>`;
        } else {
          formatted = `<h2>${fileName}</h2><pre style="white-space: pre-wrap;">${escapeHtml(textContent)}</pre>`;
        }

        importAsDoc({
          title: fileName.replace(/\.[^/.]+$/, ''),
          badge: fileExt?.toUpperCase() || 'Text',
          badgeColor: 'blue',
          description: `Imported text/code file: ${fileName}`,
          content: formatted
        });
      };
      reader.readAsText(file);
    } else {
      // Any other binary/PDF/office/document file
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        importAsDoc({
          title: fileName.replace(/\.[^/.]+$/, ''),
          badge: 'File',
          badgeColor: 'emerald',
          description: `Imported file: ${fileName} (${(file.size / 1024).toFixed(2)} KB)`,
          content: `<h2>File Attachment: ${fileName}</h2><p>Type: ${fileType || 'Unknown'} | Size: ${(file.size / 1024).toFixed(2)} KB</p><p>Successfully imported into DocEditor.</p><div style="margin-top: 16px;"><a href="${dataUrl}" download="${fileName}" style="display: inline-block; padding: 10px 20px; background: #2563eb; color: #fff; border-radius: 8px; text-decoration: none; font-weight: bold;">Download File (${fileName})</a></div>`
        });
      };
      reader.readAsDataURL(file);
    }

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
          className="hidden"
        />

        <button
          onClick={onOpenSettings}
          className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {currentUser ? (
          <div className="flex items-center space-x-2 pl-2 border-l border-neutral-200">
            <div className="hidden md:block text-right">
              <div className="text-xs font-bold text-neutral-900">{currentUser.name}</div>
              <div className="text-[10px] text-neutral-500">{currentUser.email}</div>
            </div>
            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold transition"
              title="Logout"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="ml-2 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-sm font-medium transition shadow-sm"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
