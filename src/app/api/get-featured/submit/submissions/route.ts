import { NextRequest, NextResponse } from "next/server";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import type { GetFeaturedSubmission } from "@/lib/pages/apply/featured/types";

// Admin-only endpoint to fetch all Get Featured submissions
export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString();

  try {
    // Check authentication and authorization
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser) {
      console.error(`[${timestamp}] Unauthorized access attempt to get-featured submissions`);
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is authorized admin
    const authorizedEmails = ['admin@glamlink.com', 'melanie@glamlink.net', 'mohit@blockcod.com'];
    if (!authorizedEmails.includes(currentUser.email || '')) {
      console.error(`[${timestamp}] Unauthorized user ${currentUser.email} attempted to access submissions`);
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Fetch all submissions from Firestore
    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const submissionsCollection = collection(db, 'get-featured-submissions');
    const q = query(
      submissionsCollection,
      orderBy('submittedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const submissions: GetFeaturedSubmission[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      submissions.push({
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        status: data.status || 'pending_review',
        reviewed: data.reviewed || false,
        metadata: data.metadata || {}
      } as GetFeaturedSubmission);
    });

    console.log(`[${timestamp}] ✅ Retrieved ${submissions.length} submissions for ${currentUser.email}`);

    return NextResponse.json({
      success: true,
      submissions,
      count: submissions.length
    });

  } catch (error) {
    console.error(`[${timestamp}] ❌ Failed to fetch submissions:`, error);

    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      {
        error: "Failed to fetch submissions. Please try again later.",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

// Handle other methods
export async function POST() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}