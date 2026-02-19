import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

/**
 * PUT /api/content-settings/magazine/[id]
 * Update a magazine issue
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Check if issue exists
    const docRef = doc(db, 'magazineIssues', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Magazine issue not found' },
        { status: 404 }
      );
    }

    // Update issue
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser.uid
    };

    await updateDoc(docRef, updatedData);

    return NextResponse.json({ success: true, data: { id, ...updatedData } });
  } catch (error) {
    console.error('Error updating magazine issue:', error);
    return NextResponse.json(
      { error: 'Failed to update magazine issue' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/content-settings/magazine/[id]
 * Delete a magazine issue
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if issue exists
    const docRef = doc(db, 'magazineIssues', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Magazine issue not found' },
        { status: 404 }
      );
    }

    // Delete issue
    await deleteDoc(docRef);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting magazine issue:', error);
    return NextResponse.json(
      { error: 'Failed to delete magazine issue' },
      { status: 500 }
    );
  }
}
