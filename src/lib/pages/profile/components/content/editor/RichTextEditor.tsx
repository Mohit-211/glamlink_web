/**
 * RichTextEditor Component
 *
 * Basic rich text editor with formatting toolbar
 */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

type FormatCommand =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikeThrough'
  | 'insertUnorderedList'
  | 'insertOrderedList'
  | 'createLink'
  | 'formatBlock'
  | 'removeFormat';

interface ToolbarButton {
  command: FormatCommand;
  icon: string;
  label: string;
  value?: string;
}

const TOOLBAR_BUTTONS: ToolbarButton[] = [
  {
    command: 'bold',
    icon: 'M13.5 4.5a2 2 0 012 2v2a2 2 0 01-2 2H7V4.5h6.5zm0 6a2.5 2.5 0 012.5 2.5v3a2.5 2.5 0 01-2.5 2.5H7V10.5h6.5z',
    label: 'Bold',
  },
  {
    command: 'italic',
    icon: 'M10 4.5h4m-2 15h4M13 4.5l-3 15',
    label: 'Italic',
  },
  {
    command: 'underline',
    icon: 'M6 4.5v8a6 6 0 0012 0v-8M5 19.5h14',
    label: 'Underline',
  },
  {
    command: 'strikeThrough',
    icon: 'M6 12h12M8.5 6c-.5-1-1.5-1.5-3-1.5S3 5.5 3 7s1 2.5 2.5 2.5h5c1.5 0 2.5 1 2.5 2.5s-1.5 2.5-3 2.5-2.5-.5-3-1.5',
    label: 'Strikethrough',
  },
];

const LIST_BUTTONS: ToolbarButton[] = [
  {
    command: 'insertUnorderedList',
    icon: 'M4 6h16M4 12h16M4 18h16M8 6h.01M8 12h.01M8 18h.01',
    label: 'Bullet list',
  },
  {
    command: 'insertOrderedList',
    icon: 'M4 6h16M4 12h16M4 18h16',
    label: 'Numbered list',
  },
];

const HEADING_OPTIONS = [
  { label: 'Paragraph', value: 'p' },
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
  { label: 'Quote', value: 'blockquote' },
];

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
  minHeight = 300,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const savedSelection = useRef<Range | null>(null);

  // Initialize content
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Track active formats
  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('strikeThrough')) formats.add('strikeThrough');
    if (document.queryCommandState('insertUnorderedList')) formats.add('insertUnorderedList');
    if (document.queryCommandState('insertOrderedList')) formats.add('insertOrderedList');
    setActiveFormats(formats);
  }, []);

  // Handle content changes
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    updateActiveFormats();
  }, [onChange, updateActiveFormats]);

  // Execute formatting command
  const execCommand = useCallback((command: FormatCommand, value?: string) => {
    document.execCommand(command, false, value);
    handleInput();
    editorRef.current?.focus();
  }, [handleInput]);

  // Handle format button click
  const handleFormatClick = useCallback((button: ToolbarButton) => {
    execCommand(button.command, button.value);
  }, [execCommand]);

  // Handle heading change
  const handleHeadingChange = useCallback((tag: string) => {
    execCommand('formatBlock', `<${tag}>`);
  }, [execCommand]);

  // Save selection for link insertion
  const saveSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelection.current = selection.getRangeAt(0).cloneRange();
      setLinkText(selection.toString());
    }
  }, []);

  // Restore selection
  const restoreSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && savedSelection.current) {
      selection.removeAllRanges();
      selection.addRange(savedSelection.current);
    }
  }, []);

  // Open link modal
  const handleLinkClick = useCallback(() => {
    saveSelection();
    setShowLinkModal(true);
  }, [saveSelection]);

  // Insert link
  const handleInsertLink = useCallback(() => {
    if (!linkUrl) return;

    restoreSelection();

    if (linkText) {
      execCommand('createLink', linkUrl);
    } else {
      const link = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkUrl}</a>`;
      document.execCommand('insertHTML', false, link);
      handleInput();
    }

    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
    editorRef.current?.focus();
  }, [linkUrl, linkText, restoreSelection, execCommand, handleInput]);

  // Handle key events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Keyboard shortcuts
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'k':
          e.preventDefault();
          handleLinkClick();
          break;
      }
    }
    updateActiveFormats();
  }, [execCommand, handleLinkClick, updateActiveFormats]);

  // Clear formatting
  const handleClearFormatting = useCallback(() => {
    execCommand('removeFormat');
  }, [execCommand]);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center flex-wrap gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200">
        {/* Heading selector */}
        <select
          onChange={(e) => handleHeadingChange(e.target.value)}
          className="px-2 py-1 text-sm border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          {HEADING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Format buttons */}
        {TOOLBAR_BUTTONS.map((button) => (
          <button
            key={button.command}
            type="button"
            onClick={() => handleFormatClick(button)}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormats.has(button.command) ? 'bg-gray-200 text-pink-600' : 'text-gray-600'
            }`}
            title={button.label}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={button.icon} />
            </svg>
          </button>
        ))}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* List buttons */}
        {LIST_BUTTONS.map((button) => (
          <button
            key={button.command}
            type="button"
            onClick={() => handleFormatClick(button)}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormats.has(button.command) ? 'bg-gray-200 text-pink-600' : 'text-gray-600'
            }`}
            title={button.label}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={button.icon} />
            </svg>
          </button>
        ))}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Link button */}
        <button
          type="button"
          onClick={handleLinkClick}
          className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
          title="Insert link"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </button>

        {/* Clear formatting */}
        <button
          type="button"
          onClick={handleClearFormatting}
          className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
          title="Clear formatting"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onSelect={updateActiveFormats}
        onClick={updateActiveFormats}
        className="p-4 focus:outline-none prose prose-sm max-w-none"
        style={{ minHeight }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Insert link</h2>
              <button
                onClick={() => setShowLinkModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  autoFocus
                />
              </div>

              {linkText && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Text to display
                  </label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Link text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertLink}
                disabled={!linkUrl}
                className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
              >
                Insert link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder styles */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block;
        }
      `}</style>
    </div>
  );
}

export default RichTextEditor;
