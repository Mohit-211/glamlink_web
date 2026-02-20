/**
 * API Response type definitions
 */

// Base Response
export interface BaseAIResponse {
  success: boolean;
  message?: string;
  error?: string;
  requestId?: string;
  timestamp: Date;
  processingTime?: number;
}

// Multi-field Response
export interface AIMultiFieldResponse extends BaseAIResponse {
  fieldUpdates?: Record<string, any>;
  userResponse?: string;
  iterationCount?: number;
  tokensUsed?: number;
}

// Content Block Response
export interface AIContentBlockResponse extends BaseAIResponse {
  blockUpdates?: Record<string, any>;
  userResponse?: string;
  affectedBlocks?: string[];
  totalBlocks?: number;
  tokensUsed?: number;
}

// Single Field Response
export interface AISingleFieldResponse extends BaseAIResponse {
  fieldValue?: any;
  confidence?: number;
  alternatives?: any[];
}

// Generation Response (for hooks)
export interface GenerationResponse {
  success: boolean;
  content?: Record<string, any>;
  fieldUpdates?: Record<string, any>; // Field-specific updates for AI refinement
  tokensUsed?: number; // Tokens used for this generation (top-level for easy access)
  message?: string;
  error?: string;
  metadata?: {
    tokensUsed: number;
    model: string;
    processingTime: number;
    iterations: number;
  };
}

// Batch Response
export interface BatchGenerationResponse {
  success: boolean;
  results: GenerationResponse[];
  summary: {
    totalRequests: number;
    successCount: number;
    errorCount: number;
    totalTokensUsed: number;
    totalProcessingTime: number;
  };
  errors?: string[];
}

// Validation Response
export interface ValidationResponse {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// Streaming Response
export interface StreamingResponse {
  type: 'start' | 'chunk' | 'end' | 'error';
  data?: any;
  error?: string;
  progress?: {
    current: number;
    total: number;
    percentage: number;
  };
}

// Rate Limit Response
export interface RateLimitResponse {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
}

// Authentication Response
export interface AuthenticationResponse {
  authenticated: boolean;
  user?: {
    id: string;
    email: string;
    name?: string;
    permissions: string[];
  };
  token?: string;
  expiresAt?: Date;
}

// Health Check Response
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    openai: 'up' | 'down' | 'degraded';
    database: 'up' | 'down';
    cache: 'up' | 'down';
  };
  timestamp: Date;
  version: string;
}

// Additional missing response types
export interface RefineResponse extends BaseAIResponse {
  content?: any;
  refinementSuggestions?: string[];
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
}

// Legacy aliases for backward compatibility
export type GenerateResponse = GenerationResponse;
export type ContentBlockResponse = AIContentBlockResponse;
export type SingleFieldResponse = AISingleFieldResponse;