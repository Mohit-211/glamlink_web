import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

/**
 * PATCH /api/apply/digital-card/submissions/[id]/review
 * Update submission status and reviewed flag
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();
    const { id } = await params;

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reviewed, status, hidden } = body;

    // Validate input
    if (typeof reviewed !== 'boolean') {
      return NextResponse.json(
        { error: 'reviewed field is required and must be a boolean' },
        { status: 400 }
      );
    }

    if (status && !['pending_review', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'status must be one of: pending_review, approved, rejected' },
        { status: 400 }
      );
    }

    // Check if submission exists
    const submissionRef = doc(db, 'digital-card-applications', id);
    const submissionDoc = await getDoc(submissionRef);

    if (!submissionDoc.exists()) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: Record<string, any> = { reviewed };
    if (status) {
      updateData.status = status;
    }
    if (typeof hidden === 'boolean') {
      updateData.hidden = hidden;
    }

    await updateDoc(submissionRef, updateData);

    // Get the updated document
    const updatedDoc = await getDoc(submissionRef);
    const updatedData = {
      id: updatedDoc.id,
      ...updatedDoc.data()
    };

    return NextResponse.json({
      success: true,
      submission: updatedData,
      message: 'Submission updated successfully'
    });

  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      {
        error: 'Failed to update submission',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
