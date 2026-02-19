import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import digitalMagazineService from '@/lib/services/firebase/digitalMagazineService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ issueId: string; sectionId: string }> }
) {
  try {
    const { issueId, sectionId } = await params;
    
    const { currentUser, db } = await getAuthenticatedAppForUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!db) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    // Use the digitalMagazineService to list canvases
    const canvasList = await digitalMagazineService.listCanvases(db, issueId, sectionId);
    
    // Format the response for the dropdown component
    const canvases = canvasList.map(canvas => ({
      id: canvas.name, // Use name as ID since it's unique
      name: canvas.name,
      createdAt: canvas.createdAt?.toDate?.() || canvas.createdAt || new Date(),
      dimensions: {
        width: canvas.height, // Note: height is actually stored as height in the service
        height: canvas.height,
        totalMm: canvas.totalMm
      },
      breakpoints: [], // Will be loaded when canvas is selected
      hasCanvas: true, // All items from listCanvases have canvas data
      url: canvas.url // Include the Firebase Storage URL
    }));

    return NextResponse.json({ 
      canvases,
      issueId,
      sectionId
    });

  } catch (error) {
    console.error('Error listing canvases:', error);
    return NextResponse.json(
      { error: 'Failed to list canvases' },
      { status: 500 }
    );
  }
}