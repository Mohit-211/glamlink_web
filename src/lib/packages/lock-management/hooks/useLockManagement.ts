'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { tabManager } from '../services/TabManager';
import { useLockEndpoints, buildLockEndpointUrl } from '../contexts/LockConfigContext';
import { getLockCoordinator, LockCoordinator } from '../utils/lockCoordinator';
import { lockCoordinator } from '../services/LockCoordinator';

export interface LockHolder {
  userId: string;
  userName?: string;
  userEmail?: string;
  tabId?: string;
}

export interface LockInfo {
  lockedAt: string;
  lockExpiresAt: string;
  lockPath: string[];
  lockedTabId: string;
  lockGroup?: string;
}

export interface LockData {
  userId: string;
  info: LockInfo;
}

export interface LockStatus {
  status: 'locked' | 'unlocked' | 'expired' | 'loading' | 'error';
  holder?: LockHolder;
  expiresIn: number; // seconds remaining
  formattedTime: string; // "2:34" or "Expired"
  isMultiTab: boolean;
  canTransfer: boolean;
  hasLock: boolean; // Current user has the lock
  canEdit: boolean; // Current user can edit (has lock or no lock exists)
  lockGroup?: string;
}

export interface LockActions {
  acquire: (options?: { lockGroup?: string; tabName?: string }) => Promise<boolean>;
  release: () => Promise<void>;
  extend: (extendByMinutes?: number) => Promise<void>;
  transfer: (tabName?: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export interface UseLockManagementOptions {
  resourceId: string;
  collection: string;
  currentUserId?: string; // Current user ID for lock ownership detection
  lockGroup?: string;
  autoAcquire?: boolean;
  autoRefresh?: boolean;
  autoRelease?: boolean; // Auto-release lock on unmount or lock group change
  refreshInterval?: number; // milliseconds
  onLockAcquired?: (status: LockStatus) => void;
  onLockLost?: (reason: string) => void;
  onLockExtended?: (status: LockStatus) => void;
  onError?: (error: string) => void;
}

export interface UseLockManagementReturn {
  lock: LockStatus;
  actions: LockActions;
  isLoading: boolean;
  error: string | null;
}

/**
 * Comprehensive lock management hook that handles all timer logic, 
 * automatic refresh, and state management internally.
 * 
 * Usage:
 * ```typescript
 * const { lock, actions } = useLockManagement({
 *   resourceId: 'issue-123',
 *   collection: 'magazine_issues',
 *   lockGroup: 'metadata'
 * });
 * 
 * // All countdown timers, refresh intervals, and cleanup handled automatically!
 * ```
 */
export function useLockManagement({
  resourceId,
  collection,
  currentUserId,
  lockGroup,
  autoAcquire = false,
  autoRefresh = true,
  autoRelease, // Default will be set below based on autoAcquire
  refreshInterval = 30000, // 30 seconds
  onLockAcquired,
  onLockLost,
  onLockExtended,
  onError
}: UseLockManagementOptions): UseLockManagementReturn {
  
  console.log(`[useLockManagement] Hook initialized - resourceId: ${resourceId}, lockGroup: ${lockGroup}, autoAcquire: ${autoAcquire}`);
  
  // Get endpoints from context
  const endpoints = useLockEndpoints();
  
  // Default autoRelease to match autoAcquire behavior
  const shouldAutoRelease = autoRelease ?? autoAcquire;
  
  // Track previous lock group for change detection
  const previousLockGroupRef = useRef<string | undefined>(lockGroup);
  
  // Lock coordinator for managing handoffs
  const coordinatorRef = useRef<LockCoordinator | null>(null);
  
  // Track if we're in a transfer operation
  const isTransferringRef = useRef(false);
  
  // Debounce timers
  const acquireDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const refreshDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null); // For cancelling in-flight requests (not currently used)
  const lastLockGroupRef = useRef<string | undefined>(lockGroup); // Track last lock group to prevent unnecessary calls
  const isInitialLoadRef = useRef(true); // Track if this is the first load
  const isMountedRef = useRef(true); // Track if component is mounted
  
  const [lockStatus, setLockStatus] = useState<LockStatus>({
    status: 'loading',
    expiresIn: 0,
    formattedTime: '',
    isMultiTab: false,
    canTransfer: false,
    hasLock: false,
    canEdit: false
  });
  
  const [isLoading, setIsLoading] = useState(true); // Start with loading true for initial check
  const [error, setError] = useState<string | null>(null);
  
  // Timer refs for cleanup
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoExtendTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentUserRef = useRef<string | null>(currentUserId || null);
  
  // Update currentUserRef when currentUserId changes
  useEffect(() => {
    console.log(`[useLockManagement] Current user ID updated: ${currentUserId}`);
    currentUserRef.current = currentUserId || null;
  }, [currentUserId]);
  
  // Initialize coordinator (use singleton)
  useEffect(() => {
    if (typeof window !== 'undefined' && !coordinatorRef.current) {
      console.log(`[useLockManagement] Getting shared LockCoordinator singleton`);
      coordinatorRef.current = getLockCoordinator();
      if (resourceId && lockGroup) {
        coordinatorRef.current.registerComponent(resourceId, lockGroup);
      }
    }
    
    return () => {
      // Don't destroy the shared coordinator, just unregister this component
      if (coordinatorRef.current && resourceId) {
        console.log(`[useLockManagement] Unregistering component from coordinator`);
        coordinatorRef.current.unregisterComponent();
        coordinatorRef.current = null; // Clear the reference but don't destroy the singleton
      }
    };
  }, []);
  
  // Update coordinator when resource or lock group changes
  useEffect(() => {
    if (coordinatorRef.current && resourceId) {
      // Check if lock group actually changed
      const hasGroupChanged = lockCoordinator.hasLockGroupChanged(
        collection,
        lastLockGroupRef.current,
        lockGroup
      );
      
      if (hasGroupChanged) {
        console.log(`[useLockManagement] Lock group changed from ${lastLockGroupRef.current} to ${lockGroup}`);
        coordinatorRef.current.registerComponent(resourceId, lockGroup);
        lastLockGroupRef.current = lockGroup;
      } else {
        console.log(`[useLockManagement] Lock group unchanged (${lockGroup}), skipping registration`);
      }
    }
  }, [resourceId, lockGroup, collection]);
  
  // Format time remaining into human readable format
  const formatTime = useCallback((seconds: number): string => {
    if (seconds <= 0) return 'Expired';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Clear all timers
  const clearAllTimers = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    if (autoExtendTimerRef.current) {
      clearInterval(autoExtendTimerRef.current);
      autoExtendTimerRef.current = null;
    }
  }, []);

  // Update countdown timer
  const updateCountdown = useCallback((lockExpiresAt: string, currentUserId?: string, lockedBy?: string) => {
    const now = new Date().getTime();
    const expires = new Date(lockExpiresAt).getTime();
    const remaining = Math.max(0, Math.ceil((expires - now) / 1000));
    
    const formattedTime = formatTime(remaining);
    
    // Determine if this is the current user's lock
    const hasLock = lockedBy === currentUserId;
    
    setLockStatus(prev => ({
      ...prev,
      expiresIn: remaining,
      formattedTime,
      hasLock,
      canEdit: hasLock || !lockedBy, // Can edit if we have lock or no lock exists
      status: remaining === 0 ? 'expired' : (lockedBy ? 'locked' : 'unlocked')
    }));
    
    // If expired and we had the lock, trigger onLockLost
    if (remaining === 0 && hasLock) {
      onLockLost?.('Lock expired');
    }
  }, [formatTime, onLockLost]);

  // Start countdown timer
  const startCountdown = useCallback((lockExpiresAt: string, currentUserId?: string, lockedBy?: string) => {
    console.log(`[useLockManagement] Starting countdown timer - expires at: ${lockExpiresAt}, lockedBy: ${lockedBy}`);
    clearInterval(countdownTimerRef.current!);
    
    // Update immediately
    updateCountdown(lockExpiresAt, currentUserId, lockedBy);
    
    // Then update every second
    countdownTimerRef.current = setInterval(() => {
      updateCountdown(lockExpiresAt, currentUserId, lockedBy);
    }, 1000);
  }, [updateCountdown]);

  // Check lock status via GET endpoint with deduplication and abort support
  const checkLockStatus = useCallback(async (skipCache: boolean = false): Promise<LockStatus | null> => {
    console.log(`[useLockManagement] Checking lock status for resource: ${resourceId}, lockGroup: ${lockGroup}`);
    
    // Don't use abort controller for now - it's causing more problems than it solves
    // We'll rely on the LockCoordinator's deduplication instead
    
    // Mark that we've done the initial load
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
    }
    
    setIsLoading(true);
    try {
      // Use coordinator to deduplicate requests with lock group
      const data = await lockCoordinator.executeRequest(
        {
          resourceId,
          collection,
          action: 'status',
          lockGroup // Pass lock group for better caching
        },
        async () => {
          const endpoint = endpoints.status || endpoints.acquire;
          const url = buildLockEndpointUrl(endpoint, resourceId);
          console.log(`[useLockManagement] Checking lock status with URL: ${url}`, {
            endpoint,
            resourceId,
            collection,
            lockGroup
          });
          
          const response = await fetch(url, {
            method: 'GET',
            credentials: 'include'
            // Removed abort signal - causing issues with data loading
          });

          if (!response.ok) {
            throw new Error(`Failed to check lock status: ${response.status}`);
          }

          return response.json();
        }
      );

      if (data) {
        const currentTabId = tabManager.getTabId();
        
        console.log(`[useLockManagement] Server response:`, {
          lockedBy: data.lockedBy,
          lockedTabId: data.lockedTabId,
          hasLock: data.hasLock, // Server's opinion (wrong)
          lockExpiresAt: data.lockExpiresAt
        });
        
        if (data.lockedBy) {
          // Determine relationships
          const isOwnedByCurrentUser = data.lockedBy === currentUserRef.current;
          const isOwnedByCurrentTab = data.lockedTabId === currentTabId;
          const isMultiTab = isOwnedByCurrentUser && !isOwnedByCurrentTab;
          
          // Enhanced logging for debugging visibility issues
          console.log(`[useLockManagement] 🔍 Lock ownership analysis:`, {
            lockedBy: data.lockedBy,
            currentUser: currentUserRef.current,
            userMatch: isOwnedByCurrentUser ? '✅ SAME USER' : '❌ DIFFERENT USER',
            lockedTabId: data.lockedTabId?.slice(-8),
            currentTabId: currentTabId?.slice(-8),
            tabMatch: isOwnedByCurrentTab ? '✅ SAME TAB' : '❌ DIFFERENT TAB',
            isMultiTab: isMultiTab ? '⚠️ MULTI-TAB CONFLICT' : 'NO CONFLICT',
            willAllowEdit: (isOwnedByCurrentUser && isOwnedByCurrentTab) ? '✅ CAN EDIT' : '🚫 CANNOT EDIT'
          });
          
          const status: LockStatus = {
            status: 'locked',
            holder: {
              userId: data.lockedBy,
              userName: data.lockedByName,
              userEmail: data.lockedByEmail,
              tabId: data.lockedTabId
            },
            expiresIn: 0, // Will be calculated by countdown
            formattedTime: '',
            isMultiTab,
            canTransfer: isMultiTab,
            hasLock: isOwnedByCurrentUser && isOwnedByCurrentTab, // Only true if BOTH user AND tab match
            canEdit: isOwnedByCurrentUser && isOwnedByCurrentTab, // Only true if BOTH user AND tab match
            lockGroup: data.lockGroup
          };
          
          // Final decision logging
          console.log(`[useLockManagement] 🔐 Lock status result:`, {
            resourceId,
            canEdit: status.canEdit,
            hasLock: status.hasLock,
            isMultiTab: status.isMultiTab,
            finalDecision: status.canEdit ? '✅ USER CAN EDIT' : '🚫 USER CANNOT EDIT'
          });
          
          // Start countdown for this lock (even for multi-tab conflicts)
          if (data.lockExpiresAt) {
            console.log(`[useLockManagement] Lock detected - isMultiTab: ${isMultiTab}, hasLock: ${isOwnedByCurrentUser && isOwnedByCurrentTab}`);
            startCountdown(data.lockExpiresAt, currentUserRef.current || undefined, data.lockedBy);
          }
          
          return status;
        } else {
          // No lock exists
          console.log(`[useLockManagement] No lock exists for resource ${resourceId}`);
          return {
            status: 'unlocked',
            expiresIn: 0,
            formattedTime: '',
            isMultiTab: false,
            canTransfer: false,
            hasLock: false,
            canEdit: true
          };
        }
      }
      
      return null;
    } catch (err: any) {
      // Handle different error types
      const errorStr = typeof err === 'string' ? err : err?.message || '';
      
      // Check if this is an abort or unmounting error
      if (errorStr === 'Component unmounting' ||
          errorStr === 'New request started' ||
          errorStr.includes('abort') ||
          (err instanceof Error && err.name === 'AbortError')) {
        // Don't log or set error state for expected scenarios
        console.debug('[useLockManagement] Request cancelled (component unmounting or new request)');
        // Don't change lock status - preserve existing state
        return null;
      }
      
      // For real errors, log them
      const errorMessage = err instanceof Error ? err.message : (typeof err === 'string' ? err : 'Failed to check lock status');
      console.error('[useLockManagement] Error checking lock status:', errorMessage);
      setError(errorMessage);
      onError?.(errorMessage);
      
      // Only set unlocked state if we don't have any lock info yet
      if (lockStatus.status === 'loading') {
        setLockStatus({
          status: 'unlocked',
          expiresIn: 0,
          formattedTime: '',
          isMultiTab: false,
          canTransfer: false,
          hasLock: false,
          canEdit: true
        });
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [resourceId, lockGroup, endpoints, startCountdown, onError]);

  // Actions object
  const actions: LockActions = {
    acquire: useCallback(async (options = {}) => {
      const { lockGroup: requestLockGroup, tabName } = options;
      
      console.log(`[useLockManagement] Acquire lock requested - lockGroup: ${requestLockGroup || lockGroup}`);
      
      // Check if there's a pending handoff
      if (coordinatorRef.current && lockGroup) {
        const hasHandoff = coordinatorRef.current.checkForPendingHandoff(lockGroup);
        if (hasHandoff) {
          console.log(`[useLockManagement] Found pending handoff, inheriting lock state`);
          // Don't acquire, just refresh to get current state
          await actions.refresh();
          return true;
        }
      }
      
      // Debounce rapid acquire calls
      if (acquireDebounceRef.current) {
        console.log(`[useLockManagement] Acquire debounced, skipping`);
        return false;
      }
      
      acquireDebounceRef.current = setTimeout(() => {
        acquireDebounceRef.current = null;
      }, 500);
      
      setIsLoading(true);
      setError(null);
      
      try {
        const tabId = tabManager.getTabId();
        
        // First check current status
        const currentStatus = await checkLockStatus();
        if (currentStatus?.status === 'locked' && !currentStatus.hasLock) {
          // Already locked by someone else
          setLockStatus(currentStatus);
          return false;
        }
        
        // Try to acquire
        const url = buildLockEndpointUrl(endpoints.acquire, resourceId);
        console.log(`[useLockManagement] Acquiring lock with URL: ${url}`, {
          endpoint: endpoints.acquire,
          resourceId,
          collection,
          lockGroup: requestLockGroup || lockGroup
        });
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ 
            tabName, 
            tabId,
            lockGroup: requestLockGroup || lockGroup,
            collection // Include collection if provided
          })
        });

        if (response.ok) {
          const data = await response.json();
          
          console.log(`[useLockManagement] Lock acquired successfully`, data);
          
          const newStatus: LockStatus = {
            status: 'locked',
            holder: {
              userId: currentUserRef.current!,
              userName: data.lockedByName,
              userEmail: data.lockedByEmail,
              tabId: tabId
            },
            expiresIn: 0,
            formattedTime: '',
            isMultiTab: false,
            canTransfer: false,
            hasLock: true,
            canEdit: true,
            lockGroup: data.lockGroup
          };
          
          setLockStatus(newStatus);
          
          // Start countdown and auto-refresh
          if (data.lockExpiresAt) {
            startCountdown(data.lockExpiresAt, currentUserRef.current || undefined, currentUserRef.current || undefined);
          }
          
          // Set up auto-extend timer (refresh lock every 2 minutes)
          if (autoRefresh) {
            autoExtendTimerRef.current = setInterval(() => {
              actions.extend();
            }, 2 * 60 * 1000); // 2 minutes
          }
          
          onLockAcquired?.(newStatus);
          return true;
        } else {
          // Handle 409 conflicts
          const data = await response.json();
          if (data.lockedBy) {
            const conflictStatus = await checkLockStatus();
            if (conflictStatus) {
              setLockStatus(conflictStatus);
            }
          }
          return false;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to acquire lock';
        setError(errorMessage);
        onError?.(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    }, [resourceId, collection, lockGroup, endpoints, checkLockStatus, startCountdown, autoRefresh, onLockAcquired, onError]),

    release: useCallback(async () => {
      console.log(`[useLockManagement] Release lock requested - lockGroup: ${lockGroup}`);
      
      // Check if another component with same lock group is taking over
      if (coordinatorRef.current && lockGroup) {
        const hasOther = coordinatorRef.current.hasOtherComponentWithSameLockGroup(lockGroup);
        if (hasOther) {
          console.log(`[useLockManagement] Another component with same lock group exists, initiating handoff`);
          coordinatorRef.current.initiateLockHandoff(resourceId, lockGroup);
          // Don't actually release, let the other component take over
          return;
        }
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const url = buildLockEndpointUrl(endpoints.release, resourceId);
        const tabId = tabManager.getTabId();
        console.log(`[useLockManagement] Releasing lock with URL: ${url}`, {
          endpoint: endpoints.release,
          resourceId,
          collection,
          tabId
        });
        await fetch(url, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tabId })
        });
        
        // Clear all timers
        clearAllTimers();
        
        // Reset to unlocked state
        setLockStatus({
          status: 'unlocked',
          expiresIn: 0,
          formattedTime: '',
          isMultiTab: false,
          canTransfer: false,
          hasLock: false,
          canEdit: true
        });
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to release lock';
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }, [resourceId, endpoints, clearAllTimers, onError]),

    extend: useCallback(async (extendByMinutes = 5) => {
      try {
        const url = buildLockEndpointUrl(endpoints.extend, resourceId);
        const response = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ extendByMinutes })
        });

