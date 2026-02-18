/**
 * Rate Limiting Middleware
 * 
 * Implements rate limiting for AI generation endpoints to prevent abuse
 * and manage resource usage across different user types.
 */

import { NextRequest } from 'next/server';
import type { AuthenticatedUser } from './authentication';

interface RateLimitRule {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Maximum requests per window
  maxTokens?: number;    // Maximum tokens per window
  skipSuccessful?: boolean; // Only count failed requests
}

interface RateLimitConfig {
  free: RateLimitRule;
  premium: RateLimitRule;
  admin: RateLimitRule;
}

interface RateLimitState {
  requests: number;
  tokens: number;
  windowStart: number;
}

// In-memory store for rate limiting (in production, use Redis or similar)
const rateLimitStore = new Map<string, RateLimitState>();

/**
 * Rate limiting configuration
 */
export const RATE_LIMIT_CONFIG: RateLimitConfig = {
  free: {
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxRequests: 20,
    maxTokens: 50000,
    skipSuccessful: false
  },
  premium: {
    windowMs: 60 * 60 * 1000,  // 1 hour  
    maxRequests: 200,
    maxTokens: 500000,
    skipSuccessful: false
  },
  admin: {
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxRequests: 1000,
    maxTokens: 2000000,
    skipSuccessful: false
  }
};

/**
 * Get rate limit key for a user
 */
function getRateLimitKey(user: AuthenticatedUser, endpoint: string): string {
  return `rateLimit:${user.uid}:${endpoint}`;
}

/**
 * Get user's rate limit tier
 */
function getUserTier(user: AuthenticatedUser): keyof RateLimitConfig {
  if (user.email === 'admin@glamlink.com' || user.customClaims?.admin === true) {
    return 'admin';
  }
  
  const subscription = user.customClaims?.subscription || 'free';
  return subscription === 'premium' ? 'premium' : 'free';
}

/**
 * Clean up expired entries from rate limit store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  const expiredKeys: string[] = [];
  
  for (const [key, state] of rateLimitStore.entries()) {
    // If window has expired (2x the window duration for safety)
    if (now - state.windowStart > RATE_LIMIT_CONFIG.admin.windowMs * 2) {
      expiredKeys.push(key);
    }
  }
  
  expiredKeys.forEach(key => rateLimitStore.delete(key));
}

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(
  user: AuthenticatedUser,
  endpoint: string,
  estimatedTokens?: number
): {
  allowed: boolean;
  error?: string;
  remainingRequests?: number;
  remainingTokens?: number;
  resetTime?: number;
} {
  try {
    // Clean up expired entries periodically (simple cleanup strategy)
    if (Math.random() < 0.01) { // 1% chance to cleanup
      cleanupExpiredEntries();
    }

    const key = getRateLimitKey(user, endpoint);
    const tier = getUserTier(user);
    const config = RATE_LIMIT_CONFIG[tier];
    const now = Date.now();

    // Get current state
    let state = rateLimitStore.get(key);

    // Initialize or reset if window expired
    if (!state || now - state.windowStart >= config.windowMs) {
      state = {
        requests: 0,
        tokens: 0,
        windowStart: now
      };
      rateLimitStore.set(key, state);
    }

    // Check request limit
    if (state.requests >= config.maxRequests) {
      return {
        allowed: false,
        error: `Rate limit exceeded. Maximum ${config.maxRequests} requests per hour for ${tier} users.`,
        remainingRequests: 0,
        resetTime: state.windowStart + config.windowMs
      };
    }

    // Check token limit if applicable
    if (config.maxTokens && estimatedTokens) {
      if (state.tokens + estimatedTokens > config.maxTokens) {
        return {
          allowed: false,
          error: `Token limit exceeded. Maximum ${config.maxTokens} tokens per hour for ${tier} users.`,
          remainingTokens: Math.max(0, config.maxTokens - state.tokens),
          resetTime: state.windowStart + config.windowMs
        };
      }
    }

    // Update counters (will be incremented after successful request)
    return {
      allowed: true,
      remainingRequests: config.maxRequests - state.requests - 1,
      remainingTokens: config.maxTokens ? config.maxTokens - state.tokens - (estimatedTokens || 0) : undefined,
      resetTime: state.windowStart + config.windowMs
    };

  } catch (error) {
    console.error('Rate limit check error:', error);
    // Allow request on error (fail open)
    return { allowed: true };
  }
}

/**
 * Record a request in the rate limit store
 */
export function recordRequest(
  user: AuthenticatedUser,
  endpoint: string,
  tokensUsed?: number,
  success: boolean = true
): void {
  try {
    const key = getRateLimitKey(user, endpoint);
    const tier = getUserTier(user);
    const config = RATE_LIMIT_CONFIG[tier];
    
    // Skip if configured to only count failures and this was successful
    if (config.skipSuccessful && success) {
      return;
    }

    const state = rateLimitStore.get(key);
    if (state) {
      state.requests += 1;
      if (tokensUsed) {
        state.tokens += tokensUsed;
      }
      rateLimitStore.set(key, state);
    }

  } catch (error) {
    console.error('Error recording request:', error);
    // Don't throw - this shouldn't break the main request
  }
}

/**
 * Get current rate limit status for a user
 */
