import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';
import type { DigitalPage } from '@/lib/pages/admin/components/magazine/digital/editor/types';

// Helper to deeply remove undefined values from an object (Firestore doesn't accept undefined)
function removeUndefinedDeep(obj: any): any {
  if (obj === null || obj === undefined) {
    return null; // Convert undefined to null for Firestore
  }

  if (Array.isArray(obj)) {
    return obj.map(item => removeUndefinedDeep(item));
  }

  if (typeof obj === 'object') {
    const result: Record<string, any> = {};
    for (const key in obj) {
      const value = obj[key];
      if (value !== undefined) {
        result[key] = removeUndefinedDeep(value);
      }
    }
    return result;
  }

  return obj;
}

// GET /api/digital-pages?issueId=xxx - Get all digital pages for an issue
export async function GET(request: NextRequest) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const issueId = searchParams.get('issueId');

    if (!issueId) {
      return NextResponse.json(
        { error: 'Issue ID is required' },
        { status: 400 }
      );
    }

    const pagesRef = collection(db, 'digital_pages');
    let pages: DigitalPage[] = [];

    try {
      // Try with composite index (issueId + pageNumber ordering)
      const q = query(
        pagesRef,
        where('issueId', '==', issueId),
        orderBy('pageNumber', 'asc')
      );
      const snapshot = await getDocs(q);
      snapshot.forEach((docSnap) => {
        pages.push({
          id: docSnap.id,
          ...docSnap.data()
        } as DigitalPage);
      });
    } catch (indexError: any) {
      // If composite index doesn't exist, fallback to simple query and sort in memory
      if (indexError?.code === 'failed-precondition') {
        console.log('Composite index not found, using simple query with client-side sorting');
        const simpleQuery = query(pagesRef, where('issueId', '==', issueId));
        const snapshot = await getDocs(simpleQuery);
        snapshot.forEach((docSnap) => {
          pages.push({
            id: docSnap.id,
            ...docSnap.data()
          } as DigitalPage);
        });
        // Sort by pageNumber in memory
        pages.sort((a, b) => (a.pageNumber || 0) - (b.pageNumber || 0));
      } else {
        throw indexError;
      }
    }

    return NextResponse.json({
      success: true,
      data: pages
    });
  } catch (error) {
    console.error('Error fetching digital pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch digital pages' },
      { status: 500 }
    );
  }
}

// POST /api/digital-pages - Create a new digital page
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

    // Validate required fields
    if (!body.issueId) {
      return NextResponse.json(
        { error: 'Issue ID is required' },
        { status: 400 }
      );
    }

    if (!body.pageType) {
      return NextResponse.json(
        { error: 'Page type is required' },
        { status: 400 }
      );
    }

    // Create the new page document (only include defined values)
    const now = new Date().toISOString();
    const newPageData: Record<string, any> = {
      issueId: body.issueId,
      pageNumber: body.pageNumber || 1,
      pageType: body.pageType,
      pageData: removeUndefinedDeep(body.pageData || {}),
      pdfSettings: removeUndefinedDeep(body.pdfSettings || {
        ratio: 'a4-portrait',
        backgroundColor: '#ffffff',
        margin: 0
      }),
      hasCanvas: body.hasCanvas || false,
      title: body.title || body.pageData?.title || '',
      createdAt: now,
      updatedAt: now,
      createdBy: currentUser.uid,
    };

    // Only add canvas fields if they have actual values
    if (body.canvasDataUrl) {
      newPageData.canvasDataUrl = body.canvasDataUrl;
    }
    if (body.canvasWidth) {
      newPageData.canvasWidth = body.canvasWidth;
    }
    if (body.canvasHeight) {
      newPageData.canvasHeight = body.canvasHeight;
    }

    // Deep clean to remove any remaining undefined values
    const cleanedData = removeUndefinedDeep(newPageData);

    // Add to Firestore
    const pagesRef = collection(db, 'digital_pages');
    const docRef = await addDoc(pagesRef, cleanedData);

    const createdPage: DigitalPage = {
      id: docRef.id,
      ...cleanedData
    } as DigitalPage;

    console.log('Created digital page:', {
      id: createdPage.id,
      issueId: createdPage.issueId,
      pageNumber: createdPage.pageNumber,
      pageType: createdPage.pageType
    });

    return NextResponse.json({
      success: true,
      data: createdPage
    });
  } catch (error) {
    console.error('Error creating digital page:', error);
    return NextResponse.json(
      { error: 'Failed to create digital page' },
      { status: 500 }
    );
  }
}
