import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { lockService } from '@/lib/packages/lock-management/services/LockService';

/**
 * POST /api/locks/{collection}/{resourceId}/release
 *
 * Release a lock on a resource.
 *
 * Request Body:
 * - reason: Optional reason for releasing the lock
 *
 * Returns:
 * - 200: Lock released successfully
 * - 400: Failed to release lock
 * - 401: Unauthorized
 * - 500: Server error
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; resourceId: string }> }
) {
  try {
    const { collection, resourceId } = await params;

    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { reason = 'User initiated release' } = body;

    // Release lock
    const success = await lockService.releaseLock(
      db,
      resourceId,
      collection,
      {
        userId: currentUser.uid,
        reason
      }
    );

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to release lock',
          error: 'Failed to release lock'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Lock released successfully'
    });
  } catch (error) {
    console.error('[Lock API] Error releasing lock:', error);
    return NextResponse.json(
      { error: 'Failed to release lock', success: false },
      { status: 500 }
    );
  }
}
