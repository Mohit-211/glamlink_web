/**
 * Magazine Section Lock API
 *
 * Simplified section-level locking for magazine editing.
 * Uses admin-lock-management package instead of full lock-management.
 *
 * REPLACED: Previous implementation used createLockRouteHandlers from full lock-management
 * NOW: Simple direct implementation with admin-lock-management utilities
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getLockExpirationTime, isLockExpired } from '@/lib/packages/admin-lock-management';

/**
 * GET /api/magazine/sections/[id]/lock
 * Check lock status for a section
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // IMPORTANT: Must await params in Next.js 15
    const { id: sectionId } = await params;

    // Authenticate user
    const { db, currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get userId from query params
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // Get section from Firestore
    const sectionRef = doc(db, 'sections', sectionId);
    const sectionDoc = await getDoc(sectionRef);

    if (!sectionDoc.exists()) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    const section = sectionDoc.data();

    // Check if section has a lock
    if (!section.lockedBy || !section.lockExpiresAt) {
      // Not locked
      return NextResponse.json({
        isLocked: false,
        canOverride: false,
      });
    }

    // Check if lock is expired
    if (isLockExpired(section.lockExpiresAt)) {
      // Lock expired - clean it up
      await updateDoc(sectionRef, {
        lockedBy: null,
        lockedByEmail: null,
        lockedByName: null,
        lockedAt: null,
        lockExpiresAt: null,
      });

      return NextResponse.json({
        isLocked: false,
        canOverride: false,
      });
    }

    // Check if current user owns the lock
    const canOverride = section.lockedBy === userId;

    // Return lock status
    return NextResponse.json({
      isLocked: true,
      lockedBy: section.lockedBy,
      lockedByName: section.lockedByName,
      lockedByEmail: section.lockedByEmail,
      lockExpiresAt: section.lockExpiresAt,
      canOverride,
    });
  } catch (error) {
    console.error('Error checking section lock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/magazine/sections/[id]/lock
 * Acquire lock on a section
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // IMPORTANT: Must await params in Next.js 15
    const { id: sectionId } = await params;

    // Authenticate user
    const { db, currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { userId, userEmail, userName, override = false } = body;

    if (!userId || !userEmail || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, userEmail, userName' },
        { status: 400 }
      );
    }

    // Get section from Firestore
    const sectionRef = doc(db, 'sections', sectionId);
    const sectionDoc = await getDoc(sectionRef);

    if (!sectionDoc.exists()) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    const section = sectionDoc.data();

    // Check if section is already locked
    if (section.lockedBy && section.lockExpiresAt) {
      // Check if lock is expired
      if (!isLockExpired(section.lockExpiresAt)) {
        // Lock is still active
        const isOwnLock = section.lockedBy === userId;

        if (!isOwnLock) {
          // Locked by someone else
          return NextResponse.json(
            {
              success: false,
              error: `Section is locked by ${section.lockedByName || 'another user'}`,
              lockStatus: {
                isLocked: true,
                lockedBy: section.lockedBy,
                lockedByName: section.lockedByName,
                lockedByEmail: section.lockedByEmail,
                lockExpiresAt: section.lockExpiresAt,
                canOverride: false,
              },
            },
            { status: 423 } // 423 Locked
          );
        }

        // User's own lock
        if (!override) {
          // Need override confirmation
          return NextResponse.json(
            {
              success: false,
              error: 'You have this section locked elsewhere. Set override=true to continue.',
              lockStatus: {
                isLocked: true,
                lockedBy: section.lockedBy,
                lockedByName: section.lockedByName,
                lockedByEmail: section.lockedByEmail,
                lockExpiresAt: section.lockExpiresAt,
                canOverride: true,
              },
            },
            { status: 423 } // 423 Locked
          );
        }

        // Override confirmed - will update lock below
      }
    }

    // Acquire lock (new or override)
    const now = new Date().toISOString();
    const lockExpiresAt = getLockExpirationTime(); // 5 minutes from now

    await updateDoc(sectionRef, {
      lockedBy: userId,
      lockedByEmail: userEmail,
      lockedByName: userName,
      lockedAt: now,
      lockExpiresAt: lockExpiresAt,
    });

    console.log(`[Admin Lock] Section ${sectionId} locked by ${userName} (${userId}) until ${lockExpiresAt}`);

    return NextResponse.json({
      success: true,
      lockStatus: {
        isLocked: true,
        lockedBy: userId,
        lockedByName: userName,
        lockedByEmail: userEmail,
        lockExpiresAt: lockExpiresAt,
        canOverride: true,
      },
    });
  } catch (error) {
    console.error('Error acquiring section lock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/magazine/sections/[id]/lock
 * Refresh/extend lock expiration time
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // IMPORTANT: Must await params in Next.js 15
    const { id: sectionId } = await params;

    // Authenticate user
    const { db, currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get userId from query params
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // Get section from Firestore
    const sectionRef = doc(db, 'sections', sectionId);
    const sectionDoc = await getDoc(sectionRef);

    if (!sectionDoc.exists()) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    const section = sectionDoc.data();

    // Check if section has a lock
    if (!section.lockedBy) {
      return NextResponse.json(
        { error: 'Section is not locked' },
        { status: 400 }
      );
    }

    // Verify user owns the lock
    if (section.lockedBy !== userId) {
      return NextResponse.json(
        { error: 'You do not own this lock' },
        { status: 403 }
      );
    }

    // Check if lock is expired
    if (isLockExpired(section.lockExpiresAt)) {
      return NextResponse.json(
        { error: 'Lock has expired' },
        { status: 410 } // 410 Gone
      );
    }

    // Refresh lock expiration time
    const newLockExpiresAt = getLockExpirationTime(); // 5 minutes from now

    await updateDoc(sectionRef, {
      lockExpiresAt: newLockExpiresAt,
    });

    console.log(`[Admin Lock] Section ${sectionId} lock refreshed for ${userId} until ${newLockExpiresAt}`);

    return NextResponse.json({
      success: true,
      lockStatus: {
        isLocked: true,
        lockedBy: section.lockedBy,
        lockedByName: section.lockedByName,
        lockedByEmail: section.lockedByEmail,
        lockExpiresAt: newLockExpiresAt,
        canOverride: true,
      },
    });
  } catch (error) {
    console.error('Error refreshing section lock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/magazine/sections/[id]/lock
 * Release lock on a section
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // IMPORTANT: Must await params in Next.js 15
    const { id: sectionId } = await params;

    // Authenticate user
    const { db, currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get userId from query params
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // Get section from Firestore
    const sectionRef = doc(db, 'sections', sectionId);
    const sectionDoc = await getDoc(sectionRef);

    if (!sectionDoc.exists()) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    const section = sectionDoc.data();

    // Check if section has a lock
    if (!section.lockedBy) {
      // Not locked - nothing to release
      return NextResponse.json({
        success: true,
        message: 'Section was not locked',
      });
    }

    // Verify user owns the lock or lock is expired
    const isOwnLock = section.lockedBy === userId;
    const isExpired = isLockExpired(section.lockExpiresAt);

    if (!isOwnLock && !isExpired) {
      // Can't release someone else's active lock
      return NextResponse.json(
        {
          success: false,
          error: `Cannot release lock owned by ${section.lockedByName || 'another user'}`,
        },
        { status: 403 } // 403 Forbidden
      );
    }

    // Release lock
    await updateDoc(sectionRef, {
      lockedBy: null,
      lockedByEmail: null,
      lockedByName: null,
      lockedAt: null,
      lockExpiresAt: null,
    });

    console.log(`[Admin Lock] Section ${sectionId} lock released by ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'Lock released successfully',
    });
  } catch (error) {
    console.error('Error releasing section lock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
