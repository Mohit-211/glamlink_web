import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import { db as clientDb } from '@/lib/config/firebase';
import { generateSupportResponse } from '@/lib/features/support-bot/services/supportBotService';
import type { ChatMessage } from '@/lib/features/support-bot/types';

// POST - Send message to AI
export async function POST(request: NextRequest) {
  try {
    if (!clientDb) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { sessionId, message } = body;

    if (!sessionId || !message) {
      return NextResponse.json(
        { success: false, error: 'Session ID and message are required' },
        { status: 400 }
      );
    }

    // Find the session
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
    const sessionData = sessionDoc.data();

    // Convert existing messages to ChatMessage format
    const existingMessages: ChatMessage[] = (sessionData.messages || []).map((msg: any) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp?.toDate?.() || new Date(msg.timestamp),
    }));

    // Create user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    // Generate AI response
    const responseContent = await generateSupportResponse({
      userMessage: message,
      chatHistory: existingMessages,
    });

    // Create assistant message
    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date(),
    };

    // Update session with new messages
    await updateDoc(doc(clientDb, 'support_chat_sessions', sessionDoc.id), {
      messages: arrayUnion(
        {
          id: userMessage.id,
          role: userMessage.role,
          content: userMessage.content,
          timestamp: userMessage.timestamp,
        },
        {
          id: assistantMessage.id,
          role: assistantMessage.role,
          content: assistantMessage.content,
          timestamp: assistantMessage.timestamp,
        }
      ),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: {
        id: assistantMessage.id,
        role: assistantMessage.role,
        content: assistantMessage.content,
        timestamp: assistantMessage.timestamp.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process message. Please try again.' },
      { status: 500 }
    );
  }
}
