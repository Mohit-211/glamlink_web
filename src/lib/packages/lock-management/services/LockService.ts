/**
 * Lock Service - Core Lock Management
 * 
 * Enhanced and refactored lock service extracted from the existing sectionLockService
 * with additional features for universal lock management across collections.
 */

import { 
  doc, 
  updateDoc, 
  getDoc,
  getDocs,
  query,
  where,
  Firestore,
  runTransaction,
  collection as firestoreCollection
} from 'firebase/firestore';

import {
  LockStatus,
  LockConfig,
  LockDocument,
  CleanupOptions,
  CleanupResult,
  LockStatistics
} from '../types/lock.types';

import {
  AcquireLockRequest,
  AcquireLockResponse,
  ReleaseLockRequest,
  TransferLockRequest
} from '../types/api.types';

import { getConfigForCollection, resolveLockGroup } from '../config';

/**
 * Universal Lock Service
 * 
 * Handles lock operations for any Firestore collection with lock fields.
 */
export class LockService {
  constructor(private _defaultConfig?: LockConfig) {}

  /**
   * Acquire a lock on a resource
   */
  async acquireLock(
    db: Firestore,
    resourceId: string,
    collection: string,
    request: AcquireLockRequest,
    config?: Partial<LockConfig>
  ): Promise<AcquireLockResponse> {
    try {
      const finalConfig = this.getFinalConfig(collection, undefined, config);
      const lockGroup = resolveLockGroup(collection, 'default', request.lockGroup);
      
      return await runTransaction(db, async (transaction) => {
        const docRef = doc(db, collection, resourceId);
        const docSnapshot = await transaction.get(docRef);

        if (!docSnapshot.exists()) {
          return {
            success: false,
            message: 'Resource not found'
          };
        }

        const docData = docSnapshot.data() as LockDocument;
        const now = new Date();
        const nowISO = now.toISOString();

        // Check if resource is already locked
        if (docData.lockedBy && docData.lockExpiresAt) {
          const lockExpires = new Date(docData.lockExpiresAt);
          
          // If lock is not expired
          if (lockExpires > now) {
            const remainingMinutes = Math.ceil((lockExpires.getTime() - now.getTime()) / 60000);
            const remainingSeconds = Math.ceil((lockExpires.getTime() - now.getTime()) / 1000);
            
            // Check if lock is held by another user
            if (docData.lockedBy !== request.userId) {
              return {
                success: false,
                message: `Resource is locked by ${docData.lockedByName || docData.lockedByEmail} for ${remainingMinutes} more minute(s)`,
                lockedBy: docData.lockedBy,
                lockedByName: docData.lockedByName || undefined,
                lockedByEmail: docData.lockedByEmail || undefined,
                lockedTabId: docData.lockedTabId || undefined,
                remainingSeconds: remainingSeconds
              };
            }
            
            // Same user, check for multi-tab conflict
            if (request.tabId && docData.lockedTabId && docData.lockedTabId !== request.tabId) {
              return {
                success: false,
                isMultiTabConflict: true,
                message: `You are already editing this resource in another browser tab`,
                lockedBy: docData.lockedBy,
                lockedByName: docData.lockedByName || undefined,
                lockedByEmail: docData.lockedByEmail || undefined,
                lockedTabId: docData.lockedTabId || undefined,
                remainingSeconds: remainingSeconds,
                allowTransfer: true
              };
            }
          }
        }

        // Acquire the lock
        const lockDurationMs = finalConfig.lockDurationMinutes! * 60000;
        const lockExpiresAt = new Date(now.getTime() + lockDurationMs);
        const lockExpiresISO = lockExpiresAt.toISOString();

        const lockUpdate: Partial<LockDocument> = {
          lockedBy: request.userId,
          lockedByEmail: request.userEmail,
          lockedByName: request.userName || request.userEmail,
          lockedAt: nowISO,
          lockExpiresAt: lockExpiresISO,
          lockedTabId: request.tabId || 'unknown',
          lockGroup: lockGroup,
          lastModified: nowISO,
          lastModifiedBy: request.userId,
          lastModifiedByEmail: request.userEmail
        };

        transaction.update(docRef, lockUpdate);

        return {
          success: true,
          message: 'Lock acquired successfully',
          lockExpiresAt: lockExpiresISO,
          lockStatus: this.createLockStatus(resourceId, collection, {
            ...docData,
            ...lockUpdate
          }, request.userId)
        };
      });
    } catch (error) {
      console.error('Error acquiring lock:', error);
      return {
        success: false,
        message: 'Failed to acquire lock',
        error: {
          type: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          canRetry: true
        }
      };
    }
  }

