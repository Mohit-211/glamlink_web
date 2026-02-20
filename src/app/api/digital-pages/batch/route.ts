import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { collection, getDocs, addDoc, query, where, deleteDoc, doc } from 'firebase/firestore';
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

// POST /api/digital-pages/batch?issueId=xxx - Replace all pages for an issue
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { pages } = body;

    // Validate pages array
    if (!Array.isArray(pages)) {
      return NextResponse.json(
        { error: 'pages must be an array' },
        { status: 400 }
      );
    }

    // Validate each page has required fields
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      if (!page.pageType) {
        return NextResponse.json(
          { error: `Page ${i}: missing 'pageType'` },
          { status: 400 }
        );
      }
      if (typeof page.pageNumber !== 'number') {
        return NextResponse.json(
          { error: `Page ${i}: missing or invalid 'pageNumber'` },
          { status: 400 }
        );
      }
    }

    const pagesRef = collection(db, 'digital_pages');

    // Step 1: Delete all existing pages for this issue
    const existingQuery = query(pagesRef, where('issueId', '==', issueId));
    const existingSnapshot = await getDocs(existingQuery);

    const deletePromises: Promise<void>[] = [];
    existingSnapshot.forEach((docSnap) => {
      deletePromises.push(deleteDoc(doc(db, 'digital_pages', docSnap.id)));
    });
    await Promise.all(deletePromises);

    console.log(`Deleted ${deletePromises.length} existing pages for issue ${issueId}`);

    // Step 2: Create new pages
    const now = new Date().toISOString();
    const createdPages: DigitalPage[] = [];

    for (const page of pages) {
      const newPageData: Record<string, any> = {
        issueId,
        pageNumber: page.pageNumber,
        pageType: page.pageType,
        pageData: removeUndefinedDeep(page.pageData || {}),
        pdfSettings: removeUndefinedDeep(page.pdfSettings || {
          ratio: 'a4-portrait',
          backgroundColor: '#ffffff',
          margin: 0
        }),
        hasCanvas: page.hasCanvas || false,
        title: page.title || page.pageData?.title || '',
        createdAt: now,
        updatedAt: now,
        createdBy: currentUser.uid,
      };

      // Only add canvas fields if they have actual values
      if (page.canvasDataUrl) {
        newPageData.canvasDataUrl = page.canvasDataUrl;
      }
      if (page.canvasWidth) {
        newPageData.canvasWidth = page.canvasWidth;
      }
      if (page.canvasHeight) {
        newPageData.canvasHeight = page.canvasHeight;
      }

      // Deep clean to remove any remaining undefined values
      const cleanedData = removeUndefinedDeep(newPageData);

      const docRef = await addDoc(pagesRef, cleanedData);

      createdPages.push({
        id: docRef.id,
        ...cleanedData
      } as DigitalPage);
    }

    // Sort by pageNumber
    createdPages.sort((a, b) => a.pageNumber - b.pageNumber);

    console.log(`Created ${createdPages.length} new pages for issue ${issueId}`);

    return NextResponse.json({
      success: true,
      data: createdPages,
      message: `Successfully uploaded ${createdPages.length} pages`
    });
  } catch (error) {
    console.error('Error batch uploading digital pages:', error);
    return NextResponse.json(
      { error: 'Failed to batch upload digital pages' },
      { status: 500 }
    );
  }
}
