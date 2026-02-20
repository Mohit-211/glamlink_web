import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { collection, query, where, orderBy, getDocs, doc, setDoc, writeBatch } from 'firebase/firestore';

/**
 * GET /api/magazine/digital-pages?issueId=xxx
 * Fetch all digital pages for a specific magazine issue
 */
export async function GET(request: NextRequest) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const issueId = request.nextUrl.searchParams.get('issueId');

    if (!issueId) {
      return NextResponse.json({ error: 'Issue ID is required' }, { status: 400 });
    }

    // Query digital_pages collection using modular SDK
    const pagesRef = collection(db, 'digital_pages');
    let pages: any[] = [];

    try {
      // Try with composite index (issueId + order)
      const q = query(pagesRef, where('issueId', '==', issueId), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      pages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (indexError: any) {
      // If composite index doesn't exist, fallback to simple query and sort in memory
      if (indexError?.code === 'failed-precondition') {
        console.log('Composite index not found, using simple query with client-side sorting');
        const simpleQuery = query(pagesRef, where('issueId', '==', issueId));
        const snapshot = await getDocs(simpleQuery);
        pages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort in memory by order field
        pages.sort((a, b) => (a.order || 0) - (b.order || 0));
      } else {
        throw indexError; // Re-throw if it's a different error
      }
    }

    return NextResponse.json({
      success: true,
      pages
    });
  } catch (error: any) {
    console.error('Error fetching digital pages:', error);

    // Gracefully handle if collection doesn't exist
    if (error.code === 'failed-precondition' || error.code === 9) {
      return NextResponse.json({
        success: true,
        pages: []
      });
    }

    return NextResponse.json({
      error: 'Failed to fetch digital pages',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * POST /api/magazine/digital-pages
 * Create multiple digital pages for an issue
 */
export async function POST(request: NextRequest) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { issueId, pages } = body;

    if (!issueId || !Array.isArray(pages)) {
      return NextResponse.json({
        error: 'Invalid request body. Expected { issueId: string, pages: array }'
      }, { status: 400 });
    }

    const createdPages = [];
    const batch = writeBatch(db);
    const pagesRef = collection(db, 'digital_pages');

    for (const page of pages) {
      const docRef = page.id
        ? doc(pagesRef, page.id)
        : doc(pagesRef);

      const pageData = {
        ...page,
        issueId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      batch.set(docRef, pageData);
      createdPages.push({ id: docRef.id, ...pageData });
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      pages: createdPages
    });
  } catch (error: any) {
    console.error('Error creating digital pages:', error);
    return NextResponse.json({
      error: 'Failed to create pages',
      details: error.message
    }, { status: 500 });
  }
}
