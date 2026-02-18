/**
 * AI Model Configurations
 */

import { AIModel, AIModelConfig } from '../types';

export const AI_MODELS: Record<AIModel, AIModelConfig> = {
  'gpt-5': {
    id: 'gpt-5',
    label: 'GPT-5',
    description: 'Most capable, best for complex reasoning and detailed content generation',
    maxTokens: 4096,
    temperature: 0.7
  },
  'gpt-5-mini': {
    id: 'gpt-5-mini',
    label: 'GPT-5 Mini', 
    description: 'Balanced performance and speed for most content editing tasks',
    maxTokens: 2048,
    temperature: 0.7,
    default: true
  },
  'gpt-5-nano': {
    id: 'gpt-5-nano',
    label: 'GPT-5 Nano',
    description: 'Fastest model, best for simple edits and quick tasks',
    maxTokens: 1024,
    temperature: 0.5
  }
};

export const DEFAULT_MODEL: AIModel = 'gpt-5-mini';

export const MODEL_SELECTION_STORAGE_KEY = 'glamlink-ai-cms-model';

export const getModelConfig = (model: AIModel): AIModelConfig => {
  return AI_MODELS[model];
};

export const getDefaultModel = (): AIModel => {
  return Object.values(AI_MODELS).find(model => model.default)?.id || DEFAULT_MODEL;
};

export const getAvailableModels = (): AIModelConfig[] => {
  return Object.values(AI_MODELS);
};

export const isValidModel = (model: string): model is AIModel => {
  return Object.keys(AI_MODELS).includes(model);
};