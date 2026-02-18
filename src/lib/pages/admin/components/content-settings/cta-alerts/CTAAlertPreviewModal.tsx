'use client';

import { CTAAlertConfig } from '@/lib/pages/admin/types/ctaAlert';
import { XMarkIcon } from '@/lib/pages/admin/components/shared/common';

interface CTAAlertPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CTAAlertConfig;
}

export default function CTAAlertPreviewModal({ isOpen, onClose, config }: CTAAlertPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">CTA Alert Preview</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Alert Bar Preview */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Alert Bar Preview</h3>
              <div
                className={`
                  relative w-full py-3 px-4 flex items-center justify-between
                  ${config.backgroundColor || 'bg-glamlink-teal'}
                  ${config.textColor || 'text-white'}
                `}
              >
                {/* Close button preview */}
                <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10">
                  <XMarkIcon className="h-4 w-4" />
                </button>

                {/* Message and CTA */}
                <div className="flex-1 flex items-center justify-center gap-4 pr-8">
                  <span className="text-sm font-medium text-center">
                    {config.message || 'Your message will appear here'}
                  </span>
                  <button
                    className={`
                      px-4 py-1.5 text-sm font-semibold rounded-full whitespace-nowrap
                      ${config.buttonBackgroundColor || 'bg-black'}
                      ${config.buttonTextColor || 'text-white'}
                      ${config.buttonHoverColor || 'hover:bg-gray-800'}
                    `}
                  >
                    {config.buttonText || 'Button'}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Content Preview */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Modal Content Preview</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {config.modalTitle || 'Modal Title'}
                  </h4>
                  <button className="text-gray-400 hover:text-gray-500">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 max-h-96 overflow-y-auto">
                  {config.modalType === 'custom' ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        Custom Modal: <span className="font-medium">{config.customModalId}</span>
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Custom modals cannot be previewed here. They will render at runtime.
                      </p>
                    </div>
                  ) : config.modalHtmlContent ? (
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: config.modalHtmlContent }}
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      No modal content configured yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Configuration Summary */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Configuration Summary</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Status:</span>{' '}
                  <span className={config.isActive ? 'text-green-600 font-medium' : 'text-gray-600'}>
                    {config.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Source:</span>{' '}
                  <span className="text-gray-900">
                    {config.sourceType === 'promo' ? `Linked Promo (${config.linkedPromoId})` : 'Standalone'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Start Date:</span>{' '}
                  <span className="text-gray-900">{config.startDate || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-gray-500">End Date:</span>{' '}
                  <span className="text-gray-900">{config.endDate || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Modal Type:</span>{' '}
                  <span className="text-gray-900 capitalize">{config.modalType || 'standard'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Reappear After:</span>{' '}
                  <span className="text-gray-900">{config.dismissAfterHours || 24} hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
