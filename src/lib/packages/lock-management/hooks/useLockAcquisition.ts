'use client';

import { useState, useEffect, useRef } from 'react';
import { checkLockStatus } from '../utils/checkLockStatus';
import { acquireLock } from '../utils/acquireLock';
import { releaseLock } from '../utils/releaseLock';
import { lockStore } from '../store/lockStore';
import { tabManager } from '../services/TabManager';

/**
 * Simple function to get lock data directly from API
 */
async function getAPIData(resourceId: string | undefined, endpoint: string) {
  if (!resourceId) return;
  const tabId = tabManager.getTabId();
  const url = endpoint.replace('{resourceId}', resourceId);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Tab-Id': tabId
    },
    credentials: 'include'
  });
  
  return await response.json();
}

/**
 * Unified hook for lock acquisition and management
 * Handles the complete lock lifecycle: check → acquire → release
 * 
 * @param resourceId - The ID of the resource to lock
 * @param collection - The collection name (e.g., 'magazine_issues', 'magazine_sections')
 * @param endpoint - The lock API endpoint to use
 * @returns Object containing lockInfo and loading state
 */
export function useLockAcquisition(
  resourceId: string | undefined,
  collection: string,
  endpoint: string
) {
  /*
  // Initialize state from lock store
  const cached = lockStore.get(resourceId, collection);
  const [lockInfo, setLockInfo] = useState<any>(cached?.lockInfo || null);
  const [isLoading, setIsLoading] = useState(!cached?.lockInfo);

  // Subscribe to lock store changes
  useEffect(() => {
    if (!resourceId) return;
    
    const cacheKey = lockStore.getCacheKey(resourceId, collection);
    const unsubscribe = lockStore.subscribe(cacheKey, () => {
      const stored = lockStore.get(resourceId, collection);
      if (stored) {
        console.log(`🔐 [useLockAcquisition] Lock store updated for ${cacheKey}`);
        setLockInfo(stored.lockInfo);
        setIsLoading(false);
      }
    });
    
    return unsubscribe;
  }, [resourceId, collection]);

  useEffect(() => {
    let mounted = true;

    const initializeLock = async () => {
      console.log(`🔐 [useLockAcquisition] Starting lock acquisition for:`, {
        resourceId,
        collection,
        endpoint
      });

      // Skip if no resource ID or component unmounted
      if (!resourceId || !mounted) {
        console.log(`🔐 [useLockAcquisition] Skipping - no resourceId or unmounted`);
        setIsLoading(false);
        return;
      }

      // Special case: skip locks for new issues
      if (resourceId === 'new') {
        console.log(`🔐 [useLockAcquisition] Skipping - new resource (no lock needed)`);
        setIsLoading(false);
        return;
      }
      
      // Check if we already have lock in store
      const cached = lockStore.get(resourceId, collection);
      if (cached?.lockInfo && (cached.hasLock || cached.lockInfo.canEdit)) {
        console.log(`🔐 [useLockAcquisition] Using cached lock from store:`, {
          hasLock: cached.hasLock,
          canEdit: cached.lockInfo.canEdit
        });
        setLockInfo(cached.lockInfo);
        setIsLoading(false);
        return;
      }

      try {
        // Step 1: Check current lock status
        console.log(`🔐 [useLockAcquisition] Step 1: Checking lock status...`);
        const status = await checkLockStatus(resourceId, collection, endpoint);
        console.log(`🔐 [useLockAcquisition] Lock status received:`, status);
        
        if (!mounted) {
          console.log(`🔐 [useLockAcquisition] Component unmounted, aborting`);
          return;
        }

        // Step 2: Handle based on lock status
        if (!status?.isLocked) {
          // Resource not locked - acquire it
          console.log(`🔐 [useLockAcquisition] Step 2: Resource not locked, acquiring lock...`);
          const acquired = await acquireLock(resourceId, collection, endpoint);
          console.log(`🔐 [useLockAcquisition] Lock acquisition result:`, acquired);
          
          if (!mounted) {
            console.log(`🔐 [useLockAcquisition] Component unmounted, aborting`);
            return;
          }
          
          if (acquired) {
            console.log(`🔐 [useLockAcquisition] Step 3: Lock acquired! Re-checking status...`);
            // Re-check status to get updated lock info
            const newStatus = await checkLockStatus(resourceId, collection, endpoint);
            console.log(`🔐 [useLockAcquisition] Updated lock status:`, newStatus);
            if (mounted) {
              // Store in lock store
              const lockData = { ...newStatus, hasLock: true, canEdit: true };
              lockStore.set(resourceId, collection, lockData, true, true);
              setLockInfo(lockData);
            }
          } else {
            console.log(`🔐 [useLockAcquisition] Failed to acquire lock`);
            // Failed to acquire, set status as is
            setLockInfo(status);
            setHasLock(false);
          }
        } else if (status?.canEdit) {
          // We already have the lock (possibly from another tab)
          console.log(`🔐 [useLockAcquisition] Resource already locked by current user (canEdit: true)`);
          console.log(`🔐 [useLockAcquisition] Lock details:`, {
            lockedBy: status.lockedBy,
            lockedByName: status.lockedByName,
            currentUserId: status.currentUserId,
            lockedTabId: status.lockedTabId,
            currentTabId: status.currentTabId,
            isMultiTab: status.lockedBy === status.currentUserId && status.lockedTabId !== status.currentTabId
          });
          
          // Store in lock store as we have the lock
          const lockData = { ...status, hasLock: true };
          lockStore.set(resourceId, collection, lockData, true, true);
          setLockInfo(lockData);
        } else {
          // Locked by another user
          console.log(`🔐 [useLockAcquisition] Resource locked by another user:`, {
            lockedBy: status.lockedBy,
            lockedByName: status.lockedByName,
            canEdit: status.canEdit
          });
          // Store in lock store but mark as not having lock
          lockStore.set(resourceId, collection, status, false, false);
          setLockInfo(status);
        }
      } catch (error) {
        console.error(`🔐 [useLockAcquisition] Error initializing lock:`, error);
        if (mounted) {
          setLockInfo(null);
        }
      } finally {
        if (mounted) {
          console.log(`🔐 [useLockAcquisition] Lock initialization complete, setting loading to false`);
          const finalState = lockStore.get(resourceId, collection);
          console.log(`🔐 [useLockAcquisition] Final state from store:`, {
            hasLock: finalState?.hasLock,
            canEdit: finalState?.lockInfo?.canEdit,
            isLocked: finalState?.lockInfo?.isLocked
          });
          setIsLoading(false);
        }
      }
    };

    initializeLock();

    // Cleanup: Release lock on unmount if we have it
    return () => {
      mounted = false;
      
      // Check store to see if we should release
      const stored = lockStore.get(resourceId, collection);
      if (resourceId && stored?.shouldRelease) {
        console.log(`🔐 [useLockAcquisition] Component unmounting, releasing lock for:`, resourceId);
        // Clear from store and release
        lockStore.clear(resourceId, collection);
        // Fire and forget - don't await
        releaseLock(resourceId, collection, endpoint).catch(err => {
          console.error(`🔐 [useLockAcquisition] Error releasing lock on unmount:`, err);
        });
      } else {
        console.log(`🔐 [useLockAcquisition] Component unmounting, keeping lock in store for remount`);
      }
    };
  }, [resourceId, collection, endpoint]);
  */
  
  // State to store the API result
  const [lockInfo, setLockInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  
  // Track if we need to release lock on unmount
  const shouldReleaseRef = useRef(false);
  const resourceIdRef = useRef(resourceId);
  const collectionRef = useRef(collection);
  const endpointRef = useRef(endpoint);
  
  // Update refs when props change
  resourceIdRef.current = resourceId;
  collectionRef.current = collection;
  endpointRef.current = endpoint;
  
  // Reset fetch state when resourceId changes
  useEffect(() => {
    console.log('🔐 Resource ID changed to:', resourceId);
    // Reset state for new resource
    setHasFetched(false);
    setLockInfo(null);
    setIsLoading(true);
    // Don't reset shouldReleaseRef here - that's handled by cleanup
  }, [resourceId, collection, endpoint]);
  
  // Direct API call flow without useEffect
  if (resourceId && resourceId !== 'new' && endpoint && !hasFetched) {
    setHasFetched(true);
    
    // Step 1: Check current lock status
    getAPIData(resourceId, endpoint).then(async (result) => {
      console.log('🔐 Step 1 - Check lock status:', result);
      
      if (!result) {
        setLockInfo(null);
        setIsLoading(false);
        return;
      }
      
      // Check for multi-tab conflict FIRST
      const isMultiTabConflict = 
        result.isLocked && 
        result.lockedBy === result.currentUserId && 
        result.lockedTabId && 
        result.currentTabId &&
        result.lockedTabId !== result.currentTabId;
      
      if (isMultiTabConflict) {
        // Override server's canEdit - we can't edit from a different tab!
        console.log('🔐 Multi-tab conflict detected!', {
          lockedTabId: result.lockedTabId,
          currentTabId: result.currentTabId
        });
        
        // Set lock info with conflict flags
        setLockInfo({
          ...result,
          canEdit: false,  // Override to false
          hasLock: false,  // We don't have the lock
          isMultiTabConflict: true,
          allowTransfer: true
        });
        setIsLoading(false);
        return;
      }
      
      // Step 2: If no lock exists and we can edit, acquire it
      if (!result.isLocked && result.canEdit) {
        console.log('🔐 Step 2 - No lock exists, acquiring...');
        
        const acquired = await acquireLock(resourceId, collection, endpoint);
        console.log('🔐 Step 3 - Lock acquisition result:', acquired);
        
        if (acquired) {
          // Mark that we acquired the lock and should release it
          shouldReleaseRef.current = true;
          
          // Step 4: Get updated lock status after acquisition
          const updatedStatus = await getAPIData(resourceId, endpoint);
          console.log('🔐 Step 4 - Updated lock status after acquisition:', updatedStatus);
          
          // Set the final lock info with hasLock: true
          setLockInfo({
            ...updatedStatus,
            hasLock: true,
            canEdit: true
          });
        } else {
          // Failed to acquire lock
          console.log('🔐 Failed to acquire lock');
          setLockInfo(result);
        }
      } else if (result.canEdit && result.lockedTabId === result.currentTabId) {
        // We already have the lock in THIS tab
        console.log('🔐 Already have lock in this tab (canEdit: true, same tab)');
        setLockInfo({
          ...result,
          hasLock: true
        });
        // We might want to release if we're the ones who locked it
        shouldReleaseRef.current = true;
      } else if (result.canEdit) {
        // Server says we can edit but let's double-check tab IDs
        // This shouldn't happen if our multi-tab check above is working
        console.log('🔐 Unexpected state - canEdit but different scenario');
        setLockInfo(result);
      } else {
        // Locked by another user
        console.log('🔐 Locked by another user:', result.lockedByName);
        setLockInfo(result);
      }
      
      setIsLoading(false);
    }).catch(error => {
      console.error('🔐 Error in lock acquisition flow:', error);
      setLockInfo(null);
      setIsLoading(false);
    });
  } else if (resourceId === 'new') {
    // Special case for new issues - no lock needed
    setIsLoading(false);
  }
  
  // Cleanup: Release lock on unmount if we acquired it
  useEffect(() => {
    return () => {
      // Only release if we acquired the lock in this component instance
      if (shouldReleaseRef.current && resourceIdRef.current && resourceIdRef.current !== 'new') {
        console.log('🔐 Component unmounting, releasing lock for:', resourceIdRef.current);
        // Fire and forget - don't await
        releaseLock(
          resourceIdRef.current, 
          collectionRef.current, 
          false, 
          endpointRef.current
        ).catch(err => {
          console.error('🔐 Error releasing lock on unmount:', err);
        });
      }
    };
  }, []); // Empty deps - only run on unmount

  // Function to transfer lock to current tab
  const transferLock = async () => {
    if (!resourceId || resourceId === 'new' || !endpoint) {
      console.error('🔐 Cannot transfer lock: missing required parameters');
      return false;
    }
    
    console.log('🔐 Transferring lock to current tab...');
    setIsLoading(true);
    
    try {
      const tabId = tabManager.getTabId();
      const url = endpoint.replace('{resourceId}', resourceId);
      
      // Call PATCH endpoint to transfer lock
      const response = await fetch(url, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'X-Tab-Id': tabId
        },
        credentials: 'include',
        body: JSON.stringify({ 
          collection,
          newTabId: tabId,
          forceTransfer: true
        })
      });
      
      if (response.ok) {
        console.log('🔐 Lock transfer successful, fetching updated status...');
        
        // Mark that we now have the lock and should release it
        shouldReleaseRef.current = true;
        
        // Get updated lock status
        const updatedStatus = await getAPIData(resourceId, endpoint);
        console.log('🔐 Updated status after transfer:', updatedStatus);
        
        // Update lock info with new status
        setLockInfo({
          ...updatedStatus,
          hasLock: true,
          canEdit: true,
          isMultiTabConflict: false // Clear conflict flag
        });
        
        setIsLoading(false);
        return true;
      } else {
        console.error('🔐 Lock transfer failed:', response.status);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('🔐 Error transferring lock:', error);
      setIsLoading(false);
      return false;
    }
  };

  return {
    lockInfo,
    isLoading,
    // hasLock is true when we have canEdit permission
    hasLock: lockInfo?.hasLock || lockInfo?.canEdit || false,
    // Expose these for components that need manual control
    checkingLock: isLoading,
    setCheckingLock: setIsLoading,
    // New: expose transfer function
    transferLock
  };
}