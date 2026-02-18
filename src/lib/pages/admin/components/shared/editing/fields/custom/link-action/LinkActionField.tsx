'use client';

import React, { useState, useEffect, memo } from 'react';
import { useFormContext } from '../../../form/FormProvider';
import { BaseField } from '../../BaseField';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

export type LinkActionType = 'link' | 'pro-popup' | 'user-popup' | 'modal' | 'modal-content' | 'modal-iframe' | 'modal-image';

export interface LinkFieldValue {
  url: string;
  action?: LinkActionType;
  qrCode?: string;
  modalConfig?: {
    type?: 'content' | 'iframe' | 'image';
    width?: string;
    height?: string;
  };
}

interface LinkActionFieldProps {
  field: FieldConfig;
  error?: string;
}

/**
 * LinkActionField - URL input with optional action type selector
 * Used for CTAs, social links, booking links, etc.
 */
function LinkActionFieldComponent({ field, error }: LinkActionFieldProps) {
  const { getFieldValue, updateField, validateField } = useFormContext();
  const rawValue = getFieldValue(field.name);

  // Normalize the value to LinkFieldValue format
  const normalizedValue: LinkFieldValue = (() => {
    if (!rawValue) return { url: '', action: 'link' };
    if (typeof rawValue === 'string') return { url: rawValue, action: 'link' };
    return {
      url: rawValue.url || '',
      action: rawValue.action || 'link',
      qrCode: rawValue.qrCode,
      modalConfig: rawValue.modalConfig
    };
  })();

  const [url, setUrl] = useState(normalizedValue.url);
  const [action, setAction] = useState<LinkActionType>(normalizedValue.action || 'link');
  const [isPopup, setIsPopup] = useState(
    normalizedValue.action === 'pro-popup' || normalizedValue.action === 'user-popup'
  );

  // Sync state when form value changes externally
  useEffect(() => {
    setUrl(normalizedValue.url);
    setAction(normalizedValue.action || 'link');
    setIsPopup(normalizedValue.action === 'pro-popup' || normalizedValue.action === 'user-popup');
  }, [normalizedValue.url, normalizedValue.action]);

  const updateFormValue = (newUrl: string, newAction: LinkActionType) => {
    updateField(field.name, { url: newUrl, action: newAction });
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    updateFormValue(newUrl, action);
  };

  const handlePrimaryActionChange = (actionType: 'link' | 'popup') => {
    setIsPopup(actionType === 'popup');

    if (actionType === 'popup') {
      const newAction = 'pro-popup' as LinkActionType;
      setAction(newAction);
      setUrl('#');
      updateFormValue('#', newAction);
    } else {
      setAction('link');
      updateFormValue(url, 'link');
    }
  };

  const handlePopupTypeChange = (popupType: 'pro-popup' | 'user-popup') => {
    setAction(popupType);
    updateFormValue('#', popupType);
  };

  const renderPreview = () => {
    if (action === 'link' && url) {
      return (
        <>Will open: <span className="text-blue-600">{url}</span></>
      );
    }
    if (action === 'link' && !url) {
      return <>Enter a URL to create a link</>;
    }
    if (action === 'pro-popup') {
      return (
        <>Will show: <span className="text-purple-600">Pro App download popup</span></>
      );
    }
    if (action === 'user-popup') {
      return (
        <>Will show: <span className="text-teal-600">User App download popup</span></>
      );
    }
    return null;
  };

  return (
    <BaseField field={field} error={error}>
      <div className="space-y-2">
        <div className="flex gap-2">
          {/* Primary Action Type Selector */}
          <select
            value={isPopup ? 'popup' : 'link'}
            onChange={(e) => handlePrimaryActionChange(e.target.value as 'link' | 'popup')}
            disabled={field.disabled}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 text-sm"
            aria-label="Link action type"
          >
            <option value="link">Regular Link</option>
            <option value="popup">App Download Popup</option>
          </select>

          {isPopup ? (
            // Show app type dropdown for popup
            <select
              value={action}
              onChange={(e) => handlePopupTypeChange(e.target.value as 'pro-popup' | 'user-popup')}
              disabled={field.disabled}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 text-sm"
              aria-label="App download type"
            >
              <option value="pro-popup">Pro App Download</option>
              <option value="user-popup">User App Download</option>
            </select>
          ) : (
            // Show URL input for regular link
            <input
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              onBlur={() => validateField(field.name)}
              placeholder={field.placeholder || 'https://...'}
              required={field.required && !isPopup}
              disabled={field.disabled}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 text-sm"
            />
          )}
        </div>

        {/* Preview of behavior */}
        <p className="text-sm text-gray-600 italic">
          {renderPreview()}
        </p>
      </div>
    </BaseField>
  );
}

// Memo compares field and error for optimal re-rendering
export const LinkActionField = memo(LinkActionFieldComponent, (prev, next) => {
  return prev.field === next.field && prev.error === next.error;
});

export default LinkActionField;
