import { NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { doc, getDoc } from "firebase/firestore";
import type {
  VerificationStatus,
  VerificationSubmission,
  VerificationStatusResponse,
} from "@/lib/features/profile-settings/verification/types";

/**
 * GET /api/verification/status
 * Get the current user's verification status
 */
export async function GET() {
  try {
    // Get authenticated user
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    const brandId = `brand_${currentUser.uid}`;

    // Fetch verification submission
    const submissionDoc = await getDoc(doc(db, "verificationSubmissions", brandId));

    let status: VerificationStatus = "none";
    let submission: VerificationSubmission | null = null;

    if (submissionDoc.exists()) {
      const data = submissionDoc.data() as VerificationSubmission;
      status = data.status;
      submission = data;
    }

    const response: VerificationStatusResponse = {
      success: true,
      data: {
        status,
        submission,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching verification status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch verification status" },
      { status: 500 }
    );
  }
}
