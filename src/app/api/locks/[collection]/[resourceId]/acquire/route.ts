import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { lockService } from '@/lib/packages/lock-management/services/LockService';

/**
 * POST /api/locks/{collection}/{resourceId}/acquire
 *
 * Acquire a lock on a resource for collaborative editing.
 *
 * Request Body:
 * - tabId: Browser tab identifier for multi-tab detection
 * - lockGroup: Optional grouping for related resources
 *
 * Returns:
 * - 200: Lock acquired successfully
 * - 423: Resource is locked by another user
 * - 401: Unauthorized
 * - 500: Server error
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; resourceId: string }> }
) {
  try {
    // IMPORTANT: Await params in Next.js 15
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
    const { tabId, lockGroup } = body;

    // Call lockService.acquireLock
    const response = await lockService.acquireLock(
      db,
      resourceId,
      collection,
      {
        userId: currentUser.uid,
        userEmail: currentUser.email || '',
        userName: currentUser.displayName || currentUser.email || 'Unknown User',
        tabId,
        lockGroup
      }
    );

    // Handle lock conflict
    if (!response.success) {
      return NextResponse.json(
        {
          success: false,
          message: response.message,
          error: response.message,
          lockedBy: response.lockedBy,
          lockedByName: response.lockedByName,
          lockedByEmail: response.lockedByEmail,
          lockExpiresAt: response.lockExpiresAt,
          isMultiTabConflict: response.isMultiTabConflict,
          allowTransfer: response.allowTransfer
        },
        { status: 423 } // 423 Locked
      );
    }

    // Success response
    return NextResponse.json({
      success: true,
      message: response.message,
      lockExpiresAt: response.lockExpiresAt,
      lockedBy: currentUser.uid,
      lockedByName: currentUser.displayName || currentUser.email,
      lockedByEmail: currentUser.email
    });
  } catch (error) {
    console.error('[Lock API] Error acquiring lock:', error);
    return NextResponse.json(
      { error: 'Failed to acquire lock', success: false },
      { status: 500 }
    );
  }
}
