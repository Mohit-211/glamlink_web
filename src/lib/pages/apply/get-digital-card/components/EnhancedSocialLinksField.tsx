'use client';

import { Plus, X } from 'lucide-react';
import type { EnhancedSocialLink } from '@/lib/pages/for-professionals/types/professional';

interface EnhancedSocialLinksFieldProps {
  fieldName: string;
  label: string;
  value: EnhancedSocialLink[];
  onChange: (fieldName: string, value: EnhancedSocialLink[]) => void;
  error?: string;
  disabled?: boolean;
  helperText?: string;
  maxItems?: number;
}

export default function EnhancedSocialLinksField({
  fieldName,
  label,
  value = [],
  onChange,
  error,
  disabled = false,
  helperText,
  maxItems = 5
}: EnhancedSocialLinksFieldProps) {
  const handleAddLink = () => {
    if (value.length >= maxItems) return;
    const newLink: EnhancedSocialLink = {
      platform: '',
      url: '',
      handle: ''
    };
    onChange(fieldName, [...value, newLink]);
  };

  const handleRemoveLink = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(fieldName, newValue);
  };

  const handleUpdateLink = (index: number, field: keyof EnhancedSocialLink, fieldValue: string) => {
    const newValue = value.map((link, i) => {
      if (i === index) {
        return { ...link, [field]: fieldValue };
      }
      return link;
    });
    onChange(fieldName, newValue);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <button
          type="button"
          onClick={handleAddLink}
          disabled={disabled || value.length >= maxItems}
          className="px-3 py-1.5 bg-glamlink-teal text-white text-sm rounded-lg hover:bg-glamlink-teal-dark transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add Social Link
        </button>
      </div>

      {helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {value.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <p className="text-gray-500 text-sm">No social links added yet</p>
          <p className="text-gray-400 text-xs mt-1">Click "Add Social Link" to add your social media profiles</p>
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((link, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Social Link {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveLink(index)}
                  disabled={disabled}
                  className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50"
                  aria-label="Remove social link"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Platform Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Platform
                  </label>
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) => handleUpdateLink(index, 'platform', e.target.value)}
                    placeholder="e.g., TikTok, YouTube"
                    disabled={disabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* URL */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => handleUpdateLink(index, 'url', e.target.value)}
                    placeholder="https://..."
                    disabled={disabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Handle (optional) */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Handle <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={link.handle || ''}
                    onChange={(e) => handleUpdateLink(index, 'handle', e.target.value)}
                    placeholder="@username"
                    disabled={disabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {value.length > 0 && value.length < maxItems && (
        <p className="text-xs text-gray-500 text-right">
          {value.length} of {maxItems} social links added
        </p>
      )}
    </div>
  );
}
