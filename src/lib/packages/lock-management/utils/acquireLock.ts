'use client';

import { tabManager } from '../services/TabManager';

export async function acquireLock(
  resourceId: string, 
  collection: string,
  endpoint: string = '/api/magazine/sections/{resourceId}/lock'
): Promise<boolean> {
  const tabId = tabManager.getTabId();
  const url = endpoint.replace('{resourceId}', resourceId);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ 
      collection,
      tabId 
    })
  });
  return response.ok;
}