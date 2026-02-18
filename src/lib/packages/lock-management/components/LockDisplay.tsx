'use client';

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Lock, Unlock, Clock, Loader2 } from 'lucide-react';
import { checkLockStatus } from '../utils/checkLockStatus';

export interface LockDisplayProps {
  resourceId: string;
  collection?: string;
  endpoint?: string;
  refreshTrigger?: number;
  className?: string;
  lockInfo?: any; // Optional: if provided, use this instead of fetching
}

export interface LockDisplayRef {
  setLoading: (loading: boolean) => void;
  refresh: () => void;
}

export const LockDisplay = forwardRef<LockDisplayRef, LockDisplayProps>(({ 
  resourceId, 
  collection = 'magazine_sections',
  endpoint,
  refreshTrigger,
  className = '',
  lockInfo: providedLockInfo
}, ref) => {
  const [lockInfo, setLockInfo] = useState<any>(providedLockInfo || null);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchLockStatus = async () => {
    // Skip fetching if lockInfo is provided as prop
    if (providedLockInfo || !resourceId) return;
    
    setIsLoading(true);
    try {
      const status = await checkLockStatus(resourceId, collection, endpoint);
      setLockInfo(status);
    } catch (error) {
      console.error('Failed to fetch lock status:', error);
      setLockInfo(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  useImperativeHandle(ref, () => ({
    setLoading: (loading: boolean) => setIsLoading(loading),
    refresh: () => fetchLockStatus()
  }));
  
  // Update local state when provided lockInfo changes
  useEffect(() => {
    if (providedLockInfo) {
      setLockInfo(providedLockInfo);
    }
  }, [providedLockInfo]);
  
  useEffect(() => {
    // Only fetch if no lockInfo is provided
    if (!providedLockInfo) {
      fetchLockStatus();
    }
  }, [resourceId, refreshTrigger, providedLockInfo]);
  
  if (isLoading) {
    return (
      <div className={`flex items-center gap-1 text-xs text-gray-500 ${className}`}>
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Checking...</span>
      </div>
    );
  }
  
  // Check lock status
  const isLocked = lockInfo?.isLocked;
  const hasLock = lockInfo?.hasLock;
  
  // First check if there's actually a lock
  if (!isLocked) {
    // No lock exists - resource is available
    return (
      <div className={`flex items-center gap-1 text-xs text-green-600 ${className}`}>
        <Unlock className="w-3 h-3" />
        <span>Available</span>
      </div>
    );
  }
  
  // Lock exists - check who has it
  if (hasLock) {
    // Current user has the lock
    return (
      <div className={`flex items-center gap-1 text-xs text-green-600 ${className}`}>
        <Lock className="w-3 h-3" />
        <span>Locked by you</span>
      </div>
    );
  }
  
  // Locked by another user
  const remainingMinutes = lockInfo.lockExpiresIn ? Math.ceil(lockInfo.lockExpiresIn / 60) : 0;
  const lockedByName = lockInfo.lockedByName || lockInfo.lockedByEmail || 'Someone';
  
  return (
    <div className={`flex items-center gap-1 text-xs text-orange-600 ${className}`}>
      <Lock className="w-3 h-3" />
      <span>{lockedByName}</span>
      {remainingMinutes > 0 && (
        <>
          <Clock className="w-3 h-3" />
          <span>{remainingMinutes}m</span>
        </>
      )}
    </div>
  );
});

LockDisplay.displayName = 'LockDisplay';