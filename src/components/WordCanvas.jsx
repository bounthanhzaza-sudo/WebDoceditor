import React, { useState, useEffect, useRef } from 'react';
import { RibbonToolbar } from './RibbonToolbar';
import { Printer, Trash2, Download, Check, Edit3, Eye, User, Calendar, Folder } from 'lucide-react';

export function WordCanvas({ doc, onUpdateDoc, onDeleteDoc, categories }) {
  const [title, setTitle] = useState(doc?.title || '');
  const [category, setCategory] = useState(doc?.category || categories[0] || 'Getting Started');
  const [author, setAuthor] = useState(doc?.author || 'User');
  const [mode, setMode] = useState('edit'); // 'edit' or 'preview'
  const editorRef = useRef(null);
  const [savedStatus, setSavedStatus] = useState('Saved');
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (doc) {
      setTitle(doc.title || '');
      setCategory(doc.category || categories[0] || 'Getting Started');
      setAuthor(doc.author || 'User');
      if (editorRef.current && editorRef.current.innerHTML !== doc.content) {
        editorRef.current.innerHTML = doc.content || '';
      }
      calculateWordCount(doc.content || '');
    }
  }, [doc?.id]);

  const calculateWordCount = (htmlText) => {
    const text = htmlText ? htmlText.replace(/<[^>]*>/g, ' ').trim() : '';
    const words = text ? text.split(/\s+/).length : 0;
    setWordCount(words);
  };

  const handleContentInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    calculateWordCount(html);
    setSavedStatus('Unsaved...');

    const updatedDoc = {
      ...doc,
      title: title || 'Untitled Document',
      category,
      author,
      content: html,
      updatedAt: new Date().toISOString()
    };
    onUpdateDoc(updatedDoc);
    setTimeout(() => setSavedStatus('Saved'), 600);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    const updatedDoc = {
      ...doc,
      title: newTitle || 'Untitled Document',
      category,
      author,
      content: editorRef.current?.innerHTML || '',
      updatedAt: new Date().toISOString()
    };
    onUpdateDoc(updatedDoc);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
  body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; color: #333; }
  h1, h2, h3 { color: #111; }
  table { border-collapse: collapse; width: 100%; margin: 20px 0; }
  th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; }
  th { background-color: #f4f4f4; }
  blockquote { border-left: 4px solid #3b82f6; margin: 20px 0; padding-left: 16px; color: #555; }
</style>
</head>
<body>
  <h1>${title}</h1>
  <p><em>Author: ${author} | Category: ${category}</em></p>
  <hr/>
  ${editorRef.current?.innerHTML || ''}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(title || 'document').toLowerCase().replace(/[^a-z0-9]/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!doc) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-neutral-100 text-neutral-400 p-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <Edit3 className="w-8 h-8" />
          </div>
          <p className="text-xl font-bold text-neutral-800">No Document Selected</p>
          <p className="text-sm text-neutral-500 max-w-md">
            Choose a document from the sidebar or click <strong className="text-neutral-700">+ New Document</strong> to start writing for free!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-100 overflow-hidden">
      {/* Top Document Toolbar / Action Bar */}
      <div className="bg-white border-b border-neutral-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          {mode === 'edit' ? (
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Document Title..."
              className="text-lg font-bold text-neutral-900 bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 transition w-64 md:w-80"
            />
          ) : (
            <h1 className="text-lg font-bold text-neutral-900 px-1 py-0.5">{title || 'Untitled Document'}</h1>
          )}

          {mode === 'edit' && (
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                onUpdateDoc({ ...doc, category: e.target.value, updatedAt: new Date().toISOString() });
              }}
              className="text-xs bg-neutral-100 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-neutral-700 font-medium outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>

        {/* Mode Switcher & Actions */}
        <div className="flex items-center space-x-3">
          {/* Edit / Preview Tabs */}
          <div className="bg-neutral-100 p-1 rounded-lg flex items-center space-x-1 border border-neutral-200">
            <button
              onClick={() => setMode('edit')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                mode === 'edit'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                mode === 'preview'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Reader Preview</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 border-l border-neutral-200 pl-3">
            {mode === 'edit' && (
              <span className="text-xs text-emerald-600 font-medium flex items-center space-x-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                <span>{savedStatus}</span>
              </span>
            )}
            <button
              onClick={handleDownloadHtml}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold transition"
              title="Download as HTML"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold transition"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
            {mode === 'edit' && (
              <button
                onClick={() => onDeleteDoc(doc.id)}
                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                title="Delete Document"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Microsoft Word Style Ribbon Toolbar (Only shown in Edit Mode) */}
      {mode === 'edit' && <RibbonToolbar />}

      {/* A4 Paper Canvas Container */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-12 flex justify-center bg-neutral-200/70">
        <div className="w-full max-w-[850px] min-h-[1100px] bg-white shadow-xl rounded-sm p-12 lg:p-16 border border-neutral-300 flex flex-col focus:outline-none">
          {mode === 'preview' ? (
            /* Reader Preview Mode */
            <div className="space-y-6">
              <div className="border-b border-neutral-200 pb-6 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-medium text-neutral-500">
                  <span className="flex items-center space-x-1 bg-neutral-100 px-2.5 py-1 rounded-md">
                    <Folder className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{category}</span>
                  </span>
                  {doc.badge && (
                    <span className="px-2.5 py-1 rounded-md font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {doc.badge}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight">
                  {title}
                </h1>

                <div className="flex items-center space-x-6 pt-2 text-xs text-neutral-500">
                  <div className="flex items-center space-x-1.5">
                    <User className="w-4 h-4 text-neutral-400" />
                    <span>{author}</span>
                  </div>
                  {doc.updatedAt && (
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-4 h-4 text-neutral-400" />
                      <span>Updated {new Date(doc.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="prose max-w-none text-neutral-800 leading-relaxed font-sans text-base"
                dangerouslySetInnerHTML={{ __html: doc.content }}
              />
            </div>
          ) : (
            /* Editor Mode */
            <div
              ref={editorRef}
              contentEditable
              onInput={handleContentInput}
              className="flex-1 outline-none prose max-w-none text-neutral-800 leading-relaxed font-sans text-base focus:ring-0"
              style={{ minHeight: '900px' }}
              placeholder="Start typing your document here..."
            />
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white border-t border-neutral-200 px-6 py-1.5 flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center space-x-4">
          <span>Words: <strong>{wordCount}</strong></span>
          <span>Mode: <strong className="text-blue-600 capitalize">{mode === 'edit' ? 'Editing' : 'Reader Preview'}</strong></span>
        </div>
        <div>
          <span>Author: </span>
          {mode === 'edit' ? (
            <input
              type="text"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                onUpdateDoc({ ...doc, author: e.target.value });
              }}
              className="bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-blue-500 outline-none px-1 text-neutral-700"
            />
          ) : (
            <span className="font-medium text-neutral-700">{author}</span>
          )}
        </div>
      </div>
    </div>
  );
}
