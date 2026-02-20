'use client';

import Modal from '@/lib/components/Modal';
import { Code, Eye, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { useRawHtmlModal } from './useRawHtmlModal';

interface RawHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
  onApply: (newHtml: string) => void;
}

export default function RawHtmlModal({
  isOpen,
  onClose,
  htmlContent,
  onApply,
}: RawHtmlModalProps) {
  const {
    editedHtml,
    copied,
    validationError,
    handleHtmlChange,
    handleApply,
    handleCopy,
    formatHtml,
  } = useRawHtmlModal({ isOpen, htmlContent, onApply, onClose });

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Code className="w-5 h-5 text-glamlink-teal" />
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Raw HTML
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            x
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4">
          Edit the HTML directly. You can add custom classes, modify formatting, and make structural changes.
        </p>

        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <button
              onClick={formatHtml}
              className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              Format HTML
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="text-sm text-gray-500">
            {editedHtml.length} characters
          </div>
        </div>

        {/* HTML Editor */}
        <div className="mb-4">
          <textarea
            value={editedHtml}
            onChange={(e) => handleHtmlChange(e.target.value)}
            className="w-full h-96 p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-glamlink-teal focus:border-transparent resize-none"
            placeholder="Enter your HTML content here..."
            spellCheck={false}
          />
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              {validationError}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 text-white bg-glamlink-teal rounded-lg hover:bg-glamlink-teal/90 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Apply Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}
