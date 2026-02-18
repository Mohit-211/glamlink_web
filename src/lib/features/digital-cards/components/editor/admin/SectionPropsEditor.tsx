'use client';

/**
 * SectionPropsEditor - JSON editor for section properties
 *
 * Allows editing section-specific props like mapHeight, iconSize, etc.
 * Provides JSON validation and error feedback.
 */

import React, { useState, useEffect } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface SectionPropsEditorProps {
  /** Current props object */
  props: Record<string, any>;
  /** Callback when props change */
  onChange: (props: Record<string, any>) => void;
  /** Whether the editor is disabled */
  disabled?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SectionPropsEditor({
  props,
  onChange,
  disabled = false,
}: SectionPropsEditorProps) {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize JSON text from props
  useEffect(() => {
    if (!isEditing) {
      setJsonText(JSON.stringify(props, null, 2));
    }
  }, [props, isEditing]);

  // Handle text change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setJsonText(newText);
    setIsEditing(true);

    // Try to parse JSON
    if (!newText.trim()) {
      setError(null);
      onChange({});
      return;
    }

    try {
      const parsed = JSON.parse(newText);
      if (typeof parsed !== 'object' || Array.isArray(parsed)) {
        setError('Props must be an object (not an array)');
        return;
      }
      setError(null);
      onChange(parsed);
    } catch (err) {
      setError('Invalid JSON syntax');
    }
  };

  // Handle blur - stop editing mode
  const handleBlur = () => {
    setIsEditing(false);
    // Reformat on blur if valid
    if (!error && jsonText.trim()) {
      try {
        const parsed = JSON.parse(jsonText);
        setJsonText(JSON.stringify(parsed, null, 2));
      } catch {
        // Keep current text if invalid
      }
    }
  };

  // Format JSON button
  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err) {
      setError('Cannot format invalid JSON');
    }
  };

  // Clear all props
  const handleClear = () => {
    if (confirm('Clear all section options?')) {
      setJsonText('{}');
      setError(null);
      onChange({});
    }
  };

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFormat}
            disabled={disabled || !!error}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Format
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>
        {error && (
          <span className="text-xs text-red-600">{error}</span>
        )}
      </div>

      {/* JSON Editor */}
      <textarea
        value={jsonText}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={() => setIsEditing(true)}
        disabled={disabled}
        rows={8}
        className={`w-full px-3 py-2 border rounded-md font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        }`}
        placeholder='{\n  "mapHeight": "300px",\n  "iconSize": 32\n}'
        spellCheck={false}
      />

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p className="font-medium">Common properties:</p>
        <ul className="list-disc list-inside space-y-0.5 ml-2">
          <li><code className="bg-gray-100 px-1 rounded">mapHeight</code> - Map height (e.g., "300px", "400px")</li>
          <li><code className="bg-gray-100 px-1 rounded">iconSize</code> - Icon size in pixels (e.g., 32, 48)</li>
          <li><code className="bg-gray-100 px-1 rounded">spacing</code> - Spacing between items in pixels</li>
          <li><code className="bg-gray-100 px-1 rounded">showAddressOverlay</code> - Show address on map (true/false)</li>
          <li><code className="bg-gray-100 px-1 rounded">bioItalic</code> - Display bio in italics (true/false)</li>
        </ul>
      </div>
    </div>
  );
}

export default SectionPropsEditor;
