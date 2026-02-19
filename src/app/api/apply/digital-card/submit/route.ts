import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc, serverTimestamp, doc, runTransaction } from "firebase/firestore";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import {
  DEFAULT_SUBMISSION_SETTINGS,
  DIGITAL_CARD_SETTINGS_DOC_PATH,
  MAX_SUBMISSIONS,
} from "@/lib/features/digital-card-cap/config";

export async function POST(request: NextRequest) {
  const timestamp = new Date().toISOString();

  try {
    const submission = await request.json();

    // Get authenticated Firebase instance
    const { db, currentUser } = await getAuthenticatedAppForUser();

    // Check if Firestore is available
    if (!db) {
      return NextResponse.json(
        { error: 'Database service unavailable' },
        { status: 503 }
      );
    }

    // Note: currentUser may be null for unauthenticated submissions
    // We allow both authenticated and unauthenticated submissions

    // Validate required fields
    const requiredFields = ['name', 'title', 'specialty', 'email', 'phone', 'bio'];
    const missingFields = requiredFields.filter(field => !submission[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate locations (must have at least one location)
    if (!submission.locations || !Array.isArray(submission.locations) || submission.locations.length === 0) {
      return NextResponse.json(
        { error: 'At least one business location is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(submission.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate specialties (check both field names for compatibility)
    const hasSpecialties = (Array.isArray(submission.specialties) && submission.specialties.length > 0) ||
                          (Array.isArray(submission.primarySpecialties) && submission.primarySpecialties.length > 0);
    if (!hasSpecialties) {
      return NextResponse.json(
        { error: 'Please add at least one specialty' },
        { status: 400 }
      );
    }

    // Parse the settings document path
    const [settingsCollection, settingsDocId] = DIGITAL_CARD_SETTINGS_DOC_PATH.split('/');
    const settingsRef = doc(db, settingsCollection, settingsDocId);

    // Use a transaction to check cap and increment counter atomically
    const result = await runTransaction(db, async (transaction) => {
      const settingsDoc = await transaction.get(settingsRef);

      let settings = settingsDoc.exists()
        ? settingsDoc.data()
        : { ...DEFAULT_SUBMISSION_SETTINGS };

      const currentCount = settings.currentCount || 0;
      const maxAllowed = settings.maxAllowed || MAX_SUBMISSIONS;
      const isManuallyAccepting = settings.isAccepting !== false;

      // Check if accepting submissions
      if (currentCount >= maxAllowed || !isManuallyAccepting) {
        return {
          success: false,
          capReached: true,
          currentCount,
          maxAllowed,
        };
      }

      // Create the submission document
      const submissionsCollection = collection(db, 'digital-card-applications');
      const docRef = await addDoc(submissionsCollection, {
        ...submission,
        status: 'pending_review',
        reviewed: false,
        createdAt: serverTimestamp(),
        submittedAt: timestamp,
        // Include user info if authenticated
        ...(currentUser && {
          userId: currentUser.uid,
          userEmail: currentUser.email,
        }),
        metadata: {
          userAgent: request.headers.get('user-agent'),
          ip: request.headers.get('x-forwarded-for') || 'unknown',
          source: 'digital-card-form',
          authenticated: !!currentUser,
        }
      });

      // Update the counter
      if (settingsDoc.exists()) {
        transaction.update(settingsRef, {
          currentCount: currentCount + 1,
          lastUpdated: new Date(),
        });
      } else {
        transaction.set(settingsRef, {
          ...DEFAULT_SUBMISSION_SETTINGS,
          currentCount: 1,
          lastUpdated: new Date(),
        });
      }

      return {
        success: true,
        submissionId: docRef.id,
        email: submission.email,
        spotsRemaining: maxAllowed - currentCount - 1,
      };
    });

    if (!result.success && result.capReached) {
      return NextResponse.json(
        {
          success: false,
          error: "We've reached our capacity for digital business card applications. Please join our waitlist to be notified when spots open up.",
          capReached: true,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Digital card application submitted successfully!",
      submissionId: result.submissionId,
      email: result.email,
      spotsRemaining: result.spotsRemaining,
    });

  } catch (error) {
    console.error(`[${timestamp}] Digital card application error:`, error);
    return NextResponse.json(
      { error: "Failed to submit application. Please try again later." },
      { status: 500 }
    );
  }
}
