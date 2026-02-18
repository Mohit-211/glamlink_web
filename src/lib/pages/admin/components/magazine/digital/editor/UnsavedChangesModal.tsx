'use client';

import React from 'react';
import Modal from '@/lib/components/Modal';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  context: 'navigate' | 'back' | 'newPage';
}

const CONTEXT_MESSAGES = {
  navigate: {
    title: 'Navigate to Different Page?',
    message: 'You have unsaved changes on the current page. If you navigate away, your changes will be lost.',
    confirmText: 'Navigate Anyway',
  },
  back: {
    title: 'Leave Editor?',
    message: 'You have unsaved changes. If you leave now, your changes will be lost.',
    confirmText: 'Leave Anyway',
  },
  newPage: {
    title: 'Create New Page?',
    message: 'You have unsaved changes on the current page. If you create a new page, your changes will be lost.',
    confirmText: 'Create Anyway',
  },
};

export default function UnsavedChangesModal({
  isOpen,
  onConfirm,
  onCancel,
  context,
}: UnsavedChangesModalProps) {
  const config = CONTEXT_MESSAGES[context];

  return (
    <Modal isOpen={isOpen} onClose={onCancel} maxWidth="md">
      <div className="p-6">
        {/* Warning Icon */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full">
          <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="mt-4 text-lg font-medium text-center text-gray-900">
          {config.title}
        </h3>

        {/* Message */}
        <p className="mt-2 text-sm text-center text-gray-500">
          {config.message}
        </p>

        {/* Warning note */}
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-xs text-red-600 font-medium">
            ⚠️ This action cannot be undone. Save your changes first if you want to keep them.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
          >
            {config.confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
