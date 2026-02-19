import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { lockService } from '@/lib/packages/lock-management/services/LockService';

// POST /api/magazine/locks/release - Release lock on a section
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

    const success = await lockService.releaseLock(
      db,
      sectionId,
      'magazine_sections',
      {
        userId: currentUser.uid
      }
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to release lock or you do not hold the lock' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Lock released successfully'
    });
  } catch (error) {
    console.error('Error releasing lock:', error);
    return NextResponse.json(
      { error: 'Failed to release lock' },
      { status: 500 }
    );
  }
}