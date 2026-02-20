/**
 * Release Lock Route Handler
 * 
 * Handles lock release requests for any collection/resource.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { lockService } from '../services/LockService';
import { 
  validateReleaseLockRequest, 
  validateResourceIdentifiers,
  createValidationReport
} from '../utils/lockValidators';
import { ReleaseLockRequest, RouteHandlerOptions } from '../types/api.types';

/**
 * Handle lock release with proper authorization checking
 */
export async function handleReleaseLock(
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

    // Parse request body (optional for release)
    let requestBody: any = {};
    try {
      if (request.headers.get('content-length') !== '0') {
        requestBody = await request.json();
      }
    } catch (error) {
      // Empty body is okay for release
    }

    // Check for admin override
    const isAdmin = isAdminUser(currentUser);
    const forceRelease = requestBody.force && isAdmin;

    // Build release lock request
    const releaseLockRequest: ReleaseLockRequest = {
      userId: currentUser.uid,
      tabId: requestBody.tabId,  // Pass tabId for multi-tab validation
      force: forceRelease,
      reason: requestBody.reason || (forceRelease ? 'Admin override' : undefined),
      userOverride: requestBody.userOverride || false  // Pass userOverride for same-user cross-tab release
    };

    // Attempt to release the lock
    const success = await lockService.releaseLock(
      db,
      resourceId,
      options.collection,
      releaseLockRequest
    );

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Lock released successfully',
        releasedAt: new Date().toISOString()
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RELEASE_FAILED',
            message: 'Failed to release lock or you do not hold the lock',
            statusCode: 400
          }
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error in handleReleaseLock:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to release lock',
          statusCode: 500
        }
      },
      { status: 500 }
    );
  }
}

function isAdminUser(user: any): boolean {
  const adminEmails = [
    'admin@glamlink.com',
    'mohit@blockcod.com',
    'melanie@glamlink.net'
  ];
  
  return adminEmails.includes(user.email);
}

export function createReleaseLockHandler(options: RouteHandlerOptions) {
  return async (
    request: NextRequest, 
    params: { params: Promise<{ id: string }> }
  ) => {
    return handleReleaseLock(request, params, options);
  };
}