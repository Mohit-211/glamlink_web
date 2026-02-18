/**
 * Lock Coordinator Service
 * 
 * Singleton service that coordinates all lock requests across the application
 * to prevent duplicate API calls and manage request deduplication.
 */

interface PendingRequest {
  promise: Promise<any>;
  timestamp: number;
}

interface LockRequest {
  resourceId: string;
  collection: string;
  action: 'acquire' | 'release' | 'extend' | 'transfer' | 'status';
  lockGroup?: string; // Add lock group for better caching
}

class LockCoordinatorService {
  private static instance: LockCoordinatorService;
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private requestCache: Map<string, { data: any; timestamp: number }> = new Map();
  private lockGroupCache: Map<string, { data: any; timestamp: number }> = new Map(); // Cache by lock group
  private readonly CACHE_DURATION = 1000; // 1 second cache for GET requests
  private readonly LOCK_GROUP_CACHE_DURATION = 5000; // 5 seconds for lock group cache
  private readonly REQUEST_TIMEOUT = 5000; // 5 second timeout for pending requests

  private constructor() {
    // Cleanup old requests periodically
    setInterval(() => this.cleanupOldRequests(), 10000);
  }

  static getInstance(): LockCoordinatorService {
    if (!LockCoordinatorService.instance) {
      LockCoordinatorService.instance = new LockCoordinatorService();
    }
    return LockCoordinatorService.instance;
  }

  /**
   * Generate a unique key for a lock request
   */
  private getRequestKey(request: LockRequest): string {
    // If lock group is provided, use it for better caching
    if (request.lockGroup && request.action === 'status') {
      return `${request.collection}:${request.lockGroup}:${request.action}`;
    }
    return `${request.collection}:${request.resourceId}:${request.action}`;
  }

  /**
   * Get lock group cache key
   */
  private getLockGroupKey(collection: string, lockGroup: string): string {
    return `${collection}:group:${lockGroup}`;
  }

  /**
   * Check if we have a pending request for the same resource/action
   */
  hasPendingRequest(request: LockRequest): boolean {
    const key = this.getRequestKey(request);
    const pending = this.pendingRequests.get(key);
    
    if (pending) {
      const age = Date.now() - pending.timestamp;
      if (age < this.REQUEST_TIMEOUT) {
        console.log(`[LockCoordinator] Found pending ${request.action} request for ${key}, reusing...`);
        return true;
      } else {
        // Request is too old, remove it
        this.pendingRequests.delete(key);
      }
    }
    
    return false;
  }

  /**
   * Get the pending request promise
   */
  getPendingRequest(request: LockRequest): Promise<any> | null {
    const key = this.getRequestKey(request);
    const pending = this.pendingRequests.get(key);
    
    if (pending) {
      const age = Date.now() - pending.timestamp;
      if (age < this.REQUEST_TIMEOUT) {
        return pending.promise;
      }
    }
    
    return null;
  }

