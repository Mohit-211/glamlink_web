import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { SessionManager } from '@/lib/services/security/sessionManager';

export async function GET(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all sessions for user
    const sessionsRef = collection(db, 'users', currentUser.uid, 'sessions');
    const sessionsQuery = query(sessionsRef, orderBy('lastActive', 'desc'));
    const sessionsSnap = await getDocs(sessionsQuery);

    // Get current session ID from cookie or header
    const currentSessionId = request.cookies.get('sessionId')?.value || null;

    const sessions = sessionsSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        deviceType: data.deviceType,
        browser: data.browser,
        os: data.os,
        location: data.location,
        ipAddress: data.ipAddress,
        lastActive: data.lastActive?.toDate().toISOString(),
        isCurrent: doc.id === currentSessionId,
        createdAt: data.createdAt?.toDate().toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    if (all) {
      // Revoke all other sessions except current
      const currentSessionId = request.cookies.get('sessionId')?.value;

      if (!currentSessionId) {
        return NextResponse.json(
          { error: 'Current session not found' },
          { status: 400 }
        );
      }

      await SessionManager.revokeAllOtherSessions(
        currentUser.uid,
        currentSessionId,
        db
      );

      return NextResponse.json({
        success: true,
        message: 'All other sessions revoked successfully',
      });
    }

    return NextResponse.json(
      { error: 'Invalid request. Use ?all=true or provide session ID' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error revoking sessions:', error);
    return NextResponse.json(
      { error: 'Failed to revoke sessions' },
      { status: 500 }
    );
  }
}
