'use client';

import React, { useState, useEffect } from 'react';

// Types for standalone link field (no FormContext dependency)
export type LinkActionType = 'link' | 'pro-popup' | 'user-popup' | 'modal' | 'modal-content' | 'modal-iframe' | 'modal-image';

export interface LinkFieldValue {
  url: string;
  action?: LinkActionType;
  modalConfig?: {
    type?: 'content' | 'iframe' | 'image';
    width?: string;
    height?: string;
  };
  qrCode?: string;
}

export interface LinkFieldProps {
  label?: string;
  name?: string;
  value: LinkFieldValue | string | null | undefined;
  onChange: (value: LinkFieldValue) => void;
  placeholder?: string;
  showActionSelector?: boolean;
  showQRCode?: boolean;
  defaultAction?: LinkActionType;
  modalOptions?: {
    allowModal?: boolean;
    defaultModalType?: 'content' | 'iframe' | 'image';
    width?: string;
    height?: string;
  };
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  compact?: boolean;
}

export const LinkField: React.FC<LinkFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = 'https://example.com',
  showActionSelector = true,
  showQRCode = false,
  defaultAction = 'link',
  modalOptions,
  required = false,
  disabled = false,
  error,
  helperText,
  className,
  compact
}) => {
  // Normalize the value to LinkFieldValue format
  const normalizedValue: LinkFieldValue = (() => {
    if (!value) return { url: '', action: defaultAction };
    if (typeof value === 'string') return { url: value, action: defaultAction };
    return {
      url: value.url || '',
      action: value.action || defaultAction,
      modalConfig: value.modalConfig,
      qrCode: value.qrCode
    };
  })();

  const [url, setUrl] = useState(normalizedValue.url);
  const [action, setAction] = useState<LinkActionType>(normalizedValue.action || defaultAction);
  const [isPopup, setIsPopup] = useState(
    normalizedValue.action === 'pro-popup' || normalizedValue.action === 'user-popup'
  );
  const [isModal, setIsModal] = useState(
    normalizedValue.action?.startsWith('modal') || false
  );
  const [modalType, setModalType] = useState<'content' | 'iframe' | 'image'>(
    modalOptions?.defaultModalType || 'content'
  );
  const [qrCodeValue, setQrCodeValue] = useState(normalizedValue.qrCode || '');
  const [showQrInput, setShowQrInput] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    setUrl(normalizedValue.url);
    setAction(normalizedValue.action || defaultAction);
    setIsPopup(normalizedValue.action === 'pro-popup' || normalizedValue.action === 'user-popup');
    setIsModal(normalizedValue.action?.startsWith('modal') || false);
    setQrCodeValue(normalizedValue.qrCode || '');
  }, [normalizedValue.url, normalizedValue.action, normalizedValue.qrCode, defaultAction]);

  // Handle URL change
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    onChange({ url: newUrl, action, qrCode: qrCodeValue });
  };

  // Handle primary action type change (link vs popup vs modal)
  const handlePrimaryActionChange = (actionType: 'link' | 'popup' | 'modal') => {
    setIsPopup(actionType === 'popup');
    setIsModal(actionType === 'modal');
    
    if (actionType === 'popup') {
      // Default to pro-popup when switching to popup
      const newAction = 'pro-popup' as LinkActionType;
      setAction(newAction);
      setUrl('#');
      onChange({ url: '#', action: newAction, qrCode: qrCodeValue });
    } else if (actionType === 'modal') {
      // Default to modal-content when switching to modal
      const newAction = `modal-${modalType}` as LinkActionType;
      setAction(newAction);
      onChange({ url, action: newAction, qrCode: qrCodeValue });
    } else {
      // Switch back to regular link
      setAction('link');
      onChange({ url, action: 'link', qrCode: qrCodeValue });
    }
  };

  // Handle popup type change
  const handlePopupTypeChange = (popupType: 'pro-popup' | 'user-popup') => {
    setAction(popupType);
    onChange({ url: '#', action: popupType, qrCode: qrCodeValue });
  };

  // Handle modal type change
  const handleModalTypeChange = (newModalType: 'content' | 'iframe' | 'image') => {
    setModalType(newModalType);
    const newAction = `modal-${newModalType}` as LinkActionType;
    setAction(newAction);
    onChange({ 
      url, 
      action: newAction, 
      modalConfig: {
        type: newModalType,
        width: modalOptions?.width,
        height: modalOptions?.height
      },
      qrCode: qrCodeValue
    });
  };

  // Handle QR code change
  const handleQrCodeChange = (newQrCode: string) => {
    setQrCodeValue(newQrCode);
    onChange({ url, action, qrCode: newQrCode });
  };

  const renderActionPreview = () => {
    if (action === 'link' && url) {
      return (
        <>
          Will open: <span className="text-blue-600">{url}</span>
        </>
      );
    }
    if (action === 'link' && !url) {
      return <>Enter a URL to create a link</>;
    }
    if (action === 'pro-popup') {
      return (
        <>
          Will show: <span className="text-purple-600">Pro App download popup</span>
        </>
      );
    }
    if (action === 'user-popup') {
      return (
        <>
          Will show: <span className="text-teal-600">User App download popup</span>
        </>
      );
    }
    if (action === 'modal' || action === 'modal-content') {
      return (
        <>
          Will open in modal: <span className="text-indigo-600">{url || 'No URL set'}</span>
        </>
      );
    }
    if (action === 'modal-iframe') {
      return (
        <>
          Will open in iframe modal: <span className="text-indigo-600">{url || 'No URL set'}</span>
        </>
      );
    }
    if (action === 'modal-image') {
      return (
        <>
          Will open image in lightbox: <span className="text-indigo-600">{url || 'No image URL'}</span>
        </>
      );
    }
    return null;
  };

  // Generate QR code URL
  const generateQRCodeUrl = () => {
    const targetUrl = qrCodeValue || url;
    if (!targetUrl || targetUrl === '#') return '';
    
    // If it's already a QR code image URL, return it
    if (qrCodeValue && !qrCodeValue.startsWith('http')) {
      return qrCodeValue;
    }
    
    // Generate QR code for the URL
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(targetUrl)}`;
  };

  return (
    <div className={className}>
      {label && !compact && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="space-y-2">
        <div className="flex gap-2">
          {/* Primary Action Type Selector */}
          {showActionSelector && (
            <select
              value={isModal ? 'modal' : isPopup ? 'popup' : 'link'}
              onChange={(e) => handlePrimaryActionChange(e.target.value as 'link' | 'popup' | 'modal')}
              disabled={disabled}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:opacity-50"
              aria-label="Link action type"
            >
              <option value="link">🔗 Regular Link</option>
              <option value="popup">📱 App Download Popup</option>
              {modalOptions?.allowModal !== false && (
                <option value="modal">🖼️ Open in Modal</option>
              )}
            </select>
          )}

          {/* Conditional rendering based on primary action */}
          {isPopup ? (
            // Show app type dropdown for popup
            <select
              value={action}
              onChange={(e) => handlePopupTypeChange(e.target.value as 'pro-popup' | 'user-popup')}
              disabled={disabled}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:opacity-50"
              aria-label="App download type"
            >
              <option value="pro-popup">✨ Pro App Download</option>
              <option value="user-popup">👤 User App Download</option>
            </select>
          ) : isModal ? (
            // Show modal type selector and URL input
            <>
              <select
                value={modalType}
                onChange={(e) => handleModalTypeChange(e.target.value as 'content' | 'iframe' | 'image')}
                disabled={disabled}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:opacity-50"
                aria-label="Modal type"
              >
                <option value="content">📝 Content Modal</option>
                <option value="iframe">🌐 iFrame Modal</option>
                <option value="image">🖼️ Image Lightbox</option>
              </select>
              <input
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder={modalType === 'image' ? 'Image URL' : placeholder}
                required={required}
                disabled={disabled}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:opacity-50"
              />
            </>
          ) : (
            // Show URL input for regular link
            <input
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={placeholder}
              required={required && !isPopup}
              disabled={disabled}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:opacity-50"
            />
          )}
        </div>

        {/* QR Code Section */}
        {showQRCode && url && url !== '#' && (
          <div className="p-3 bg-gray-50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">QR Code</label>
              <button
                type="button"
                onClick={() => setShowQrInput(!showQrInput)}
                className="text-xs text-glamlink-teal hover:underline"
              >
                {showQrInput ? 'Hide Options' : 'Show Options'}
              </button>
            </div>
            
            {showQrInput && (
              <input
                type="text"
                value={qrCodeValue}
                onChange={(e) => handleQrCodeChange(e.target.value)}
                placeholder="Custom QR code URL or leave empty for auto-generation"
                disabled={disabled}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-glamlink-teal disabled:opacity-50"
              />
            )}
            
            {generateQRCodeUrl() && (
              <div className="flex items-center gap-3">
                <div className="w-24 h-24 bg-white p-1 border border-gray-300 rounded">
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                    QR Code Preview
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  <p>QR code will link to:</p>
                  <p className="font-medium truncate">{qrCodeValue || url}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preview of behavior */}
        <p className="text-sm text-gray-600 italic">
          {renderActionPreview()}
        </p>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && !compact && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

// Standalone version that doesn't require FormContext
export const StandaloneLinkField = LinkField;

export default StandaloneLinkField;