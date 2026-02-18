/**
 * Route Handlers - Exports
 * 
 * Centralized exports for all AI generation route handlers.
 * These handlers contain the core logic extracted from API routes.
 */

// Import handlers first so they're available in local scope for HANDLER_REGISTRY
import { 
  handleMultiFieldGeneration,
  type MultiFieldHandlerOptions 
} from './multiField';

import { 
  handleContentBlockGeneration,
  type ContentBlockHandlerOptions 
} from './contentBlock';

import { 
  handleSingleFieldGeneration,
  type SingleFieldHandlerOptions 
} from './singleField';

// Now export them (they're also available for HANDLER_REGISTRY)
export { 
  handleMultiFieldGeneration,
  type MultiFieldHandlerOptions,
  handleContentBlockGeneration,
  type ContentBlockHandlerOptions,
  handleSingleFieldGeneration,
  type SingleFieldHandlerOptions
};

/**
 * Common handler configuration type
 */
export interface BaseHandlerOptions {
  collection?: string;
  contentType?: string;
  requireAuth?: boolean;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
}

/**
 * Handler registry for dynamic handler selection
 */
export const HANDLER_REGISTRY = {
  'multi-field': handleMultiFieldGeneration,
  'content-block': handleContentBlockGeneration,
  'single-field': handleSingleFieldGeneration
} as const;

export type HandlerType = keyof typeof HANDLER_REGISTRY;

/**
 * Generic handler function type
 */
export type AIHandler<TRequest = any, TResponse = any, TOptions = any> = (
  request: Request,
  options?: TOptions
) => Promise<Response>;

/**
 * Utility function to get handler by type
 */
export function getHandlerByType(type: HandlerType) {
  return HANDLER_REGISTRY[type];
}

/**
 * Validate handler type
 */
export function isValidHandlerType(type: string): type is HandlerType {
  return type in HANDLER_REGISTRY;
}