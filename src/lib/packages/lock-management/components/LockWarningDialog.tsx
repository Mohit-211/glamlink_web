'use client';

/**
 * LockWarningDialog Component - Lock Conflict & Warning Dialog
 * 
 * Modal dialog for handling lock conflicts, warnings, and confirmations.
 */

import React from 'react';
import { LockStatus } from '../types/lock.types';
import { MultiTabStatus } from '../hooks/useMultiTabDetection';
import { LockCountdown } from './LockCountdown';

export interface LockWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'conflict' | 'expiring' | 'expired' | 'transfer' | 'force_release';
  lockStatus?: LockStatus | null;
  multiTabStatus?: MultiTabStatus;
  timeRemaining?: string | null;
  conflictingUser?: string;
  resourceName?: string;
  
  // Action callbacks
  onAcquireLock?: () => void;
  onExtendLock?: () => void;
  onReleaseLock?: () => void;
  onTransferLock?: () => void;
  onForceOverride?: () => void;
  onCancel?: () => void;
  
  // Configuration
  showBackdrop?: boolean;
  allowEscapeClose?: boolean;
  className?: string;
}

const dialogTypes = {
  conflict: {
    icon: '⚠️',
    title: 'Lock Conflict Detected',
    color: 'border-yellow-200 bg-yellow-50',
    headerColor: 'bg-yellow-100 text-yellow-800'
  },
  expiring: {
    icon: '⏰',
    title: 'Lock Expiring Soon',
    color: 'border-orange-200 bg-orange-50',
    headerColor: 'bg-orange-100 text-orange-800'
  },
  expired: {
    icon: '❌',
    title: 'Lock Has Expired',
    color: 'border-red-200 bg-red-50',
    headerColor: 'bg-red-100 text-red-800'
  },
  transfer: {
    icon: '🔄',
    title: 'Transfer Lock',
    color: 'border-blue-200 bg-blue-50',
    headerColor: 'bg-blue-100 text-blue-800'
  },
  force_release: {
    icon: '🔓',
    title: 'Force Release Lock',
    color: 'border-gray-200 bg-gray-50',
    headerColor: 'bg-gray-100 text-gray-800'
  }
};

export function LockWarningDialog({
  isOpen,
  onClose,
  type,
  lockStatus,
  multiTabStatus,
  timeRemaining,
  conflictingUser,
  resourceName = 'this resource',
  onAcquireLock,
  onExtendLock,
  onReleaseLock,
  onTransferLock,
  onForceOverride,
  onCancel,
  showBackdrop = true,
  allowEscapeClose = true,
  className = ''
}: LockWarningDialogProps) {
  
  const dialogConfig = dialogTypes[type];

  const handleEscapeClose = (e: React.KeyboardEvent) => {
    if (allowEscapeClose && e.key === 'Escape') {
      onClose();
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'conflict':
        return (
          <div className="space-y-4">
            {multiTabStatus?.isOtherTabEditing ? (
              <div>
                <p className="text-gray-700 mb-3">
                  <strong>{resourceName}</strong> is being edited in another browser tab.
                </p>
                {multiTabStatus.conflictingSection && (
                  <p className="text-sm text-gray-600 mb-3">
                    Section: <strong>{multiTabStatus.conflictingSection}</strong>
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  To avoid data conflicts, please close the other tab or use the override option below.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 mb-3">
                  <strong>{resourceName}</strong> is currently locked by <strong>{conflictingUser}</strong>.
                </p>
                <p className="text-sm text-gray-600">
                  Another user is editing this resource. Please wait for them to finish or contact them directly.
                </p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={onCancel || onClose}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Wait
              </button>
              
              {multiTabStatus?.isOtherTabEditing && onForceOverride && (
                <button
                  onClick={onForceOverride}
                  className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                >
                  Override Tab
                </button>
              )}
              
              {!multiTabStatus?.isOtherTabEditing && onTransferLock && (
                <button
                  onClick={onTransferLock}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Request Transfer
                </button>
              )}
            </div>
          </div>
        );

      case 'expiring':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <LockCountdown
                timeRemaining={timeRemaining || ''}
                isWarning={true}
                size="lg"
              />
            </div>
            
            <p className="text-gray-700 text-center">
              Your lock on <strong>{resourceName}</strong> is expiring soon.
            </p>
            
            <p className="text-sm text-gray-600 text-center">
              Extend your lock to continue editing or release it to allow others to edit.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={onReleaseLock}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Release Lock
              </button>
              
              <button
                onClick={onExtendLock}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
              >
                Extend Lock
              </button>
            </div>
          </div>
        );

      case 'expired':
        return (
          <div className="space-y-4">
            <p className="text-gray-700 text-center">
              Your lock on <strong>{resourceName}</strong> has expired.
            </p>
            
            <p className="text-sm text-gray-600 text-center">
              You'll need to acquire a new lock to continue editing.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              
              <button
                onClick={onAcquireLock}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Acquire New Lock
              </button>
            </div>
          </div>
        );

      case 'transfer':
        return (
          <div className="space-y-4">
            <p className="text-gray-700">
              Transfer the lock for <strong>{resourceName}</strong> from <strong>{conflictingUser}</strong> to yourself?
            </p>
            
            <p className="text-sm text-gray-600">
              This will immediately remove their access and give you editing control.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={onCancel || onClose}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={onTransferLock}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Transfer Lock
              </button>
            </div>
          </div>
        );

      case 'force_release':
        return (
          <div className="space-y-4">
            <p className="text-gray-700">
              Force release the lock for <strong>{resourceName}</strong>?
            </p>
            
            <p className="text-sm text-gray-600">
              This will immediately remove the current lock and make the resource available for editing.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={onCancel || onClose}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={onReleaseLock}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Force Release
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      {showBackdrop && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative bg-white rounded-lg shadow-xl max-w-md w-full border-2 ${dialogConfig.color} ${className}`}
          onKeyDown={handleEscapeClose}
          tabIndex={-1}
        >
          {/* Header */}
          <div className={`px-6 py-4 rounded-t-lg ${dialogConfig.headerColor}`}>
            <div className="flex items-center gap-3">
              <span className="text-xl">{dialogConfig.icon}</span>
              <h3 className="text-lg font-semibold">{dialogConfig.title}</h3>
            </div>
          </div>
          
          {/* Content */}
          <div className="px-6 py-4">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}