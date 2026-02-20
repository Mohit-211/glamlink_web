'use client';

import { tabManager } from '../services/TabManager';

/**
 * Release a lock on a resource
 * @param resourceId - The ID of the resource to release
 * @param collection - The collection name
 * @param userOverride - If true, allows same-user release across different tabs (default: false)
 * @param endpoint - The API endpoint to use (default: sections endpoint)
 */
export async function releaseLock(
  resourceId: string, 
  collection: string, 
  userOverride: boolean = false,
  endpoint: string = '/api/magazine/sections/{resourceId}/lock'
): Promise<boolean> {
  const tabId = tabManager.getTabId();
  const url = endpoint.replace('{resourceId}', resourceId);
  
  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Tab-Id': tabId
    },
    body: JSON.stringify({ 
      collection,
      tabId,
      userOverride
    })
  });
  return response.ok;
}