import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { sectionTemplateServerService, ForClientsSectionType } from '@/lib/features/display-cms';

/**
 * GET /api/content-settings/for-clients/templates
 * Fetch templates for a specific section type
 *
 * Query params:
 * - sectionType: 'hero' | 'features' | 'how-it-works' | 'testimonials' | 'cta'
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

    // Get section type from query params
    const searchParams = request.nextUrl.searchParams;
    const sectionType = searchParams.get('sectionType') as ForClientsSectionType | null;

    if (!sectionType) {
      return NextResponse.json(
        { success: false, error: 'sectionType query parameter is required' },
        { status: 400 }
      );
    }

    // Validate section type - for invalid types, return empty array instead of error
    // This handles cases where the client accidentally calls for unsupported section types
    const validTypes: ForClientsSectionType[] = ['hero', 'features', 'how-it-works', 'testimonials', 'cta', 'html-content'];
    if (!validTypes.includes(sectionType)) {
      // Return empty array for unsupported section types (graceful fallback)
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // Fetch templates
    const templates = await sectionTemplateServerService.getTemplates(db, sectionType);

    return NextResponse.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error('Error fetching section templates:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch templates',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/content-settings/for-clients/templates
 * Create or update a template
 *
 * Body:
 * {
 *   id?: string,  // Optional: omit for create, include for update
 *   name: string,
 *   sectionType: ForClientsSectionType,
 *   content: Record<string, any>
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, name, sectionType, content } = body;

    // Validation
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Template name is required' },
        { status: 400 }
      );
    }

    if (!sectionType) {
      return NextResponse.json(
        { success: false, error: 'sectionType is required' },
        { status: 400 }
      );
    }

    const validTypes: ForClientsSectionType[] = ['hero', 'features', 'how-it-works', 'testimonials', 'cta', 'html-content'];
    if (!validTypes.includes(sectionType)) {
      return NextResponse.json(
        { success: false, error: `Invalid sectionType. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Template content is required' },
        { status: 400 }
      );
    }

    // Save template (create or update based on presence of id)
    const template = await sectionTemplateServerService.saveTemplate(db, {
      id,
      name,
      sectionType,
      content,
    });

    return NextResponse.json({
      success: true,
      data: template,
      message: id ? 'Template updated successfully' : 'Template created successfully',
    });
  } catch (error) {
    console.error('Error saving section template:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save template',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/content-settings/for-clients/templates
 * Delete a template
 *
 * Query params:
 * - id: template ID to delete
 */
export async function DELETE(request: NextRequest) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get template ID from query params
    const searchParams = request.nextUrl.searchParams;
    const templateId = searchParams.get('id');

    if (!templateId) {
      return NextResponse.json(
        { success: false, error: 'Template id query parameter is required' },
        { status: 400 }
      );
    }

    // Delete template
    await sectionTemplateServerService.deleteTemplate(db, templateId);

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting section template:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete template',
      },
      { status: 500 }
    );
  }
}
