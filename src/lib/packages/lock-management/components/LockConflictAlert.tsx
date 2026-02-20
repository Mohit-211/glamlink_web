'use client';

import React from 'react';
import { AlertCircle, UserCheck, RefreshCw } from 'lucide-react';
import { LockStatus } from '../types/lock.types';

/**
 * Format milliseconds into human-readable time string
 */
function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

interface LockConflictAlertProps {
  lock: LockStatus;
  resourceName?: string;
  onTakeControl?: () => void;
  onWait?: () => void;
  onCancel?: () => void;
  className?: string;
}

/**
 * LockConflictAlert Component
 * 
 * Displays a user-friendly alert when there's a lock conflict,
 * with options to take control if it's the same user in another tab.
 */
export function LockConflictAlert({
  lock,
  resourceName = 'this content',
  onTakeControl,
  onWait,
  onCancel,
  className = ''
}: LockConflictAlertProps) {
  if (!lock || !lock.isLocked || lock.hasLock) {
    return null;
  }

  const isMultiTab = lock.isMultiTabConflict;
  const holderName = lock.lockedByName || lock.lockedByEmail || 'Another user';

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-yellow-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              Content Currently Being Edited
            </h3>
          </div>

          {/* Message */}
          <div className="mb-6">
            {isMultiTab ? (
              <div className="space-y-2">
                <p className="text-gray-700">
                  You are already editing {resourceName} in another browser tab.
                </p>
                <p className="text-sm text-gray-600">
                  To continue editing here, you can take control from the other tab.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-700">
                  {resourceName} is currently being edited by:
                </p>
                <div className="flex items-center bg-gray-50 p-3 rounded-md">
                  <UserCheck className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-900">{holderName}</span>
                </div>
                {lock.lockExpiresIn && lock.lockExpiresIn > 0 && (
                  <p className="text-sm text-gray-600">
                    Lock expires in: <span className="font-medium">{formatTime(lock.lockExpiresIn)}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {isMultiTab && onTakeControl && (
              <button
                onClick={onTakeControl}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Take Control Here
              </button>
            )}
            
            {!isMultiTab && onWait && (
              <button
                onClick={onWait}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Wait for Release
              </button>
            )}
            
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * InlineLockAlert Component
 * 
 * A simpler inline version of the alert that doesn't use a modal.
 */
export function InlineLockAlert({
  lock,
  resourceName = 'this content',
  onTakeControl,
  className = ''
}: {
  lock: LockStatus;
  resourceName?: string;
  onTakeControl?: () => void;
  className?: string;
}) {
  if (!lock || !lock.isLocked || lock.hasLock) {
    return null;
  }

  const isMultiTab = lock.isMultiTabConflict;
  const holderName = lock.lockedByName || lock.lockedByEmail || 'Another user';

  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-md p-4 ${className}`}>
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-yellow-800">
            {isMultiTab ? (
              <>
                You are editing {resourceName} in another tab.
                {onTakeControl && (
                  <>
                    {' '}
                    <button
                      onClick={onTakeControl}
                      className="font-medium underline hover:no-underline"
                    >
                      Take control here
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                Currently being edited by <span className="font-medium">{holderName}</span>
                {lock.lockExpiresIn && lock.lockExpiresIn > 0 && (
                  <span className="ml-2 text-yellow-600">
                    (expires in {formatTime(lock.lockExpiresIn)})
                  </span>
                )}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LockConflictAlert;