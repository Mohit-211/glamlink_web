'use client';

import { Suspense, lazy, ComponentType } from 'react';
import { PublicCTAAlert } from '@/lib/pages/admin/types/ctaAlert';

// Lazy load custom modal components
const customModals: Record<string, ComponentType<{ isOpen: boolean; onClose: () => void }>> = {
  'thanksgiving-glam-giveaway': lazy(() =>
    import('@/lib/features/promos/components/custom-modals/ThanksgivingGlamGiveawayDialog')
  ),
  'parie-medical-spa': lazy(() =>
    import('@/lib/features/promos/components/custom-modals/ParieMedicalSpaDialog')
  ),
};

interface DynamicCTAModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PublicCTAAlert;
}

/**
 * Standard Modal Component for HTML content
 */
function StandardModal({ isOpen, onClose, config }: DynamicCTAModalProps) {
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
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {config.modalTitle || 'Special Offer'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {config.modalHtmlContent ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: config.modalHtmlContent }}
              />
            ) : (
              <p className="text-gray-600 text-center py-4">
                Click the button below to learn more!
              </p>
            )}
          </div>

          {/* Footer - conditionally shown based on showGotItButton */}
          {(config.showGotItButton ?? true) && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-glamlink-teal rounded-lg hover:bg-glamlink-teal-dark transition-colors"
              >
                Got it!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Loading fallback for lazy-loaded modals
 */
function ModalLoadingFallback() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
        <svg className="animate-spin h-5 w-5 text-glamlink-teal" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-gray-700">Loading...</span>
      </div>
    </div>
  );
}

/**
 * DynamicCTAModal - Renders either a custom modal component or standard HTML modal
 *
 * For custom modals, it lazy-loads the component from the registry.
 * For standard modals, it renders the HTML content directly.
 */
export default function DynamicCTAModal({ isOpen, onClose, config }: DynamicCTAModalProps) {
  if (!isOpen) return null;

  // Custom modal
  if (config.modalType === 'custom' && config.customModalId) {
    const CustomModal = customModals[config.customModalId];

    if (CustomModal) {
      return (
        <Suspense fallback={<ModalLoadingFallback />}>
          <CustomModal isOpen={isOpen} onClose={onClose} />
        </Suspense>
      );
    } else {
      console.warn(`Custom modal "${config.customModalId}" not found in registry`);
      // Fall through to standard modal
    }
  }

  // Standard modal with HTML content
  return <StandardModal isOpen={isOpen} onClose={onClose} config={config} />;
}
