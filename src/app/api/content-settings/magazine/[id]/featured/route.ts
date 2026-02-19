import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';

/**
 * PUT /api/content-settings/magazine/[id]/featured
 * Toggle featured status for a magazine issue
 * Ensures only one issue can be featured at a time
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

    const { featured } = await request.json();

    // Check if issue exists
    const docRef = doc(db, 'magazineIssues', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Magazine issue not found' },
        { status: 404 }
      );
    }

    // If setting to featured, unfeatured all others first
    if (featured) {
      const q = query(collection(db, 'magazineIssues'), where('featured', '==', true));
      const allIssues = await getDocs(q);
      const batch = writeBatch(db);

      allIssues.docs.forEach(issueDoc => {
        batch.update(issueDoc.ref, { featured: false });
      });

      await batch.commit();
    }

    // Update this issue
    await updateDoc(docRef, {
      featured: featured,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser.uid
    });

    return NextResponse.json({ success: true, data: { id, featured } });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    return NextResponse.json(
      { error: 'Failed to toggle featured status' },
      { status: 500 }
    );
  }
}
