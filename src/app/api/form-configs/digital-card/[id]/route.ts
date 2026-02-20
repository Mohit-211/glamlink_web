import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const COLLECTION_NAME = 'digital-card-forms';

/**
 * GET /api/form-configs/digital-card/[id]
 * Get a single digital card form configuration by ID
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
        { error: 'Digital card form configuration not found' },
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
    console.error('Error fetching digital card form config:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch digital card form configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/form-configs/digital-card/[id]
 * Update a digital card form configuration
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
        { error: 'Digital card form configuration not found' },
        { status: 404 }
      );
    }

    // Prepare update data with updated timestamp
    const updateData = {
      ...data,
      id, // Ensure ID doesn't change
      category: 'digital-card', // Ensure category doesn't change
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
      message: 'Digital card form configuration updated successfully'
    });

  } catch (error) {
    console.error('Error updating digital card form config:', error);
    return NextResponse.json(
      {
        error: 'Failed to update digital card form configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/form-configs/digital-card/[id]
 * Delete a digital card form configuration
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
        { error: 'Digital card form configuration not found' },
        { status: 404 }
      );
    }

    await deleteDoc(formRef);

    return NextResponse.json({
      success: true,
      message: 'Digital card form configuration deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting digital card form config:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete digital card form configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
