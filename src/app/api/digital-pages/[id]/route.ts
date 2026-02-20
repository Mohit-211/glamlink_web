import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
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

// GET /api/digital-pages/[id] - Get a single digital page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const pageRef = doc(db, 'digital_pages', id);
    const pageDoc = await getDoc(pageRef);

    if (!pageDoc.exists()) {
      return NextResponse.json(
        { error: 'Digital page not found' },
        { status: 404 }
      );
    }

    const page: DigitalPage = {
      id: pageDoc.id,
      ...pageDoc.data()
    } as DigitalPage;

    return NextResponse.json({
      success: true,
      data: page
    });
  } catch (error) {
    console.error('Error fetching digital page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch digital page' },
      { status: 500 }
    );
  }
}

// PUT /api/digital-pages/[id] - Update a digital page
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Get the existing page to verify it exists
    const pageRef = doc(db, 'digital_pages', id);
    const pageDoc = await getDoc(pageRef);

    if (!pageDoc.exists()) {
      return NextResponse.json(
        { error: 'Digital page not found' },
        { status: 404 }
      );
    }

    // Build update object
    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    // Only update provided fields
    if (body.pageNumber !== undefined) updateData.pageNumber = body.pageNumber;
    if (body.pageType !== undefined) updateData.pageType = body.pageType;
    if (body.pageData !== undefined) updateData.pageData = removeUndefinedDeep(body.pageData);
    if (body.pdfSettings !== undefined) updateData.pdfSettings = removeUndefinedDeep(body.pdfSettings);
    if (body.canvasDataUrl !== undefined) updateData.canvasDataUrl = body.canvasDataUrl;
    if (body.canvasWidth !== undefined) updateData.canvasWidth = body.canvasWidth;
    if (body.canvasHeight !== undefined) updateData.canvasHeight = body.canvasHeight;
    if (body.hasCanvas !== undefined) updateData.hasCanvas = body.hasCanvas;
    if (body.title !== undefined) updateData.title = body.title;

    // Clean the entire update data to remove any remaining undefined values
    const cleanedUpdateData = removeUndefinedDeep(updateData);

    // Update the document
    await updateDoc(pageRef, cleanedUpdateData);

    // Get the updated document
    const updatedDoc = await getDoc(pageRef);
    const updatedPage: DigitalPage = {
      id: updatedDoc.id,
      ...updatedDoc.data()
    } as DigitalPage;

    console.log('Updated digital page:', {
      id: updatedPage.id,
      pageNumber: updatedPage.pageNumber,
      hasCanvas: updatedPage.hasCanvas
    });

    return NextResponse.json({
      success: true,
      data: updatedPage
    });
  } catch (error) {
    console.error('Error updating digital page:', error);
    return NextResponse.json(
      { error: 'Failed to update digital page' },
      { status: 500 }
    );
  }
}

// DELETE /api/digital-pages/[id]?issueId=xxx - Delete a digital page
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify the page exists
    const pageRef = doc(db, 'digital_pages', id);
    const pageDoc = await getDoc(pageRef);

    if (!pageDoc.exists()) {
      return NextResponse.json(
        { error: 'Digital page not found' },
        { status: 404 }
      );
    }

    // Delete the document
    await deleteDoc(pageRef);

    console.log('Deleted digital page:', id);

    return NextResponse.json({
      success: true,
      message: 'Digital page deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting digital page:', error);
    return NextResponse.json(
      { error: 'Failed to delete digital page' },
      { status: 500 }
    );
  }
}