  /**
   * Release a lock on a resource
   */
  async releaseLock(
    db: Firestore,
    resourceId: string,
    collection: string,
    request: ReleaseLockRequest
  ): Promise<boolean> {
    try {
      const docRef = doc(db, collection, resourceId);
      const docSnapshot = await getDoc(docRef);

      if (!docSnapshot.exists()) {
        console.error('Resource not found');
        return false;
      }

      const docData = docSnapshot.data() as LockDocument;
      const now = new Date();

      // Only the user who locked it can release it (or if it's expired or force)
      const isExpired = this.isLockExpired(docData);
      
      // Check both userId and tabId for multi-tab validation
      // If userOverride is true, only check userId (allows same-user release across tabs)
      const isOwner = request.userOverride 
        ? docData.lockedBy === request.userId  // Only check user for override
        : docData.lockedBy === request.userId && 
          (!docData.lockedTabId || !request.tabId || docData.lockedTabId === request.tabId);
      const canRelease = isOwner || isExpired || request.force;

      if (!canRelease) {
        console.error('User does not hold the lock or tab ID mismatch');
        return false;
      }

      await updateDoc(docRef, {
        lockedBy: null,
        lockedByEmail: null,
        lockedByName: null,
        lockedAt: null,
        lockExpiresAt: null,
        lockedTabId: null,
        lockGroup: null,
        lastModified: now.toISOString(),
        lastModifiedBy: request.userId,
        lastModifiedByEmail: 'system'
      });

      return true;
    } catch (error) {
      console.error('Error releasing lock:', error);
      return false;
    }
  }

  /**
   * Extend a lock before it expires
   */
  async extendLock(
    db: Firestore,
    resourceId: string,
    collection: string,
    userId: string,
    extendByMinutes?: number
  ): Promise<AcquireLockResponse> {
    try {
      const config = this.getFinalConfig(collection);
      const extensionMinutes = extendByMinutes || config.lockDurationMinutes!;

      return await runTransaction(db, async (transaction) => {
        const docRef = doc(db, collection, resourceId);
        const docSnapshot = await transaction.get(docRef);

        if (!docSnapshot.exists()) {
          return {
            success: false,
            message: 'Resource not found'
          };
        }

        const docData = docSnapshot.data() as LockDocument;

        // Check if user holds the lock
        if (docData.lockedBy !== userId) {
          return {
            success: false,
            message: 'You do not hold the lock on this resource'
          };
        }

        // Extend the lock
        const now = new Date();
        const lockExpiresAt = new Date(now.getTime() + extensionMinutes * 60000);
        const lockExpiresISO = lockExpiresAt.toISOString();

        transaction.update(docRef, {
          lockExpiresAt: lockExpiresISO,
          lastModified: now.toISOString()
        });

        return {
          success: true,
          message: 'Lock extended successfully',
          lockExpiresAt: lockExpiresISO
        };
      });
    } catch (error) {
      console.error('Error extending lock:', error);
      return {
        success: false,
        message: 'Failed to extend lock'
      };
    }
  }

  /**
   * Transfer lock to another tab (same user only)
   */
  async transferLock(
    db: Firestore,
    resourceId: string,
    collection: string,
    request: TransferLockRequest
  ): Promise<AcquireLockResponse> {
    try {
      return await runTransaction(db, async (transaction) => {
        const docRef = doc(db, collection, resourceId);
        const docSnapshot = await transaction.get(docRef);

        if (!docSnapshot.exists()) {
          return {
            success: false,
            message: 'Resource not found'
          };
        }

        const docData = docSnapshot.data() as LockDocument;

        // Only allow transfer if current user holds the lock
        if (docData.lockedBy !== request.userId) {
          return {
            success: false,
            message: 'You do not hold the lock on this resource'
          };
        }

        // Verify this is a tab transfer request
        if (!request.forceTransfer || !request.newTabId) {
          return {
            success: false,
            message: 'Invalid transfer request'
          };
        }

        // Transfer the lock to the new tab
        const now = new Date();
        const config = this.getFinalConfig(collection);
        const lockDurationMinutes = config.lockDurationMinutes!;
        const lockExpiresAt = new Date(now.getTime() + lockDurationMinutes * 60000);
        const lockExpiresISO = lockExpiresAt.toISOString();

        transaction.update(docRef, {
          lockedTabId: request.newTabId,
          lockExpiresAt: lockExpiresISO,
          lockedAt: now.toISOString(),
          lastModified: now.toISOString()
        });

        return {
          success: true,
          message: 'Lock transferred successfully',
          lockExpiresAt: lockExpiresISO
        };
      });
    } catch (error) {
      console.error('Error transferring lock:', error);
      return {
        success: false,
        message: 'Failed to transfer lock'
      };
    }
  }

