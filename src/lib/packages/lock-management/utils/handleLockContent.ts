'use client';

import { checkLockStatus } from './checkLockStatus';
import { acquireLock } from './acquireLock';
import { LockWarningDialog } from '../components/LockWarningDialog';
import { createRoot } from 'react-dom/client';
import React from 'react';

export async function handleLockContent(
  resourceId: string,
  collection: string,
  resourceName?: string,
  endpoint?: string
): Promise<boolean> {
  // Use provided endpoint or default to sections endpoint
  const lockEndpoint = endpoint || '/api/magazine/sections/{resourceId}/lock';
  
  // Check current lock status
  const lockStatus = await checkLockStatus(resourceId, collection, lockEndpoint);
  
  // If not locked, acquire the lock
  if (!lockStatus?.isLocked) {
    return await acquireLock(resourceId, collection, lockEndpoint);
  }
  
  // If user can edit (they already have the lock), allow access
  if (lockStatus?.canEdit) {
    return true;
  }
  
  // Otherwise show warning dialog
  return new Promise((resolve) => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = createRoot(div);
    
    root.render(
      React.createElement(LockWarningDialog, {
        isOpen: true,
        onClose: () => {
          root.unmount();
          document.body.removeChild(div);
          resolve(false);
        },
        type: 'conflict',
        lockStatus,
        resourceName: resourceName || 'this content'
      })
    );
  });
}