/**
 * Transfer Lock Route Handler
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { lockService } from '../services/LockService';
import { validateResourceIdentifiers, validateTransferLockRequest } from '../utils/lockValidators';
import { TransferLockRequest, RouteHandlerOptions } from '../types/api.types';

export async function handleTransferLock(
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

    const requestBody = await request.json();
    const { newTabId, forceTransfer, reason } = requestBody;

    const transferLockRequest: TransferLockRequest = {
      userId: currentUser.uid,
      newTabId: newTabId,
      forceTransfer: forceTransfer || false,
      reason: reason
    };

    const requestValidation = validateTransferLockRequest(transferLockRequest);
    if (!requestValidation.isValid) {
      return NextResponse.json({ success: false, error: 'Invalid transfer request', details: requestValidation.errors }, { status: 400 });
    }

    const result = await lockService.transferLock(
      db,
      resourceId,
      options.collection,
      transferLockRequest
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        lockExpiresAt: result.lockExpiresAt,
        transferredTo: newTabId
      });
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in handleTransferLock:', error);
    return NextResponse.json({ success: false, error: 'Failed to transfer lock' }, { status: 500 });
  }
}

export function createTransferLockHandler(options: RouteHandlerOptions) {
  return async (request: NextRequest, params: { params: Promise<{ id: string }> }) => {
    return handleTransferLock(request, params, options);
  };
}