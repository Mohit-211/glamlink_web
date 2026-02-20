import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { lockService } from '@/lib/packages/lock-management/services/LockService';

// POST /api/magazine/locks/acquire - Acquire lock on a section
export async function POST(request: NextRequest) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();
    
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sectionId } = body;

    if (!sectionId) {
      return NextResponse.json(
        { error: 'Section ID is required' },
        { status: 400 }
      );
    }

    const response = await lockService.acquireLock(
      db,
      sectionId,
      'magazine_sections',
      {
        userId: currentUser.uid,
        userEmail: currentUser.email || '',
        userName: currentUser.displayName || currentUser.email || 'Unknown User'
      }
    );

    if (!response.success) {
      return NextResponse.json(
        {
          success: false,
          message: response.message,
          lockedBy: response.lockedBy
        },
        { status: 423 } // 423 Locked
      );
    }

    return NextResponse.json({
      success: true,
      message: response.message,
      lockExpiresAt: response.lockExpiresAt
    });
  } catch (error) {
    console.error('Error acquiring lock:', error);
    return NextResponse.json(
      { error: 'Failed to acquire lock' },
      { status: 500 }
    );
  }
}