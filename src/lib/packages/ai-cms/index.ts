/**
 * AI-CMS Package - Main Export
 * 
 * Comprehensive AI content management system for web applications.
 * This package provides all AI functionality for content generation,
 * multi-field editing, and AI-powered content management.
 * 
 * @example
 * // Import components
 * import { 
 *   AIMultiFieldDialog, 
 *   AIContentBlockDialog,
 *   AIModelSelector 
 * } from '@/lib/packages/ai-cms';
 * 
 * // Import hooks
 * import { useAIGeneration, useAIModel } from '@/lib/packages/ai-cms';
 * 
 * // Import services
 * import { AIService } from '@/lib/packages/ai-cms';
 */

// ===== COMPONENTS =====

// Dialog Components
export { AIMultiFieldDialog } from './components/dialogs/AIMultiFieldDialog';
export { AIContentBlockDialog } from './components/dialogs/AIContentBlockDialog';

// Selector Components
export { AIModelSelector } from './components/selectors/AIModelSelector';

// Field Components
export { FieldComparison } from './components/fields/FieldComparison';
export { FieldToggle } from './components/fields/FieldToggle';

// Tab Components
export { AITab } from './components/tabs/AITab';

// ===== CONTEXTS =====

// Context Providers and Hooks
export {
  AIModelProvider,
  useAIModel
} from './contexts/AIModelContext';

export {
  AIEditingProvider,
  useAIEditing
} from './contexts/AIEditingContext';

// Configuration Context
export {
  AIConfigProvider,
  useAIConfig,
  useAIEndpoints,
  useAIEndpoint
} from './contexts/AIConfigContext';

// ===== PROVIDERS =====

// Unified Providers
export {
  AIProvider,
  DevAIProvider
} from './providers/AIProvider';

// ===== HOOKS =====

// AI Generation Hooks
export {
  useAIGeneration
} from './hooks/useAIGeneration';

export {
  useRefinement
} from './hooks/useRefinement';

export {
  useFieldComparison
} from './hooks/useFieldComparison';

// Combined Hook (provides all AI functionality)
export {
  useAIComplete
} from './hooks';

// Magazine Section Generation Hook
export {
  useSectionGeneration
} from './hooks/useSectionGeneration';

// ===== TYPES =====

// Core AI Types
export type {
  AIModel,
  AIResponse,
  AIGenerationState,
  AIGenerationStatus
} from './types/ai.types';

// Field Types
export type {
  FieldDefinition,
  FieldType,
  FieldUpdateResult,
  FieldComparison as FieldComparisonType
} from './types/field.types';

// Request Types
export type {
  GenerateRequest,
  RefineRequest,
  ContentBlockRequest,
  SingleFieldRequest
} from './types/request.types';

// Response Types
export type {
  GenerationResponse,
  AIMultiFieldResponse,
  AIContentBlockResponse,
  AISingleFieldResponse,
  RefineResponse,
  ErrorResponse,
  GenerateResponse,
  ContentBlockResponse,
  SingleFieldResponse
} from './types/response.types';

// Component Types
export type {
  AIDialogProps,
  AIMultiFieldDialogProps,
  AIContentBlockDialogProps,
  ModelSelectorProps,
  FieldComparisonProps,
  FieldToggleProps,
  AITabProps
} from './types/component.types';

// Configuration Types
export type {
  AIEndpoints
} from './types';

// ===== CONFIGURATION =====

// AI Model Configuration
export {
  AI_MODELS,
  DEFAULT_MODEL,
  getModelConfig,
  getDefaultModel,
  getAvailableModels,
  isValidModel
} from './config/models';

// Field Mappings
export {
  FIELD_MAPPINGS,
  getFieldsForContentType,
  getFieldDefinition,
  getUpdatableFieldNames
} from './config/fieldMappings';

// Content Types
export {
  CONTENT_TYPES,
  getContentTypeConfig,
  getContentTypesByCategory,
  getSupportedModes,
  getDefaultPrompts,
  getAllContentTypes
} from './config/contentTypes';

// Rate Limits and Constraints
export {
  RATE_LIMITS,
  GENERATION_LIMITS,
  CONTENT_LIMITS,
  SECURITY_LIMITS,
  getRateLimitForUser,
  isWithinLimits,
  validateContent
} from './config/limits';

// Magazine Section Configuration
export {
  getMagazineSectionConfig,
  getAllMagazineSectionTypes,
  getMagazineSectionsByComplexity
} from './config/magazine/sectionMappings';

// ===== UTILITIES =====

// HTML Formatting Utilities
export {
  formatHtmlForDisplay,
  stripHtmlTags,
  textToHtml,
  sanitizeHtml,
  getHtmlTextLength,
  truncateHtml,
  getHtmlPreview
} from './utils/formatters/htmlFormatter';

// Text Formatting Utilities
export {
  capitalize,
  toTitleCase,
  truncateText,
  extractWords,
  countWords,
  estimateReadingTime,
  slugify,
  normalizeWhitespace,
  toSentenceCase,
  wrapText,
  getInitials,
  formatName
} from './utils/formatters/textFormatter';

// ===== VERSION INFO =====

/**
 * Package version and metadata
 */
export const AI_CMS_VERSION = '1.0.0';
export const AI_CMS_NAME = 'AI Content Management System';
export const AI_CMS_DESCRIPTION = 'Modular AI-powered content management and editing system';

/**
 * Feature flags for different capabilities
 */
export const FEATURES = {
  MULTI_FIELD_EDITING: true,
  CONTENT_BLOCK_EDITING: true,
  REFINEMENT_MODE: true,
  FIELD_COMPARISON: true,
  MODEL_SELECTION: true,
  RATE_LIMITING: true,
  STREAMING_RESPONSES: false, // Future feature
  BATCH_GENERATION: false,    // Future feature
  CUSTOM_TEMPLATES: false,    // Future feature
  VOICE_INPUT: false          // Future feature
} as const;

/**
 * Default export for convenience
 */
export default {
  version: AI_CMS_VERSION,
  name: AI_CMS_NAME,
  description: AI_CMS_DESCRIPTION,
  features: FEATURES
};