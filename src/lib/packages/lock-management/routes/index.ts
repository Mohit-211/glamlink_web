/**
 * Lock Management Route Handlers - Main Export
 * 
 * Centralized exports for all route handler functions.
 */

// Import functions for internal use
import { createAcquireLockHandler } from './acquire';
import { createReleaseLockHandler } from './release';
import { createExtendLockHandler } from './extend';
import { createTransferLockHandler } from './transfer';
import { createStatusLockHandler } from './status';

// Individual route handlers
export { 
  handleAcquireLock, 
  createAcquireLockHandler, 
  acquireLockHandlers 
} from './acquire';

export { 
  handleReleaseLock, 
  createReleaseLockHandler 
} from './release';

export { 
  handleExtendLock, 
  createExtendLockHandler 
} from './extend';

export { 
  handleTransferLock, 
  createTransferLockHandler 
} from './transfer';

export { 
  handleCleanupExpiredLocks, 
  cleanupHandlers 
} from './cleanup';

// Convenience factory for creating complete route handlers
export function createLockRouteHandlers(options: {
  collection: string;
  lockDuration?: number;
  lockGroup?: string;
  allowTransfer?: boolean;
  requireAuth?: boolean;
  adminOnly?: boolean;
}) {
  const routeOptions = {
    collection: options.collection,
    lockDuration: options.lockDuration,
    lockGroup: options.lockGroup,
    allowTransfer: options.allowTransfer,
    requireAuth: options.requireAuth ?? true,
    adminOnly: options.adminOnly
  };

  return {
    acquire: createAcquireLockHandler(routeOptions),
    release: createReleaseLockHandler(routeOptions),
    extend: createExtendLockHandler(routeOptions),
    transfer: createTransferLockHandler(routeOptions),
    status: createStatusLockHandler(routeOptions)
  };
}

// Pre-configured route handlers for common collections
export const lockRouteHandlers = {
  magazineIssues: createLockRouteHandlers({
    collection: 'magazine_issues',
    lockDuration: 10,
    lockGroup: 'issue-metadata',
    allowTransfer: true
  }),

  sections: createLockRouteHandlers({
    collection: 'sections',
    lockDuration: 5,
    lockGroup: 'section', // Each section has its own lock group
    allowTransfer: true
  }),

  documents: createLockRouteHandlers({
    collection: 'documents',
    lockDuration: 15,
    allowTransfer: true
  }),

  brands: createLockRouteHandlers({
    collection: 'brands',
    lockDuration: 10,
    allowTransfer: true
  }),

  products: createLockRouteHandlers({
    collection: 'products',
    lockDuration: 5,
    allowTransfer: true
  })
};

// Route handlers version
export const LOCK_ROUTES_VERSION = '1.0.0';