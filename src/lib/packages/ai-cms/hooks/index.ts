/**
 * Hooks - Exports
 * 
 * Centralized exports for all React hooks in the ai-cms package.
 * These hooks provide React integration for AI content management.
 */

// Main AI generation hook
export {
  useAIGeneration,
  type AIGenerationOptions,
  type GenerationHistoryItem
} from './useAIGeneration';

// Field comparison and selection hook
export {
  useFieldComparison,
  type UseFieldComparisonOptions
} from './useFieldComparison';

// Refinement process hook
export {
  useRefinement,
  type RefinementState,
  type RefinementHistoryItem,
  type UseRefinementOptions
} from './useRefinement';

// Re-export context hooks for convenience
export {
  useAIModel
} from '../contexts/AIModelContext';

export {
  useAIEditing
} from '../contexts/AIEditingContext';

/**
 * Combined hook that provides all AI functionality
 * Note: This is a placeholder implementation. Individual hooks should be used directly.
 */
export function useAIComplete(options: {
  contentType: string;
  initialContent?: any;
  model?: 'gpt-5' | 'gpt-5-mini' | 'gpt-5-nano';
  maxRefinements?: number;
}) {
  // For now, return a basic object structure
  // Individual hooks should be imported and used directly
  return {
    generation: { isGenerating: false, generatedContent: null, error: null, history: [], generateMultiField: async () => null },
    comparison: { getSelectedFieldData: () => ({}) },
    refinement: { isRefining: false, refinementHistory: [], refineContent: async () => null, lastRefinement: null },
    model: { selectedModel: 'gpt-5-mini' as const, setSelectedModel: () => {}, availableModels: [] },
    editing: { isEditing: false },
    generateAndCompare: async () => null,
    refineAndCompare: async () => null,
    isBusy: false,
    hasError: false,
    totalOperations: 0
  };
};