/**
 * Rate Limits and Constraints Configuration
 */

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface GenerationLimits {
  maxPromptLength: number;
  maxFieldUpdates: number;
  maxIterations: number;
  maxTokensPerRequest: number;
  timeoutMs: number;
}

export interface UserLimits {
  daily: RateLimitConfig;
  hourly: RateLimitConfig;
  perMinute: RateLimitConfig;
}

// Rate limiting configurations by user tier
export const RATE_LIMITS = {
  default: {
    daily: {
      maxRequests: 100,
      windowMs: 24 * 60 * 60 * 1000, // 24 hours
      message: 'Daily AI generation limit reached'
    },
    hourly: {
      maxRequests: 20,
      windowMs: 60 * 60 * 1000, // 1 hour
      message: 'Hourly AI generation limit reached'
    },
    perMinute: {
      maxRequests: 5,
      windowMs: 60 * 1000, // 1 minute
      message: 'Too many requests, please wait a moment'
    }
  },
  
  premium: {
    daily: {
      maxRequests: 500,
      windowMs: 24 * 60 * 60 * 1000,
      message: 'Daily AI generation limit reached'
    },
    hourly: {
      maxRequests: 100,
      windowMs: 60 * 60 * 1000,
      message: 'Hourly AI generation limit reached'
    },
    perMinute: {
      maxRequests: 15,
      windowMs: 60 * 1000,
      message: 'Too many requests, please wait a moment'
    }
  },
  
  admin: {
    daily: {
      maxRequests: 10000,
      windowMs: 24 * 60 * 60 * 1000,
      message: 'Daily AI generation limit reached'
    },
    hourly: {
      maxRequests: 1000,
      windowMs: 60 * 60 * 1000,
      message: 'Hourly AI generation limit reached'
    },
    perMinute: {
      maxRequests: 50,
      windowMs: 60 * 1000,
      message: 'Too many requests, please wait a moment'
    }
  }
} as const;

// Generation constraints
export const GENERATION_LIMITS: GenerationLimits = {
  maxPromptLength: 2000, // characters
  maxFieldUpdates: 20, // number of fields that can be updated at once
  maxIterations: 10, // maximum refinement iterations
  maxTokensPerRequest: 4000, // OpenAI token limit per request
  timeoutMs: 30000 // 30 seconds timeout
};

// Content-specific limits
export const CONTENT_LIMITS = {
  text: {
    maxLength: 5000,
    minLength: 1
  },
  html: {
    maxLength: 10000,
    minLength: 1,
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote']
  },
  array: {
    maxItems: 20,
    maxItemLength: 200
  }
};

// Security constraints
export const SECURITY_LIMITS = {
  maxConcurrentRequests: 3, // per user
  requestCooldownMs: 1000, // minimum time between requests
  maxRetries: 3,
  suspiciousPatternThreshold: 5, // number of suspicious requests before flagging
  blockDuration: 15 * 60 * 1000 // 15 minutes block for suspicious activity
};

// Helper functions
export const getRateLimitForUser = (userTier: 'default' | 'premium' | 'admin' = 'default'): UserLimits => {
  return RATE_LIMITS[userTier];
};

export const isWithinLimits = (
  prompt: string,
  fieldCount: number,
  iterationCount: number
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (prompt.length > GENERATION_LIMITS.maxPromptLength) {
    errors.push(`Prompt exceeds maximum length of ${GENERATION_LIMITS.maxPromptLength} characters`);
  }
  
  if (fieldCount > GENERATION_LIMITS.maxFieldUpdates) {
    errors.push(`Too many fields to update (max: ${GENERATION_LIMITS.maxFieldUpdates})`);
  }
  
  if (iterationCount > GENERATION_LIMITS.maxIterations) {
    errors.push(`Maximum iterations exceeded (max: ${GENERATION_LIMITS.maxIterations})`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateContent = (
  content: string,
  type: 'text' | 'html' | 'array'
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const limits = CONTENT_LIMITS[type];
  
  if (type === 'text' || type === 'html') {
    const textLimits = limits as { maxLength: number; minLength: number };
    if (content.length > textLimits.maxLength) {
      errors.push(`Content exceeds maximum length of ${textLimits.maxLength} characters`);
    }
    if (content.length < textLimits.minLength) {
      errors.push(`Content must be at least ${textLimits.minLength} character(s)`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};