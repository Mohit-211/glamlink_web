import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { sectionTemplateServerService } from '@/lib/features/display-cms';

/**
 * GET /api/content-settings/for-clients/templates/all
 * Fetch ALL templates (no filtering - for Redux caching)
 *
 * Returns all templates across all section types, sorted by createdAt (newest first).
 * Client-side filtering is much faster than multiple Firestore queries.
 */
export async function GET(request: NextRequest) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all templates (no filtering - client will filter)
    const templates = await sectionTemplateServerService.getAllTemplates(db);

    return NextResponse.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error('Error fetching all section templates:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch templates',
      },
      { status: 500 }
    );
  }
}
