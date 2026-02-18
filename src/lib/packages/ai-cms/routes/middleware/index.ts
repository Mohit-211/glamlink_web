/**
 * Middleware - Exports
 * 
 * Centralized exports for all middleware functions used in AI generation routes.
 * These middleware functions handle cross-cutting concerns like authentication,
 * validation, rate limiting, and request/response processing.
 */

import { NextRequest, NextResponse } from 'next/server';
import type { AuthenticatedUser } from './authentication';

// Import middleware functions for internal use
import { withAuthentication } from './authentication';
import { withValidation, getValidatedDataFromRequest } from './validation';
import { withRateLimit, TOKEN_ESTIMATORS } from './rateLimit';

// Authentication middleware
export {
  authenticate,
  checkPermissions,
  checkAIAccess,
  withAuthentication,
  getUserFromRequest,
  getAILimitsFromRequest,
  isAdmin,
  getSubscriptionLevel,
  type AuthenticatedUser,
  type AuthenticationResult
} from './authentication';

// Validation middleware
export {
  validateField,
  validateMultiFieldRequest,
  validateContentBlockRequest,
  validateSingleFieldRequest,
  sanitizeInput,
  validateRequest,
  withValidation,
  getValidatedDataFromRequest,
  type ValidationResult,
  type ValidationRules
} from './validation';

// Rate limiting middleware
export {
  checkRateLimit,
  recordRequest,
  getRateLimitStatus,
  withRateLimit,
  getRateLimitInfoFromRequest,
  RATE_LIMIT_CONFIG,
  TOKEN_ESTIMATORS
} from './rateLimit';

/**
 * Compose multiple middleware functions into a single handler
 */
export function composeMiddleware<T = any>(
  ...middlewares: Array<(handler: any) => any>
) {
  return (handler: T): T => {
    return middlewares.reduceRight(
      (composedHandler, middleware) => middleware(composedHandler),
      handler
    ) as T;
  };
}

/**
 * Standard middleware composition for AI routes
 */
export function withStandardMiddleware(
  requestType: 'multiField' | 'contentBlock' | 'singleField',
  endpoint: string,
  handler: (request: Request, user: AuthenticatedUser, validatedData: any) => Promise<Response>
) {
  return composeMiddleware(
    // Rate limiting (outermost - applied first)
    (h: any) => withRateLimit(endpoint, h, {
      estimateTokens: TOKEN_ESTIMATORS[requestType]
    }),
    
    // Authentication (applied second)
    (h: any) => withAuthentication(h, {
      requireAIAccess: true
    }),
    
    // Validation (innermost - applied last)
    (h: any) => withValidation(requestType, h)
  )(
    // Final handler that receives all processed data
    async (request: Request, user: AuthenticatedUser) => {
      const validatedData = getValidatedDataFromRequest(request as any);
      return handler(request, user, validatedData);
    }
  );
}

/**
 * Lightweight middleware for simple routes (no rate limiting)
 */
export function withBasicMiddleware(
  requestType: 'multiField' | 'contentBlock' | 'singleField',
  handler: (request: Request, user: AuthenticatedUser, validatedData: any) => Promise<Response>
) {
  return composeMiddleware(
    // Authentication
    (h: any) => withAuthentication(h, {
      requireAIAccess: true
    }),
    
    // Validation
    (h: any) => withValidation(requestType, h)
  )(
    async (request: Request, user: AuthenticatedUser) => {
      const validatedData = getValidatedDataFromRequest(request as any);
      return handler(request, user, validatedData);
    }
  );
}

/**
 * Admin-only middleware composition
 */
export function withAdminMiddleware(
  handler: (request: Request, user: AuthenticatedUser) => Promise<Response>
) {
  return withAuthentication(handler, {
    requiredPermissions: ['admin']
  });
}

/**
 * Error handling middleware wrapper
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<Response>>(
  handler: T,
  options: {
    logErrors?: boolean;
    fallbackMessage?: string;
  } = {}
): T {
  const { 
    logErrors = true, 
    fallbackMessage = 'An internal error occurred' 
  } = options;

  return (async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      if (logErrors) {
        console.error('Handler error:', error);
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: fallbackMessage
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }) as T;
}

/**
 * CORS middleware for AI endpoints
 */
export function withCORS(
  handler: (request: Request) => Promise<Response>,
  options: {
    origin?: string | string[];
    methods?: string[];
    headers?: string[];
    credentials?: boolean;
  } = {}
) {
  const {
    origin = '*',
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    headers = ['Content-Type', 'Authorization'],
    credentials = true
  } = options;

  return async (request: Request): Promise<Response> => {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': Array.isArray(origin) ? origin.join(',') : origin,
          'Access-Control-Allow-Methods': methods.join(','),
          'Access-Control-Allow-Headers': headers.join(','),
          'Access-Control-Allow-Credentials': credentials.toString(),
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    // Handle actual request
    const response = await handler(request);

    // Add CORS headers to response
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', Array.isArray(origin) ? origin.join(',') : origin);
    newHeaders.set('Access-Control-Allow-Credentials', credentials.toString());

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  };
}

/**
 * Request logging middleware
 */
export function withLogging(
  handler: (request: Request) => Promise<Response>,
  options: {
    logRequests?: boolean;
    logResponses?: boolean;
    logErrors?: boolean;
  } = {}
) {
  const {
    logRequests = true,
    logResponses = false,
    logErrors = true
  } = options;

  return async (request: Request): Promise<Response> => {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(7);

    try {
      if (logRequests) {
        console.log(`[${requestId}] ${request.method} ${request.url}`);
      }

      const response = await handler(request);
      const duration = Date.now() - startTime;

      if (logResponses) {
        console.log(`[${requestId}] Response: ${response.status} (${duration}ms)`);
      }

      return response;
    } catch (error) {
      if (logErrors) {
        const duration = Date.now() - startTime;
        console.error(`[${requestId}] Error after ${duration}ms:`, error);
      }
      throw error;
    }
  };
}

/**
 * Complete AI route middleware stack
 */
export function withAIRouteMiddleware(
  requestType: 'multiField' | 'contentBlock' | 'singleField',
  endpoint: string,
  handler: (request: Request, user: AuthenticatedUser, validatedData: any) => Promise<Response>
) {
  return composeMiddleware(
    // Error handling (outermost)
    (h: any) => withErrorHandling(h),
    
    // Logging
    (h: any) => withLogging(h),
    
    // CORS
    (h: any) => withCORS(h),
    
    // Standard AI middleware stack
    (h: any) => withStandardMiddleware(requestType, endpoint, h)
  )(handler);
}

