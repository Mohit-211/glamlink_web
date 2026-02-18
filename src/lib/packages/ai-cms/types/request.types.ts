/**
 * API Request type definitions
 */

import { AIModel, GenerationParams, RefinementParams } from './ai.types';
import { FieldDefinition } from './field.types';

// Base Request
export interface BaseAIRequest {
  userPrompt: string;
  selectedModel: AIModel;
  contentType: string;
  currentData: Record<string, any>;
}

// Multi-field Generation Request
export interface MultiFieldRequest extends BaseAIRequest {
  fieldDefinitions: FieldDefinition[];
  isRefinement?: boolean;
  iterationCount?: number;
  promptHistory?: string[];
}

// Content Block Generation Request
export interface ContentBlockRequest extends BaseAIRequest {
  sectionType: string;
  contentBlocks: any[];
  blockMappings: Record<string, any>;
  currentContent?: any;
  contentField?: string;
  model?: AIModel;
  maxLength?: number;
  preserveFormatting?: boolean;
  includeMarkdown?: boolean;
}

// Single Field Generation Request
export interface SingleFieldRequest extends BaseAIRequest {
  fieldName: string;
  fieldType: FieldDefinition['fieldType'];
  context?: Record<string, any>;
  currentValue?: any;
  model?: AIModel;
  maxLength?: number;
  suggestions?: string[];
}

// Generate Request (for hooks)
export interface GenerateRequest {
  contentType: string;
  fields?: string[];
  selectedFields?: string[];
  currentData: Record<string, any>;
  userPrompt: string;
  model?: AIModel;
  context?: Record<string, any>;
  options?: GenerationOptions;
  isRefinement?: boolean;
  refinementContext?: any;
}

// Refine Request (for hooks)
export interface RefineRequest {
  previousResult: any;
  refinementPrompt: string;
  preserveUnchangedFields?: boolean;
  targetFields?: string[];
}

// Generation Options
export interface GenerationOptions {
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
  retries?: number;
  streaming?: boolean;
  cache?: boolean;
}

// Batch Request (for multiple generations)
export interface BatchGenerationRequest {
  requests: GenerateRequest[];
  options?: {
    parallel?: boolean;
    maxConcurrency?: number;
    failFast?: boolean;
  };
}

// Request Context
export interface RequestContext {
  userId: string;
  userEmail: string;
  sessionId: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

// Handler Options (for route handlers)
export interface HandlerOptions {
  collection?: string;
  contentType?: string;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
  authentication?: {
    required: boolean;
    permissions?: string[];
  };
  validation?: {
    strict: boolean;
    customRules?: Record<string, (value: any) => boolean>;
  };
}

// Middleware Request
export interface MiddlewareRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
    permissions: string[];
  };
  rateLimit?: {
    remaining: number;
    resetTime: Date;
  };
  validation?: {
    errors: string[];
    warnings: string[];
  };
}