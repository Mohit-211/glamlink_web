'use client';

import React, { ReactNode } from 'react';
import { AIConfigProvider, type AIEndpoints, type AIConfig } from '../contexts/AIConfigContext';
import { AIModelProvider } from '../contexts/AIModelContext';
import { AIEditingProvider } from '../contexts/AIEditingContext';

/**
 * AI Provider Props
 */
export interface AIProviderProps {
  children: ReactNode;
  
  // Option 1: Pass endpoints directly (convenience)
  endpoints?: AIEndpoints;
  
  // Option 2: Pass full configuration
  config?: AIConfig;
  
  // Optional model configuration
  defaultModel?: 'gpt-5' | 'gpt-5-mini' | 'gpt-5-nano';
  
  // Optional editing configuration  
  enableCollaboration?: boolean;
}

/**
 * Unified AI Provider
 * 
 * Combines all AI-related providers into a single wrapper.
 * Provides configuration, model selection, and editing state management.
 * 
 * @example Basic usage with endpoints
 * ```tsx
 * const endpoints = {
 *   multiField: '/api/magazine/editor/ai-multi-field',
 *   contentBlock: '/api/magazine/editor/ai-content-block'
 * };
 * 
 * <AIProvider endpoints={endpoints}>
 *   <MyEditor />
 * </AIProvider>
 * ```
 * 
 * @example Advanced usage with full config
 * ```tsx
 * const config = {
 *   endpoints: { ... },
 *   headers: { 'Custom-Header': 'value' },
 *   timeout: 30000
 * };
 * 
 * <AIProvider config={config} defaultModel="gpt-5">
 *   <MyEditor />
 * </AIProvider>
 * ```
 */
export function AIProvider({
  children,
  endpoints,
  config,
  defaultModel = 'gpt-5-mini',
  enableCollaboration = false
}: AIProviderProps) {
  return (
    <AIConfigProvider config={config} endpoints={endpoints}>
      <AIModelProvider defaultModel={defaultModel}>
        <AIEditingProvider enableCollaboration={enableCollaboration}>
          {children}
        </AIEditingProvider>
      </AIModelProvider>
    </AIConfigProvider>
  );
}

/**
 * Development AI Provider
 * 
 * IMPORTANT: This provider will throw an error if no endpoints are provided.
 * It serves as a reminder that endpoints MUST be configured by the consuming application.
 * 
 * @example Correct usage
 * ```tsx
 * const endpoints = {
 *   multiField: '/api/your-app/ai-multi-field'
 * };
 * 
 * <AIProvider endpoints={endpoints}>
 *   <YourComponent />
 * </AIProvider>
 * ```
 */
export function DevAIProvider({ children }: { children: ReactNode }) {
  console.error('DevAIProvider is being used without endpoints! This will cause errors.');
  console.log('Please use AIProvider with explicit endpoints instead:');
  console.log('const endpoints = { multiField: "/api/your-app/ai-generate" };');
  console.log('<AIProvider endpoints={endpoints}><YourComponent /></AIProvider>');
  
  return (
    <AIProvider>
      {children}
    </AIProvider>
  );
}