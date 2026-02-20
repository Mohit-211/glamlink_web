'use client';

import React, { createContext, useContext, ReactNode } from 'react';

/**
 * AI Endpoints Configuration
 */
export interface AIEndpoints {
  multiField: string;
  contentBlock?: string;
  singleField?: string;
}

/**
 * AI Configuration Interface
 */
export interface AIConfig {
  endpoints: AIEndpoints;
  // Future configuration options:
  // headers?: Record<string, string>;
  // timeout?: number;
  // retries?: number;
}

/**
 * AI Configuration Context
 */
const AIConfigContext = createContext<AIConfig | null>(null);

/**
 * AI Configuration Provider Props
 */
export interface AIConfigProviderProps {
  config?: AIConfig;
  endpoints?: AIEndpoints;
  children: ReactNode;
}

/**
 * AI Configuration Provider
 * 
 * Provides AI endpoint configuration to all child components.
 * Accepts either a full config object or just endpoints for convenience.
 */
export function AIConfigProvider({ 
  config, 
  endpoints, 
  children 
}: AIConfigProviderProps) {
  // Require either config object or endpoints
  if (!config && !endpoints) {
    throw new Error(
      'AIConfigProvider requires either config or endpoints to be provided. ' +
      'Example usage:\n\n' +
      'const endpoints = { multiField: "/api/your-app/ai-generate" };\n' +
      '<AIProvider endpoints={endpoints}><YourComponent /></AIProvider>'
    );
  }

  // Allow either config object or endpoints shorthand
  const finalConfig: AIConfig = config || { endpoints: endpoints! };

  return (
    <AIConfigContext.Provider value={finalConfig}>
      {children}
    </AIConfigContext.Provider>
  );
}

/**
 * Hook to access AI configuration
 * 
 * @throws Error if used outside AIConfigProvider or if no endpoints configured
 */
export function useAIConfig(): AIConfig {
  const context = useContext(AIConfigContext);
  
  if (!context) {
    throw new Error(
      'useAIConfig must be used within an AIConfigProvider. ' +
      'Please wrap your component with AIProvider and provide endpoints:\n\n' +
      'const endpoints = { multiField: "/api/your-app/ai-generate" };\n' +
      '<AIProvider endpoints={endpoints}><YourComponent /></AIProvider>'
    );
  }
  
  return context;
}

/**
 * Hook to access just the endpoints (convenience)
 */
export function useAIEndpoints(): AIEndpoints {
  return useAIConfig().endpoints;
}

/**
 * Get a specific endpoint with validation
 */
export function useAIEndpoint(type: keyof AIEndpoints): string {
  const endpoints = useAIEndpoints();
  const endpoint = endpoints[type];
  
  if (!endpoint) {
    throw new Error(
      `AI endpoint '${type}' is not configured. ` +
      `Please provide '${type}' in your endpoints configuration:\n\n` +
      `const endpoints = {\n` +
      `  ${type}: '/api/your-app/ai-${type}',\n` +
      `  // ... other endpoints\n` +
      `};\n` +
      `<AIProvider endpoints={endpoints}><YourComponent /></AIProvider>`
    );
  }
  
  return endpoint;
}