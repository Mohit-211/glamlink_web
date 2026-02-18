'use client';

/**
 * Lock Store - Persistent state management for locks
 * 
 * This store maintains lock state across component remounts,
 * ensuring that lock information persists even when React components
 * are destroyed and recreated due to conditional rendering.
 * 
 * The store uses a singleton pattern to ensure all components
 * share the same lock state, regardless of their lifecycle.
 */

interface LockStoreData {
  lockInfo: any;
  hasLock: boolean;
  shouldRelease: boolean;
  lastUpdated: number;
}

class LockStore {
  private locks = new Map<string, LockStoreData>();
  private subscribers = new Map<string, Set<() => void>>();
  
  /**
   * Generate a cache key for a resource
   */
  getCacheKey(resourceId: string | undefined, collection: string): string {
    return `${collection}:${resourceId || 'unknown'}`;
  }
  
  /**
   * Get lock data for a resource
   */
  get(resourceId: string | undefined, collection: string): LockStoreData | null {
    if (!resourceId) return null;
    const key = this.getCacheKey(resourceId, collection);
    return this.locks.get(key) || null;
  }
  
  /**
   * Set lock data for a resource
   */
  set(resourceId: string | undefined, collection: string, lockInfo: any, hasLock: boolean = false, shouldRelease: boolean = false): void {
    if (!resourceId) return;
    
    const key = this.getCacheKey(resourceId, collection);
    const data: LockStoreData = {
      lockInfo,
      hasLock,
      shouldRelease,
      lastUpdated: Date.now()
    };
    
    this.locks.set(key, data);
    this.notifySubscribers(key);
    
    // Debug logging
    console.log(`🔐 [LockStore] Stored lock for ${key}:`, {
      hasLock: data.hasLock,
      canEdit: lockInfo?.canEdit,
      isLocked: lockInfo?.isLocked,
      lockedBy: lockInfo?.lockedByName
    });
  }
  
  /**
   * Clear lock data for a resource
   */
  clear(resourceId: string | undefined, collection: string): void {
    if (!resourceId) return;
    
    const key = this.getCacheKey(resourceId, collection);
    const hadLock = this.locks.get(key);
    this.locks.delete(key);
    
    if (hadLock) {
      console.log(`🔐 [LockStore] Cleared lock for ${key}`);
      this.notifySubscribers(key);
    }
  }
  
  /**
   * Update only specific fields of lock data
   */
  update(resourceId: string | undefined, collection: string, updates: Partial<LockStoreData>): void {
    if (!resourceId) return;
    
    const key = this.getCacheKey(resourceId, collection);
    const existing = this.locks.get(key);
    
    if (existing) {
      const updated = {
        ...existing,
        ...updates,
        lastUpdated: Date.now()
      };
      this.locks.set(key, updated);
      this.notifySubscribers(key);
      
      console.log(`🔐 [LockStore] Updated lock for ${key}:`, updates);
    }
  }
  
  /**
   * Subscribe to changes for a specific resource
   */
  subscribe(key: string, callback: () => void): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    
    const callbacks = this.subscribers.get(key)!;
    callbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.subscribers.delete(key);
      }
    };
  }
  
  /**
   * Notify all subscribers of a change
   */
  private notifySubscribers(key: string): void {
    const callbacks = this.subscribers.get(key);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error(`🔐 [LockStore] Error notifying subscriber:`, error);
        }
      });
    }
  }
  
  /**
   * Check if a resource has an active lock
   */
  hasActiveLock(resourceId: string | undefined, collection: string): boolean {
    if (!resourceId) return false;
    
    const data = this.get(resourceId, collection);
    return data?.hasLock === true || data?.lockInfo?.canEdit === true;
  }
  
  /**
   * Get all active locks (for debugging)
   */
  getAllLocks(): Map<string, LockStoreData> {
    return new Map(this.locks);
  }
  
  /**
   * Clear all locks (for cleanup/testing)
   */
  clearAll(): void {
    const keys = Array.from(this.locks.keys());
    this.locks.clear();
    
    // Notify all subscribers
    keys.forEach(key => this.notifySubscribers(key));
    
    console.log(`🔐 [LockStore] Cleared all locks`);
  }
  
  /**
   * Clean up stale locks (older than specified milliseconds)
   */
  cleanupStale(maxAgeMs: number = 30 * 60 * 1000): void {
    const now = Date.now();
    const staleKeys: string[] = [];
    
    this.locks.forEach((data, key) => {
      if (now - data.lastUpdated > maxAgeMs) {
        staleKeys.push(key);
      }
    });
    
    staleKeys.forEach(key => {
      this.locks.delete(key);
      this.notifySubscribers(key);
    });
    
    if (staleKeys.length > 0) {
      console.log(`🔐 [LockStore] Cleaned up ${staleKeys.length} stale locks`);
    }
  }
}

// Export singleton instance
export const lockStore = new LockStore();

// For debugging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).__lockStore = lockStore;
}