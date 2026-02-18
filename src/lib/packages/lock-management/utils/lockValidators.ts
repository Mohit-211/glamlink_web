/**
 * Lock Validators - Validation functions for lock management
 * 
 * Comprehensive validation utilities for lock operations, data, and configurations.
 * 
 * Note: No 'use client' directive - this utility works on both client and server.
 */

import { 
  LockConfig, 
  LockDocument, 
  LockStatus,
  TabInfo
} from '../types/lock.types';

import { 
  AcquireLockRequest,
  ReleaseLockRequest,
  ExtendLockRequest,
  TransferLockRequest
} from '../types/api.types';

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  code: string;
  message: string;
  value?: any;
}

/**
 * Validate acquire lock request
 */
export function validateAcquireLockRequest(request: any): ValidationResult {
  const errors: ValidationError[] = [];

  // Required fields
  if (!request.userId || typeof request.userId !== 'string') {
    errors.push({
      field: 'userId',
      code: 'REQUIRED',
      message: 'User ID is required and must be a string',
      value: request.userId
    });
  } else if (request.userId.length > 255) {
    errors.push({
      field: 'userId',
      code: 'TOO_LONG',
      message: 'User ID cannot exceed 255 characters',
      value: request.userId
    });
  }

  if (!request.userEmail || typeof request.userEmail !== 'string') {
    errors.push({
      field: 'userEmail',
      code: 'REQUIRED',
      message: 'User email is required and must be a string',
      value: request.userEmail
    });
  } else if (!isValidEmail(request.userEmail)) {
    errors.push({
      field: 'userEmail',
      code: 'INVALID_FORMAT',
      message: 'User email must be a valid email address',
      value: request.userEmail
    });
  }

  // Optional fields validation
  if (request.userName && typeof request.userName !== 'string') {
    errors.push({
      field: 'userName',
      code: 'INVALID_TYPE',
      message: 'User name must be a string',
      value: request.userName
    });
  } else if (request.userName && request.userName.length > 255) {
    errors.push({
      field: 'userName',
      code: 'TOO_LONG',
      message: 'User name cannot exceed 255 characters',
      value: request.userName
    });
  }

  if (request.tabId && typeof request.tabId !== 'string') {
    errors.push({
      field: 'tabId',
      code: 'INVALID_TYPE',
      message: 'Tab ID must be a string',
      value: request.tabId
    });
  } else if (request.tabId && request.tabId.length > 100) {
    errors.push({
      field: 'tabId',
      code: 'TOO_LONG',
      message: 'Tab ID cannot exceed 100 characters',
      value: request.tabId
    });
  }

  if (request.lockGroup && typeof request.lockGroup !== 'string') {
    errors.push({
      field: 'lockGroup',
      code: 'INVALID_TYPE',
      message: 'Lock group must be a string',
      value: request.lockGroup
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate release lock request
 */
export function validateReleaseLockRequest(request: any): ValidationResult {
  const errors: ValidationError[] = [];

  if (!request.userId || typeof request.userId !== 'string') {
    errors.push({
      field: 'userId',
      code: 'REQUIRED',
      message: 'User ID is required and must be a string',
      value: request.userId
    });
  }

  if (request.force !== undefined && typeof request.force !== 'boolean') {
    errors.push({
      field: 'force',
      code: 'INVALID_TYPE',
      message: 'Force flag must be a boolean',
      value: request.force
    });
  }

  if (request.reason && typeof request.reason !== 'string') {
    errors.push({
      field: 'reason',
      code: 'INVALID_TYPE',
      message: 'Reason must be a string',
      value: request.reason
    });
  } else if (request.reason && request.reason.length > 500) {
    errors.push({
      field: 'reason',
      code: 'TOO_LONG',
      message: 'Reason cannot exceed 500 characters',
      value: request.reason
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate extend lock request
 */
export function validateExtendLockRequest(request: any): ValidationResult {
  const errors: ValidationError[] = [];

  if (!request.userId || typeof request.userId !== 'string') {
    errors.push({
      field: 'userId',
      code: 'REQUIRED',
      message: 'User ID is required and must be a string',
      value: request.userId
    });
  }

  if (request.extendByMinutes !== undefined) {
    if (typeof request.extendByMinutes !== 'number') {
      errors.push({
        field: 'extendByMinutes',
        code: 'INVALID_TYPE',
        message: 'Extend by minutes must be a number',
        value: request.extendByMinutes
      });
    } else if (request.extendByMinutes <= 0) {
      errors.push({
        field: 'extendByMinutes',
        code: 'INVALID_VALUE',
        message: 'Extend by minutes must be greater than 0',
        value: request.extendByMinutes
      });
    } else if (request.extendByMinutes > 1440) { // 24 hours max
      errors.push({
        field: 'extendByMinutes',
        code: 'TOO_LARGE',
        message: 'Cannot extend lock by more than 1440 minutes (24 hours)',
        value: request.extendByMinutes
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate transfer lock request
 */
export function validateTransferLockRequest(request: any): ValidationResult {
  const errors: ValidationError[] = [];

  if (!request.userId || typeof request.userId !== 'string') {
    errors.push({
      field: 'userId',
      code: 'REQUIRED',
      message: 'User ID is required and must be a string',
      value: request.userId
    });
  }

  if (!request.newTabId || typeof request.newTabId !== 'string') {
    errors.push({
      field: 'newTabId',
      code: 'REQUIRED',
      message: 'New tab ID is required and must be a string',
      value: request.newTabId
    });
  }

  if (request.forceTransfer !== undefined && typeof request.forceTransfer !== 'boolean') {
    errors.push({
      field: 'forceTransfer',
      code: 'INVALID_TYPE',
      message: 'Force transfer flag must be a boolean',
      value: request.forceTransfer
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate resource identifiers
 */
export function validateResourceIdentifiers(
  resourceId: any,
  collection: any
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!resourceId || typeof resourceId !== 'string') {
    errors.push({
      field: 'resourceId',
      code: 'REQUIRED',
      message: 'Resource ID is required and must be a string',
      value: resourceId
    });
  } else if (resourceId.length > 255) {
    errors.push({
      field: 'resourceId',
      code: 'TOO_LONG',
      message: 'Resource ID cannot exceed 255 characters',
      value: resourceId
    });
  } else if (!/^[a-zA-Z0-9_-]+$/.test(resourceId)) {
    errors.push({
      field: 'resourceId',
      code: 'INVALID_FORMAT',
      message: 'Resource ID can only contain letters, numbers, underscores, and hyphens',
      value: resourceId
    });
  }

  if (!collection || typeof collection !== 'string') {
    errors.push({
      field: 'collection',
      code: 'REQUIRED',
      message: 'Collection name is required and must be a string',
      value: collection
    });
  } else if (collection.length > 100) {
    errors.push({
      field: 'collection',
      code: 'TOO_LONG',
      message: 'Collection name cannot exceed 100 characters',
      value: collection
    });
  } else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(collection)) {
    errors.push({
      field: 'collection',
      code: 'INVALID_FORMAT',
      message: 'Collection name must start with a letter and contain only letters, numbers, and underscores',
      value: collection
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate lock configuration
 */
export function validateLockConfig(config: any): ValidationResult {
  const errors: ValidationError[] = [];

  if (config.lockDurationMinutes !== undefined) {
    if (typeof config.lockDurationMinutes !== 'number') {
      errors.push({
        field: 'lockDurationMinutes',
        code: 'INVALID_TYPE',
        message: 'Lock duration must be a number',
        value: config.lockDurationMinutes
      });
    } else if (config.lockDurationMinutes <= 0) {
      errors.push({
        field: 'lockDurationMinutes',
        code: 'INVALID_VALUE',
        message: 'Lock duration must be greater than 0',
        value: config.lockDurationMinutes
      });
    } else if (config.lockDurationMinutes > 1440) { // 24 hours
      errors.push({
        field: 'lockDurationMinutes',
        code: 'TOO_LARGE',
        message: 'Lock duration cannot exceed 1440 minutes (24 hours)',
        value: config.lockDurationMinutes
      });
    }
  }

  if (config.refreshIntervalMs !== undefined) {
    if (typeof config.refreshIntervalMs !== 'number') {
      errors.push({
        field: 'refreshIntervalMs',
        code: 'INVALID_TYPE',
        message: 'Refresh interval must be a number',
        value: config.refreshIntervalMs
      });
    } else if (config.refreshIntervalMs < 1000) {
      errors.push({
        field: 'refreshIntervalMs',
        code: 'TOO_SMALL',
        message: 'Refresh interval cannot be less than 1000ms (1 second)',
        value: config.refreshIntervalMs
      });
    } else if (config.refreshIntervalMs > 900000) { // 15 minutes
      errors.push({
        field: 'refreshIntervalMs',
        code: 'TOO_LARGE',
        message: 'Refresh interval cannot exceed 900000ms (15 minutes)',
        value: config.refreshIntervalMs
      });
    }
  }

  if (config.maxLockAttempts !== undefined) {
    if (typeof config.maxLockAttempts !== 'number') {
      errors.push({
        field: 'maxLockAttempts',
        code: 'INVALID_TYPE',
        message: 'Max lock attempts must be a number',
        value: config.maxLockAttempts
      });
    } else if (config.maxLockAttempts < 1) {
      errors.push({
        field: 'maxLockAttempts',
        code: 'TOO_SMALL',
        message: 'Max lock attempts must be at least 1',
        value: config.maxLockAttempts
      });
    } else if (config.maxLockAttempts > 100) {
      errors.push({
        field: 'maxLockAttempts',
        code: 'TOO_LARGE',
        message: 'Max lock attempts cannot exceed 100',
        value: config.maxLockAttempts
      });
    }
  }

  if (config.autoRefresh !== undefined && typeof config.autoRefresh !== 'boolean') {
    errors.push({
      field: 'autoRefresh',
      code: 'INVALID_TYPE',
      message: 'Auto refresh must be a boolean',
      value: config.autoRefresh
    });
  }

  if (config.allowTransfer !== undefined && typeof config.allowTransfer !== 'boolean') {
    errors.push({
      field: 'allowTransfer',
      code: 'INVALID_TYPE',
      message: 'Allow transfer must be a boolean',
      value: config.allowTransfer
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate lock document data
 */
export function validateLockDocument(lockData: any): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate timestamp fields
  const timestampFields = ['lockedAt', 'lockExpiresAt', 'lastModified'];
  for (const field of timestampFields) {
    if (lockData[field] && !isValidTimestamp(lockData[field])) {
      errors.push({
        field,
        code: 'INVALID_FORMAT',
        message: `${field} must be a valid ISO timestamp`,
        value: lockData[field]
      });
    }
  }

  // Validate string fields
  const stringFields = ['lockedBy', 'lockedByEmail', 'lockedByName', 'lockedTabId', 'lockGroup'];
  for (const field of stringFields) {
    if (lockData[field] && typeof lockData[field] !== 'string') {
      errors.push({
        field,
        code: 'INVALID_TYPE',
        message: `${field} must be a string`,
        value: lockData[field]
      });
    }
  }

  // Validate email format
  if (lockData.lockedByEmail && !isValidEmail(lockData.lockedByEmail)) {
    errors.push({
      field: 'lockedByEmail',
      code: 'INVALID_FORMAT',
      message: 'lockedByEmail must be a valid email address',
      value: lockData.lockedByEmail
    });
  }

  // Validate lock consistency
  if (lockData.lockedBy && !lockData.lockExpiresAt) {
    errors.push({
      field: 'lockExpiresAt',
      code: 'REQUIRED_WHEN_LOCKED',
      message: 'lockExpiresAt is required when lockedBy is set',
      value: lockData.lockExpiresAt
    });
  }

  if (lockData.lockExpiresAt && !lockData.lockedBy) {
    errors.push({
      field: 'lockedBy',
      code: 'REQUIRED_WHEN_EXPIRES',
      message: 'lockedBy is required when lockExpiresAt is set',
      value: lockData.lockedBy
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate tab information
 */
export function validateTabInfo(tabInfo: any): ValidationResult {
  const errors: ValidationError[] = [];

  if (!tabInfo.tabId || typeof tabInfo.tabId !== 'string') {
    errors.push({
      field: 'tabId',
      code: 'REQUIRED',
      message: 'Tab ID is required and must be a string',
      value: tabInfo.tabId
    });
  }

  if (!tabInfo.lastActivity || !isValidTimestamp(tabInfo.lastActivity)) {
    errors.push({
      field: 'lastActivity',
      code: 'REQUIRED',
      message: 'Last activity must be a valid ISO timestamp',
      value: tabInfo.lastActivity
    });
  }

  if (tabInfo.isActive !== undefined && typeof tabInfo.isActive !== 'boolean') {
    errors.push({
      field: 'isActive',
      code: 'INVALID_TYPE',
      message: 'isActive must be a boolean',
      value: tabInfo.isActive
    });
  }

  if (tabInfo.resourceId && typeof tabInfo.resourceId !== 'string') {
    errors.push({
      field: 'resourceId',
      code: 'INVALID_TYPE',
      message: 'Resource ID must be a string',
      value: tabInfo.resourceId
    });
  }

  if (tabInfo.collection && typeof tabInfo.collection !== 'string') {
    errors.push({
      field: 'collection',
      code: 'INVALID_TYPE',
      message: 'Collection must be a string',
      value: tabInfo.collection
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate batch operation requests
 */
export function validateBatchRequest(operations: any[]): ValidationResult {
  const errors: ValidationError[] = [];

  if (!Array.isArray(operations)) {
    errors.push({
      field: 'operations',
      code: 'INVALID_TYPE',
      message: 'Operations must be an array',
      value: operations
    });
    return { isValid: false, errors };
  }

  if (operations.length === 0) {
    errors.push({
      field: 'operations',
      code: 'EMPTY_ARRAY',
      message: 'Operations array cannot be empty',
      value: operations
    });
  } else if (operations.length > 100) {
    errors.push({
      field: 'operations',
      code: 'TOO_MANY',
      message: 'Cannot process more than 100 operations in a single batch',
      value: operations.length
    });
  }

  // Validate each operation
  operations.forEach((operation, index) => {
    const validOperations = ['acquire', 'release', 'extend', 'transfer'];
    if (!operation.operation || !validOperations.includes(operation.operation)) {
      errors.push({
        field: `operations[${index}].operation`,
        code: 'INVALID_VALUE',
        message: `Operation must be one of: ${validOperations.join(', ')}`,
        value: operation.operation
      });
    }

    const resourceValidation = validateResourceIdentifiers(
      operation.resourceId,
      operation.collection
    );

    if (!resourceValidation.isValid) {
      resourceValidation.errors.forEach(error => {
        errors.push({
          ...error,
          field: `operations[${index}].${error.field}`
        });
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize and validate user input
 */
export function sanitizeUserInput(input: any, maxLength: number = 1000): string {
  if (typeof input !== 'string') return '';
  
  // Remove potentially dangerous characters
  let sanitized = input.replace(/[<>\"'&]/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Check if lock operation is allowed based on current state
 */
export function isLockOperationAllowed(
  operation: 'acquire' | 'release' | 'extend' | 'transfer',
  currentLock: LockStatus | null,
  userId: string
): { allowed: boolean; reason?: string } {
  if (!currentLock) {
    if (operation === 'acquire') return { allowed: true };
    return { allowed: false, reason: 'No lock exists to operate on' };
  }

  switch (operation) {
    case 'acquire':
      if (!currentLock.isLocked) return { allowed: true };
      if (currentLock.lockedBy === userId) {
        return { allowed: false, reason: 'You already hold this lock' };
      }
      return { allowed: false, reason: 'Resource is locked by another user' };

    case 'release':
    case 'extend':
      if (!currentLock.isLocked) {
        return { allowed: false, reason: 'Resource is not locked' };
      }
      if (currentLock.lockedBy !== userId) {
        return { allowed: false, reason: 'You do not hold this lock' };
      }
      if (currentLock.isExpired) {
        return { allowed: false, reason: 'Lock has expired' };
      }
      return { allowed: true };

    case 'transfer':
      if (!currentLock.isLocked) {
        return { allowed: false, reason: 'Resource is not locked' };
      }
      if (currentLock.lockedBy !== userId) {
        return { allowed: false, reason: 'You do not hold this lock' };
      }
      if (!currentLock.isMultiTabConflict) {
        return { allowed: false, reason: 'No multi-tab conflict to resolve' };
      }
      return { allowed: true };

    default:
      return { allowed: false, reason: 'Unknown operation' };
  }
}

// Helper functions

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 320; // RFC 5321 limit
}

function isValidTimestamp(timestamp: string): boolean {
  try {
    const date = new Date(timestamp);
    return !isNaN(date.getTime()) && timestamp.includes('T');
  } catch {
    return false;
  }
}

/**
 * Create a comprehensive validation report
 */
export function createValidationReport(
  validationResults: ValidationResult[]
): {
  isValid: boolean;
  totalErrors: number;
  errorsByField: Record<string, ValidationError[]>;
  errorsBySeverity: Record<string, ValidationError[]>;
  summary: string;
} {
  const allErrors = validationResults.flatMap(result => result.errors);
  const errorsByField: Record<string, ValidationError[]> = {};
  const errorsBySeverity: Record<string, ValidationError[]> = {
    required: [],
    format: [],
    constraint: [],
    other: []
  };

  allErrors.forEach(error => {
    // Group by field
    if (!errorsByField[error.field]) {
      errorsByField[error.field] = [];
    }
    errorsByField[error.field].push(error);

    // Group by severity
    if (error.code.includes('REQUIRED')) {
      errorsBySeverity.required.push(error);
    } else if (error.code.includes('FORMAT') || error.code.includes('TYPE')) {
      errorsBySeverity.format.push(error);
    } else if (error.code.includes('TOO_') || error.code.includes('INVALID_VALUE')) {
      errorsBySeverity.constraint.push(error);
    } else {
      errorsBySeverity.other.push(error);
    }
  });

  const isValid = allErrors.length === 0;
  const summary = isValid 
    ? 'All validations passed'
    : `${allErrors.length} validation error${allErrors.length === 1 ? '' : 's'} found`;

  return {
    isValid,
    totalErrors: allErrors.length,
    errorsByField,
    errorsBySeverity,
    summary
  };
}