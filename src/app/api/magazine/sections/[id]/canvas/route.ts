import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

// POST /api/magazine/sections/[id]/canvas - Save canvas to section
export async function POST(
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

    const { id: sectionId } = await params;
    const body = await request.json();

    const { issueId, canvas } = body;

    // Validate required fields
    if (!issueId) {
      return NextResponse.json(
        { error: 'Issue ID is required' },
        { status: 400 }
      );
    }

    if (!canvas || !canvas.id || !canvas.name || !canvas.canvasDataUrl) {
      return NextResponse.json(
        { error: 'Invalid canvas data. Required: id, name, canvasDataUrl' },
        { status: 400 }
      );
    }

    console.log('Saving canvas to section:', {
      sectionId,
      issueId,
      canvasId: canvas.id,
      canvasName: canvas.name,
      dataUrlLength: canvas.canvasDataUrl?.length || 0
    });

    // Update section document to add canvas to savedCanvases array
    // Sections are stored as subcollection under magazine_issues
    const sectionRef = doc(db, 'magazine_issues', issueId, 'sections', sectionId);
    
    // First verify the section exists
    const sectionDoc = await getDoc(sectionRef);
    if (!sectionDoc.exists()) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    // Add canvas to the savedCanvases array
    await updateDoc(sectionRef, {
      savedCanvases: arrayUnion(canvas),
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser.uid
    });

    console.log('Canvas saved successfully:', canvas.id);

    return NextResponse.json({
      success: true,
      canvas,
      message: 'Canvas saved successfully'
    });
  } catch (error) {
    console.error('Error saving canvas:', error);
    return NextResponse.json(
      { error: 'Failed to save canvas' },
      { status: 500 }
    );
  }
}

// GET /api/magazine/sections/[id]/canvas - Get all saved canvases for a section
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

    const { id: sectionId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const issueId = searchParams.get('issueId');

    if (!issueId) {
      return NextResponse.json(
        { error: 'Issue ID is required' },
        { status: 400 }
      );
    }

    const sectionRef = doc(db, 'magazine_issues', issueId, 'sections', sectionId);
    const sectionDoc = await getDoc(sectionRef);

    if (!sectionDoc.exists()) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    const sectionData = sectionDoc.data();
    const savedCanvases = sectionData.savedCanvases || [];

    return NextResponse.json({
      success: true,
      canvases: savedCanvases
    });
  } catch (error) {
    console.error('Error fetching canvases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch canvases' },
      { status: 500 }
    );
  }
}

// DELETE /api/magazine/sections/[id]/canvas - Delete a specific canvas
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

    const { id: sectionId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const issueId = searchParams.get('issueId');
    const canvasId = searchParams.get('canvasId');

    if (!issueId || !canvasId) {
      return NextResponse.json(
        { error: 'Issue ID and Canvas ID are required' },
        { status: 400 }
      );
    }

    const sectionRef = doc(db, 'magazine_issues', issueId, 'sections', sectionId);
    const sectionDoc = await getDoc(sectionRef);

    if (!sectionDoc.exists()) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    const sectionData = sectionDoc.data();
    const savedCanvases = sectionData.savedCanvases || [];
    
    // Filter out the canvas to delete
    const updatedCanvases = savedCanvases.filter(
      (c: any) => c.id !== canvasId
    );

    await updateDoc(sectionRef, {
      savedCanvases: updatedCanvases,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser.uid
    });

    return NextResponse.json({
      success: true,
      message: 'Canvas deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting canvas:', error);
    return NextResponse.json(
      { error: 'Failed to delete canvas' },
      { status: 500 }
    );
  }
}
