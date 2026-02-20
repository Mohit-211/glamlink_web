import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { ADMIN_EMAILS } from "@/lib/features/auth/config";
import type {
  VerificationSubmission,
  VerificationSubmissionsResponse,
  VerificationStatus,
} from "@/lib/features/profile-settings/verification/types";

/**
 * GET /api/verification/submissions
 * Get all verification submissions (admin only)
 *
 * Query params:
 *   - status: Filter by status (pending, approved, rejected)
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    // Verify admin access
    const callerEmail = currentUser.email;
    if (!callerEmail || !ADMIN_EMAILS.includes(callerEmail)) {
      return NextResponse.json(
        { success: false, error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status") as VerificationStatus | null;

    // Build query
    const submissionsRef = collection(db, "verificationSubmissions");
    let q = query(submissionsRef, orderBy("submittedAt", "desc"));

    if (statusFilter && ["pending", "approved", "rejected", "none"].includes(statusFilter)) {
      q = query(
        submissionsRef,
        where("status", "==", statusFilter),
        orderBy("submittedAt", "desc")
      );
    }

    // Execute query
    const snapshot = await getDocs(q);
    const submissions: VerificationSubmission[] = [];

    snapshot.forEach((doc) => {
      submissions.push(doc.data() as VerificationSubmission);
    });

    const response: VerificationSubmissionsResponse = {
      success: true,
      data: submissions,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching verification submissions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
