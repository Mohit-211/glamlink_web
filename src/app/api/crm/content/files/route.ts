/**
 * Files API Routes
 *
 * GET /api/crm/content/files - List files for brand
 * POST /api/crm/content/files - Upload new file
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { collection, query, where, orderBy, limit, startAfter, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandId = (currentUser as any).brandId;
    if (!brandId) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const cursor = searchParams.get('cursor');
    const fileType = searchParams.get('fileType');
    const search = searchParams.get('search');
    const sortField = searchParams.get('sortField') || 'createdAt';
    const sortDirection = searchParams.get('sortDirection') || 'desc';

    // Build query
    let q = query(
      collection(db, `brands/${brandId}/files`),
      orderBy(sortField, sortDirection as 'asc' | 'desc'),
      limit(pageSize)
    );

    // Add file type filter
    if (fileType && fileType !== 'all') {
      q = query(
        collection(db, `brands/${brandId}/files`),
        where('type', '==', fileType),
        orderBy(sortField, sortDirection as 'asc' | 'desc'),
        limit(pageSize)
      );
    }

    // Add cursor pagination
    if (cursor) {
      const cursorDoc = await getDoc(doc(db, `brands/${brandId}/files`, cursor));
      if (cursorDoc.exists()) {
        q = query(q, startAfter(cursorDoc));
      }
    }

    const snapshot = await getDocs(q);
    let files = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Client-side search filter (Firestore doesn't support full-text search)
    if (search) {
      const searchLower = search.toLowerCase();
      files = files.filter(
        (file: any) =>
          file.name?.toLowerCase().includes(searchLower) ||
          file.altText?.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        files,
        hasMore: snapshot.docs.length === pageSize,
        cursor: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : null,
      },
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandId = (currentUser as any).brandId;
    if (!brandId) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const body = await request.json();
    const { name, url, type, format, size, altText, dimensions, thumbnailUrl } = body;

    if (!name || !url || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: name, url, type' },
        { status: 400 }
      );
    }

    const fileData = {
      brandId,
      name,
      url,
      type,
      format: format || name.split('.').pop()?.toLowerCase() || 'unknown',
      size: size || 0,
      altText: altText || '',
      dimensions: dimensions || null,
      thumbnailUrl: thumbnailUrl || null,
      focalPoint: null,
      references: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, `brands/${brandId}/files`), fileData);

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...fileData,
      },
    });
  } catch (error) {
    console.error('Error creating file:', error);
    return NextResponse.json(
      { error: 'Failed to create file' },
      { status: 500 }
    );
  }
}
