'use client';

import React, { useState } from 'react';
import TiptapEditor from './TiptapEditor';
import HtmlPreview from './HtmlPreview';
import { Eye, EyeOff } from 'lucide-react';

interface StandaloneHtmlFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  minHeight?: number;
  placeholder?: string;
  helperText?: string;
  showPreview?: boolean;
}

export function StandaloneHtmlField({
  label,
  value,
  onChange,
  disabled = false,
  minHeight = 150,
  placeholder = 'Start typing...',
  helperText,
  showPreview = true,
}: StandaloneHtmlFieldProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-gray-600">
          {label}
        </label>
        {showPreview && (
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {isPreviewMode ? (
              <>
                <EyeOff size={16} />
                Edit
              </>
            ) : (
              <>
                <Eye size={16} />
                Preview
              </>
            )}
          </button>
        )}
      </div>

      {isPreviewMode ? (
        <HtmlPreview content={value} className="" />
      ) : (
        <TiptapEditor
          value={value}
          onChange={onChange}
          disabled={disabled}
          minHeight={minHeight}
          placeholder={placeholder}
        />
      )}

      {helperText && (
        <p className="text-xs text-gray-400">{helperText}</p>
      )}
    </div>
  );
}

export default StandaloneHtmlField;
