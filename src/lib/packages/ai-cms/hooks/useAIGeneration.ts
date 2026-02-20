/**
 * useAIGeneration Hook
 * 
 * Main hook for AI content generation with state management,
 * history tracking, and error handling.
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { useAIEndpoints } from '../contexts/AIConfigContext';
import type { 
  AIModel, 
  GenerateRequest, 
  GenerationResponse, 
  ContentBlockRequest, 
  AIContentBlockResponse,
  SingleFieldRequest,
  AISingleFieldResponse 
} from '../types';

export interface AIGenerationOptions {
  contentType: string;
  model?: AIModel;
  onSuccess?: (response: any) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onComplete?: () => void;
  maxHistory?: number;
  endpoints?: {
    multiField?: string;
    contentBlock?: string;
    singleField?: string;
  };
}

export interface GenerationHistoryItem {
  id: string;
  timestamp: Date;
  request: any;
  response: any;
  type: 'multiField' | 'contentBlock' | 'singleField';
  success: boolean;
}

export function useAIGeneration(options: AIGenerationOptions) {
  const {
    contentType,
    model = 'gpt-5-mini',
    onSuccess,
    onError,
    onStart,
    onComplete,
    maxHistory = 50,
    endpoints: customEndpoints
  } = options;

  // Get endpoints from context or use custom ones
  const contextEndpoints = useAIEndpoints();
  const endpoints = customEndpoints || contextEndpoints;

  // State management
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  // Refs for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Generate multi-field content
   */
  const generateMultiField = useCallback(async (params: Omit<GenerateRequest, 'model'>) => {
    if (isGenerating) {
      console.warn('Generation already in progress');
      return null;
    }

    try {
      setIsGenerating(true);
      setError(null);
      onStart?.();

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      const request: GenerateRequest = {
        ...params,
        model: model,
        contentType
      };

      const response = await fetch(endpoints.multiField || '/api/ai-cms/multi-field', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        credentials: 'include',
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result: GenerationResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Generation failed');
      }

      // Update state
      setGeneratedContent(result);
      
      // Add to history
      const historyItem: GenerationHistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date(),
        request,
        response: result,
        type: 'multiField',
        success: true
      };
      
      setHistory(prev => {
        const newHistory = [historyItem, ...prev].slice(0, maxHistory);
        setCurrentHistoryIndex(0);
        return newHistory;
      });

      onSuccess?.(result);
      return result;

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Generation cancelled');
        return null;
      }

      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      onError?.(errorMessage);

      // Add failed attempt to history
      const historyItem: GenerationHistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date(),
        request: params,
        response: { error: errorMessage },
        type: 'multiField',
        success: false
      };

      setHistory(prev => [historyItem, ...prev].slice(0, maxHistory));
      return null;

    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
      onComplete?.();
    }
  }, [isGenerating, model, contentType, onStart, onSuccess, onError, onComplete, maxHistory]);

  /**
   * Generate content block
   */
  const generateContentBlock = useCallback(async (params: Omit<ContentBlockRequest, 'model'>) => {
    if (isGenerating) return null;

    try {
      setIsGenerating(true);
      setError(null);
      onStart?.();

      abortControllerRef.current = new AbortController();

      const request: ContentBlockRequest = {
        ...params,
        model: model,
        contentType
      };

      const response = await fetch(endpoints.contentBlock || '/api/ai-cms/content-block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        credentials: 'include',
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result: AIContentBlockResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Generation failed');
      }

      setGeneratedContent(result);
      
      const historyItem: GenerationHistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date(),
        request,
        response: result,
        type: 'contentBlock',
        success: true
      };
      
      setHistory(prev => {
        const newHistory = [historyItem, ...prev].slice(0, maxHistory);
        setCurrentHistoryIndex(0);
        return newHistory;
      });

      onSuccess?.(result);
      return result;

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return null;
      }

      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
      return null;

    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
      onComplete?.();
    }
  }, [isGenerating, model, contentType, onStart, onSuccess, onError, onComplete, maxHistory]);

  /**
   * Generate single field
   */
  const generateSingleField = useCallback(async (params: Omit<SingleFieldRequest, 'model'>) => {
    if (isGenerating) return null;

    try {
      setIsGenerating(true);
      setError(null);
      onStart?.();

      abortControllerRef.current = new AbortController();

      const request: SingleFieldRequest = {
        ...params,
        model: model,
        contentType
      };

      const response = await fetch(endpoints.singleField || '/api/ai-cms/single-field', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        credentials: 'include',
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result: AISingleFieldResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Generation failed');
      }

      setGeneratedContent(result);
      
      const historyItem: GenerationHistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date(),
        request,
        response: result,
        type: 'singleField',
        success: true
      };
      
      setHistory(prev => {
        const newHistory = [historyItem, ...prev].slice(0, maxHistory);
        setCurrentHistoryIndex(0);
        return newHistory;
      });

      onSuccess?.(result);
      return result;

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return null;
      }

      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
      return null;

    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
      onComplete?.();
    }
  }, [isGenerating, model, contentType, onStart, onSuccess, onError, onComplete, maxHistory]);

  /**
   * Regenerate using the same parameters as the last successful generation
   */
  const regenerate = useCallback(async () => {
    const lastSuccess = history.find(item => item.success);
    if (!lastSuccess) {
      setError('No previous successful generation to repeat');
      return null;
    }

    switch (lastSuccess.type) {
      case 'multiField':
        return generateMultiField(lastSuccess.request);
      case 'contentBlock':
        return generateContentBlock(lastSuccess.request);
      case 'singleField':
        return generateSingleField(lastSuccess.request);
      default:
        setError('Unknown generation type');
        return null;
    }
  }, [history, generateMultiField, generateContentBlock, generateSingleField]);

  /**
   * Cancel current generation
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  }, []);

  /**
   * Clear current results and error
   */
  const clear = useCallback(() => {
    setGeneratedContent(null);
    setError(null);
    setCurrentHistoryIndex(-1);
  }, []);

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentHistoryIndex(-1);
  }, []);

  /**
   * Navigate to previous result in history
   */
  const undo = useCallback(() => {
    if (canUndo) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      setGeneratedContent(history[newIndex].response);
      setError(null);
    }
  }, [currentHistoryIndex, history]);

  /**
   * Navigate to next result in history
   */
  const redo = useCallback(() => {
    if (canRedo) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      setGeneratedContent(newIndex >= 0 ? history[newIndex].response : null);
      setError(null);
    }
  }, [currentHistoryIndex, history]);

  /**
   * Get a specific history item
   */
  const getHistoryItem = useCallback((index: number) => {
    return history[index] || null;
  }, [history]);

  /**
   * Get statistics about generation history
   */
  const getStats = useCallback(() => {
    const total = history.length;
    const successful = history.filter(item => item.success).length;
    const failed = total - successful;
    
    const typeBreakdown = history.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? successful / total : 0,
      typeBreakdown
    };
  }, [history]);

  // Computed properties
  const canUndo = currentHistoryIndex < history.length - 1;
  const canRedo = currentHistoryIndex > 0;
  const hasHistory = history.length > 0;
  const lastSuccessful = history.find(item => item.success) || null;

  return {
    // State
    isGenerating,
    generatedContent,
    error,
    history,
    currentHistoryIndex,
    
    // Actions
    generateMultiField,
    generateContentBlock,
    generateSingleField,
    regenerate,
    cancel,
    clear,
    clearHistory,
    
    // History navigation
    undo,
    redo,
    canUndo,
    canRedo,
    getHistoryItem,
    
    // Utilities
    hasHistory,
    lastSuccessful,
    getStats
  };
}