export function getRateLimitStatus(
  user: AuthenticatedUser,
  endpoint: string
): {
  tier: string;
  requests: number;
  maxRequests: number;
  tokens: number;
  maxTokens: number;
  windowStart: number;
  windowEnd: number;
} {
  const key = getRateLimitKey(user, endpoint);
  const tier = getUserTier(user);
  const config = RATE_LIMIT_CONFIG[tier];
  const state = rateLimitStore.get(key) || {
    requests: 0,
    tokens: 0,
    windowStart: Date.now()
  };

  return {
    tier,
    requests: state.requests,
    maxRequests: config.maxRequests,
    tokens: state.tokens,
    maxTokens: config.maxTokens || 0,
    windowStart: state.windowStart,
    windowEnd: state.windowStart + config.windowMs
  };
}

/**
 * Middleware wrapper for rate limiting
 */
export function withRateLimit(
  endpoint: string,
  handler: (request: NextRequest, user: AuthenticatedUser) => Promise<Response>,
  options: {
    estimateTokens?: (request: NextRequest) => number;
  } = {}
) {
  return async (request: NextRequest, user: AuthenticatedUser): Promise<Response> => {
    try {
      // Estimate tokens if function provided
      const estimatedTokens = options.estimateTokens ? options.estimateTokens(request) : undefined;

      // Check rate limit
      const rateLimitResult = checkRateLimit(user, endpoint, estimatedTokens);
      
      if (!rateLimitResult.allowed) {
        return new Response(
          JSON.stringify({
            success: false,
            error: rateLimitResult.error,
            rateLimitInfo: {
              remainingRequests: rateLimitResult.remainingRequests,
              remainingTokens: rateLimitResult.remainingTokens,
              resetTime: rateLimitResult.resetTime
            }
          }),
          {
            status: 429, // Too Many Requests
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil(((rateLimitResult.resetTime || Date.now()) - Date.now()) / 1000).toString(),
              'X-RateLimit-Limit': RATE_LIMIT_CONFIG[getUserTier(user)].maxRequests.toString(),
              'X-RateLimit-Remaining': (rateLimitResult.remainingRequests || 0).toString(),
              'X-RateLimit-Reset': (rateLimitResult.resetTime || Date.now()).toString()
            }
          }
        );
      }

      // Add rate limit info to request context
      (request as any).rateLimitInfo = {
        remainingRequests: rateLimitResult.remainingRequests,
        remainingTokens: rateLimitResult.remainingTokens,
        resetTime: rateLimitResult.resetTime
      };

      // Call handler
      const response = await handler(request, user);
      
      // Record the request after successful completion
      const responseData = await response.clone().json().catch(() => null);
      const success = responseData?.success !== false;
      const tokensUsed = responseData?.tokensUsed || estimatedTokens;
      
      recordRequest(user, endpoint, tokensUsed, success);

      // Add rate limit headers to response
      const newHeaders = new Headers(response.headers);
      newHeaders.set('X-RateLimit-Limit', RATE_LIMIT_CONFIG[getUserTier(user)].maxRequests.toString());
      newHeaders.set('X-RateLimit-Remaining', (rateLimitResult.remainingRequests || 0).toString());
      newHeaders.set('X-RateLimit-Reset', (rateLimitResult.resetTime || Date.now()).toString());

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });

    } catch (error) {
      console.error('Rate limit middleware error:', error);
      
      // Record failed request
      recordRequest(user, endpoint, 0, false);
      
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Internal rate limiting error'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  };
}

/**
 * Token estimation functions for different request types
 */
export const TOKEN_ESTIMATORS = {
  multiField: (request: NextRequest): number => {
    try {
      const data = (request as any).validatedData;
      if (!data) return 1000; // Default estimate
      
      // Rough estimation: prompt + current data + response
      const promptTokens = Math.ceil(data.userPrompt.length / 4);
      const dataTokens = Math.ceil(JSON.stringify(data.currentData).length / 4);
      const responseTokens = Object.keys(data.selectedFields).length * 100; // ~100 tokens per field
      
      return promptTokens + dataTokens + responseTokens;
    } catch {
      return 1000; // Default fallback
    }
  },

  contentBlock: (request: NextRequest): number => {
    try {
      const data = (request as any).validatedData;
      if (!data) return 2000; // Default estimate
      
      const promptTokens = Math.ceil(data.userPrompt.length / 4);
      const contentTokens = data.currentContent ? Math.ceil(data.currentContent.length / 4) : 0;
      const responseTokens = data.maxLength ? Math.ceil(data.maxLength / 4) : 1000;
      
      return promptTokens + contentTokens + responseTokens;
    } catch {
      return 2000; // Default fallback
    }
  },

  singleField: (request: NextRequest): number => {
    try {
      const data = (request as any).validatedData;
      if (!data) return 500; // Default estimate
      
      const promptTokens = Math.ceil(data.userPrompt.length / 4);
      const currentValueTokens = data.currentValue ? Math.ceil(data.currentValue.length / 4) : 0;
      const responseTokens = data.maxLength ? Math.ceil(data.maxLength / 4) : 200;
      
      return promptTokens + currentValueTokens + responseTokens;
    } catch {
      return 500; // Default fallback
    }
  }
};

/**
 * Get rate limit info from request (after rate limit middleware)
 */
export function getRateLimitInfoFromRequest(request: NextRequest) {
  return (request as any).rateLimitInfo || null;
}