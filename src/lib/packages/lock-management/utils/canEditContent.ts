'use client';

/**
 * Determines if the current user can edit content based on lock status.
 * 
 * User can edit if ALL of the following are true:
 * 1. They have the lock (hasLock is true)
 * 2. The lock is for their current tab (lockedTabId matches currentTabId)
 * 3. They are the user who locked it (lockedBy matches currentUserId)
 * 
 * @param lockInfo - Lock status information from the server
 * @returns true if the user can edit, false otherwise
 */
export function canEditContent(lockInfo: any): boolean {
  if (!lockInfo) return false;
  
  // User can edit if they have the lock AND it's in their current tab
  return lockInfo.hasLock === true && 
         lockInfo.lockedTabId === lockInfo.currentTabId &&
         lockInfo.lockedBy === lockInfo.currentUserId;
}