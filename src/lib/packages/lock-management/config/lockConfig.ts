/**
 * Lock Management Configuration
 * 
 * Central configuration for lock duration, timeouts, and other settings.
 * 
 * Note: No 'use client' directive - this configuration works on both client and server.
 */

import { LockConfig } from '../types/lock.types';

// Default lock configuration
export const DEFAULT_LOCK_CONFIG: Required<Omit<LockConfig, 'lockGroup'>> & { lockGroup?: string } = {
  lockDurationMinutes: 5,           // Locks expire after 5 minutes
  refreshIntervalMs: 2 * 60 * 1000, // Refresh every 2 minutes
  autoRefresh: true,                // Automatically extend locks
  maxLockAttempts: 3,               // Max attempts before giving up
  warningThresholdMs: 60 * 1000,    // Show warning when < 1 minute left
  cleanupIntervalMs: 10 * 60 * 1000, // Clean expired locks every 10 minutes
  allowTransfer: true,              // Allow same-user tab transfers
  lockGroup: undefined              // No default lock group
};

// Environment-specific configurations
export const DEVELOPMENT_CONFIG: Partial<LockConfig> = {
  lockDurationMinutes: 1,           // Shorter locks for dev
  refreshIntervalMs: 10 * 1000,     // Refresh every 10 seconds
  warningThresholdMs: 15 * 1000,    // Warn at 15 seconds
  cleanupIntervalMs: 30 * 1000      // Cleanup every 30 seconds
};

export const PRODUCTION_CONFIG: Partial<LockConfig> = {
  lockDurationMinutes: 10,          // Longer locks for production
  refreshIntervalMs: 3 * 60 * 1000, // Refresh every 3 minutes
  warningThresholdMs: 2 * 60 * 1000, // Warn at 2 minutes
  maxLockAttempts: 5                // More attempts in production
};

export const TEST_CONFIG: Partial<LockConfig> = {
  lockDurationMinutes: 0.1,         // 6 seconds for testing
  refreshIntervalMs: 1000,          // Refresh every second
  warningThresholdMs: 2000,         // Warn at 2 seconds
  cleanupIntervalMs: 5000,          // Cleanup every 5 seconds
  autoRefresh: false                // Manual control in tests
};

// Get configuration based on environment
export function getEnvironmentConfig(): LockConfig {
  const env = process.env.NODE_ENV;
  
  switch (env) {
    case 'development':
      return { ...DEFAULT_LOCK_CONFIG, ...DEVELOPMENT_CONFIG };
    case 'production':
      return { ...DEFAULT_LOCK_CONFIG, ...PRODUCTION_CONFIG };
    case 'test':
      return { ...DEFAULT_LOCK_CONFIG, ...TEST_CONFIG };
    default:
      return DEFAULT_LOCK_CONFIG;
  }
}

// Lock priority configurations
export const LOCK_PRIORITY_CONFIG = {
  high: {
    lockDurationMinutes: 15,
    refreshIntervalMs: 5 * 60 * 1000, // 5 minutes
    maxLockAttempts: 10
  },
  medium: {
    lockDurationMinutes: 5,
    refreshIntervalMs: 2 * 60 * 1000, // 2 minutes
    maxLockAttempts: 3
  },
  low: {
    lockDurationMinutes: 2,
    refreshIntervalMs: 30 * 1000,     // 30 seconds
    maxLockAttempts: 1
  }
};

// Collection-specific configurations
export const COLLECTION_CONFIG: Record<string, Partial<LockConfig>> = {
  magazine_issues: {
    lockDurationMinutes: 10,          // Magazine issues need longer locks
    lockGroup: 'magazine-metadata'
  },
  sections: {
    lockDurationMinutes: 5,           // Individual sections
    allowTransfer: true
  },
  documents: {
    lockDurationMinutes: 15,          // Long-form editing
    refreshIntervalMs: 60 * 1000      // Refresh every minute
  },
  comments: {
    lockDurationMinutes: 2,           // Quick edits
    autoRefresh: false
  }
};

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000,          // 15 minutes
  maxRequests: {
    acquire: 50,                     // Max 50 lock acquisitions per window
    release: 100,                    // Max 100 releases per window
    extend: 200,                     // Max 200 extensions per window
    transfer: 20                     // Max 20 transfers per window
  }
};

