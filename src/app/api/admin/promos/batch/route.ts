import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import promosServerService from '@/lib/features/promos/server/promosServerService';

export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { promos } = body;

    // Validate request body
    if (!Array.isArray(promos)) {
      return NextResponse.json({ error: "Invalid request: promos must be an array" }, { status: 400 });
    }

    // Validate each promo item
    for (let i = 0; i < promos.length; i++) {
      const promo = promos[i];

      if (!promo || typeof promo !== 'object') {
        return NextResponse.json({
          error: `Invalid promo at index ${i}: each item must be an object`
        }, { status: 400 });
      }

      if (!promo.id) {
        return NextResponse.json({
          error: `Invalid promo at index ${i}: missing required field 'id'`
        }, { status: 400 });
      }

      if (!promo.title) {
        return NextResponse.json({
          error: `Invalid promo at index ${i}: missing required field 'title'`
        }, { status: 400 });
      }

      if (!promo.description) {
        return NextResponse.json({
          error: `Invalid promo at index ${i}: missing required field 'description'`
        }, { status: 400 });
      }

      if (!promo.image) {
        return NextResponse.json({
          error: `Invalid promo at index ${i}: missing required field 'image'`
        }, { status: 400 });
      }

      if (!promo.link) {
        return NextResponse.json({
          error: `Invalid promo at index ${i}: missing required field 'link'`
        }, { status: 400 });
      }

      if (!promo.ctaText) {
        return NextResponse.json({
          error: `Invalid promo at index ${i}: missing required field 'ctaText'`
        }, { status: 400 });
      }

      if (!promo.startDate) {
        return NextResponse.json({
          error: `Invalid promo at index ${i}: missing required field 'startDate'`
        }, { status: 400 });
      }

      if (!promo.endDate) {
        return NextResponse.json({
          error: `Invalid promo at index ${i}: missing required field 'endDate'`
        }, { status: 400 });
      }

      if (!promo.popupDisplay) {
        return NextResponse.json({
          error: `Invalid promo at index ${i}: missing required field 'popupDisplay'`
        }, { status: 400 });
      }
    }

    // Prepare promos with timestamps
    const promosWithTimestamps = promos.map(promo => ({
      ...promo,
      createdAt: promo.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    // Use the existing bulk upload service to replace all promos
    // First, clear existing promos
    try {
      const existingPromos = await promosServerService.getAllPromos(db, true);

      // Delete all existing promos
      for (const existingPromo of existingPromos) {
        await promosServerService.deletePromo(db, existingPromo.id);
      }
    } catch (error) {
      // Continue even if deletion fails - collection might be empty
      console.log("Note: No existing promos to delete or deletion failed:", error);
    }

    // Upload new promos
    const result = await promosServerService.bulkUploadPromos(db, promosWithTimestamps);

    if (result.failed > 0) {
      return NextResponse.json({
        error: `Failed to upload ${result.failed} out of ${promosWithTimestamps.length} promos`,
        success: result.success,
        failed: result.failed
      }, { status: 500 });
    }

    // Return the uploaded promos
    const uploadedPromos = await promosServerService.getAllPromos(db, true);

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${result.success} promos`,
      data: uploadedPromos
    });

  } catch (error) {
    console.error("Error in promos batch upload:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to upload promos"
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    error: "Method not allowed"
  }, { status: 405 });
}