import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db as clientDb } from '@/lib/config/firebase';
import {
  DEFAULT_SUBMISSION_SETTINGS,
  DIGITAL_CARD_SETTINGS_DOC_PATH
} from '@/lib/features/digital-card-cap/config';

export async function GET(request: NextRequest) {
  try {
    if (!clientDb) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable' },
        { status: 503 }
      );
    }

    // Parse the document path
    const [collection, docId] = DIGITAL_CARD_SETTINGS_DOC_PATH.split('/');
    const settingsRef = doc(clientDb, collection, docId);
    const settingsDoc = await getDoc(settingsRef);

    if (!settingsDoc.exists()) {
      // Return defaults if document doesn't exist
      // The document should be created by an admin through the admin panel
      return NextResponse.json({
        success: true,
        data: {
          currentCount: DEFAULT_SUBMISSION_SETTINGS.currentCount,
          maxAllowed: DEFAULT_SUBMISSION_SETTINGS.maxAllowed,
          isAccepting: DEFAULT_SUBMISSION_SETTINGS.isAccepting,
          lastUpdated: null,
        },
      });
    }

    const settings = settingsDoc.data();
    const isAccepting = settings.currentCount < settings.maxAllowed && settings.isAccepting !== false;

    return NextResponse.json({
      success: true,
      data: {
        currentCount: settings.currentCount,
        maxAllowed: settings.maxAllowed,
        isAccepting,
        lastUpdated: settings.lastUpdated?.toDate?.()?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error('Error fetching submission status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submission status' },
      { status: 500 }
    );
  }
}
