/**
 * Acquire Lock Route Handler
 * 
 * Handles lock acquisition requests for any collection/resource.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { lockService } from '../services/LockService';
import { 
  validateAcquireLockRequest, 
  validateResourceIdentifiers,
  createValidationReport
} from '../utils/lockValidators';
import { AcquireLockRequest, RouteHandlerOptions } from '../types/api.types';

/**
 * Handle lock acquisition with comprehensive validation and conflict detection
 */
export async function handleAcquireLock(
  request: NextRequest,
  params: { params: Promise<{ id: string }> },
  options: RouteHandlerOptions
): Promise<NextResponse> {
  try {
    const { id: resourceId } = await params.params;
    const { currentUser, db } = await getAuthenticatedAppForUser();

    // Authentication check
    if (!currentUser || !db) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
            statusCode: 401
          }
        },
        { status: 401 }
      );
    }

    // Admin-only check
    if (options.adminOnly && !isAdminUser(currentUser)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Admin access required',
            statusCode: 403
          }
        },
        { status: 403 }
      );
    }

    // Parse and validate request body
    let requestBody: any;
    try {
      requestBody = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_JSON',
            message: 'Invalid JSON in request body',
            statusCode: 400
          }
        },
        { status: 400 }
      );
    }

    // Validate resource identifiers
    const resourceValidation = validateResourceIdentifiers(resourceId, options.collection);
    if (!resourceValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid resource identifiers',
            details: resourceValidation.errors,
            statusCode: 400
          }
        },
        { status: 400 }
      );
    }

    // Build acquire lock request
    const acquireLockRequest: AcquireLockRequest = {
      userId: currentUser.uid,
      userEmail: currentUser.email || '',
      userName: currentUser.displayName || requestBody.userName,
      tabId: requestBody.tabId,
      lockGroup: requestBody.lockGroup || options.lockGroup,
      config: {
        lockDurationMinutes: options.lockDuration,
        allowTransfer: options.allowTransfer
      }
    };

    // Validate the acquire request
    const requestValidation = validateAcquireLockRequest(acquireLockRequest);
    if (!requestValidation.isValid) {
      const report = createValidationReport([requestValidation]);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: report.summary,
            details: report.errorsByField,
            statusCode: 400
          }
        },
        { status: 400 }
      );
    }

    // Apply rate limiting if configured
    if (options.rateLimit) {
      const rateLimitResult = await checkRateLimit(
        `acquire:${currentUser.uid}`,
        options.rateLimit
      );
      
      if (!rateLimitResult.allowed) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'RATE_LIMITED',
              message: `Rate limit exceeded. Try again in ${rateLimitResult.retryAfterSeconds} seconds`,
              statusCode: 429
            }
          },
          { 
            status: 429,
            headers: {
              'Retry-After': rateLimitResult.retryAfterSeconds.toString()
            }
          }
        );
      }
    }

    // Attempt to acquire the lock
    const result = await lockService.acquireLock(
      db,
      resourceId,
      options.collection,
      acquireLockRequest,
      acquireLockRequest.config
    );

    // Handle successful acquisition
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        lockExpiresAt: result.lockExpiresAt,
        lockStatus: result.lockStatus
      });
    }

    // Handle acquisition conflicts
    const statusCode = result.isMultiTabConflict ? 409 : 423; // 409 Conflict for multi-tab, 423 Locked for other users
    
    return NextResponse.json(
      {
        success: false,
        message: result.message,
        lockedBy: result.lockedBy,
        lockedByName: result.lockedByName,
        lockedByEmail: result.lockedByEmail,
        isMultiTabConflict: result.isMultiTabConflict || false,
        lockedTabId: result.lockedTabId,
        allowTransfer: result.allowTransfer || false,
        remainingSeconds: result.remainingSeconds,
        error: result.error
      },
      { status: statusCode }
    );

  } catch (error) {
    console.error('Error in handleAcquireLock:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to acquire lock',
          statusCode: 500
        }
      },
      { status: 500 }
    );
  }
}

// Helper functions

function isAdminUser(user: any): boolean {
  // This should be implemented based on your auth system
  // For now, check if user email is in admin list
  const adminEmails = [
    'admin@glamlink.com',
    'mohit@blockcod.com',
    'melanie@glamlink.net'
  ];
  
  return adminEmails.includes(user.email);
}

interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  requestsRemaining: number;
}

async function checkRateLimit(
  key: string,
  config: { maxRequests: number; windowMs: number }
): Promise<RateLimitResult> {
  // This is a simplified in-memory rate limiter
  // In production, you'd want to use Redis or a similar store
  
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  // In a real implementation, you'd store this in Redis/database
  // For now, return allowed for all requests
  return {
    allowed: true,
    retryAfterSeconds: 0,
    requestsRemaining: config.maxRequests
  };
}

/**
 * Create a standardized acquire lock handler for specific collections
 */
export function createAcquireLockHandler(options: RouteHandlerOptions) {
  return async (
    request: NextRequest, 
    params: { params: Promise<{ id: string }> }
  ) => {
    return handleAcquireLock(request, params, options);
  };
}

/**
 * Quick handler factory for common use cases
 */
export const acquireLockHandlers = {
  // Magazine issues handler (with lock grouping)
  magazineIssues: createAcquireLockHandler({
    collection: 'magazine_issues',
    lockDuration: 10,
    lockGroup: 'issue-metadata',
    allowTransfer: true,
    requireAuth: true
  }),

  // Individual sections handler
  sections: createAcquireLockHandler({
    collection: 'sections',
    lockDuration: 5,
    allowTransfer: true,
    requireAuth: true
  }),

  // Documents handler (longer duration for long-form editing)
  documents: createAcquireLockHandler({
    collection: 'documents',
    lockDuration: 15,
    allowTransfer: true,
    requireAuth: true,
    rateLimit: {
      maxRequests: 30,
      windowMs: 15 * 60 * 1000 // 15 minutes
    }
  }),

  // Admin-only handler
  adminResources: createAcquireLockHandler({
    collection: 'admin_resources',
    lockDuration: 5,
    allowTransfer: false,
    requireAuth: true,
    adminOnly: true
  })
};