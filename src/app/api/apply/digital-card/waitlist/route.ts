import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { db as clientDb } from '@/lib/config/firebase';
import {
  DEFAULT_SUBMISSION_SETTINGS,
  DIGITAL_CARD_SETTINGS_DOC_PATH,
  MESSAGES
} from '@/lib/features/digital-card-cap/config';

export async function POST(request: NextRequest) {
  try {
    if (!clientDb) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Parse the document path
    const [collection, docId] = DIGITAL_CARD_SETTINGS_DOC_PATH.split('/');
    const settingsRef = doc(clientDb, collection, docId);
    const settingsDoc = await getDoc(settingsRef);

    if (!settingsDoc.exists()) {
      // Initialize with defaults and add email to waitlist
      await setDoc(settingsRef, {
        ...DEFAULT_SUBMISSION_SETTINGS,
        waitlistEmails: [normalizedEmail],
        lastUpdated: new Date(),
      });

      return NextResponse.json({
        success: true,
        message: MESSAGES.waitlist.success,
        alreadyOnWaitlist: false,
      });
    }

    const settings = settingsDoc.data();
    const waitlistEmails = settings.waitlistEmails || [];

    // Check if already on waitlist
    if (waitlistEmails.includes(normalizedEmail)) {
      return NextResponse.json({
        success: true,
        message: MESSAGES.waitlist.alreadyOnList,
        alreadyOnWaitlist: true,
      });
    }

    // Add to waitlist
    await updateDoc(settingsRef, {
      waitlistEmails: arrayUnion(normalizedEmail),
      lastUpdated: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: MESSAGES.waitlist.success,
      alreadyOnWaitlist: false,
    });
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    return NextResponse.json(
      { success: false, error: MESSAGES.waitlist.error },
      { status: 500 }
    );
  }
}
