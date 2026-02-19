import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';

/**
 * DELETE /api/get-featured/submissions/[id]
 * Delete a submission by ID
 */
export async function DELETE(
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

    // Check if submission exists
    const submissionRef = doc(db, 'get-featured-submissions', id);
    const submissionDoc = await getDoc(submissionRef);

    if (!submissionDoc.exists()) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Delete the submission
    await deleteDoc(submissionRef);

    return NextResponse.json({
      success: true,
      message: 'Submission deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete submission',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/get-featured/submissions/[id]
 * Get a single submission by ID
 */
export async function GET(
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

    // Get submission
    const submissionRef = doc(db, 'get-featured-submissions', id);
    const submissionDoc = await getDoc(submissionRef);

    if (!submissionDoc.exists()) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      submission: {
        id: submissionDoc.id,
        ...submissionDoc.data()
      }
    });

  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch submission',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
