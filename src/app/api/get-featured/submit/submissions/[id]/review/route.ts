import { NextRequest, NextResponse } from "next/server";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";

interface ReviewUpdateRequest {
  reviewed: boolean;
  status?: 'pending_review' | 'approved' | 'rejected';
  reviewNotes?: string;
}

// Admin-only endpoint to update submission review status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const timestamp = new Date().toISOString();
  const { id } = await params;

  try {
    // Check authentication and authorization
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser) {
      console.error(`[${timestamp}] Unauthorized access attempt to update submission ${id}`);
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is authorized admin
    const authorizedEmails = ['admin@glamlink.com', 'melanie@glamlink.net', 'mohit@blockcod.com'];
    if (!authorizedEmails.includes(currentUser.email || '')) {
      console.error(`[${timestamp}] Unauthorized user ${currentUser.email} attempted to update submission ${id}`);
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Parse request body
    const updateData: ReviewUpdateRequest = await request.json();

    // Validate required fields
    if (typeof updateData.reviewed !== 'boolean') {
      return NextResponse.json(
        { error: "reviewed field must be a boolean" },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (updateData.status && !['pending_review', 'approved', 'rejected'].includes(updateData.status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be: pending_review, approved, or rejected" },
        { status: 400 }
      );
    }

    // Prepare update data
    const submissionUpdate = {
      reviewed: updateData.reviewed,
      ...(updateData.status && { status: updateData.status }),
      ...(updateData.reviewed && {
        reviewedAt: serverTimestamp(),
        reviewedBy: {
          email: currentUser.email,
          uid: currentUser.uid
        }
      }),
      ...(updateData.reviewNotes && { reviewNotes: updateData.reviewNotes }),
      updatedAt: serverTimestamp()
    };

    // Update the submission
    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const submissionRef = doc(db, 'get-featured-submissions', id);
    await updateDoc(submissionRef, submissionUpdate);

    console.log(`[${timestamp}] ✅ Submission ${id} updated by ${currentUser.email}`, {
      reviewed: updateData.reviewed,
      status: updateData.status
    });

    return NextResponse.json({
      success: true,
      message: "Submission updated successfully",
      submissionId: id,
      updatedFields: {
        reviewed: updateData.reviewed,
        ...(updateData.status && { status: updateData.status })
      }
    });

  } catch (error) {
    console.error(`[${timestamp}] ❌ Failed to update submission ${id}:`, error);

    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      {
        error: "Failed to update submission. Please try again later.",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

// Handle other methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}