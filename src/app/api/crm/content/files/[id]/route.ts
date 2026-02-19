/**
 * Single File API Routes
 *
 * GET /api/crm/content/files/[id] - Get file by ID
 * PATCH /api/crm/content/files/[id] - Update file
 * DELETE /api/crm/content/files/[id] - Delete file
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandId = (currentUser as any).brandId;
    if (!brandId) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const fileRef = doc(db, `brands/${brandId}/files`, id);
    const fileSnap = await getDoc(fileRef);

    if (!fileSnap.exists()) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: fileSnap.id,
        ...fileSnap.data(),
      },
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandId = (currentUser as any).brandId;
    if (!brandId) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const body = await request.json();
    const { altText, focalPoint, name, url, dimensions, transform } = body;

    const fileRef = doc(db, `brands/${brandId}/files`, id);
    const fileSnap = await getDoc(fileRef);

    if (!fileSnap.exists()) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (altText !== undefined) updates.altText = altText;
    if (focalPoint !== undefined) updates.focalPoint = focalPoint;
    if (name !== undefined) updates.name = name;
    if (url !== undefined) updates.url = url;
    if (dimensions !== undefined) updates.dimensions = dimensions;

    // Handle image transforms
    if (transform) {
      const existingTransforms = fileSnap.data().transforms || [];
      updates.transforms = [...existingTransforms, {
        ...transform,
        appliedAt: new Date().toISOString(),
      }];
    }

    await updateDoc(fileRef, updates);

    const updatedSnap = await getDoc(fileRef);

    return NextResponse.json({
      success: true,
      data: {
        id: updatedSnap.id,
        ...updatedSnap.data(),
      },
    });
  } catch (error) {
    console.error('Error updating file:', error);
    return NextResponse.json(
      { error: 'Failed to update file' },
      { status: 500 }
    );
  }
}

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

    const brandId = (currentUser as any).brandId;
    if (!brandId) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const fileRef = doc(db, `brands/${brandId}/files`, id);
    const fileSnap = await getDoc(fileRef);

    if (!fileSnap.exists()) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    await deleteDoc(fileRef);

    return NextResponse.json({
      success: true,
      data: { id },
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
