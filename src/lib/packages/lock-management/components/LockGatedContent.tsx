'use client';

/**
 * LockGatedContent Component - Content wrapper with lock state management
 * 
 * Wraps content and shows appropriate UI based on lock state.
 * Prevents duplicate UI elements during multi-tab conflicts and loading states.
 */

import React, { ReactNode } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { LockStatus } from '../types/lock.types';

export interface LockGatedContentProps {
  // Lock state
  lockStatus?: LockStatus | null;
  isLoading?: boolean;
  isMultiTabConflict?: boolean;
  
  // Content  
  children: ReactNode;
  loadingMessage?: string;
  loadingSubMessage?: string;
  
  // Lock conflict handling
  onTransferLock?: () => Promise<void> | void;
  onGoBack?: () => void;
  
  // Display options
  showLoadingState?: boolean;
  showMultiTabConflict?: boolean;
  showLockedByOther?: boolean;
  hideContentWhenLocked?: boolean;
  
  // Custom messages
  multiTabTitle?: string;
  multiTabMessage?: string;
  lockedTitle?: string;
  lockedMessage?: string;
  
  className?: string;
}

export function LockGatedContent({
  lockStatus,
  isLoading = false,
  isMultiTabConflict = false,
  children,
  loadingMessage = 'Loading content...',
  loadingSubMessage = 'Checking for active editors...',
  onTransferLock,
  onGoBack,
  showLoadingState = true,
  showMultiTabConflict = true,
  showLockedByOther = true,
  hideContentWhenLocked = true,
  multiTabTitle = 'Multi-Tab Editing Conflict',
  multiTabMessage = 'You are already editing this content in another browser tab.',
  lockedTitle = 'Content Locked',
  lockedMessage,
  className = ''
}: LockGatedContentProps) {
  const [isTransferring, setIsTransferring] = React.useState(false);
  
  // Handle lock transfer
  const handleTransferLock = async () => {
    if (!onTransferLock) return;
    
    setIsTransferring(true);
    try {
      await onTransferLock();
    } finally {
      setIsTransferring(false);
    }
  };
  
  // Determine what to show based on state priority
  // Priority: Multi-tab conflict > Locked by other > Loading > Content
  
  // 1. Check for multi-tab conflict (highest priority)
  if (showMultiTabConflict && (isMultiTabConflict || lockStatus?.isMultiTabConflict)) {
    return (
      <div className={`h-full flex items-center justify-center bg-white ${className}`}>
        <div className="text-center max-w-md">
          <Lock className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{multiTabTitle}</h3>
          <p className="text-gray-600 mb-1">{multiTabMessage}</p>
          <p className="text-gray-500 text-sm mb-4">
            You can transfer the lock to this tab to continue editing here.
          </p>
          <div className="flex gap-3 justify-center">
            {onTransferLock && (
              <button
                onClick={handleTransferLock}
                disabled={isTransferring}
                className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTransferring ? 'Transferring...' : 'Set as Primary Window'}
              </button>
            )}
            {onGoBack && (
              <button
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
  
  // 2. Check if locked by another user
  if (showLockedByOther && lockStatus?.isLocked && !lockStatus?.hasLock && !lockStatus?.canEdit) {
    const lockedByName = lockStatus.lockedByName || lockStatus.lockedByEmail || 'Another user';
    const remainingMinutes = lockStatus.lockExpiresIn ? Math.ceil(lockStatus.lockExpiresIn / 60) : 0;
    const finalLockedMessage = lockedMessage || `This content is currently being edited by ${lockedByName}.`;
    
    if (hideContentWhenLocked) {
      return (
        <div className={`h-full flex items-center justify-center bg-white ${className}`}>
          <div className="text-center max-w-md">
            <Lock className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{lockedTitle}</h3>
            <p className="text-gray-600 mb-1">{finalLockedMessage}</p>
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
                onClick={onGoBack}
                className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Go Back
              </button>
            )}
          </div>
        </div>
      );
    }
  }
  
  // 3. Show loading state (only if not in conflict)
  if (showLoadingState && isLoading && !isMultiTabConflict && !lockStatus?.isMultiTabConflict) {
    return (
      <div className={`h-full flex items-center justify-center bg-white ${className}`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-teal-500" />
          <p className="text-gray-600 font-medium">{loadingMessage}</p>
          <p className="text-gray-400 text-sm mt-1">{loadingSubMessage}</p>
        </div>
      </div>
    );
  }
  
  // 4. Show content (default)
  return <>{children}</>;
}

// Convenience wrapper for section-specific content
export function SectionGatedContent({
  sectionName,
  ...props
}: LockGatedContentProps & { sectionName?: string }) {
  const formattedSectionName = sectionName ? 
    sectionName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') : 'section';
  
  return (
    <LockGatedContent
      loadingMessage={`Loading ${formattedSectionName} fields...`}
      multiTabMessage={`You are already editing this ${formattedSectionName.toLowerCase()} in another browser tab.`}
      lockedMessage={props.lockStatus?.lockedByName ? 
        `This ${formattedSectionName.toLowerCase()} is currently being edited by ${props.lockStatus.lockedByName}.` :
        undefined
      }
      {...props}
    />
  );
}