import { NextRequest, NextResponse } from 'next/server';
import { doc, writeBatch } from 'firebase/firestore';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { COLLECTION_PATHS, isAdminEmail } from '@/lib/features/crm/profile/support-messaging/config';
import type { ConversationStatus } from '@/lib/features/crm/profile/support-messaging/types';

interface BulkUpdateRequest {
  conversationIds: string[];
  updates: {
    status?: ConversationStatus;
  };
}

// POST - Bulk update conversation status
export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admins can perform bulk updates
    if (!isAdminEmail(currentUser.email || '')) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body: BulkUpdateRequest = await request.json();
    const { conversationIds, updates } = body;

    if (!conversationIds || !Array.isArray(conversationIds) || conversationIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'conversationIds array is required' },
        { status: 400 }
      );
    }

    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one update field is required' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (updates.status && !['open', 'pending', 'resolved'].includes(updates.status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Limit batch size to prevent abuse
    const MAX_BATCH_SIZE = 100;
    if (conversationIds.length > MAX_BATCH_SIZE) {
      return NextResponse.json(
        { success: false, error: `Maximum ${MAX_BATCH_SIZE} conversations per batch` },
        { status: 400 }
      );
    }

    const now = new Date();
    const batch = writeBatch(db);

    // Add all updates to the batch
    for (const id of conversationIds) {
      const conversationRef = doc(db, COLLECTION_PATHS.conversations, id);
      batch.update(conversationRef, {
        ...updates,
        updatedAt: now,
      });
    }

    // Commit the batch
    await batch.commit();

    return NextResponse.json({
      success: true,
      updatedCount: conversationIds.length,
    });
  } catch (error) {
    console.error('Error performing bulk update:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform bulk update' },
      { status: 500 }
    );
  }
}
