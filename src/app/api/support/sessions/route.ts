import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db as clientDb } from '@/lib/config/firebase';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';

// POST - Create new session
export async function POST(request: NextRequest) {
  try {
    if (!clientDb) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable' },
        { status: 503 }
      );
    }

    // Get user if authenticated (optional)
    let userId: string | undefined;
    try {
      const { currentUser } = await getAuthenticatedAppForUser();
      userId = currentUser?.uid;
    } catch {
      // User not authenticated, that's okay
    }

    const sessionId = crypto.randomUUID();
    const now = new Date();

    const sessionData = {
      sessionId,
      userId: userId || null,
      startedAt: now,
      messages: [],
      updatedAt: now,
    };

    const sessionsCollection = collection(clientDb, 'support_chat_sessions');
    await addDoc(sessionsCollection, sessionData);

    return NextResponse.json({
      success: true,
      session: {
        sessionId,
        userId,
        startedAt: now.toISOString(),
        messages: [],
        updatedAt: now.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating chat session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

// GET - List user's sessions (for logged-in users)
export async function GET(request: NextRequest) {
  try {
    if (!clientDb) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable' },
        { status: 503 }
      );
    }

    // Get user
    let userId: string | undefined;
    try {
      const { currentUser } = await getAuthenticatedAppForUser();
      userId = currentUser?.uid;
    } catch {
      // User not authenticated
    }

    if (!userId) {
      return NextResponse.json({
        success: true,
        sessions: [],
      });
    }

    const sessionsCollection = collection(clientDb, 'support_chat_sessions');
    const q = query(
      sessionsCollection,
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(10)
    );

    const snapshot = await getDocs(q);
    const sessions = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        sessionId: data.sessionId,
        startedAt: data.startedAt?.toDate?.()?.toISOString() || data.startedAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
        messageCount: data.messages?.length || 0,
      };
    });

    return NextResponse.json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error('Error listing chat sessions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list sessions' },
      { status: 500 }
    );
  }
}
