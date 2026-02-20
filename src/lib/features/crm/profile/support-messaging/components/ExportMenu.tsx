'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { ConversationWithMessages } from '../types';
import {
  exportConversation,
  downloadBlob,
  generateExportFilename,
  type ExportFormat,
} from '../utils/exportConversation';

interface ExportMenuProps {
  /** The conversation to export */
  conversation: ConversationWithMessages;
}

const EXPORT_OPTIONS: { format: ExportFormat; label: string; description: string }[] = [
  { format: 'txt', label: 'Plain Text (.txt)', description: 'Simple text format' },
  { format: 'json', label: 'JSON (.json)', description: 'Structured data format' },
  { format: 'html', label: 'HTML (.html)', description: 'Printable web format' },
];

/**
 * Dropdown menu for exporting conversation transcripts.
 *
 * @example
 * ```tsx
 * {userIsAdmin && <ExportMenu conversation={conversation} />}
 * ```
 */
export function ExportMenu({ conversation }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleExport = useCallback(async (format: ExportFormat) => {
    setIsExporting(true);
    setExportError(null);

    try {
      const blob = await exportConversation(conversation, {
        format,
        includeAttachments: true,
        includeMetadata: true,
      });

      const filename = generateExportFilename(conversation, format);
      downloadBlob(blob, filename);
      setIsOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
      setExportError('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [conversation]);

  return (
    <div ref={menuRef} className="relative">
      {/* Export button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {isExporting ? (
          <svg
            className="w-4 h-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        )}
        <span>Export</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          role="menu"
          aria-orientation="vertical"
        >
          {exportError && (
            <div className="px-3 py-2 text-xs text-red-600 bg-red-50 border-b border-red-100">
              {exportError}
            </div>
          )}
          {EXPORT_OPTIONS.map((option) => (
            <button
              key={option.format}
              onClick={() => handleExport(option.format)}
              disabled={isExporting}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 disabled:opacity-50 focus:bg-gray-50 focus:outline-none"
              role="menuitem"
            >
              <div className="font-medium text-gray-900">{option.label}</div>
              <div className="text-xs text-gray-500">{option.description}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
