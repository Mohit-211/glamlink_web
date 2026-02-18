'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseRawHtmlModalProps {
  isOpen: boolean;
  htmlContent: string;
  onApply: (newHtml: string) => void;
  onClose: () => void;
}

interface UseRawHtmlModalReturn {
  editedHtml: string;
  copied: boolean;
  validationError: string | null;
  handleHtmlChange: (value: string) => void;
  handleApply: () => void;
  handleCopy: () => Promise<void>;
  formatHtml: () => void;
}

// Basic HTML validation
function validateHtml(html: string): string | null {
  // Check for unclosed tags (basic check)
  const openTags = (html.match(/<[^\/][^>]*>/g) || []).length;
  const closeTags = (html.match(/<\/[^>]*>/g) || []).length;

  if (openTags !== closeTags) {
    return 'Warning: Mismatched HTML tags detected. Please check your opening and closing tags.';
  }

  // Check for script tags (security)
  if (/<script/i.test(html)) {
    return 'Warning: Script tags are not allowed for security reasons.';
  }

  return null;
}

export function useRawHtmlModal({
  isOpen,
  htmlContent,
  onApply,
  onClose,
}: UseRawHtmlModalProps): UseRawHtmlModalReturn {
  const [editedHtml, setEditedHtml] = useState('');
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setEditedHtml(htmlContent);
      setValidationError(null);
      setCopied(false);
    }
  }, [isOpen, htmlContent]);

  const handleHtmlChange = useCallback((value: string) => {
    setEditedHtml(value);
    setValidationError(null);
  }, []);

  const handleApply = useCallback(() => {
    const error = validateHtml(editedHtml);
    if (error) {
      setValidationError(error);
      return;
    }
    onApply(editedHtml);
    onClose();
  }, [editedHtml, onApply, onClose]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(editedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy HTML:', err);
    }
  }, [editedHtml]);

  const formatHtml = useCallback(() => {
    // Basic HTML formatting
    let formatted = editedHtml
      .replace(/></g, '>\n<')
      .replace(/^\s*\n/gm, '') // Remove empty lines
      .split('\n')
      .map((line) => {
        // Simple indentation logic
        const depth = (line.match(/^\s*<\//) ? -1 : 0) +
                     (line.match(/<[^\/][^>]*[^\/]>/) ? 1 : 0);
        return '  '.repeat(Math.max(0, depth - 1)) + line.trim();
      })
      .join('\n');

    setEditedHtml(formatted);
  }, [editedHtml]);

  return {
    editedHtml,
    copied,
    validationError,
    handleHtmlChange,
    handleApply,
    handleCopy,
    formatHtml,
  };
}
