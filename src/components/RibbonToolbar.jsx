import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Undo2,
  Redo2,
  Minus,
  Quote,
  Table,
  Palette,
  Highlighter
} from 'lucide-react';

export function RibbonToolbar({ onFormat }) {
  const format = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="bg-white border-b border-neutral-200 px-4 py-2 flex flex-wrap items-center gap-2 select-none shadow-xs sticky top-0 z-30">
      {/* Undo / Redo */}
      <div className="flex items-center space-x-0.5 border-r border-neutral-200 pr-2">
        <button
          type="button"
          onClick={() => format('undo')}
          title="Undo (Ctrl+Z)"
          className="p-1.5 hover:bg-neutral-100 rounded text-neutral-700 transition"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => format('redo')}
          title="Redo (Ctrl+Y)"
          className="p-1.5 hover:bg-neutral-100 rounded text-neutral-700 transition"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      {/* Headings & Styles */}
      <div className="flex items-center space-x-1 border-r border-neutral-200 pr-2">
        <button
          type="button"
          onClick={() => format('formatBlock', '<h1>')}
          title="Heading 1"
          className="px-2 py-1 hover:bg-neutral-100 rounded text-xs font-bold text-neutral-700 flex items-center space-x-1 transition"
        >
          <Heading1 className="w-4 h-4" />
          <span>H1</span>
        </button>
        <button
          type="button"
          onClick={() => format('formatBlock', '<h2>')}
          title="Heading 2"
          className="px-2 py-1 hover:bg-neutral-100 rounded text-xs font-bold text-neutral-700 flex items-center space-x-1 transition"
        >
          <Heading2 className="w-4 h-4" />
          <span>H2</span>
        </button>
        <button
          type="button"
          onClick={() => format('formatBlock', '<h3>')}
          title="Heading 3"
          className="px-2 py-1 hover:bg-neutral-100 rounded text-xs font-bold text-neutral-700 flex items-center space-x-1 transition"
        >
          <Heading3 className="w-4 h-4" />
          <span>H3</span>
        </button>
        <button
          type="button"
          onClick={() => format('formatBlock', '<p>')}
          title="Normal Paragraph"
          className="px-2 py-1 hover:bg-neutral-100 rounded text-xs font-medium text-neutral-700 flex items-center space-x-1 transition"
        >
          <Type className="w-4 h-4" />
          <span>Normal</span>
        </button>
      </div>

      {/* Font Styling: Bold, Italic, Underline, Strikethrough */}
      <div className="flex items-center space-x-0.5 border-r border-neutral-200 pr-2">
        <button
          type="button"
          onClick={() => format('bold')}
          title="Bold (Ctrl+B)"
          className="p-1.5 hover:bg-neutral-100 rounded text-neutral-700 transition font-bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => format('italic')}
          title="Italic (Ctrl+I)"
          className="p-1.5 hover:bg-neutral-100 rounded text-neutral-700 transition italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => format('underline')}
          title="Underline (Ctrl+U)"
          className="p-1.5 hover:bg-neutral-100 rounded text-neutral-700 transition underline"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => format('strikeThrough')}
          title="Strikethrough"
          className="p-1.5 hover:bg-neutral-100 rounded text-neutral-700 transition"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
      </div>

      {/* Colors */}
      <div className="flex items-center space-x-1 border-r border-neutral-200 pr-2">
        <div className="flex items-center space-x-1" title="Text Color">
          <Palette className="w-4 h-4 text-neutral-500" />
          <input
            type="color"
            onChange={(e) => format('foreColor', e.target.value)}
            className="w-6 h-6 border-0 rounded cursor-pointer bg-transparent"
            title="Choose text color"
          />
        </div>
        <div className="flex items-center space-x-1" title="Highlight Color">
          <Highlighter className="w-4 h-4 text-neutral-500" />
          <input
            type="color"
            defaultValue="#ffff00"
            onChange={(e) => format('hiliteColor', e.target.value)}
            className="w-6 h-6 border-0 rounded cursor-pointer bg-transparent"
            title="Choose highlight color"
          />
        </div>
      </div>

      {/* Alignment */}
      <div className="flex items-center space-x-0.5 border-r border-neutral-200 pr-2">
        <button
          type="button"
          onClick={() => format('justifyLeft')}
          title="Align Left"
          className="p-1.5 hover:bg-neutral-100 rounded text-neutral-700 transition"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => format('justifyCenter')}
          title="Align Center"
          className="p-1.5 hover:bg-neutral-100 rounded text-neutral-700 transition"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => format('justifyRight')}
          title="Align Right"
          className="p-1.5 hover:bg-neutral-100 rounded text-neutral-700 transition"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => format('justifyFull')}
          title="Justify"
          className="p-1.5 hover:bg-neutral-100 rounded text-neutral-700 transition"
        >
          <AlignJustify className="w-4 h-4" />
        </button>
      </div>

      {/* Lists */}
      <div className="flex items-center space-x-0.5 border-r border-neutral-200 pr-2">
        <button
          type="button"
          onClick={() => format('insertUnorderedList')}
          title="Bullet List"
          className="p-1.5 hover:bg-neutral-100 rounded text-neutral-700 transition"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => format('insertOrderedList')}
          title="Numbered List"
          className="p-1.5 hover:bg-neutral-100 rounded text-neutral-700 transition"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      {/* Insert Elements */}
      <div className="flex items-center space-x-1">
        <button
          type="button"
          onClick={() => format('insertHorizontalRule')}
          title="Horizontal Line"
          className="p-1.5 hover:bg-neutral-100 rounded text-neutral-700 transition"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => format('formatBlock', '<blockquote>')}
          title="Quote / Callout Box"
          className="p-1.5 hover:bg-neutral-100 rounded text-neutral-700 transition"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            const tableHtml = '<table class="border-collapse border border-neutral-300 w-full my-4"><tr><th class="border border-neutral-300 p-2 bg-neutral-100">Header 1</th><th class="border border-neutral-300 p-2 bg-neutral-100">Header 2</th></tr><tr><td class="border border-neutral-300 p-2">Cell 1</td><td class="border border-neutral-300 p-2">Cell 2</td></tr></table><p><br></p>';
            format('insertHTML', tableHtml);
          }}
          title="Insert Table"
          className="p-1.5 hover:bg-neutral-100 rounded text-neutral-700 transition flex items-center space-x-1"
        >
          <Table className="w-4 h-4" />
          <span className="text-xs font-medium">Table</span>
        </button>
      </div>
    </div>
  );
}
