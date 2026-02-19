import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { lockService } from '@/lib/packages/lock-management/services/LockService';

// GET /api/magazine/locks/status?sectionId=xxx - Check lock status
export async function GET(request: NextRequest) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();
    
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sectionId = request.nextUrl.searchParams.get('sectionId');

    if (!sectionId) {
      return NextResponse.json(
        { error: 'Section ID is required' },
        { status: 400 }
      );
    }

    const lockStatus = await lockService.getLockStatus(
      db,
      sectionId,
      'magazine_sections',
      currentUser.uid
    );

    return NextResponse.json({
      success: true,
      ...lockStatus
    });
  } catch (error) {
    console.error('Error checking lock status:', error);
    return NextResponse.json(
      { error: 'Failed to check lock status' },
      { status: 500 }
    );
  }
}