  /**
   * Get current lock status for a resource
   */
  async getLockStatus(
    db: Firestore,
    resourceId: string,
    collection: string,
    currentUserId: string
  ): Promise<LockStatus> {
    try {
      const docRef = doc(db, collection, resourceId);
      const docSnapshot = await getDoc(docRef);

      if (!docSnapshot.exists()) {
        return this.createEmptyLockStatus(resourceId, collection);
      }

      const docData = docSnapshot.data() as LockDocument;
      return this.createLockStatus(resourceId, collection, docData, currentUserId);
    } catch (error) {
      console.error('Error getting lock status:', error);
      return this.createEmptyLockStatus(resourceId, collection);
    }
  }

  /**
   * Force unlock a resource (admin only)
   */
  async forceUnlock(
    db: Firestore,
    resourceId: string,
    collection: string,
    adminUserId: string,
    reason?: string
  ): Promise<boolean> {
    try {
      const docRef = doc(db, collection, resourceId);
      const now = new Date();

      await updateDoc(docRef, {
        lockedBy: null,
        lockedByEmail: null,
        lockedByName: null,
        lockedAt: null,
        lockExpiresAt: null,
        lockedTabId: null,
        lockGroup: null,
        lastModified: now.toISOString(),
        lastModifiedBy: adminUserId,
        lastModifiedByEmail: `admin-force-unlock${reason ? `: ${reason}` : ''}`
      });

      return true;
    } catch (error) {
      console.error('Error forcing unlock:', error);
      return false;
    }
  }

