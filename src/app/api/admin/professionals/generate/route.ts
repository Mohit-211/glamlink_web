import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import professionalsServerService from '@/lib/pages/for-professionals/server/professionalsServerService';

export async function POST(request: NextRequest) {
  try {
    const { db } = await getAuthenticatedAppForUser();

    if (!db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { professionals } = await request.json();

    if (!Array.isArray(professionals)) {
      return NextResponse.json({ error: "Invalid professionals data" }, { status: 400 });
    }

    const results = [];
    for (const professional of professionals) {
      const newProfessional = {
        ...professional,
        profileImage: professional.profileImage || 'https://source.unsplash.com/300x300/?beauty,professional',
        rating: professional.rating || 0,
        reviewCount: professional.reviewCount || 0,
        featured: professional.featured || false,
        isFounder: professional.isFounder || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const result = await professionalsServerService.createProfessionalWithAutoId(db, newProfessional);
      results.push({ ...newProfessional, id: result?.id });
    }

    return NextResponse.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error("Error generating professionals:", error);
    return NextResponse.json({ error: "Failed to generate professionals" }, { status: 500 });
  }
}