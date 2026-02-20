/**
 * Core AI-related type definitions
 */

// AI Model types
export type AIModel = 'gpt-5' | 'gpt-5-mini' | 'gpt-5-nano';

export interface AIModelConfig {
  id: AIModel;
  label: string;
  description: string;
  maxTokens: number;
  temperature: number;
  default?: boolean;
}

// AI Response types
export interface AIResponse {
  success: boolean;
  userResponse?: string;
  fieldUpdates?: Record<string, any>;
  error?: string;
}

export interface AIGenerationResult {
  success: boolean;
  content?: Record<string, any>;
  message?: string;
  error?: string;
  requestId?: string;
  tokensUsed?: number;
  processingTime?: number;
}

// AI Service Configuration
export interface AIServiceConfig {
  apiKey?: string;
  defaultModel: AIModel;
  timeout: number;
  maxRetries?: number;
  rateLimiting?: {
    maxRequests: number;
    windowMs: number;
  };
}

// Content Generation Parameters
export interface GenerationParams {
  contentType: string;
  fields: string[];
  currentData: Record<string, any>;
  userPrompt: string;
  model: AIModel;
  context?: Record<string, any>;
}

// Refinement Parameters
export interface RefinementParams extends GenerationParams {
  previousResult: AIResponse;
  refinementPrompt: string;
  iterationCount: number;
  promptHistory: string[];
  preserveUnchangedFields: boolean;
}

// AI Model Context
export interface AIModelContextType {
  selectedModel: AIModel;
  setSelectedModel: (model: AIModel) => void;
  availableModels: AIModelConfig[];
}

// AI Generation Status
export type AIGenerationStatus = 'idle' | 'generating' | 'refining' | 'completed' | 'error';

export interface AIGenerationState {
  status: AIGenerationStatus;
  currentIteration: number;
  maxIterations: number;
  startTime?: Date;
  endTime?: Date;
  totalTokensUsed: number;
}