'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Import from package
import { getDefaultModel, MODEL_SELECTION_STORAGE_KEY, isValidModel, getAvailableModels } from '../config';

// Import types
import type { AIModel, AIModelContextType } from '../types';

const AIModelContext = createContext<AIModelContextType | undefined>(undefined);

interface AIModelProviderProps {
  children: ReactNode;
  defaultModel?: AIModel;
}

export function AIModelProvider({ children, defaultModel }: AIModelProviderProps) {
  const [selectedModel, setSelectedModelState] = useState<AIModel>(defaultModel || getDefaultModel());

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(MODEL_SELECTION_STORAGE_KEY);
      if (saved && isValidModel(saved)) {
        setSelectedModelState(saved as AIModel);
      }
    } catch (error) {
      console.error('Failed to load AI model preference:', error);
    }
  }, []);

  const setSelectedModel = (model: AIModel) => {
    setSelectedModelState(model);
    try {
      localStorage.setItem(MODEL_SELECTION_STORAGE_KEY, model);
    } catch (error) {
      console.error('Failed to save AI model preference:', error);
    }
  };

  return (
    <AIModelContext.Provider value={{ selectedModel, setSelectedModel, availableModels: getAvailableModels() }}>
      {children}
    </AIModelContext.Provider>
  );
}

export function useAIModel(): AIModelContextType {
  const context = useContext(AIModelContext);
  if (context === undefined) {
    throw new Error('useAIModel must be used within an AIModelProvider');
  }
  return context;
}