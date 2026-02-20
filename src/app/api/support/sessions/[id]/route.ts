import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db as clientDb } from '@/lib/config/firebase';

// GET - Load session
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;

    if (!clientDb) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable' },
        { status: 503 }
      );
    }

    const sessionsCollection = collection(clientDb, 'support_chat_sessions');
    const q = query(sessionsCollection, where('sessionId', '==', sessionId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    const sessionDoc = snapshot.docs[0];
    const data = sessionDoc.data();

    return NextResponse.json({
      success: true,
      session: {
        sessionId: data.sessionId,
        userId: data.userId,
        startedAt: data.startedAt?.toDate?.()?.toISOString() || data.startedAt,
        messages: (data.messages || []).map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp?.toDate?.()?.toISOString() || msg.timestamp,
        })),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error loading chat session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load session' },
      { status: 500 }
    );
  }
}

// DELETE - Clear/delete session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;

    if (!clientDb) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable' },
        { status: 503 }
      );
    }

    const sessionsCollection = collection(clientDb, 'support_chat_sessions');
    const q = query(sessionsCollection, where('sessionId', '==', sessionId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      await deleteDoc(doc(clientDb, 'support_chat_sessions', snapshot.docs[0].id));
    }

    return NextResponse.json({
      success: true,
      message: 'Session deleted',
    });
  } catch (error) {
    console.error('Error deleting chat session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}
