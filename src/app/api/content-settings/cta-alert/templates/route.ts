import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import ctaAlertServerService from '@/lib/features/cta-alerts/server/ctaAlertServerService';
import { SavedModalTemplate } from '@/lib/pages/admin/types/ctaAlert';

/**
 * GET /api/content-settings/cta-alert/templates
 * Fetch all saved modal templates (admin only)
 */
export async function GET() {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templates = await ctaAlertServerService.getSavedTemplates(db);

    return NextResponse.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error('Error fetching saved templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved templates' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/content-settings/cta-alert/templates
 * Create or update a modal template (admin only)
 * Include 'id' in body to update an existing template
 */
export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        { error: 'Template name is required' },
        { status: 400 }
      );
    }

    const template: Omit<SavedModalTemplate, 'id' | 'createdAt' | 'updatedAt'> & { id?: string } = {
      name: body.name.trim(),
      modalTitle: body.modalTitle || '',
      modalHtmlContent: body.modalHtmlContent || '',
    };

    // Include id if updating existing template
    if (body.id) {
      template.id = body.id;
    }

    const savedTemplate = await ctaAlertServerService.saveTemplate(db, template);

    if (!savedTemplate) {
      return NextResponse.json(
        { error: 'Failed to save template' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: savedTemplate,
    });
  } catch (error) {
    console.error('Error saving template:', error);
    return NextResponse.json(
      { error: 'Failed to save template' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/content-settings/cta-alert/templates
 * Delete a modal template by ID (admin only)
 * Pass templateId as query param: ?id=xxx
 */
export async function DELETE(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templateId = request.nextUrl.searchParams.get('id');

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    const success = await ctaAlertServerService.deleteTemplate(db, templateId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete template' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Template deleted',
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}
