'use client';

/**
 * useMultiTabDetection Hook - Multi-Tab Conflict Detection
 * 
 * Hook for detecting when the same resource is being edited in multiple tabs.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { tabManager } from '../services/TabManager';

interface EditingResource {
  resourceId: string;
  collection: string;
  section?: string;
  lockGroup?: string;
  timestamp: number;
}

export interface MultiTabStatus {
  isOtherTabEditing: boolean;
  conflictingTabId?: string;
  conflictingSection?: string;
  conflictingSince?: Date;
  canContinue: boolean;
}

export interface UseMultiTabDetectionOptions {
  resourceId: string;
  collection: string;
  section?: string;
  lockGroup?: string;
  checkInterval?: number; // milliseconds
  onConflictDetected?: (status: MultiTabStatus) => void;
  onConflictResolved?: () => void;
}

export interface UseMultiTabDetectionReturn {
  tabStatus: MultiTabStatus;
  currentTabId: string;
  setAsEditing: () => void;
  clearEditing: () => void;
  forceOverride: () => void;
  refreshCheck: () => void;
}

export function useMultiTabDetection(options: UseMultiTabDetectionOptions): UseMultiTabDetectionReturn {
  const {
    resourceId,
    collection,
    section,
    lockGroup,
    checkInterval = 5000, // 5 seconds
    onConflictDetected,
    onConflictResolved
  } = options;

  const [tabStatus, setTabStatus] = useState<MultiTabStatus>({
    isOtherTabEditing: false,
    canContinue: true
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentTabId = tabManager.getTabId();
  const lastConflictState = useRef<boolean>(false);

  const checkForConflicts = useCallback(() => {
    if (!resourceId || !collection) return;

    const result = tabManager.isOtherTabEditing(resourceId, collection, section, lockGroup);
    
    const firstConflict = result.conflictingTabs[0];
    const newStatus: MultiTabStatus = {
      isOtherTabEditing: result.isEditing,
      conflictingTabId: firstConflict?.tabId,
      conflictingSection: firstConflict?.editingSection || undefined,
      conflictingSince: firstConflict?.lastActivity ? new Date(firstConflict.lastActivity) : undefined,
      canContinue: !result.isEditing
    };

    setTabStatus(newStatus);

    // Trigger callbacks on state changes
    if (result.isEditing && !lastConflictState.current) {
      onConflictDetected?.(newStatus);
    } else if (!result.isEditing && lastConflictState.current) {
      onConflictResolved?.();
    }

    lastConflictState.current = result.isEditing;
  }, [resourceId, collection, section, lockGroup, onConflictDetected, onConflictResolved]);

  const setAsEditing = useCallback(() => {
    if (!resourceId || !collection) return;

    tabManager.setEditingResource(resourceId, collection, section, lockGroup);
    checkForConflicts();
  }, [resourceId, collection, section, lockGroup, checkForConflicts]);

  const clearEditing = useCallback(() => {
    tabManager.clearEditingResource();
    setTabStatus({
      isOtherTabEditing: false,
      canContinue: true
    });
  }, []);

  const forceOverride = useCallback(() => {
    if (!resourceId || !collection) return;

    // Override by taking control
    tabManager.setEditingResource(resourceId, collection, section, lockGroup);
    
    // Clear the conflict status
    setTabStatus({
      isOtherTabEditing: false,
      canContinue: true
    });
    
    onConflictResolved?.();
  }, [resourceId, collection, section, lockGroup, onConflictResolved]);

  const refreshCheck = useCallback(() => {
    checkForConflicts();
  }, [checkForConflicts]);

  // Start periodic checking
  useEffect(() => {
    if (resourceId && collection) {
      checkForConflicts(); // Initial check
      
      intervalRef.current = setInterval(checkForConflicts, checkInterval);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [resourceId, collection, checkInterval, checkForConflicts]);

  // Handle storage events for cross-tab communication
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'tabEditing' || event.key?.startsWith('tabEditing_')) {
        checkForConflicts();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkForConflicts]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForConflicts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkForConflicts]);

  // Handle beforeunload to clean up
  useEffect(() => {
    const handleBeforeUnload = () => {
      clearEditing();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [clearEditing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      clearEditing();
    };
  }, [clearEditing]);

  return {
    tabStatus,
    currentTabId,
    setAsEditing,
    clearEditing,
    forceOverride,
    refreshCheck
  };
}