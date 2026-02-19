import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const COLLECTION_NAME = 'get-featured-forms';

/**
 * GET /api/get-featured/forms/[id]
 * Get a single form configuration by ID
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

    const formRef = doc(db, COLLECTION_NAME, id);
    const formDoc = await getDoc(formRef);

    if (!formDoc.exists()) {
      return NextResponse.json(
        { error: 'Form configuration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: formDoc.id,
        ...formDoc.data()
      }
    });

  } catch (error) {
    console.error('Error fetching form config:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch form configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/get-featured/forms/[id]
 * Update a form configuration
 */
export async function PUT(
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

    const data = await request.json();

    // Check if form exists
    const formRef = doc(db, COLLECTION_NAME, id);
    const formDoc = await getDoc(formRef);

    if (!formDoc.exists()) {
      return NextResponse.json(
        { error: 'Form configuration not found' },
        { status: 404 }
      );
    }

    // Prepare update data with updated timestamp
    const updateData = {
      ...data,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    await updateDoc(formRef, updateData);

    // Get updated document
    const updatedDoc = await getDoc(formRef);

    return NextResponse.json({
      success: true,
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data()
      },
      message: 'Form configuration updated successfully'
    });

  } catch (error) {
    console.error('Error updating form config:', error);
    return NextResponse.json(
      {
        error: 'Failed to update form configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/get-featured/forms/[id]
 * Delete a form configuration
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

    // Check if form exists
    const formRef = doc(db, COLLECTION_NAME, id);
    const formDoc = await getDoc(formRef);

    if (!formDoc.exists()) {
      return NextResponse.json(
        { error: 'Form configuration not found' },
        { status: 404 }
      );
    }

    await deleteDoc(formRef);

    return NextResponse.json({
      success: true,
      message: 'Form configuration deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting form config:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete form configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
