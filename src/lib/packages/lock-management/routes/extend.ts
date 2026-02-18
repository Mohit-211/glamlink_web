/**
 * Extend Lock Route Handler
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { lockService } from '../services/LockService';
import { validateResourceIdentifiers } from '../utils/lockValidators';
import { RouteHandlerOptions } from '../types/api.types';

export async function handleExtendLock(
  request: NextRequest,
  params: { params: Promise<{ id: string }> },
  options: RouteHandlerOptions
): Promise<NextResponse> {
  try {
    const { id: resourceId } = await params.params;
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const resourceValidation = validateResourceIdentifiers(resourceId, options.collection);
    if (!resourceValidation.isValid) {
      return NextResponse.json({ success: false, error: 'Invalid resource identifiers' }, { status: 400 });
    }

    let requestBody: any = {};
    try {
      if (request.headers.get('content-length') !== '0') {
        requestBody = await request.json();
      }
    } catch (error) {
      // Empty body is okay
    }

    const extendByMinutes = requestBody.extendByMinutes || options.lockDuration || 5;

    const result = await lockService.extendLock(
      db,
      resourceId,
      options.collection,
      currentUser.uid,
      extendByMinutes
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        lockExpiresAt: result.lockExpiresAt,
        extendedByMinutes: extendByMinutes
      });
    } else {
      return NextResponse.json({ success: false, message: result.message || 'Failed to extend lock' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in handleExtendLock:', error);
    return NextResponse.json({ success: false, error: 'Failed to extend lock' }, { status: 500 });
  }
}

export function createExtendLockHandler(options: RouteHandlerOptions) {
  return async (request: NextRequest, params: { params: Promise<{ id: string }> }) => {
    return handleExtendLock(request, params, options);
  };
}