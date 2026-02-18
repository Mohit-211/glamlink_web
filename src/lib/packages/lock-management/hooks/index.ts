'use client';

/**
 * Lock Management Hooks - Main Export
 * 
 * Centralized exports for all React hooks in the lock management package.
 */

export { useLock } from './useLock';
export { useMultiTabDetection } from './useMultiTabDetection';
export { useLockIndicator } from './useLockIndicator';
export { useLockAcquisition } from './useLockAcquisition';

export type { 
  UseLockOptions, 
  UseLockReturn 
} from './useLock';

export type { 
  UseMultiTabDetectionOptions, 
  UseMultiTabDetectionReturn,
  MultiTabStatus 
} from './useMultiTabDetection';

export type { 
  UseLockIndicatorOptions, 
  UseLockIndicatorReturn,
  LockIndicatorState 
} from './useLockIndicator';