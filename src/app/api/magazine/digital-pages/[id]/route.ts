import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { collection, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

/**
 * GET /api/magazine/digital-pages/[id]
 * Fetch a single digital page by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // IMPORTANT: Await params in Next.js 15
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const docRef = doc(db, 'digital_pages', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      page: { id: docSnap.id, ...docSnap.data() }
    });
  } catch (error: any) {
    console.error('Error fetching digital page:', error);
    return NextResponse.json({
      error: 'Failed to fetch page',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * PUT /api/magazine/digital-pages/[id]
 * Update a digital page
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // IMPORTANT: Await params in Next.js 15
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    const docRef = doc(db, 'digital_pages', id);

    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    const updated = await getDoc(docRef);

    return NextResponse.json({
      success: true,
      page: { id: updated.id, ...updated.data() }
    });
  } catch (error: any) {
    console.error('Error updating digital page:', error);
    return NextResponse.json({
      error: 'Failed to update page',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * DELETE /api/magazine/digital-pages/[id]
 * Delete a digital page
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // IMPORTANT: Await params in Next.js 15
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const docRef = doc(db, 'digital_pages', id);
    await deleteDoc(docRef);

    return NextResponse.json({
      success: true
    });
  } catch (error: any) {
    console.error('Error deleting digital page:', error);
    return NextResponse.json({
      error: 'Failed to delete page',
      details: error.message
    }, { status: 500 });
  }
}
