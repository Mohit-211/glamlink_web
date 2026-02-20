'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Import types
import type { AIGenerationState, AIGenerationStatus } from '../types';

interface AIEditingContextType {
  // Current editing state
  isEditing: boolean;
  currentSession: string | null;
  
  // Generation state
  generationState: AIGenerationState;
  
  // Actions
  startEditing: (sessionId: string) => void;
  stopEditing: () => void;
  updateGenerationState: (updates: Partial<AIGenerationState>) => void;
  resetGenerationState: () => void;
}

const AIEditingContext = createContext<AIEditingContextType | undefined>(undefined);

const initialGenerationState: AIGenerationState = {
  status: 'idle',
  currentIteration: 0,
  maxIterations: 10,
  totalTokensUsed: 0
};

interface AIEditingProviderProps {
  children: ReactNode;
  enableCollaboration?: boolean;
}

export function AIEditingProvider({ children, enableCollaboration = false }: AIEditingProviderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [generationState, setGenerationState] = useState<AIGenerationState>(initialGenerationState);

  const startEditing = (sessionId: string) => {
    setIsEditing(true);
    setCurrentSession(sessionId);
    setGenerationState({
      ...initialGenerationState,
      status: 'idle',
      startTime: new Date()
    });
  };

  const stopEditing = () => {
    setIsEditing(false);
    setCurrentSession(null);
    setGenerationState(prev => ({
      ...prev,
      status: 'completed',
      endTime: new Date()
    }));
  };

  const updateGenerationState = (updates: Partial<AIGenerationState>) => {
    setGenerationState(prev => ({ ...prev, ...updates }));
  };

  const resetGenerationState = () => {
    setGenerationState(initialGenerationState);
  };

  const value: AIEditingContextType = {
    isEditing,
    currentSession,
    generationState,
    startEditing,
    stopEditing,
    updateGenerationState,
    resetGenerationState
  };

  return (
    <AIEditingContext.Provider value={value}>
      {children}
    </AIEditingContext.Provider>
  );
}

export function useAIEditing(): AIEditingContextType {
  const context = useContext(AIEditingContext);
  if (context === undefined) {
    throw new Error('useAIEditing must be used within an AIEditingProvider');
  }
  return context;
}