import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { lockService } from '@/lib/packages/lock-management/services/LockService';

/**
 * POST /api/locks/{collection}/{resourceId}/extend
 *
 * Extend the expiration time of an existing lock.
 *
 * Request Body:
 * - extendByMinutes: Number of minutes to extend the lock (default: 5)
 *
 * Returns:
 * - 200: Lock extended successfully
 * - 400: Failed to extend lock
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
    const { extendByMinutes = 5 } = body;

    // Extend lock
    const response = await lockService.extendLock(
      db,
      resourceId,
      collection,
      currentUser.uid,
      extendByMinutes
    );

    if (!response.success) {
      return NextResponse.json(
        {
          success: false,
          message: response.message || 'Failed to extend lock',
          error: response.message
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      lockExpiresAt: response.lockExpiresAt,
      message: response.message || 'Lock extended successfully'
    });
  } catch (error) {
    console.error('[Lock API] Error extending lock:', error);
    return NextResponse.json(
      { error: 'Failed to extend lock', success: false },
      { status: 500 }
    );
  }
}