  /**
   * Register a new request to prevent duplicates
   */
  registerRequest(request: LockRequest, promise: Promise<any>): void {
    const key = this.getRequestKey(request);
    console.log(`[LockCoordinator] Registering ${request.action} request for ${key}`);
    
    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now()
    });

    // Clean up after request completes
    promise.finally(() => {
      this.pendingRequests.delete(key);
    });
  }

  /**
   * Get cached data if available and fresh
   */
  getCachedData(request: LockRequest): any | null {
    // Only cache GET/status requests
    if (request.action !== 'status') {
      return null;
    }

    // First check lock group cache if available
    if (request.lockGroup) {
      const groupKey = this.getLockGroupKey(request.collection, request.lockGroup);
      const groupCached = this.lockGroupCache.get(groupKey);
      
      if (groupCached) {
        const age = Date.now() - groupCached.timestamp;
        if (age < this.LOCK_GROUP_CACHE_DURATION) {
          console.log(`[LockCoordinator] Using lock group cached data for ${groupKey} (age: ${age}ms)`);
          return groupCached.data;
        } else {
          this.lockGroupCache.delete(groupKey);
        }
      }
    }

    // Then check regular cache
    const key = this.getRequestKey(request);
    const cached = this.requestCache.get(key);
    
    if (cached) {
      const age = Date.now() - cached.timestamp;
      if (age < this.CACHE_DURATION) {
        console.log(`[LockCoordinator] Using cached data for ${key} (age: ${age}ms)`);
        return cached.data;
      } else {
        // Cache expired, remove it
        this.requestCache.delete(key);
      }
    }
    
    return null;
  }

  /**
   * Cache response data
   */
  cacheData(request: LockRequest, data: any): void {
    // Only cache GET/status requests
    if (request.action !== 'status') {
      return;
    }

    const key = this.getRequestKey(request);
    this.requestCache.set(key, {
      data,
      timestamp: Date.now()
    });

    // Also cache by lock group if available
    if (request.lockGroup) {
      const groupKey = this.getLockGroupKey(request.collection, request.lockGroup);
      this.lockGroupCache.set(groupKey, {
        data,
        timestamp: Date.now()
      });
      console.log(`[LockCoordinator] Cached data for lock group: ${groupKey}`);
    }
  }

  /**
   * Check if lock group has changed
   */
  hasLockGroupChanged(collection: string, oldGroup?: string, newGroup?: string): boolean {
    if (oldGroup === newGroup) return false;
    if (!oldGroup || !newGroup) return true;
    
    // Clear cache when lock group changes
    if (oldGroup) {
      const oldKey = this.getLockGroupKey(collection, oldGroup);
      this.lockGroupCache.delete(oldKey);
    }
    
    return true;
  }

  /**
   * Execute a lock request with deduplication
   */
  async executeRequest<T>(
    request: LockRequest,
    executeFn: () => Promise<T>
  ): Promise<T> {
    // Check for cached data (GET requests only)
    const cached = this.getCachedData(request);
    if (cached !== null) {
      return cached as T;
    }

    // Check for pending request
    const pending = this.getPendingRequest(request);
    if (pending) {
      console.log(`[LockCoordinator] Reusing pending request for ${this.getRequestKey(request)}`);
      return pending as Promise<T>;
    }

    // Execute new request
    const promise = executeFn().catch(err => {
      // Don't cache or log abort errors - these are expected
      const errorMessage = typeof err === 'string' ? err : err?.message || '';
      if (err?.name === 'AbortError' || 
          errorMessage.includes('abort') || 
          errorMessage.includes('Component unmounting') ||
          err === 'Component unmounting' ||
          err === 'New request started') {
        throw err; // Re-throw abort errors silently without logging
      }
      // For other errors, log and re-throw
      console.error(`[LockCoordinator] Request failed:`, err);
      throw err;
    });
    
    this.registerRequest(request, promise);

    // Cache successful responses (but not if aborted)
    promise.then(data => {
      this.cacheData(request, data);
    }).catch(err => {
      // Ignore caching errors for aborted requests
      if (err?.name !== 'AbortError' && !err?.message?.includes('abort')) {
        console.debug('[LockCoordinator] Failed to cache response:', err);
      }
    });

    return promise;
  }

  /**
   * Clean up old pending requests
   */
  private cleanupOldRequests(): void {
    const now = Date.now();
    const expired: string[] = [];

    this.pendingRequests.forEach((request, key) => {
      if (now - request.timestamp > this.REQUEST_TIMEOUT) {
        expired.push(key);
      }
    });

    expired.forEach(key => {
      console.log(`[LockCoordinator] Cleaning up expired request: ${key}`);
      this.pendingRequests.delete(key);
    });

    // Also clean up old cache entries
    this.requestCache.forEach((cache, key) => {
      if (now - cache.timestamp > this.CACHE_DURATION * 2) {
        this.requestCache.delete(key);
      }
    });
  }

  /**
   * Clear all pending requests and cache
   */
  clear(): void {
    this.pendingRequests.clear();
    this.requestCache.clear();
  }

  /**
   * Get statistics about coordinator state
   */
  getStats(): { pendingRequests: number; cachedResponses: number } {
    return {
      pendingRequests: this.pendingRequests.size,
      cachedResponses: this.requestCache.size
    };
  }
}

// Export singleton instance
export const lockCoordinator = LockCoordinatorService.getInstance();