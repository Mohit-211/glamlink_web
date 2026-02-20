import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import professionalsServerService from '@/lib/pages/for-professionals/server/professionalsServerService';

export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { professionals } = body;

    // Validate request body
    if (!Array.isArray(professionals)) {
      return NextResponse.json({ error: "Invalid request: professionals must be an array" }, { status: 400 });
    }

    // Validate each professional item
    for (let i = 0; i < professionals.length; i++) {
      const professional = professionals[i];

      if (!professional || typeof professional !== 'object') {
        return NextResponse.json({
          error: `Invalid professional at index ${i}: each item must be an object`
        }, { status: 400 });
      }

      if (!professional.id) {
        return NextResponse.json({
          error: `Invalid professional at index ${i}: missing required field 'id'`
        }, { status: 400 });
      }

      if (!professional.name) {
        return NextResponse.json({
          error: `Invalid professional at index ${i}: missing required field 'name'`
        }, { status: 400 });
      }

      if (!professional.title) {
        return NextResponse.json({
          error: `Invalid professional at index ${i}: missing required field 'title'`
        }, { status: 400 });
      }

      if (!professional.specialty) {
        return NextResponse.json({
          error: `Invalid professional at index ${i}: missing required field 'specialty'`
        }, { status: 400 });
      }

      if (!professional.location) {
        return NextResponse.json({
          error: `Invalid professional at index ${i}: missing required field 'location'`
        }, { status: 400 });
      }

      if (!professional.certificationLevel) {
        return NextResponse.json({
          error: `Invalid professional at index ${i}: missing required field 'certificationLevel'`
        }, { status: 400 });
      }

      if (!professional.yearsExperience || professional.yearsExperience < 0) {
        return NextResponse.json({
          error: `Invalid professional at index ${i}: missing or invalid 'yearsExperience' field`
        }, { status: 400 });
      }

      // Validate certification level
      const validCertificationLevels = ['Bronze', 'Silver', 'Gold', 'Platinum'];
      if (!validCertificationLevels.includes(professional.certificationLevel)) {
        return NextResponse.json({
          error: `Invalid professional at index ${i}: 'certificationLevel' must be one of ${validCertificationLevels.join(', ')}`
        }, { status: 400 });
      }
    }

    // Prepare professionals with timestamps
    const professionalsWithTimestamps = professionals.map(professional => ({
      ...professional,
      createdAt: professional.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    // Use the existing bulk upload service to replace all professionals
    // First, clear existing professionals
    try {
      const existingProfessionals = await professionalsServerService.getAllProfessionals(db, true);

      // Delete all existing professionals
      for (const existingProfessional of existingProfessionals) {
        await professionalsServerService.deleteProfessional(db, existingProfessional.id);
      }
    } catch (error) {
      // Continue even if deletion fails - collection might be empty
      console.log("Note: No existing professionals to delete or deletion failed:", error);
    }

    // Upload new professionals
    const result = await professionalsServerService.bulkUploadProfessionals(db, professionalsWithTimestamps);

    if (result.failed > 0) {
      return NextResponse.json({
        error: `Failed to upload ${result.failed} out of ${professionalsWithTimestamps.length} professionals`,
        success: result.success,
        failed: result.failed
      }, { status: 500 });
    }

    // Return the uploaded professionals
    const uploadedProfessionals = await professionalsServerService.getAllProfessionals(db, true);

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${result.success} professionals`,
      data: uploadedProfessionals
    });

  } catch (error) {
    console.error("Error in professionals batch upload:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to upload professionals"
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