// Validation rules
export const VALIDATION_CONFIG = {
  maxLockDurationMinutes: 60,        // No lock longer than 1 hour
  minLockDurationMinutes: 0.1,       // Minimum 6 seconds (for testing)
  maxRefreshIntervalMs: 15 * 60 * 1000, // Don't refresh less than every 15 minutes
  minRefreshIntervalMs: 1000,        // Don't refresh more than every second
  maxResourceIdLength: 255,
  maxCollectionNameLength: 100,
  maxUserNameLength: 255,
  maxLockGroupLength: 100
};

// Feature flags
export const FEATURE_FLAGS = {
  enableWebSocketUpdates: false,     // Real-time updates via WebSocket
  enableLockAnalytics: false,        // Track lock usage statistics
  enableAdminOverride: true,         // Allow admin to force release locks
  enableLockQueue: false,            // Queue lock requests
  enableOfflineSupport: false,       // Handle locks when offline
  enableLockPrediction: false        // Predict when user will need locks
};

// Cache configuration
export const CACHE_CONFIG = {
  lockStatusTtlMs: 30 * 1000,        // Cache lock status for 30 seconds
  userInfoTtlMs: 5 * 60 * 1000,      // Cache user info for 5 minutes
  lockStatsTtlMs: 60 * 1000,         // Cache lock stats for 1 minute
  maxCacheSize: 1000,                // Max cached items
  enableCaching: true
};

// Notification configuration
export const NOTIFICATION_CONFIG = {
  showLockAcquired: false,           // Don't spam with acquisition notifications
  showLockReleased: false,           // Don't show release notifications
  showLockConflict: true,            // Always show conflicts
  showLockExpiring: true,            // Warn about expiration
  showLockTransferred: true,         // Show transfer notifications
  
  // Timing
  expirationWarningMs: 2 * 60 * 1000, // Warn 2 minutes before expiration
  conflictRetryDelayMs: 5 * 1000,    // Wait 5 seconds before retry suggestion
  notificationDurationMs: 5 * 1000   // Show notifications for 5 seconds
};

// Export a function to create custom configurations
export function createLockConfig(overrides: Partial<LockConfig> = {}): Required<Omit<LockConfig, 'lockGroup'>> & { lockGroup?: string } {
  return {
    ...getEnvironmentConfig(),
    ...overrides
  } as Required<Omit<LockConfig, 'lockGroup'>> & { lockGroup?: string };
}

// Export a function to merge collection-specific config
export function getConfigForCollection(collection: string, overrides?: Partial<LockConfig>): Required<Omit<LockConfig, 'lockGroup'>> & { lockGroup?: string } {
  const baseConfig = getEnvironmentConfig();
  const collectionConfig = COLLECTION_CONFIG[collection] || {};
  
  return {
    ...baseConfig,
    ...collectionConfig,
    ...overrides
  } as Required<Omit<LockConfig, 'lockGroup'>> & { lockGroup?: string };
}

// Validation function for lock config
export function validateLockConfig(config: Partial<LockConfig>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (config.lockDurationMinutes !== undefined) {
    if (config.lockDurationMinutes > VALIDATION_CONFIG.maxLockDurationMinutes) {
      errors.push(`lockDurationMinutes cannot exceed ${VALIDATION_CONFIG.maxLockDurationMinutes}`);
    }
    if (config.lockDurationMinutes < VALIDATION_CONFIG.minLockDurationMinutes) {
      errors.push(`lockDurationMinutes cannot be less than ${VALIDATION_CONFIG.minLockDurationMinutes}`);
    }
  }
  
  if (config.refreshIntervalMs !== undefined) {
    if (config.refreshIntervalMs > VALIDATION_CONFIG.maxRefreshIntervalMs) {
      errors.push(`refreshIntervalMs cannot exceed ${VALIDATION_CONFIG.maxRefreshIntervalMs}`);
    }
    if (config.refreshIntervalMs < VALIDATION_CONFIG.minRefreshIntervalMs) {
      errors.push(`refreshIntervalMs cannot be less than ${VALIDATION_CONFIG.minRefreshIntervalMs}`);
    }
  }
  
  if (config.maxLockAttempts !== undefined && config.maxLockAttempts < 1) {
    errors.push('maxLockAttempts must be at least 1');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Aliases for backward compatibility with expected export names
export const defaultLockConfig = DEFAULT_LOCK_CONFIG;
export const collectionConfigs = COLLECTION_CONFIG;