import { NextRequest, NextResponse } from 'next/server';
import { getPublicFirebaseApp } from '@/lib/firebase/serverApp';
import professionalsServerService from '@/lib/pages/for-professionals/server/professionalsServerService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    // Use public app for public access (no authentication required)
    const { db } = await getPublicFirebaseApp();

    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    // Get professionals from database - show all professionals (includeHidden = true)
    let professionals = await professionalsServerService.getAllProfessionals(db, true);

    // Filter for featured if requested
    if (featured === 'true') {
      professionals = professionals.filter(pro => pro.featured === true);
    }

    // Limit results if specified
    if (limit && !isNaN(parseInt(limit))) {
      professionals = professionals.slice(0, parseInt(limit));
    }

    return NextResponse.json({
      success: true,
      data: professionals
    });
  } catch (error) {
    console.error("Error fetching professionals:", error);
    return NextResponse.json({ error: "Failed to fetch professionals" }, { status: 500 });
  }
}