'use client';

import React, { createContext, useContext, ReactNode } from 'react';

/**
 * Lock API Endpoints Configuration
 */
export interface LockEndpoints {
  acquire: string;     // POST endpoint for acquiring locks
  release: string;     // DELETE endpoint for releasing locks
  extend: string;      // PUT endpoint for extending locks
  transfer: string;    // PATCH endpoint for transferring locks
  status?: string;     // Optional GET endpoint for checking status
}

/**
 * Lock Configuration Interface
 */
export interface LockConfig {
  endpoints: LockEndpoints;
  collection?: string;          // Optional default collection name
  lockGroup?: string;           // Optional default lock group
  lockDuration?: number;        // Optional default lock duration in minutes
  autoRefresh?: boolean;        // Optional auto-refresh setting
  refreshInterval?: number;     // Optional refresh interval in ms
}

/**
 * Lock Configuration Context
 */
const LockConfigContext = createContext<LockConfig | null>(null);

/**
 * Lock Configuration Provider Props
 */
export interface LockConfigProviderProps {
  config?: LockConfig;
  endpoints?: LockEndpoints;
  collection?: string;
  lockGroup?: string;
  children: ReactNode;
}

/**
 * Lock Configuration Provider
 * 
 * Provides lock endpoint configuration to all child components.
 * Accepts either a full config object or individual options for convenience.
 * 
 * @example
 * ```tsx
 * const endpoints = {
 *   acquire: '/api/magazine/issues/{resourceId}/lock',
 *   release: '/api/magazine/issues/{resourceId}/lock',
 *   extend: '/api/magazine/issues/{resourceId}/lock',
 *   transfer: '/api/magazine/issues/{resourceId}/lock'
 * };
 * 
 * <LockConfigProvider endpoints={endpoints}>
 *   <YourComponent />
 * </LockConfigProvider>
 * ```
 */
export function LockConfigProvider({ 
  config, 
  endpoints, 
  collection,
  lockGroup,
  children 
}: LockConfigProviderProps) {
  // Require either config object or endpoints
  if (!config && !endpoints) {
    throw new Error(
      'LockConfigProvider requires either config or endpoints to be provided. ' +
      'Example usage:\n\n' +
      'const endpoints = {\n' +
      '  acquire: "/api/magazine/issues/{resourceId}/lock",\n' +
      '  release: "/api/magazine/issues/{resourceId}/lock",\n' +
      '  extend: "/api/magazine/issues/{resourceId}/lock",\n' +
      '  transfer: "/api/magazine/issues/{resourceId}/lock"\n' +
      '};\n' +
      '<LockProvider endpoints={endpoints}><YourComponent /></LockProvider>'
    );
  }

  // Build final config from either full config or individual props
  const finalConfig: LockConfig = config || { 
    endpoints: endpoints!,
    collection,
    lockGroup
  };

  return (
    <LockConfigContext.Provider value={finalConfig}>
      {children}
    </LockConfigContext.Provider>
  );
}

/**
 * Hook to access lock configuration
 * 
 * @throws Error if used outside LockConfigProvider
 */
export function useLockConfig(): LockConfig {
  const context = useContext(LockConfigContext);
  
  if (!context) {
    throw new Error(
      'useLockConfig must be used within a LockConfigProvider. ' +
      'Please wrap your component with LockProvider and provide endpoints:\n\n' +
      'const endpoints = {\n' +
      '  acquire: "/api/magazine/issues/{resourceId}/lock",\n' +
      '  release: "/api/magazine/issues/{resourceId}/lock",\n' +
      '  extend: "/api/magazine/issues/{resourceId}/lock",\n' +
      '  transfer: "/api/magazine/issues/{resourceId}/lock"\n' +
      '};\n' +
      '<LockProvider endpoints={endpoints}><YourComponent /></LockProvider>'
    );
  }
  
  return context;
}

/**
 * Hook to access just the endpoints (convenience)
 */
export function useLockEndpoints(): LockEndpoints {
  return useLockConfig().endpoints;
}

/**
 * Helper to build API URL with resource ID
 * 
 * @param endpoint - Endpoint template with {resourceId} placeholder
 * @param resourceId - Actual resource ID to substitute
 * @returns Complete API URL
 */
export function buildLockEndpointUrl(endpoint: string, resourceId: string): string {
  return endpoint.replace('{resourceId}', resourceId);
}