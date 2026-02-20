'use client';

import { RefObject } from 'react';
import { Editor } from '@tiptap/react';
import { Code } from 'lucide-react';

interface TiptapEditorToolbarProps {
  editor: Editor;
  showColorPicker: boolean;
  setShowColorPicker: (v: boolean) => void;
  currentColor: string;
  colorPickerRef: RefObject<HTMLDivElement | null>;
  setShowRawHtmlModal: (v: boolean) => void;
  fontSizes: Array<{ label: string; value: string }>;
  presetColors: string[];
  handleColorChange: (color: string) => void;
  handleFontSizeChange: (size: string) => void;
  getCurrentFontSize: () => string;
  handleClearFormatting: () => void;
  showHtmlButton?: boolean;
  // Character count props
  characterCount?: number;
  maxLength?: number;
  showCharCount?: boolean;
}

export default function TiptapEditorToolbar({
  editor,
  showColorPicker,
  setShowColorPicker,
  currentColor,
  colorPickerRef,
  setShowRawHtmlModal,
  fontSizes,
  presetColors,
  handleColorChange,
  handleFontSizeChange,
  getCurrentFontSize,
  handleClearFormatting,
  showHtmlButton = true,
  characterCount = 0,
  maxLength,
  showCharCount = false,
}: TiptapEditorToolbarProps) {
  const isOverLimit = maxLength !== undefined && characterCount > maxLength;

  return (
    <div className="bg-gray-50 border-b border-gray-300 px-3 py-2">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Font Size Dropdown */}
        <select
          onChange={(e) => {
            const size = e.target.value;
            if (size === 'default') {
              (editor.chain().focus() as any).unsetFontSize().run();
            } else {
              handleFontSizeChange(size);
            }
          }}
          value={getCurrentFontSize()}
          className="px-2 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-100"
          title="Font Size"
        >
          <option value="default">Default</option>
          {fontSizes.map(size => (
            <option key={size.value} value={size.value}>
              {size.label} ({size.value})
            </option>
          ))}
        </select>

        {/* Color Picker */}
        <div className="relative" ref={colorPickerRef}>
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="px-2 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-100 flex items-center gap-1"
            title="Text Color"
          >
            <span
              className="w-4 h-4 border border-gray-400 rounded"
              style={{ backgroundColor: currentColor }}
            />
            <span>A</span>
          </button>

          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 z-50">
              <div className="grid grid-cols-4 gap-1 mb-2">
                {presetColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorChange(color)}
                    className="w-7 h-7 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 pt-2 border-t">
                <label className="text-xs">Custom:</label>
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-16 h-7 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={currentColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-20 px-1 py-1 text-xs border border-gray-300 rounded"
                  placeholder="#000000"
                />
              </div>
            </div>
          )}
        </div>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-2 py-1 text-sm border border-gray-300 rounded transition-colors disabled:opacity-50 ${
            editor.isActive('bold')
              ? 'bg-gray-700 text-white hover:bg-gray-800'
              : 'bg-white hover:bg-gray-100'
          }`}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-2 py-1 text-sm border border-gray-300 rounded transition-colors disabled:opacity-50 ${
            editor.isActive('italic')
              ? 'bg-gray-700 text-white hover:bg-gray-800'
              : 'bg-white hover:bg-gray-100'
          }`}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`px-2 py-1 text-sm border border-gray-300 rounded transition-colors disabled:opacity-50 ${
            editor.isActive('strike')
              ? 'bg-gray-700 text-white hover:bg-gray-800'
              : 'bg-white hover:bg-gray-100'
          }`}
          title="Strikethrough"
        >
          <s>S</s>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`px-2 py-1 text-sm border border-gray-300 rounded transition-colors disabled:opacity-50 ${
            editor.isActive('code')
              ? 'bg-gray-700 text-white hover:bg-gray-800'
              : 'bg-white hover:bg-gray-100'
          }`}
          title="Code"
        >
          {'</>'}
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 text-sm border border-gray-300 rounded transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-gray-700 text-white hover:bg-gray-800'
              : 'bg-white hover:bg-gray-100'
          }`}
          title="Bullet List"
        >
          *
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 text-sm border border-gray-300 rounded transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-gray-700 text-white hover:bg-gray-800'
              : 'bg-white hover:bg-gray-100'
          }`}
          title="Numbered List"
        >
          1.
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 text-sm border border-gray-300 rounded transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-gray-700 text-white hover:bg-gray-800'
              : 'bg-white hover:bg-gray-100'
          }`}
          title="Quote"
        >
          "
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="px-2 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors disabled:opacity-50"
          title="Undo (Ctrl+Z)"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="px-2 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors disabled:opacity-50"
          title="Redo (Ctrl+Y)"
        >
          Redo
        </button>
        <button
          type="button"
          onClick={handleClearFormatting}
          className="px-2 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Clear Formatting"
        >
          Clear
        </button>

        {/* Raw HTML Editor Button */}
        {showHtmlButton && (
          <>
            <div className="w-px bg-gray-300 mx-1" />
            <button
              type="button"
              onClick={() => setShowRawHtmlModal(true)}
              className="px-2 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-blue-50 hover:border-blue-300 flex items-center gap-1 transition-colors"
              title="Edit Raw HTML"
            >
              <Code className="w-4 h-4 text-blue-600" />
              HTML
            </button>
          </>
        )}

        {/* Character Count */}
        {showCharCount && maxLength !== undefined && (
          <>
            <div className="flex-1" />
            <div className={`text-sm ${isOverLimit ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              {characterCount} / {maxLength}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
