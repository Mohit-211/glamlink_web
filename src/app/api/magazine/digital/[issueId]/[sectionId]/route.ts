import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import digitalMagazineService from '@/lib/services/firebase/digitalMagazineService';

// GET - List canvases or load specific canvas
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ issueId: string; sectionId: string }> }
) {
  try {
    const { issueId, sectionId } = await params;
    const { currentUser, db } = await getAuthenticatedAppForUser();
    
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if requesting specific canvas
    const canvasName = request.nextUrl.searchParams.get('name');
    
    if (canvasName) {
      // Load specific canvas
      const canvas = await digitalMagazineService.loadCanvas(db, issueId, sectionId, canvasName);
      
      if (!canvas) {
        return NextResponse.json(
          { error: `Canvas "${canvasName}" not found` },
          { status: 404 }
        );
      }
      
      return NextResponse.json(canvas);
    } else {
      // List all canvases
      const canvases = await digitalMagazineService.listCanvases(db, issueId, sectionId);
      return NextResponse.json({ canvases, count: canvases.length });
    }
  } catch (error) {
    console.error('Error in canvas GET:', error);
    return NextResponse.json(
      { error: 'Failed to load canvas data' },
      { status: 500 }
    );
  }
}

// POST - Save new canvas
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ issueId: string; sectionId: string }> }
) {
  try {
    const { issueId, sectionId } = await params;
    const { currentUser, db } = await getAuthenticatedAppForUser();
    
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.canvasDataUrl || !body.canvasHeight || !body.canvasTotalMm || !body.configuration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check canvas count limit
    const canvasCount = await digitalMagazineService.getCanvasCount(db, issueId, sectionId);
    if (canvasCount >= 10) {
      return NextResponse.json(
        { error: 'Maximum canvas limit (10) reached for this section' },
        { status: 400 }
      );
    }
    
    const success = await digitalMagazineService.saveCanvas(db, issueId, sectionId, body);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save canvas. Canvas limit may have been reached.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving canvas:', error);
    return NextResponse.json(
      { error: 'Failed to save canvas' },
      { status: 500 }
    );
  }
}

// PUT - Overwrite existing canvas
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ issueId: string; sectionId: string }> }
) {
  try {
    const { issueId, sectionId } = await params;
    const { currentUser, db } = await getAuthenticatedAppForUser();
    
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.canvasName || !body.canvasDataUrl || !body.canvasHeight || !body.canvasTotalMm || !body.configuration) {
      return NextResponse.json(
        { error: 'Missing required fields (canvasName, canvasDataUrl, etc.)' },
        { status: 400 }
      );
    }
    
    const success = await digitalMagazineService.overwriteCanvas(
      db, 
      issueId, 
      sectionId, 
      body.canvasName,
      body
    );
    
    if (!success) {
      return NextResponse.json(
        { error: `Failed to overwrite canvas "${body.canvasName}"` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error overwriting canvas:', error);
    return NextResponse.json(
      { error: 'Failed to overwrite canvas' },
      { status: 500 }
    );
  }
}

// DELETE - Delete specific canvas or all canvases
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ issueId: string; sectionId: string }> }
) {
  try {
    const { issueId, sectionId } = await params;
    const { currentUser, db } = await getAuthenticatedAppForUser();
    
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if deleting specific canvas or all
    const canvasName = request.nextUrl.searchParams.get('name');
    const deleteAll = request.nextUrl.searchParams.get('all') === 'true';
    
    let success: boolean;
    
    if (deleteAll) {
      // Delete all canvases for the section
      success = await digitalMagazineService.deleteAllCanvases(db, issueId, sectionId);
    } else if (canvasName) {
      // Delete specific canvas
      success = await digitalMagazineService.deleteCanvas(db, issueId, sectionId, canvasName);
    } else {
      return NextResponse.json(
        { error: 'Must specify canvas name or all=true' },
        { status: 400 }
      );
    }
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete canvas' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting canvas:', error);
    return NextResponse.json(
      { error: 'Failed to delete canvas' },
      { status: 500 }
    );
  }
}