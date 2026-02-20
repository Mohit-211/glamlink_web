/**
 * AI-CMS Types - Main Export
 * 
 * Centralized export for all type definitions
 */

// Core AI Types
export type {
  AIModel,
  AIModelConfig,
  AIResponse,
  AIGenerationResult,
  AIServiceConfig,
  GenerationParams,
  RefinementParams,
  AIModelContextType,
  AIGenerationStatus,
  AIGenerationState
} from './ai.types';

// Field Types
export type {
  FieldDefinition,
  FieldType,
  FieldValidation,
  FieldComparison,
  ContentBlockField,
  ContentBlockGroup,
  ContentTypeMapping,
  FieldMappingConfig,
  FieldUpdate,
  FieldComparisonOptions,
  FieldToggleState
} from './field.types';

// Request Types
export type {
  BaseAIRequest,
  MultiFieldRequest,
  ContentBlockRequest,
  SingleFieldRequest,
  GenerateRequest,
  RefineRequest,
  GenerationOptions,
  BatchGenerationRequest,
  RequestContext,
  HandlerOptions,
  MiddlewareRequest
} from './request.types';

// Response Types
export type {
  BaseAIResponse,
  AIMultiFieldResponse,
  AIContentBlockResponse,
  AISingleFieldResponse,
  GenerationResponse,
  RefineResponse,
  ErrorResponse,
  BatchGenerationResponse,
  ValidationResponse,
  ValidationError,
  ValidationWarning,
  StreamingResponse,
  RateLimitResponse,
  AuthenticationResponse,
  HealthCheckResponse,
  // Legacy aliases
  GenerateResponse,
  ContentBlockResponse,
  SingleFieldResponse
} from './response.types';

// Component Types
export type {
  AIDialogProps,
  AIMultiFieldDialogProps,
  AIContentBlockDialogProps,
  ModelSelectorProps,
  FieldComparisonProps,
  FieldToggleProps,
  AITabProps,
  UseAIGenerationProps,
  UseAIModelProps,
  UseFieldComparisonProps,
  UseRefinementProps,
  UsePromptHistoryProps,
  LoadingState,
  ErrorState,
  GenerationProgress,
  AIButtonProps
} from './component.types';

// Additional legacy types
export type AIEndpoints = {
  multiField: string;
  contentBlock: string;
  singleField: string;
};