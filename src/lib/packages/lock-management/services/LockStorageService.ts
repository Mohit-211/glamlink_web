'use client';

import { 
  LockDocument, 
  LockData, 
  ResourceWithLock, 
  StandardizedLockStatus,
  AcquireLockRequest,
  ReleaseLockRequest,
  ExtendLockRequest,
  TransferLockRequest,
  LockEventLog,
  LockEvent,
  MigratedResource,
  LegacyLockFields,
  CleanResource
} from '../types/standardized.types';

/**
 * Lock Storage Service - Separates lock management from business data
 * 
 * This service manages locks in a dedicated collection, keeping business
 * collections clean of lock-related fields.
 */
export class LockStorageService {
  private db: any; // Firestore instance
  private locksCollection: string;
  private config: {
    defaultDurationMinutes: number;
    maxDurationMinutes: number;
  };

  constructor(
    db: any, 
    locksCollection = 'resource_locks',
    config = {
      defaultDurationMinutes: 5,
      maxDurationMinutes: 60
    }
  ) {
    this.db = db;
    this.locksCollection = locksCollection;
    this.config = config;
  }

  /**
   * Generate a unique lock ID for a resource
   */
  private generateLockId(resourceType: string, resourceId: string, lockGroup?: string): string {
    if (lockGroup) {
      return `${resourceType}:${resourceId}:${lockGroup}`;
    }
    return `${resourceType}:${resourceId}`;
  }

  /**
   * Generate lock path array from resource info
   */
  private generateLockPath(resourceType: string, resourceId: string): string[] {
    return [resourceType, resourceId];
  }

