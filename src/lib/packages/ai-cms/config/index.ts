/**
 * AI-CMS Config - Main Export
 * 
 * Centralized export for all configuration files
 */

// Model Configuration
export {
  AI_MODELS,
  DEFAULT_MODEL,
  MODEL_SELECTION_STORAGE_KEY,
  getModelConfig,
  getDefaultModel,
  getAvailableModels,
  isValidModel
} from './models';

// Field Mapping Configuration
export {
  FIELD_MAPPINGS,
  getFieldsForContentType,
  getFieldDefinition,
  getUpdatableFieldNames
} from './fieldMappings';

// Content Type Configuration
export {
  CONTENT_TYPES,
  getContentTypeConfig,
  getContentTypesByCategory,
  getSupportedModes,
  getDefaultPrompts,
  getAllContentTypes
} from './contentTypes';

// Rate Limits and Constraints
export {
  RATE_LIMITS,
  GENERATION_LIMITS,
  CONTENT_LIMITS,
  SECURITY_LIMITS,
  getRateLimitForUser,
  isWithinLimits,
  validateContent
} from './limits';

// Type exports
export type {
  ContentTypeConfig
} from './contentTypes';

export type {
  RateLimitConfig,
  GenerationLimits,
  UserLimits
} from './limits';