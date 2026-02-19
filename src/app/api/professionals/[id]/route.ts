import { NextRequest, NextResponse } from 'next/server';
import { getPublicFirebaseApp } from '@/lib/firebase/serverApp';
import professionalsServerService from '@/lib/pages/for-professionals/server/professionalsServerService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(`Fetching professional with ID: ${id}`);
    const { db } = await getPublicFirebaseApp();

    if (!db) {
      return NextResponse.json(
        { error: 'Database unavailable' },
        { status: 500 }
      );
    }

    const professional = await professionalsServerService.getProfessionalById(
      db,
      id,
      false // checkVisibility = false (show all professionals)
    );

    console.log(`Professional found: ${professional ? 'YES' : 'NO'}`);
    if (professional) {
      console.log(`Professional name: ${professional.name}`);
    }

    if (!professional) {
      return NextResponse.json(
        { success: false, error: 'Professional not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: professional
    });

  } catch (error) {
    console.error('Error fetching professional:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}