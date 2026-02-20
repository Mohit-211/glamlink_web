'use client';

import React from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

// Import from package
import { formatHtmlForDisplay } from '../../utils';

// Import types
import type { FieldToggleProps, FieldComparison } from '../../types';

export function FieldToggle({
  field,
  onToggle,
  disabled = false,
  showPreview = true,
  maxPreviewLength = 100
}: FieldToggleProps) {
  const [showFullPreview, setShowFullPreview] = React.useState(false);

  const formatValueForDisplay = (value: any, fieldType: FieldComparison['fieldType']): string => {
    if (!value) return '';
    
    if (fieldType === 'html') {
      return formatHtmlForDisplay(value);
    }
    
    return String(value);
  };

  const getPreviewValue = (value: any): string => {
    const formatted = formatValueForDisplay(value, field.fieldType);
    if (!showFullPreview && formatted.length > maxPreviewLength) {
      return formatted.substring(0, maxPreviewLength) + '...';
    }
    return formatted;
  };

  const hasChanges = field.oldValue !== field.newValue;

  return (
    <div
      className={`p-4 border rounded-lg transition-colors ${
        field.shouldUpdate && !disabled
          ? 'border-green-200 bg-green-50' 
          : 'border-gray-200 bg-gray-50'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={field.shouldUpdate}
            onChange={() => !disabled && onToggle(field.fieldName)}
            disabled={disabled}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded disabled:opacity-50"
          />
          <label className={`font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
            {field.displayName}
          </label>
          
          {/* Status badges */}
          <div className="flex items-center gap-1">
            {field.shouldUpdate && !disabled && (
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                Will update
              </span>
            )}
            {disabled && (
              <span className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                <Lock className="w-3 h-3" />
                Locked
              </span>
            )}
            {hasChanges && (
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                Modified
              </span>
            )}
          </div>
        </div>

        {/* Preview toggle */}
        {showPreview && (field.oldValue || field.newValue) && (
          <button
            onClick={() => setShowFullPreview(!showFullPreview)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            {showFullPreview ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Preview
              </>
            )}
          </button>
        )}
      </div>

      {/* Field Type Badge */}
      <div className="mb-2">
        <span className={`text-xs px-2 py-1 rounded-full ${
          field.fieldType === 'html' ? 'bg-orange-100 text-orange-700' :
          field.fieldType === 'number' ? 'bg-blue-100 text-blue-700' :
          field.fieldType === 'date' ? 'bg-purple-100 text-purple-700' :
          field.fieldType === 'select' ? 'bg-green-100 text-green-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {field.fieldType}
        </span>
      </div>

      {/* Preview Content */}
      {showPreview && (field.oldValue || field.newValue) && (
        <div className="grid grid-cols-2 gap-3 text-sm">
          {/* Current Value */}
          <div>
            <div className="font-medium text-gray-700 mb-1">Current:</div>
            <div className="p-2 bg-white border border-gray-200 rounded min-h-[40px]">
              {field.fieldType === 'html' ? (
                <div
                  className="text-gray-600 text-xs"
                  dangerouslySetInnerHTML={{ 
                    __html: getPreviewValue(field.oldValue) || '<em>No content</em>' 
                  }}
                />
              ) : (
                <div className="text-gray-600 text-xs whitespace-pre-wrap">
                  {getPreviewValue(field.oldValue) || <em className="text-gray-400">No content</em>}
                </div>
              )}
            </div>
          </div>

          {/* New Value */}
          <div>
            <div className="font-medium text-gray-700 mb-1">Proposed:</div>
            <div className="p-2 bg-blue-50 border border-blue-200 rounded min-h-[40px]">
              {field.fieldType === 'html' ? (
                <div
                  className="text-gray-800 text-xs"
                  dangerouslySetInnerHTML={{ 
                    __html: getPreviewValue(field.newValue) || '<em>No content</em>' 
                  }}
                />
              ) : (
                <div className="text-gray-800 text-xs whitespace-pre-wrap">
                  {getPreviewValue(field.newValue) || <em className="text-gray-400">No content</em>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}