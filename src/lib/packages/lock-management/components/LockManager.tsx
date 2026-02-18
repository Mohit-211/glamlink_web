'use client';

import React, { createContext, useContext } from 'react';
import { useLockManagement, LockStatus, LockActions, UseLockManagementOptions } from '../hooks/useLockManagement';
import { Lock, Clock, User, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';

// Context for sharing lock state with child components
interface LockManagerContextType {
  lock: LockStatus;
  actions: LockActions;
  isLoading: boolean;
  error: string | null;
}

const LockManagerContext = createContext<LockManagerContextType | null>(null);

// Hook to access lock context in child components
export function useLockContext() {
  const context = useContext(LockManagerContext);
  if (!context) {
    throw new Error('useLockContext must be used within a LockManager component');
  }
  return context;
}

// Loading indicator component
interface LoadingIndicatorProps {
  message?: string;
  className?: string;
}

function LoadingIndicator({ 
  message = "Verifying content can be updated", 
  className = "" 
}: LoadingIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md ${className}`}>
      <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
      <span className="text-sm text-gray-600">{message}</span>
    </div>
  );
}

// Render prop pattern for lock management
interface LockManagerProps extends Omit<UseLockManagementOptions, 'onLockAcquired' | 'onLockLost' | 'onLockExtended' | 'onError'> {
  children: (lockState: LockManagerContextType) => React.ReactNode;
  onLockAcquired?: (status: LockStatus) => void;
  onLockLost?: (reason: string) => void;
  onLockExtended?: (status: LockStatus) => void;
  onError?: (error: string) => void;
  className?: string;
  loadingMessage?: string; // Custom loading message
  showLoadingIndicator?: boolean; // Whether to show loading indicator (default: true)
}

/**
 * LockManager - Wrapper component that provides lock management to children
 * 
 * Usage:
 * ```tsx
 * <LockManager 
 *   resourceId="issue-123"
 *   collection="magazine_issues"
 *   lockGroup="metadata"
 * >
 *   {({ lock, actions, isLoading }) => (
 *     <div>
 *       {!lock.canEdit && <LockIndicator lock={lock} />}
 *       <YourEditForm disabled={!lock.canEdit} />
 *       <button onClick={actions.acquire}>Edit</button>
 *     </div>
 *   )}
 * </LockManager>
 * ```
 */
export function LockManager({
  children,
  className = '',
  loadingMessage = "Verifying content can be updated",
  showLoadingIndicator = true,
  onLockAcquired,
  onLockLost,
  onLockExtended,
  onError,
  ...lockOptions
}: LockManagerProps) {
  const { lock, actions, isLoading, error } = useLockManagement({
    ...lockOptions,
    onLockAcquired,
    onLockLost,
    onLockExtended,
    onError
  });

  const contextValue: LockManagerContextType = {
    lock,
    actions,
    isLoading,
    error
  };

  // Check if we're in initial loading state
  const isInitialLoading = lock.status === 'loading' || (isLoading && !lock.holder && !lock.hasLock);

  return (
    <LockManagerContext.Provider value={contextValue}>
      <div className={`lock-manager ${className}`}>
        {/* Show loading indicator during initial load if enabled */}
        {showLoadingIndicator && isInitialLoading ? (
          <LoadingIndicator message={loadingMessage} />
        ) : (
          children(contextValue)
        )}
      </div>
    </LockManagerContext.Provider>
  );
}

// Pre-built lock indicator component
interface LockIndicatorProps {
  lock: LockStatus;
  showDetails?: boolean;
  showCountdown?: boolean;
  onTransfer?: () => void;
  onRequestRelease?: () => void;
  className?: string;
  customMessage?: string; // Allow custom message override
}

export function LockIndicator({
  lock,
  showDetails = true,
  showCountdown = true,
  onTransfer,
  onRequestRelease,
  className = '',
  customMessage
}: LockIndicatorProps) {
  // Always show indicator if explicitly passed, even if canEdit is true
  // The parent component decides when to show it
  if (!lock || (!lock.holder && !lock.isMultiTab && !lock.status)) {
    return null;
  }

  // Use yellow theme to match IssueEditForm styling
  const getStatusColor = () => {
    return 'bg-yellow-50 border-yellow-200';
  };

  const getStatusIcon = () => {
    return <Lock className="h-4 w-4 text-yellow-600" />;
  };

  const getMessage = () => {
    if (customMessage) return customMessage;
    
    if (lock.isMultiTab) {
      return 'You are editing this section in another tab';
    }
    
    const userName = lock.holder?.userName || lock.holder?.userEmail || 'another user';
    return `This section is being edited by ${userName}`;
  };

  return (
    <div className={`mb-4 p-3 ${getStatusColor()} rounded ${className}`}>
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <div className="flex-1">
          <span className="text-sm text-yellow-700">
            {getMessage()}
          </span>
          
          {/* Countdown timer */}
          {showCountdown && lock.expiresIn > 0 && lock.formattedTime && (
            <div className="text-xs text-yellow-600 mt-1">
              Lock expires in {lock.formattedTime}
            </div>
          )}
        </div>
        
        {/* Transfer button */}
        {lock.canTransfer && onTransfer && (
          <button
            type="button"
            onClick={onTransfer}
            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200"
          >
            Take Control
          </button>
        )}
      </div>
    </div>
  );
}

// Pre-built edit wrapper component
interface EditableContentProps {
  resourceId: string;
  collection: string;
  lockGroup?: string;
  children: React.ReactNode;
  lockedContent?: React.ReactNode;
  autoAcquire?: boolean;
  autoRelease?: boolean; // Auto-release lock on unmount or lock group change
  className?: string;
}

/**
 * EditableContent - Wrapper that automatically handles lock acquisition
 * 
 * Usage:
 * ```tsx
 * <EditableContent
 *   resourceId="issue-123"
 *   collection="magazine_issues"
 *   autoAcquire={true}
 * >
 *   <YourEditForm />
 * </EditableContent>
 * ```
 */
export function EditableContent({
  resourceId,
  collection,
  lockGroup,
  children,
  lockedContent,
  autoAcquire = false,
  autoRelease,
  className = ''
}: EditableContentProps) {
  return (
    <LockManager
      resourceId={resourceId}
      collection={collection}
      lockGroup={lockGroup}
      autoAcquire={autoAcquire}
      autoRelease={autoRelease}
      className={className}
    >
      {({ lock, actions, isLoading }) => (
        <div className="relative">
          {/* Lock overlay */}
          {!lock.canEdit && (
            <div className="mb-4">
              <LockIndicator
                lock={lock}
                onTransfer={() => actions.transfer()}
                onRequestRelease={() => {
                  // Could implement a request system here
                  console.log('Release requested');
                }}
              />
            </div>
          )}

          {/* Content */}
          {lock.canEdit ? (
            <div>
              {children}
            </div>
          ) : (
            <div className="opacity-50 pointer-events-none">
              {lockedContent || children}
            </div>
          )}

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Updating lock...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </LockManager>
  );
}

// Lock status display component (for debugging/admin)
interface LockStatusDisplayProps {
  lock: LockStatus;
  className?: string;
}

export function LockStatusDisplay({ lock, className = '' }: LockStatusDisplayProps) {
  return (
    <div className={`p-4 bg-gray-50 rounded-lg text-sm space-y-2 ${className}`}>
      <div className="font-medium">Lock Status Debug</div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>Status: <code>{lock.status}</code></div>
        <div>Can Edit: <code>{lock.canEdit.toString()}</code></div>
        <div>Has Lock: <code>{lock.hasLock.toString()}</code></div>
        <div>Multi-tab: <code>{lock.isMultiTab.toString()}</code></div>
        <div>Can Transfer: <code>{lock.canTransfer.toString()}</code></div>
        <div>Expires In: <code>{lock.expiresIn}s</code></div>
        {lock.holder && (
          <>
            <div className="col-span-2">
              Holder: <code>{lock.holder.userName || lock.holder.userEmail}</code>
            </div>
            <div className="col-span-2">
              Tab: <code>{lock.holder.tabId?.slice(-4)}</code>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Export the hook for direct use when needed
export { useLockManagement };