  /**
   * Clean up expired locks for a collection
   */
  async cleanupExpiredLocks(
    db: Firestore,
    collectionName: string,
    options: CleanupOptions = {}
  ): Promise<CleanupResult> {
    try {
      const now = new Date();
      const cutoffTime = new Date(now.getTime() - (options.olderThan || 5) * 60000);
      
      // Query for potentially expired locks
      const collectionRef = firestoreCollection(db, collectionName);
      const expiredQuery = query(
        collectionRef,
        where('lockExpiresAt', '<=', cutoffTime.toISOString()),
        where('lockedBy', '!=', null)
      );

      const snapshot = await getDocs(expiredQuery);
      const cleanedLocks: CleanupResult['details'] = [];

      if (options.dryRun) {
        // Just report what would be cleaned
        snapshot.docs.forEach(doc => {
          const data = doc.data() as LockDocument;
          cleanedLocks.push({
            resourceId: doc.id,
            collection: collectionName,
            lockedBy: data.lockedBy || 'unknown',
            expiredAt: data.lockExpiresAt || 'unknown'
          });
        });
      } else {
        // Actually clean up the locks
        for (const docSnapshot of snapshot.docs) {
          const data = docSnapshot.data() as LockDocument;
          
          if (this.isLockExpired(data) || options.force) {
            cleanedLocks.push({
              resourceId: docSnapshot.id,
              collection: collectionName,
              lockedBy: data.lockedBy || 'unknown',
              expiredAt: data.lockExpiresAt || 'unknown'
            });

            await updateDoc(docSnapshot.ref, {
              lockedBy: null,
              lockedByEmail: null,
              lockedByName: null,
              lockedAt: null,
              lockExpiresAt: null,
              lockedTabId: null,
              lockGroup: null,
              lastModified: now.toISOString(),
              lastModifiedBy: 'system-cleanup',
              lastModifiedByEmail: 'system'
            });
          }
        }
      }

      return {
        count: cleanedLocks.length,
        details: cleanedLocks,
        timestamp: now.toISOString()
      };
    } catch (error) {
      console.error('Error cleaning up expired locks:', error);
      return {
        count: 0,
        details: [],
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get lock statistics for monitoring
   */
  async getLockStatistics(
    db: Firestore,
    collectionName?: string
  ): Promise<LockStatistics> {
    try {
      const now = new Date();
      const stats: LockStatistics = {
        totalActiveLocks: 0,
        expiredLocks: 0,
        multiTabConflicts: 0,
        locksByUser: {},
        locksByCollection: {},
        averageLockDuration: 0,
        timestamp: now.toISOString()
      };

      // If specific collection, get stats for that collection only
      if (collectionName) {
        await this.getCollectionStats(db, collectionName, stats);
      } else {
        // Get stats for all known collections with locks
        const collections = ['magazine_issues', 'sections', 'documents', 'products', 'brands'];
        for (const collection of collections) {
          await this.getCollectionStats(db, collection, stats);
        }
      }

      // Calculate average lock duration
      if (stats.totalActiveLocks > 0) {
        const totalDuration = Object.values(stats.locksByUser).reduce((sum, count) => sum + count, 0);
        stats.averageLockDuration = totalDuration / stats.totalActiveLocks;
      }

      return stats;
    } catch (error) {
      console.error('Error getting lock statistics:', error);
      return {
        totalActiveLocks: 0,
        expiredLocks: 0,
        multiTabConflicts: 0,
        locksByUser: {},
        locksByCollection: {},
        averageLockDuration: 0,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Helper method to get stats for a specific collection
   */
  private async getCollectionStats(
    db: Firestore,
    collectionName: string,
    stats: LockStatistics
  ): Promise<void> {
    try {
      const collectionRef = firestoreCollection(db, collectionName);
      const lockedQuery = query(collectionRef, where('lockedBy', '!=', null));
      const snapshot = await getDocs(lockedQuery);

      snapshot.docs.forEach(doc => {
        const data = doc.data() as LockDocument;
        
        if (data.lockedBy) {
          stats.totalActiveLocks++;
          stats.locksByUser[data.lockedBy] = (stats.locksByUser[data.lockedBy] || 0) + 1;
          stats.locksByCollection[collectionName] = (stats.locksByCollection[collectionName] || 0) + 1;

          if (this.isLockExpired(data)) {
            stats.expiredLocks++;
          }

          // Check for potential multi-tab conflicts (same user, different tabs editing same resource type)
          if (data.lockedTabId) {
            // This is a simplified check - in practice, you'd need more sophisticated logic
            const userLocks = stats.locksByUser[data.lockedBy];
            if (userLocks > 1) {
              stats.multiTabConflicts++;
            }
          }
        }
      });
    } catch (error) {
      console.error(`Error getting stats for collection ${collectionName}:`, error);
    }
  }

  /**
   * Check if a lock is expired
   */
  isLockExpired(lockData: LockDocument): boolean {
    if (!lockData.lockExpiresAt) return true;
    const now = new Date();
    const lockExpires = new Date(lockData.lockExpiresAt);
    return lockExpires <= now;
  }

  /**
   * Create a LockStatus object from lock data
   */
  private createLockStatus(
    resourceId: string,
    collection: string,
    lockData: LockDocument,
    currentUserId: string
  ): LockStatus {
    const isLocked = !!lockData.lockedBy && !!lockData.lockExpiresAt && !this.isLockExpired(lockData);
    const hasLock = isLocked && lockData.lockedBy === currentUserId;
    const now = new Date();
    const lockExpiresIn = lockData.lockExpiresAt ? 
      Math.max(0, Math.floor((new Date(lockData.lockExpiresAt).getTime() - now.getTime()) / 1000)) : 0;

    return {
      resourceId,
      collection,
      isLocked,
      canEdit: !isLocked || hasLock,
      hasLock,
      lockedBy: lockData.lockedBy || undefined,
      lockedByName: lockData.lockedByName || undefined,
      lockedByEmail: lockData.lockedByEmail || undefined,
      lockExpiresAt: lockData.lockExpiresAt || undefined,
      lockExpiresIn: lockExpiresIn,
      isExpired: this.isLockExpired(lockData),
      isMultiTabConflict: false, // This would be determined by the caller
      allowTransfer: true, // This would be determined by configuration
      lockedTabId: lockData.lockedTabId || undefined,
      lockGroup: lockData.lockGroup || undefined
    };
  }

  /**
   * Create an empty lock status for unlocked resources
   */
  private createEmptyLockStatus(resourceId: string, collection: string): LockStatus {
    return {
      resourceId,
      collection,
      isLocked: false,
      canEdit: true,
      hasLock: false,
      lockExpiresIn: 0,
      isExpired: false,
      isMultiTabConflict: false,
      allowTransfer: true
    };
  }

  /**
   * Get final configuration for lock operations
   */
  private getFinalConfig(
    collection: string,
    _field?: string,
    overrides?: Partial<LockConfig>
  ): Required<LockConfig> {
    return getConfigForCollection(collection, overrides) as Required<LockConfig>;
  }
}

// Create and export singleton instance
export const lockService = new LockService();