  /**
   * Get current lock status for a resource
   */
  async getLockStatus(
    resourceType: string, 
    resourceId: string, 
    currentUserId?: string,
    currentTabId?: string,
    lockGroup?: string
  ): Promise<StandardizedLockStatus> {
    try {
      const lockId = this.generateLockId(resourceType, resourceId, lockGroup);
      const lockDoc = await this.db.collection(this.locksCollection).doc(lockId).get();

      if (!lockDoc.exists) {
        return {
          exists: false,
          isOwnedByCurrentUser: false,
          isOwnedByCurrentTab: false,
          isExpired: false,
          canTransfer: false,
          canEdit: true // No lock means can edit
        };
      }

      const lockData = lockDoc.data() as LockDocument;
      const lock = lockData.lock;
      const now = new Date();
      const expiresAt = new Date(lock.info.lockExpiresAt);
      const isExpired = expiresAt <= now;
      
      if (isExpired) {
        // Clean up expired lock
        await this.cleanupExpiredLock(lockId);
        return {
          exists: false,
          isOwnedByCurrentUser: false,
          isOwnedByCurrentTab: false,
          isExpired: true,
          canTransfer: false,
          canEdit: true
        };
      }

      const isOwnedByCurrentUser = currentUserId ? lock.userId === currentUserId : false;
      const isOwnedByCurrentTab = currentTabId ? lock.info.lockedTabId === currentTabId : false;
      const canTransfer = isOwnedByCurrentUser && !isOwnedByCurrentTab;

      return {
        exists: true,
        isOwnedByCurrentUser,
        isOwnedByCurrentTab,
        isExpired: false,
        holder: {
          userId: lock.userId,
          userName: lock.info.userName,
          userEmail: lock.info.userEmail,
          tabId: lock.info.lockedTabId
        },
        expiresAt: lock.info.lockExpiresAt,
        expiresIn: Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / 1000)),
        lockGroup: lock.info.lockGroup,
        canTransfer,
        canEdit: isOwnedByCurrentUser && isOwnedByCurrentTab
      };
    } catch (error) {
      console.error('Error getting lock status:', error);
      throw error;
    }
  }

  /**
   * Acquire a lock on a resource
   */
  async acquireLock(
    resourceType: string,
    resourceId: string,
    request: AcquireLockRequest
  ): Promise<{ success: boolean; lock?: LockData; error?: string; conflictInfo?: StandardizedLockStatus }> {
    try {
      const lockId = this.generateLockId(resourceType, resourceId, request.lockGroup);
      const lockPath = this.generateLockPath(resourceType, resourceId);
      
      // Use Firestore transaction to ensure atomicity
      const result = await this.db.runTransaction(async (transaction: any) => {
        const lockRef = this.db.collection(this.locksCollection).doc(lockId);
        const existingLock = await transaction.get(lockRef);

        if (existingLock.exists) {
          const existing = existingLock.data() as LockDocument;
          const expiresAt = new Date(existing.lock.info.lockExpiresAt);
          const now = new Date();

          // Check if lock is expired
          if (expiresAt <= now) {
            // Lock expired, we can take it
            console.log(`Lock ${lockId} expired, acquiring...`);
          } else {
            // Lock is still active
            const conflictInfo = await this.getLockStatus(
              resourceType, 
              resourceId, 
              request.userId, 
              request.tabId, 
              request.lockGroup
            );
            return { success: false, conflictInfo };
          }
        }

        // Create new lock
        const now = new Date();
        const durationMs = (request.lockDurationMinutes || this.config.defaultDurationMinutes) * 60 * 1000;
        const expiresAt = new Date(now.getTime() + durationMs);

        const lockData: LockData = {
          userId: request.userId,
          info: {
            lockedAt: now.toISOString(),
            lockExpiresAt: expiresAt.toISOString(),
            lockPath,
            lockedTabId: request.tabId,
            userName: request.tabName, // This would ideally come from user service
            userEmail: '', // This would ideally come from user service
            lockGroup: request.lockGroup
          }
        };

        const lockDocument: LockDocument = {
          id: lockId,
          resourceType,
          resourceId,
          lockPath,
          lock: lockData,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString()
        };

        transaction.set(lockRef, lockDocument);
        
        // Log the event
        this.logLockEvent('acquired', resourceType, resourceId, request.userId, request.tabId);

        return { success: true, lock: lockData };
      });

      return result;
    } catch (error) {
      console.error('Error acquiring lock:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Release a lock
   */
  async releaseLock(
    resourceType: string,
    resourceId: string,
    request: ReleaseLockRequest,
    lockGroup?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const lockId = this.generateLockId(resourceType, resourceId, lockGroup);
      
      const result = await this.db.runTransaction(async (transaction: any) => {
        const lockRef = this.db.collection(this.locksCollection).doc(lockId);
        const lockDoc = await transaction.get(lockRef);

        if (!lockDoc.exists) {
          return { success: true }; // Already released
        }

        const lockData = lockDoc.data() as LockDocument;
        
        // Verify ownership
        if (lockData.lock.userId !== request.userId) {
          return { success: false, error: 'Lock not owned by requesting user' };
        }

        // Delete the lock
        transaction.delete(lockRef);
        
        // Log the event
        this.logLockEvent('released', resourceType, resourceId, request.userId);

        return { success: true };
      });

      return result;
    } catch (error) {
      console.error('Error releasing lock:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Extend an existing lock
   */
  async extendLock(
    resourceType: string,
    resourceId: string,
    request: ExtendLockRequest,
    lockGroup?: string
  ): Promise<{ success: boolean; newExpiresAt?: string; error?: string }> {
    try {
      const lockId = this.generateLockId(resourceType, resourceId, lockGroup);
      
      const result = await this.db.runTransaction(async (transaction: any) => {
        const lockRef = this.db.collection(this.locksCollection).doc(lockId);
        const lockDoc = await transaction.get(lockRef);

        if (!lockDoc.exists) {
          return { success: false, error: 'Lock does not exist' };
        }

        const lockData = lockDoc.data() as LockDocument;
        
        // Verify ownership
        if (lockData.lock.userId !== request.userId) {
          return { success: false, error: 'Lock not owned by requesting user' };
        }

        // Extend the lock
        const extendByMs = (request.extendByMinutes || this.config.defaultDurationMinutes) * 60 * 1000;
        const newExpiresAt = new Date(Date.now() + extendByMs);

        const updatedLock = {
          ...lockData,
          lock: {
            ...lockData.lock,
            info: {
              ...lockData.lock.info,
              lockExpiresAt: newExpiresAt.toISOString()
            }
          },
          updatedAt: new Date().toISOString()
        };

        transaction.update(lockRef, updatedLock);
        
        // Log the event
        this.logLockEvent('extended', resourceType, resourceId, request.userId);

        return { success: true, newExpiresAt: newExpiresAt.toISOString() };
      });

      return result;
    } catch (error) {
      console.error('Error extending lock:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Transfer lock to a different tab
   */
  async transferLock(
    resourceType: string,
    resourceId: string,
    request: TransferLockRequest,
    lockGroup?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const lockId = this.generateLockId(resourceType, resourceId, lockGroup);
      
      const result = await this.db.runTransaction(async (transaction: any) => {
        const lockRef = this.db.collection(this.locksCollection).doc(lockId);
        const lockDoc = await transaction.get(lockRef);

        if (!lockDoc.exists) {
          return { success: false, error: 'Lock does not exist' };
        }

        const lockData = lockDoc.data() as LockDocument;
        
        // Verify ownership (same user, different tab)
        if (lockData.lock.userId !== request.userId) {
          return { success: false, error: 'Lock not owned by requesting user' };
        }

        // Update tab ID
        const updatedLock = {
          ...lockData,
          lock: {
            ...lockData.lock,
            info: {
              ...lockData.lock.info,
              lockedTabId: request.newTabId
            }
          },
          updatedAt: new Date().toISOString()
        };

        transaction.update(lockRef, updatedLock);
        
        // Log the event
        this.logLockEvent('transferred', resourceType, resourceId, request.userId, request.newTabId);

        return { success: true };
      });

      return result;
    } catch (error) {
      console.error('Error transferring lock:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Clean up expired locks
   */
  private async cleanupExpiredLock(lockId: string): Promise<void> {
    try {
      await this.db.collection(this.locksCollection).doc(lockId).delete();
      console.log(`Cleaned up expired lock: ${lockId}`);
    } catch (error) {
      console.error('Error cleaning up expired lock:', error);
    }
  }

  /**
   * Clean up all expired locks (maintenance operation)
   */
  async cleanupExpiredLocks(): Promise<{ cleanedCount: number }> {
    try {
      const now = new Date();
      const expiredQuery = await this.db
        .collection(this.locksCollection)
        .where('lock.info.lockExpiresAt', '<=', now.toISOString())
        .get();

      const batch = this.db.batch();
      expiredQuery.docs.forEach((doc: any) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      
      console.log(`Cleaned up ${expiredQuery.docs.length} expired locks`);
      return { cleanedCount: expiredQuery.docs.length };
    } catch (error) {
      console.error('Error during bulk cleanup:', error);
      throw error;
    }
  }

  /**
   * Migrate legacy resource to clean structure
   */
  migrateResource<T extends LegacyLockFields>(resource: T): MigratedResource<T> {
    const {
      lockExpiresAt,
      lockedAt,
      lockedBy,
      lockedByName,
      lockedByEmail,
      lockedTab,
      lockedTabId,
      lockGroup,
      ...cleanData
    } = resource;

    const migratedResource: MigratedResource<T> = {
      cleanData: cleanData as CleanResource<T>
    };

    // If lock fields exist, create lock data
    if (lockedBy && lockExpiresAt) {
      migratedResource.lockData = {
        userId: lockedBy,
        info: {
          lockedAt: lockedAt || new Date().toISOString(),
          lockExpiresAt,
          lockPath: [], // Would need to be determined by context
          lockedTabId: lockedTabId || '',
          userName: lockedByName,
          userEmail: lockedByEmail,
          lockGroup
        }
      };
    }

    return migratedResource;
  }

  /**
   * Log lock events for monitoring
   */
  private logLockEvent(
    event: LockEvent,
    resourceType: string,
    resourceId: string,
    userId: string,
    tabId?: string,
    details?: Record<string, any>
  ): void {
    const logEntry: LockEventLog = {
      event,
      resourceType,
      resourceId,
      userId,
      tabId,
      timestamp: new Date().toISOString(),
      details
    };

    // In a production system, you might want to store these logs
    console.log(`[LockEvent] ${event}:`, logEntry);
  }

  /**
   * Get all active locks (for admin/monitoring)
   */
  async getActiveLocks(): Promise<LockDocument[]> {
    try {
      const now = new Date();
      const activeQuery = await this.db
        .collection(this.locksCollection)
        .where('lock.info.lockExpiresAt', '>', now.toISOString())
        .get();

      return activeQuery.docs.map((doc: any) => doc.data() as LockDocument);
    } catch (error) {
      console.error('Error getting active locks:', error);
      throw error;
    }
  }
}