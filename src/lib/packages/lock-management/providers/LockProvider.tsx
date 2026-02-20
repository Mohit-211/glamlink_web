'use client';

import React, { ReactNode } from 'react';
import { 
  LockConfigProvider, 
  type LockEndpoints, 
  type LockConfig 
} from '../contexts/LockConfigContext';

/**
 * Lock Provider Props
 */
export interface LockProviderProps {
  children: ReactNode;
  
  // Option 1: Pass endpoints directly (convenience)
  endpoints?: LockEndpoints;
  
  // Option 2: Pass full configuration
  config?: LockConfig;
  
  // Optional default settings
  collection?: string;
  lockGroup?: string;
  lockDuration?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

/**
 * Unified Lock Provider
 * 
 * Provides lock management configuration to all child components.
 * This provider must wrap any components that use lock management features.
 * 
 * @example Basic usage with endpoints
 * ```tsx
 * import { MAGAZINE_LOCK_ENDPOINTS } from '@/lib/pages/magazine/config/lockEndpoints';
 * 
 * <LockProvider endpoints={MAGAZINE_LOCK_ENDPOINTS}>
 *   <MagazineEditor />
 * </LockProvider>
 * ```
 * 
 * @example Advanced usage with full config
 * ```tsx
 * const lockConfig = {
 *   endpoints: MAGAZINE_LOCK_ENDPOINTS,
 *   collection: 'magazine_issues',
 *   lockGroup: 'metadata',
 *   lockDuration: 10,
 *   autoRefresh: true,
 *   refreshInterval: 30000
 * };
 * 
 * <LockProvider config={lockConfig}>
 *   <MagazineEditor />
 * </LockProvider>
 * ```
 * 
 * @example With individual options
 * ```tsx
 * <LockProvider 
 *   endpoints={MAGAZINE_LOCK_ENDPOINTS}
 *   collection="magazine_issues"
 *   lockGroup="metadata"
 *   autoRefresh={true}
 * >
 *   <MagazineEditor />
 * </LockProvider>
 * ```
 */
export function LockProvider({
  children,
  endpoints,
  config,
  collection,
  lockGroup,
  lockDuration,
  autoRefresh,
  refreshInterval
}: LockProviderProps) {
  // Build configuration from props
  const lockConfig: LockConfig | undefined = config || (endpoints ? {
    endpoints,
    collection,
    lockGroup,
    lockDuration,
    autoRefresh,
    refreshInterval
  } : undefined);

  return (
    <LockConfigProvider 
      config={lockConfig}
      endpoints={endpoints}
      collection={collection}
      lockGroup={lockGroup}
    >
      {children}
    </LockConfigProvider>
  );
}

/**
 * Development Lock Provider
 * 
 * IMPORTANT: This provider will throw an error if no endpoints are provided.
 * It serves as a reminder that endpoints MUST be configured by the consuming application.
 * 
 * @example Correct usage
 * ```tsx
 * const endpoints = {
 *   acquire: '/api/your-resource/{resourceId}/lock',
 *   release: '/api/your-resource/{resourceId}/lock',
 *   extend: '/api/your-resource/{resourceId}/lock',
 *   transfer: '/api/your-resource/{resourceId}/lock'
 * };
 * 
 * <LockProvider endpoints={endpoints}>
 *   <YourComponent />
 * </LockProvider>
 * ```
 */
export function DevLockProvider({ children }: { children: ReactNode }) {
  console.error('DevLockProvider is being used without endpoints! This will cause errors.');
  console.log('Please use LockProvider with explicit endpoints instead:');
  console.log('const endpoints = {');
  console.log('  acquire: "/api/your-resource/{resourceId}/lock",');
  console.log('  release: "/api/your-resource/{resourceId}/lock",');
  console.log('  extend: "/api/your-resource/{resourceId}/lock",');
  console.log('  transfer: "/api/your-resource/{resourceId}/lock"');
  console.log('};');
  console.log('<LockProvider endpoints={endpoints}><YourComponent /></LockProvider>');
  
  return (
    <LockProvider>
      {children}
    </LockProvider>
  );
}