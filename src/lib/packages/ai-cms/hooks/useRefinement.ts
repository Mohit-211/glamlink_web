/**
 * useRefinement Hook
 * 
 * Manages iterative content refinement process,
 * tracks refinement history and provides refinement controls.
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { useAIEndpoint } from '../contexts/AIConfigContext';
import type { GenerateRequest, GenerationResponse, AIModel } from '../types';

export interface RefinementState {
  currentIteration: number;
  maxIterations: number;
  isRefining: boolean;
  refinementHistory: RefinementHistoryItem[];
  currentContent: any;
  originalContent: any;
}

export interface RefinementHistoryItem {
  iteration: number;
  timestamp: Date;
  prompt: string;
  request: GenerateRequest;
  response: GenerationResponse | null;
  success: boolean;
  error?: string;
}

export interface UseRefinementOptions {
  contentType: string;
  model?: AIModel;
  maxIterations?: number;
  onRefinementStart?: (iteration: number) => void;
  onRefinementComplete?: (iteration: number, success: boolean) => void;
  onMaxIterationsReached?: () => void;
  endpoint?: string; // Optional endpoint override
}

export function useRefinement(
  initialContent: any,
  options: UseRefinementOptions
) {
  const {
    contentType,
    model = 'gpt-5-mini',
    maxIterations = 10,
    onRefinementStart,
    onRefinementComplete,
    onMaxIterationsReached,
    endpoint
  } = options;

  // Get endpoint from context or use override
  const defaultEndpoint = useAIEndpoint('multiField');
  const apiEndpoint = endpoint || defaultEndpoint;

  // State management
  const [state, setState] = useState<RefinementState>({
    currentIteration: 0,
    maxIterations,
    isRefining: false,
    refinementHistory: [],
    currentContent: initialContent,
    originalContent: initialContent
  });

  /**
   * Refine content with a new prompt
   */
  const refineContent = useCallback(async (
    refinementPrompt: string,
    selectedFields: Record<string, any>
  ): Promise<GenerationResponse | null> => {
    if (state.isRefining) {
      console.warn('Refinement already in progress');
      return null;
    }

    if (state.currentIteration >= maxIterations) {
      console.warn('Maximum refinement iterations reached');
      onMaxIterationsReached?.();
      return null;
    }

    const newIteration = state.currentIteration + 1;
    
    setState(prev => ({
      ...prev,
      isRefining: true
    }));

    onRefinementStart?.(newIteration);

    try {
      const request: GenerateRequest = {
        contentType,
        userPrompt: refinementPrompt,
        currentData: state.currentContent,
        selectedFields: Object.keys(selectedFields),
        model,
        isRefinement: true,
        refinementContext: {
          currentIteration: newIteration,
          maxIterations,
          previousPrompts: state.refinementHistory.map(item => item.prompt),
          originalContent: state.originalContent
        }
      };

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result: GenerationResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Refinement failed');
      }

      // Update state with successful refinement
      const historyItem: RefinementHistoryItem = {
        iteration: newIteration,
        timestamp: new Date(),
        prompt: refinementPrompt,
        request,
        response: result,
        success: true
      };

      // Apply field updates to current content
      const updatedContent = {
        ...state.currentContent,
        ...result.fieldUpdates
      };

      setState(prev => ({
        ...prev,
        currentIteration: newIteration,
        isRefining: false,
        refinementHistory: [...prev.refinementHistory, historyItem],
        currentContent: updatedContent
      }));

      onRefinementComplete?.(newIteration, true);
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Record failed refinement
      const historyItem: RefinementHistoryItem = {
        iteration: newIteration,
        timestamp: new Date(),
        prompt: refinementPrompt,
        request: {} as GenerateRequest, // Minimal request for history
        response: null,
        success: false,
        error: errorMessage
      };

      setState(prev => ({
        ...prev,
        currentIteration: newIteration,
        isRefining: false,
        refinementHistory: [...prev.refinementHistory, historyItem]
      }));

      onRefinementComplete?.(newIteration, false);
      console.error('Refinement error:', error);
      return null;
    }
  }, [state, contentType, model, maxIterations, onRefinementStart, onRefinementComplete, onMaxIterationsReached]);

  /**
   * Accept current refinement and finalize
   */
  const acceptRefinement = useCallback(() => {
    // Mark refinement as accepted - could trigger save or other actions
    console.log('Refinement accepted at iteration', state.currentIteration);
    return state.currentContent;
  }, [state.currentContent, state.currentIteration]);

  /**
   * Revert to a previous iteration
   */
  const revertToIteration = useCallback((iteration: number) => {
    if (iteration < 0 || iteration > state.currentIteration) {
      console.warn('Invalid iteration number');
      return;
    }

    if (iteration === 0) {
      // Revert to original content
      setState(prev => ({
        ...prev,
        currentContent: prev.originalContent,
        currentIteration: 0
      }));
    } else {
      // Find the content at the specified iteration
      const historyItem = state.refinementHistory[iteration - 1];
      if (historyItem && historyItem.success && historyItem.response) {
        const previousContent = {
          ...state.originalContent,
          ...historyItem.response.fieldUpdates
        };

        setState(prev => ({
          ...prev,
          currentContent: previousContent,
          currentIteration: iteration
        }));
      }
    }
  }, [state]);

  /**
   * Revert to original content
   */
  const revertToOriginal = useCallback(() => {
    revertToIteration(0);
  }, [revertToIteration]);

  /**
   * Reset entire refinement process
   */
  const resetRefinement = useCallback(() => {
    setState({
      currentIteration: 0,
      maxIterations,
      isRefining: false,
      refinementHistory: [],
      currentContent: initialContent,
      originalContent: initialContent
    });
  }, [initialContent, maxIterations]);

  /**
   * Get refinement suggestions based on current state
   */
  const getRefinementSuggestions = useCallback((): string[] => {
    const suggestions: string[] = [];
    
    if (state.currentIteration === 0) {
      suggestions.push(
        'Make this more professional',
        'Add more specific details',
        'Improve clarity and readability',
        'Enhance engagement'
      );
    } else {
      // Based on iteration count, suggest different refinements
      if (state.currentIteration < 3) {
        suggestions.push(
          'Add more examples',
          'Make it more concise',
          'Improve the tone',
          'Add more technical details'
        );
      } else if (state.currentIteration < 6) {
        suggestions.push(
          'Fine-tune the language',
          'Adjust the structure',
          'Polish the conclusion',
          'Enhance transitions'
        );
      } else {
        suggestions.push(
          'Make small improvements',
          'Perfect the final details',
          'Ensure consistency',
          'Final quality check'
        );
      }
    }
    
    return suggestions;
  }, [state.currentIteration]);

  /**
   * Get changes from original content
   */
  const getChangesFromOriginal = useMemo(() => {
    const changes: Array<{
      field: string;
      originalValue: any;
      currentValue: any;
      changedInIteration: number;
    }> = [];
    
    for (const [field, currentValue] of Object.entries(state.currentContent || {})) {
      const originalValue = state.originalContent?.[field];
      
      if (originalValue !== currentValue) {
        // Find which iteration this change was made in
        let changedInIteration = 0;
        for (let i = 0; i < state.refinementHistory.length; i++) {
          const history = state.refinementHistory[i];
          if (history.success && history.response?.fieldUpdates?.[field] !== undefined) {
            changedInIteration = history.iteration;
          }
        }
        
        changes.push({
          field,
          originalValue,
          currentValue,
          changedInIteration
        });
      }
    }
    
    return changes;
  }, [state.currentContent, state.originalContent, state.refinementHistory]);

  /**
   * Get refinement statistics
   */
  const getRefinementStats = useMemo(() => {
    const total = state.refinementHistory.length;
    const successful = state.refinementHistory.filter(item => item.success).length;
    const failed = total - successful;
    
    const totalTokensUsed = state.refinementHistory.reduce((sum, item) => {
      return sum + (item.response?.tokensUsed || 0);
    }, 0);
    
    return {
      currentIteration: state.currentIteration,
      maxIterations: state.maxIterations,
      totalRefinements: total,
      successfulRefinements: successful,
      failedRefinements: failed,
      successRate: total > 0 ? successful / total : 0,
      totalTokensUsed,
      remainingIterations: state.maxIterations - state.currentIteration,
      changesFromOriginal: getChangesFromOriginal.length
    };
  }, [state, getChangesFromOriginal]);

  // Computed properties
  const canRefine = !state.isRefining && state.currentIteration < maxIterations;
  const hasRefinements = state.refinementHistory.length > 0;
  const canRevert = state.currentIteration > 0;
  const isAtMaxIterations = state.currentIteration >= maxIterations;
  const lastRefinement = state.refinementHistory[state.refinementHistory.length - 1] || null;

  return {
    // State
    content: state.currentContent,
    originalContent: state.originalContent,
    refinementHistory: state.refinementHistory,
    isRefining: state.isRefining,
    currentIteration: state.currentIteration,
    maxIterations: state.maxIterations,
    
    // Actions
    refineContent,
    acceptRefinement,
    revertToIteration,
    revertToOriginal,
    resetRefinement,
    
    // Utilities
    getRefinementSuggestions,
    getChangesFromOriginal,
    getRefinementStats,
    
    // State checks
    canRefine,
    hasRefinements,
    canRevert,
    isAtMaxIterations,
    lastRefinement
  };
}