        if (response.ok) {
          const data = await response.json();
          
          // Update expiration time and restart countdown
          if (data.lockExpiresAt) {
            startCountdown(data.lockExpiresAt, currentUserRef.current || undefined, currentUserRef.current || undefined);
          }
          
          onLockExtended?.(lockStatus);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to extend lock';
        setError(errorMessage);
        onError?.(errorMessage);
      }
    }, [resourceId, endpoints, startCountdown, lockStatus, onLockExtended, onError]),

    transfer: useCallback(async (tabName) => {
      console.log(`[useLockManagement] Transfer lock requested to current tab`);
      
      // Set transfer flag to prevent auto-acquire from triggering
      isTransferringRef.current = true;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const tabId = tabManager.getTabId();
        console.log(`[useLockManagement] Current tab ID: ${tabId}`);
        
        const url = buildLockEndpointUrl(endpoints.transfer, resourceId);
        const response = await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ 
            newTabId: tabId, 
            forceTransfer: true 
          })
        });

        if (response.ok) {
          const data = await response.json();
          
          console.log(`[useLockManagement] Lock transferred successfully`, data);
          
          // Update to show we now have the lock
          setLockStatus(prev => ({
            ...prev,
            hasLock: true,
            canEdit: true,
            isMultiTab: false,
            canTransfer: false,
            holder: {
              ...prev.holder!,
              tabId: tabId
            }
          }));
          
          // Restart countdown with new expiration
          if (data.lockExpiresAt) {
            startCountdown(data.lockExpiresAt, currentUserRef.current || undefined, currentUserRef.current || undefined);
          }
          
          // Clear transfer flag after a delay
          setTimeout(() => {
            isTransferringRef.current = false;
          }, 1000);
          
          return true;
        }
        
        return false;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to transfer lock';
        setError(errorMessage);
        onError?.(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    }, [resourceId, endpoints, startCountdown, onError]),

    refresh: useCallback(async () => {
      // Debounce rapid refresh calls
      if (refreshDebounceRef.current) {
        console.log(`[useLockManagement] Refresh debounced, skipping`);
        return;
      }
      
      refreshDebounceRef.current = setTimeout(() => {
        refreshDebounceRef.current = null;
      }, 1000);
      
      console.log(`[useLockManagement] Refreshing lock status`);
      const status = await checkLockStatus();
      if (status) {
        setLockStatus(status);
      }
    }, [checkLockStatus])
  };

  // Set up periodic refresh
  useEffect(() => {
    if (autoRefresh && resourceId) {
      refreshTimerRef.current = setInterval(() => {
        actions.refresh();
      }, refreshInterval);

      return () => {
        if (refreshTimerRef.current) {
          clearInterval(refreshTimerRef.current);
        }
      };
    }
  }, [autoRefresh, resourceId, refreshInterval, actions.refresh]);

  // Initial status check
  useEffect(() => {
    if (resourceId) {
      actions.refresh();
    }
  }, [resourceId]);

  // Auto-acquire lock if requested
  useEffect(() => {
    // Don't auto-acquire if we're in a transfer operation
    if (isTransferringRef.current) {
      console.log(`[useLockManagement] Skipping auto-acquire during transfer`);
      return;
    }
    
    if (autoAcquire && lockStatus.status === 'unlocked') {
      console.log(`[useLockManagement] Auto-acquiring lock - tabId: ${tabManager.getTabId()}`);
      actions.acquire();
    }
  }, [autoAcquire, lockStatus.status]);

  // Auto-release on lock group change
  useEffect(() => {
    const previousLockGroup = previousLockGroupRef.current;
    
    if (shouldAutoRelease && 
        previousLockGroup && 
        previousLockGroup !== lockGroup && 
        lockStatus.hasLock) {
      console.debug(`Lock group changed from "${previousLockGroup}" to "${lockGroup}", releasing lock`);
      actions.release().catch(err => {
        console.debug('Lock auto-release on group change failed:', err);
      });
    }
    
    // Update the ref with the current lock group
    previousLockGroupRef.current = lockGroup;
  }, [shouldAutoRelease, lockGroup, lockStatus.hasLock, actions]);

  // Track mounted status
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // Cleanup on unmount with smart auto-release
  useEffect(() => {
    return () => {
      console.log(`[useLockManagement] Component unmounting - hasLock: ${lockStatus.hasLock}, shouldAutoRelease: ${shouldAutoRelease}`);
      isMountedRef.current = false;
      
      clearAllTimers();
      
      // Clear debounce timers
      if (acquireDebounceRef.current) {
        clearTimeout(acquireDebounceRef.current);
      }
      if (refreshDebounceRef.current) {
        clearTimeout(refreshDebounceRef.current);
      }
      
      // We're not using abort controllers anymore to avoid issues
      // The LockCoordinator handles deduplication for us
      
      // Auto-release lock if enabled and user has the lock
      if (shouldAutoRelease && lockStatus.hasLock) {
        console.log('[useLockManagement] Checking for lock handoff before auto-release');
        
        // Check if another component with same lock group is taking over
        if (coordinatorRef.current && lockGroup) {
          const hasOther = coordinatorRef.current.hasOtherComponentWithSameLockGroup(lockGroup);
          if (hasOther) {
            console.log('[useLockManagement] Another component with same lock group exists, initiating handoff instead of release');
            coordinatorRef.current.initiateLockHandoff(resourceId, lockGroup);
            return; // Don't release
          }
        }
        
        // Verify this tab actually owns the lock before releasing
        const currentTabId = tabManager.getTabId();
        const holderTabId = lockStatus.holder?.tabId;
        
        if (holderTabId && holderTabId !== currentTabId) {
          console.log('[useLockManagement] Current tab does not own the lock, skipping auto-release');
          return; // Don't release lock owned by another tab
        }
        
        console.log('[useLockManagement] No handoff needed, auto-releasing lock');
        // Use a fire-and-forget approach to avoid cleanup issues
        actions.release().catch(err => {
          console.log('[useLockManagement] Lock auto-release on unmount failed:', err);
        });
      }
    };
  }, [shouldAutoRelease, lockStatus.hasLock, lockStatus.holder, clearAllTimers, lockGroup, resourceId]);

  return {
    lock: lockStatus,
    actions,
    isLoading,
    error
  };
}

// Export helper function to set current user
export function setCurrentUser(userId: string) {
  // This is a temporary solution - ideally this would come from auth context
  (global as any).__lockManagementCurrentUser = userId;
}