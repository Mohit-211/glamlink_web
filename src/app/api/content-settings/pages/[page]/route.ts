import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser, getPublicFirebaseApp } from '@/lib/firebase/serverApp';
import { doc, getDoc, setDoc } from 'firebase/firestore';

/**
 * GET /api/content-settings/pages/[page]
 * Fetch content for a specific page - PUBLIC ACCESS (no auth required)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const { page } = await params;

    // Use public Firebase app - no authentication required for reading page content
    const { db } = await getPublicFirebaseApp();

    if (!db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Get page content from Firestore
    const docRef = doc(db, 'pageContent', page);
    const docSnap = await getDoc(docRef);

    let content = {};
    if (docSnap.exists()) {
      content = docSnap.data() || {};
    }

    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page content' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/content-settings/pages/[page]
 * Update content for a specific page
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const { page } = await params;
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content || typeof content !== 'object') {
      return NextResponse.json(
        { error: 'Invalid content format' },
        { status: 400 }
      );
    }

    // Prepare data for Firestore (ensure ssgEnabled is included)
    const dataToSave = {
      ...content,
      id: page,
      ssgEnabled: content.ssgEnabled ?? false,  // Default to dynamic rendering
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser.uid
    };

    // Save to Firestore
    const docRef = doc(db, 'pageContent', page);
    await setDoc(docRef, dataToSave);

    return NextResponse.json({ success: true, data: dataToSave });
  } catch (error) {
    console.error('Error updating page content:', error);
    return NextResponse.json(
      { error: 'Failed to update page content' },
      { status: 500 }
    );
  }
}
