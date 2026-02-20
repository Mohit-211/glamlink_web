'use client';

import React from 'react';
import { Lock, Loader2, CheckCircle } from 'lucide-react';
import { LockDisplay } from './LockDisplay';

export interface LockGatedEditorProps {
  // Resource identification
  resourceId: string;
  collection?: string;
  endpoint?: string;
  resourceName: string; // e.g., "Basic Information", "Cover Configuration", "The Glam Drop"
  
  // Lock state
  isLoading: boolean;
  lockInfo: any; // Lock status object
  
  // Callbacks
  onTransferLock?: () => void | Promise<void>;
  onGoBack?: () => void;
  
  // Content to show when unlocked
  children: React.ReactNode;
  
  // Optional customization
  className?: string;
  loadingMessage?: string;
  loadingSubMessage?: string;
}

export function LockGatedEditor({
  resourceId,
  collection,
  endpoint,
  resourceName,
  isLoading,
  lockInfo,
  onTransferLock,
  onGoBack,
  children,
  className = '',
  loadingMessage,
  loadingSubMessage
}: LockGatedEditorProps) {
  // Show loading state while checking lock status
  if (isLoading) {
    const sectionName = resourceName || 'content';
    
    return (
      <div className={`h-full flex items-center justify-center bg-white ${className}`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-teal-500" />
          <p className="text-gray-600 font-medium">
            {loadingMessage || `Loading ${sectionName} fields...`}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {loadingSubMessage || 'Checking lock status...'}
          </p>
        </div>
      </div>
    );
  }
  
  // If no lock info provided, allow editing (backward compatibility)
  if (!lockInfo) {
    return <>{children}</>;
  }
  
  // Check lock status
  const isLocked = lockInfo.isLocked === true;
  const hasLock = lockInfo.hasLock === true;
  const canEdit = lockInfo.canEdit === true;
  
  // Determine lock conflict type
  const isLockedByOther = isLocked && 
                          lockInfo.lockedBy !== lockInfo.currentUserId &&
                          !hasLock;
  // Use the explicit flag if provided, otherwise calculate it
  const isMultiTab = lockInfo.isMultiTabConflict || 
                     (isLocked && 
                      lockInfo.lockedBy === lockInfo.currentUserId &&
                      lockInfo.lockedTabId !== lockInfo.currentTabId &&
                      !hasLock);
  
  // User has the lock only if a lock exists AND they have it
  const userHasLock = isLocked && hasLock;
  
  // Show multi-tab conflict UI (only if user doesn't have edit permission)
  if (!userHasLock && isMultiTab) {
    return (
      <div className={`h-full flex items-center justify-center bg-white ${className}`}>
        <div className="text-center max-w-md">
          <Lock className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Tab Conflict</h3>
          <p className="text-gray-600 mb-1">
            You're already editing this {resourceName.toLowerCase()} in another browser tab.
          </p>
          <p className="text-gray-500 text-sm mb-2">
            Choose to edit here or go back.
          </p>
          <div className="flex gap-3 justify-center mt-6">
            {onTransferLock && (
              <button
                type="button"
                onClick={onTransferLock}
                className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
              >
                Edit from Current Tab
              </button>
            )}
            {onGoBack && (
              <button
                type="button"
                onClick={onGoBack}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Go Back
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Show locked by another user UI
  if (!userHasLock && isLockedByOther) {
    const remainingMinutes = lockInfo?.lockExpiresIn ? Math.ceil(lockInfo.lockExpiresIn / 60) : 0;
    
    return (
      <div className={`h-full flex items-center justify-center bg-white ${className}`}>
        <div className="text-center max-w-md">
          <Lock className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{resourceName} Locked</h3>
          <p className="text-gray-600 mb-1">
            This {resourceName.toLowerCase()} is currently being edited by{' '}
            <strong>{lockInfo?.lockedByName || lockInfo?.lockedByEmail || 'another user'}</strong>.
          </p>
          <p className="text-gray-500 text-sm mb-2">
            You cannot make changes until they release the lock.
          </p>
          {remainingMinutes > 0 && (
            <p className="text-gray-500 text-xs">
              Lock expires in approximately {remainingMinutes} minute{remainingMinutes !== 1 ? 's' : ''}.
            </p>
          )}
          {onGoBack && (
            <button
              type="button"
              onClick={onGoBack}
              className="mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }
  
  // User has the lock - show the children content with lock indicator
  if (userHasLock) {
    return (
      <>
        {/* Lock status display above the content */}
        <LockDisplay 
          resourceId={resourceId}
          collection={collection}
          endpoint={endpoint}
          lockInfo={lockInfo}
          className="mb-2"
        />
        {children}
      </>
    );
  }
  
  // No lock exists and user can edit - allow them to proceed (lock will be acquired)
  if (!isLocked && canEdit) {
    return (
      <>
        {/* Show available status */}
        <LockDisplay 
          resourceId={resourceId}
          collection={collection}
          endpoint={endpoint}
          lockInfo={lockInfo}
          className="mb-2"
        />
        {children}
      </>
    );
  }
  
  // If we reach here, something is wrong - show a fallback UI
  console.warn('LockGatedEditor: Unexpected state - no lock condition matched', lockInfo);
  return (
    <div className={`h-full flex items-center justify-center bg-white ${className}`}>
      <div className="text-center max-w-md">
        <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Lock Status Unknown</h3>
        <p className="text-gray-600 mb-1">
          Unable to determine lock status for this {resourceName.toLowerCase()}.
        </p>
        {onGoBack && (
          <button
            type="button"
            onClick={onGoBack}
            className="mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Go Back
          </button>
        )}
      </div>
    </div>
  );
}

// Convenience wrapper for sections
export function SectionLockGatedEditor(props: LockGatedEditorProps & { sectionType?: string }) {
  const sectionName = props.sectionType ? 
    props.sectionType.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') : props.resourceName;
    
  return <LockGatedEditor {...props} resourceName={sectionName} />;
}