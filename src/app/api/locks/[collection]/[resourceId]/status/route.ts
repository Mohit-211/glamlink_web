import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { lockService } from '@/lib/packages/lock-management/services/LockService';

/**
 * GET /api/locks/{collection}/{resourceId}/status
 *
 * Check the lock status of a resource.
 *
 * Returns:
 * - 200: Lock status retrieved successfully
 * - 401: Unauthorized
 * - 500: Server error
 */
export async function GET(
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

    // Get lock status
    const lockStatus = await lockService.getLockStatus(
      db,
      resourceId,
      collection,
      currentUser.uid
    );

    // Return status with proper structure for useLock hook
    return NextResponse.json({
      success: true,
      status: {
        resourceId,
        collection,
        isLocked: lockStatus.isLocked,
        canEdit: lockStatus.canEdit,
        hasLock: lockStatus.hasLock,
        lockExpiresAt: lockStatus.lockExpiresAt,
        lockedBy: lockStatus.lockedBy,
        lockedByName: lockStatus.lockedByName,
        lockedByEmail: lockStatus.lockedByEmail,
        lockedTabId: lockStatus.lockedTabId
      }
    });
  } catch (error) {
    console.error('[Lock API] Error checking lock status:', error);
    return NextResponse.json(
      { error: 'Failed to check lock status', success: false },
      { status: 500 }
    );
  }
}
