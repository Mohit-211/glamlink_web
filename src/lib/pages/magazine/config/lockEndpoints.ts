import { type LockEndpoints } from '@/lib/packages/lock-management/contexts/LockConfigContext';

/**
 * Lock API Endpoints for Magazine Module
 * 
 * These endpoints are used by the lock management system to handle
 * collaborative editing locks for magazine issues and sections.
 * 
 * The {resourceId} placeholder will be replaced with the actual resource ID
 * when making API calls.
 */
export const MAGAZINE_LOCK_ENDPOINTS: LockEndpoints = {
  // All operations use the same endpoint with different HTTP methods
  acquire: '/api/magazine/issues/{resourceId}/lock',  // POST
  release: '/api/magazine/issues/{resourceId}/lock',  // DELETE
  extend: '/api/magazine/issues/{resourceId}/lock',   // PUT
  transfer: '/api/magazine/issues/{resourceId}/lock', // PATCH
  // No separate status endpoint - GET on acquire endpoint is used
};

/**
 * Lock configuration for magazine sections
 * 
 * This is used when locking individual sections within a magazine issue.
 */
export const MAGAZINE_SECTION_LOCK_ENDPOINTS: LockEndpoints = {
  acquire: '/api/magazine/sections/{resourceId}/lock',  // POST
  release: '/api/magazine/sections/{resourceId}/lock',  // DELETE
  extend: '/api/magazine/sections/{resourceId}/lock',   // PUT
  transfer: '/api/magazine/sections/{resourceId}/lock', // PATCH
};

/**
 * Default lock configuration for the magazine module
 */
export const MAGAZINE_LOCK_CONFIG = {
  endpoints: MAGAZINE_LOCK_ENDPOINTS,
  collection: 'magazine_issues',
  lockDuration: 10,        // 10 minutes for magazine editing
  autoRefresh: true,       // Auto-extend locks
  refreshInterval: 30000,  // Check every 30 seconds
};

/**
 * Lock groups for magazine issue fields
 * 
 * Fields in the same group share a lock to prevent conflicts.
 */
export const MAGAZINE_LOCK_GROUPS = {
  'basic-info': 'metadata',
  'cover-config': 'metadata',
  // Individual sections have their own locks
} as const;

/**
 * Helper to get the appropriate endpoints based on resource type
 */
export function getMagazineLockEndpoints(resourceType: 'issue' | 'section'): LockEndpoints {
  return resourceType === 'issue' 
    ? MAGAZINE_LOCK_ENDPOINTS 
    : MAGAZINE_SECTION_LOCK_ENDPOINTS;
}