import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import professionalsServerService from '@/lib/pages/for-professionals/server/professionalsServerService';

export async function GET(request: NextRequest) {
  try {
    const { db } = await getAuthenticatedAppForUser();

    if (!db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse URL parameters
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get('includeHidden') === 'true';

    const professionals = await professionalsServerService.getAllProfessionals(db, includeHidden);
    return NextResponse.json({ success: true, data: professionals });
  } catch (error) {
    console.error("Error fetching professionals:", error);
    return NextResponse.json({ error: "Failed to fetch professionals" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { db } = await getAuthenticatedAppForUser();

    if (!db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, ...updates } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Professional ID is required" }, { status: 400 });
    }

    const updatedProfessional = await professionalsServerService.updateProfessionalAndReturn(db, id, updates);

    if (updatedProfessional) {
      return NextResponse.json({ success: true, data: updatedProfessional });
    } else {
      return NextResponse.json({ error: "Failed to update professional" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating professional:", error);
    return NextResponse.json({ error: "Failed to update professional" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await getAuthenticatedAppForUser();

    if (!db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const professionalData = await request.json();

    const newProfessional = {
      ...professionalData,
      profileImage: professionalData.profileImage || 'https://source.unsplash.com/300x300/?beauty,professional',
      rating: professionalData.rating || 0,
      reviewCount: professionalData.reviewCount || 0,
      featured: professionalData.featured || false,
      isFounder: professionalData.isFounder || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await professionalsServerService.createProfessionalWithAutoId(db, newProfessional);

    return NextResponse.json({
      success: true,
      data: { ...newProfessional, id: result?.id }
    });
  } catch (error) {
    console.error("Error creating professional:", error);
    return NextResponse.json({ error: "Failed to create professional" }, { status: 500 });
  }
}