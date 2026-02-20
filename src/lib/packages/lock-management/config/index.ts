/**
 * Lock Management Configuration - Main Export
 * 
 * Centralized exports for all configuration files.
 */

// Import functions we need to use
import { getEnvironmentConfig, getConfigForCollection, validateLockConfig } from './lockConfig';
import { resolveLockGroup, validateLockGroups } from './lockGroups';

// Lock configuration exports
export {
  DEFAULT_LOCK_CONFIG,
  DEVELOPMENT_CONFIG,
  PRODUCTION_CONFIG,
  TEST_CONFIG,
  LOCK_PRIORITY_CONFIG,
  COLLECTION_CONFIG,
  RATE_LIMIT_CONFIG,
  VALIDATION_CONFIG,
  FEATURE_FLAGS,
  CACHE_CONFIG,
  NOTIFICATION_CONFIG,
  getEnvironmentConfig,
  createLockConfig,
  getConfigForCollection,
  validateLockConfig
} from './lockConfig';

// Lock groups exports
export {
  LOCK_GROUPS,
  COLLECTION_LOCK_GROUPS,
  getLockGroup,
  getFieldsInGroup,
  doFieldsShareLock,
  getLockGroupPriority,
  getLockGroupMaxDuration,
  getCollectionFieldLockGroup,
  resolveLockGroup,
  validateLockGroups,
  getLockGroupSummary,
  createLockGroupResolver
} from './lockGroups';

// Combined configuration utilities
export function getCompleteConfig(collection?: string, field?: string, overrides?: any) {
  const baseConfig = getEnvironmentConfig();
  const collectionConfig = collection ? getConfigForCollection(collection, overrides) : baseConfig;
  const lockGroup = collection && field ? resolveLockGroup(collection, field) : undefined;
  
  return {
    ...collectionConfig,
    lockGroup,
    collection,
    field
  };
}

// Configuration validator
export function validateCompleteConfig(config: any) {
  const lockConfigValidation = validateLockConfig(config);
  const lockGroupsValidation = validateLockGroups();
  
  return {
    isValid: lockConfigValidation.isValid && lockGroupsValidation.isValid,
    errors: [...lockConfigValidation.errors, ...lockGroupsValidation.errors]
  };
}