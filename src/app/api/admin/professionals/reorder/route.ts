import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import professionalsServerService from '@/lib/pages/for-professionals/server/professionalsServerService';

/**
 * POST /api/admin/professionals/reorder
 * Update a single professional's order value
 *
 * Body: { id: string, newOrder: number }
 * Response: { success: true, data: Professional }
 *
 * This is an O(1) operation - only updates one document in Firestore
 */
export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!db || !currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, newOrder } = await request.json();

    // Validate input
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: "Missing or invalid 'id' field" },
        { status: 400 }
      );
    }

    if (typeof newOrder !== 'number' || isNaN(newOrder)) {
      return NextResponse.json(
        { error: "Missing or invalid 'newOrder' field - must be a number" },
        { status: 400 }
      );
    }

    // Update the professional's order
    const updatedProfessional = await professionalsServerService.updateProfessionalOrder(
      db,
      id,
      newOrder
    );

    if (!updatedProfessional) {
      return NextResponse.json(
        { error: "Professional not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProfessional
    });
  } catch (error) {
    console.error("Error reordering professional:", error);
    return NextResponse.json(
      { error: "Failed to reorder professional" },
      { status: 500 }
    );
  }
}
