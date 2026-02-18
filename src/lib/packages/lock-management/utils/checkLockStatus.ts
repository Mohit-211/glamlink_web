'use client';

import { tabManager } from '../services/TabManager';

export async function checkLockStatus(
  resourceId: string, 
  collection: string,
  endpoint: string = '/api/magazine/sections/{resourceId}/lock'
) {
  const tabId = tabManager.getTabId();
  const url = endpoint.replace('{resourceId}', resourceId);
  
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'X-Tab-Id': tabId
    }
  });
  return response.ok ? await response.json() : null;
}