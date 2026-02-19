import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ADMIN_EMAILS } from "@/lib/features/auth/config";
import type {
  VerificationSubmission,
  VerificationReviewRequest,
} from "@/lib/features/profile-settings/verification/types";

/**
 * GET /api/verification/submissions/[id]
 * Get a specific verification submission (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Fetch submission
    const submissionDoc = await getDoc(doc(db, "verificationSubmissions", id));

    if (!submissionDoc.exists()) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: submissionDoc.data() as VerificationSubmission,
    });
  } catch (error) {
    console.error("Error fetching verification submission:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch submission" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/verification/submissions/[id]
 * Update verification submission status (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Parse request body
    const body: VerificationReviewRequest = await request.json();
    const { status, reviewNotes, rejectionReason } = body;

    // Validate status
    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status. Must be 'approved' or 'rejected'" },
        { status: 400 }
      );
    }

    // Require rejection reason for rejected status
    if (status === "rejected" && !rejectionReason) {
      return NextResponse.json(
        { success: false, error: "Rejection reason is required when rejecting" },
        { status: 400 }
      );
    }

    // Check if submission exists
    const submissionRef = doc(db, "verificationSubmissions", id);
    const submissionDoc = await getDoc(submissionRef);

    if (!submissionDoc.exists()) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { status: 404 }
      );
    }

    // Update submission
    const updateData: Record<string, any> = {
      status,
      reviewedAt: new Date().toISOString(),
      reviewedBy: currentUser.uid,
      reviewerEmail: currentUser.email,
      updatedAt: serverTimestamp(),
    };

    if (reviewNotes) {
      updateData.reviewNotes = reviewNotes;
    }

    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    await updateDoc(submissionRef, updateData);

    // If approved, also update the brand document to mark as verified
    if (status === "approved") {
      const brandId = submissionDoc.data().brandId;
      const brandRef = doc(db, "brands", brandId);
      const brandDoc = await getDoc(brandRef);

      if (brandDoc.exists()) {
        await updateDoc(brandRef, {
          isVerified: true,
          verifiedAt: new Date().toISOString(),
          updatedAt: serverTimestamp(),
        });
      }
    }

    // If rejected, ensure brand is not marked as verified
    if (status === "rejected") {
      const brandId = submissionDoc.data().brandId;
      const brandRef = doc(db, "brands", brandId);
      const brandDoc = await getDoc(brandRef);

      if (brandDoc.exists()) {
        await updateDoc(brandRef, {
          isVerified: false,
          verifiedAt: null,
          updatedAt: serverTimestamp(),
        });
      }
    }

    console.log(`Verification ${id} reviewed: ${status} by ${currentUser.email}`);

    return NextResponse.json({
      success: true,
      data: {
        id,
        status,
        reviewedAt: updateData.reviewedAt,
        reviewedBy: currentUser.uid,
      },
    });
  } catch (error) {
    console.error("Error updating verification submission:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update submission" },
      { status: 500 }
    );
  }
}
