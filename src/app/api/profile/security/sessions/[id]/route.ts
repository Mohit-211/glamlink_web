import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { SessionManager } from '@/lib/services/security/sessionManager';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const currentSessionId = request.cookies.get('sessionId')?.value;

    // Prevent revoking current session
    if (id === currentSessionId) {
      return NextResponse.json(
        { error: 'Cannot revoke current session' },
        { status: 400 }
      );
    }

    await SessionManager.revokeSession(currentUser.uid, id, db);

    return NextResponse.json({
      success: true,
      message: 'Session revoked successfully',
    });
  } catch (error) {
    console.error('Error revoking session:', error);
    return NextResponse.json(
      { error: 'Failed to revoke session' },
      { status: 500 }
    );
  }
}
