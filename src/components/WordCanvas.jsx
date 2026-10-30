import React, { useState, useEffect, useRef } from 'react';
import { RibbonToolbar } from './RibbonToolbar';
import { Printer, Trash2, Download, Check, Edit3, Eye, User, Calendar, Folder, AlignLeft, AlignCenter, AlignRight, Maximize2, Trash, Sparkles } from 'lucide-react';

export function WordCanvas({ doc, onUpdateDoc, onDeleteDoc, categories }) {
  const [title, setTitle] = useState(doc?.title || '');
  const [category, setCategory] = useState(doc?.category || categories[0] || 'Getting Started');
  const [author, setAuthor] = useState(doc?.author || 'User');
  const [mode, setMode] = useState('edit'); // 'edit' or 'preview'
  const editorRef = useRef(null);
  const [savedStatus, setSavedStatus] = useState('Saved');
  const [wordCount, setWordCount] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    if (doc) {
      setTitle(doc.title || '');
      setCategory(doc.category || categories[0] || 'Getting Started');
      setAuthor(doc.author || 'User');
      if (editorRef.current && editorRef.current.innerHTML !== doc.content) {
        editorRef.current.innerHTML = doc.content || '';
      }
      calculateWordCount(doc.content || '');
      setSelectedImg(null);
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

  // Microsoft Word-style Image Insertion & Handling
  const handleInsertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target.result;
          const imgHtml = `<img src="${base64}" alt="${file.name}" class="doc-image max-w-full rounded-lg shadow-md my-4 cursor-pointer inline-block" style="max-height: 500px; width: 100%; object-fit: contain;" />`;
          if (editorRef.current) {
            editorRef.current.focus();
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              range.deleteContents();
              const div = document.createElement('div');
              div.innerHTML = imgHtml;
              const frag = document.createDocumentFragment();
              let node;
              while ((node = div.firstChild)) {
                frag.appendChild(node);
              }
              range.insertNode(frag);
              range.collapse(false);
            } else {
              editorRef.current.innerHTML += imgHtml;
            }
            handleContentInput();
          }
        };
        reader.readAsDataURL(file);
      });
    };
    input.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target.result;
            const imgHtml = `<img src="${base64}" alt="${file.name}" class="doc-image max-w-full rounded-lg shadow-md my-4 cursor-pointer inline-block" style="max-height: 500px; width: 100%; object-fit: contain;" />`;
            if (editorRef.current) {
              editorRef.current.focus();
              document.execCommand('insertHTML', false, imgHtml);
              handleContentInput();
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target.result;
            const imgHtml = `<img src="${base64}" alt="Pasted Image" class="doc-image max-w-full rounded-lg shadow-md my-4 cursor-pointer inline-block" style="max-height: 500px; width: 100%; object-fit: contain;" />`;
            if (editorRef.current) {
              editorRef.current.focus();
              document.execCommand('insertHTML', false, imgHtml);
              handleContentInput();
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleEditorClick = (e) => {
    if (e.target && e.target.tagName === 'IMG') {
      setSelectedImg(e.target);
    } else if (!e.target.closest('.image-format-toolbar')) {
      setSelectedImg(null);
    }
  };

  // Image Formatting Actions (Word Style)
  const setImageStyle = (styleProp, value) => {
    if (!selectedImg) return;
    selectedImg.style[styleProp] = value;
    handleContentInput();
  };

  const setImageAlignment = (align) => {
    if (!selectedImg) return;
    if (align === 'left') {
      selectedImg.style.display = 'block';
      selectedImg.style.marginLeft = '0';
      selectedImg.style.marginRight = 'auto';
    } else if (align === 'center') {
      selectedImg.style.display = 'block';
      selectedImg.style.marginLeft = 'auto';
      selectedImg.style.marginRight = 'auto';
    } else if (align === 'right') {
      selectedImg.style.display = 'block';
      selectedImg.style.marginLeft = 'auto';
      selectedImg.style.marginRight = '0';
    }
    handleContentInput();
  };

  const setImageSize = (widthPercent) => {
    if (!selectedImg) return;
    selectedImg.style.width = widthPercent;
    handleContentInput();
  };

  const handleDeleteSelectedImage = () => {
    if (!selectedImg) return;
    selectedImg.remove();
    setSelectedImg(null);
    handleContentInput();
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
  img { max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; }
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
    <div className="flex-1 flex flex-col h-full bg-neutral-100 overflow-hidden relative">
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
      {mode === 'edit' && <RibbonToolbar onInsertImage={handleInsertImage} />}

      {/* Microsoft Word Style Floating Picture Format Toolbar */}
      {mode === 'edit' && selectedImg && (
        <div className="image-format-toolbar bg-neutral-900 text-white px-4 py-2 rounded-xl shadow-2xl flex flex-wrap items-center gap-3 absolute top-28 left-1/2 transform -translate-x-1/2 z-40 border border-neutral-700 animate-fade-in text-xs">
          <div className="flex items-center space-x-1.5 text-blue-400 font-semibold border-r border-neutral-700 pr-3">
            <Sparkles className="w-4 h-4" />
            <span>Picture Tools</span>
          </div>

          {/* Alignment */}
          <div className="flex items-center space-x-1 border-r border-neutral-700 pr-3">
            <span className="text-neutral-400 text-[10px] uppercase">Align:</span>
            <button onClick={() => setImageAlignment('left')} className="p-1 hover:bg-neutral-800 rounded text-neutral-200" title="Align Left">
              <AlignLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setImageAlignment('center')} className="p-1 hover:bg-neutral-800 rounded text-neutral-200" title="Align Center">
              <AlignCenter className="w-4 h-4" />
            </button>
            <button onClick={() => setImageAlignment('right')} className="p-1 hover:bg-neutral-800 rounded text-neutral-200" title="Align Right">
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          {/* Size */}
          <div className="flex items-center space-x-1 border-r border-neutral-700 pr-3">
            <span className="text-neutral-400 text-[10px] uppercase">Size:</span>
            <button onClick={() => setImageSize('25%')} className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 rounded font-medium">25%</button>
            <button onClick={() => setImageSize('50%')} className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 rounded font-medium">50%</button>
            <button onClick={() => setImageSize('75%')} className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 rounded font-medium">75%</button>
            <button onClick={() => setImageSize('100%')} className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 rounded font-medium">100%</button>
          </div>

          {/* Effects */}
          <div className="flex items-center space-x-1 border-r border-neutral-700 pr-3">
            <span className="text-neutral-400 text-[10px] uppercase">Style:</span>
            <button onClick={() => setImageStyle('borderRadius', '0px')} className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 rounded">Square</button>
            <button onClick={() => setImageStyle('borderRadius', '12px')} className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 rounded">Rounded</button>
            <button onClick={() => setImageStyle('boxShadow', '0 10px 25px -5px rgba(0,0,0,0.3)')} className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 rounded">Shadow</button>
          </div>

          {/* Delete */}
          <button
            onClick={handleDeleteSelectedImage}
            className="flex items-center space-x-1 px-2.5 py-1 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition font-medium"
            title="Delete Picture"
          >
            <Trash className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>
      )}

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
              onClick={handleEditorClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onPaste={handlePaste}
              className="flex-1 outline-none prose max-w-none text-neutral-800 leading-relaxed font-sans text-base focus:ring-0"
              style={{ minHeight: '900px' }}
              placeholder="Start typing your document here... Drag, paste or insert pictures like Microsoft Word!"
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
