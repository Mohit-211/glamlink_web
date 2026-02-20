import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { collection, doc, getDocs, updateDoc, query, where, writeBatch } from 'firebase/firestore';
import type { DigitalPage } from '@/lib/pages/admin/components/magazine/digital/editor/types';

// POST /api/digital-pages/reorder - Reorder digital pages
export async function POST(request: NextRequest) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { issueId, pageIds } = body;

    if (!issueId) {
      return NextResponse.json(
        { error: 'Issue ID is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(pageIds) || pageIds.length === 0) {
      return NextResponse.json(
        { error: 'Page IDs array is required' },
        { status: 400 }
      );
    }

    // Create a batch update
    const batch = writeBatch(db);
    const now = new Date().toISOString();

    // Update each page with its new page number
    pageIds.forEach((pageId, index) => {
      const pageRef = doc(db, 'digital_pages', pageId);
      batch.update(pageRef, {
        pageNumber: index + 1, // 1-indexed
        updatedAt: now
      });
    });

    // Commit the batch
    await batch.commit();

    // Fetch and return the updated pages
    const pagesRef = collection(db, 'digital_pages');
    const q = query(
      pagesRef,
      where('issueId', '==', issueId)
    );

    const snapshot = await getDocs(q);
    const pages: DigitalPage[] = [];

    snapshot.forEach((docSnap) => {
      pages.push({
        id: docSnap.id,
        ...docSnap.data()
      } as DigitalPage);
    });

    // Sort by pageNumber
    pages.sort((a, b) => a.pageNumber - b.pageNumber);

    console.log('Reordered digital pages for issue:', issueId);

    return NextResponse.json({
      success: true,
      data: pages
    });
  } catch (error) {
    console.error('Error reordering digital pages:', error);
    return NextResponse.json(
      { error: 'Failed to reorder digital pages' },
      { status: 500 }
    );
  }
}
