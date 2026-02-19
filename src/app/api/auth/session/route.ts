import { NextRequest, NextResponse } from 'next/server';
import { setCookie, deleteCookie } from '@/lib/utils/cookies';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { SessionManager } from '@/lib/services/security/sessionManager';
import { LoginLogger } from '@/lib/services/security/loginLogger';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { success: false, error: 'No ID token provided' },
        { status: 400 }
      );
    }

    // Set the session cookie first
    await setCookie('__session', idToken);

    // Get authenticated user and db
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (currentUser && db) {
      try {
        // Create session document
        const sessionId = await SessionManager.createSession(currentUser, request, db);

        // Log successful login
        await LoginLogger.logLoginAttempt(
          currentUser.uid,
          'success',
          request,
          db
        );

        // Set session ID cookie for tracking
        await setCookie('sessionId', sessionId);
      } catch (error) {
        console.error('Error creating session or logging login:', error);
        // Don't fail the login if session creation fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Error setting session cookie
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Clear the session cookie
    await deleteCookie('__session');
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Error clearing session cookie
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}