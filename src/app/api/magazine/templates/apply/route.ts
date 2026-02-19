import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import magazineSectionService from '@/lib/pages/magazine/services/magazineSectionService';
import magazineTemplateService from '@/lib/pages/magazine/services/magazineTemplateService';

// POST /api/magazine/templates/apply - Apply template to create multiple sections
export async function POST(request: NextRequest) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();
    
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { issueId, templateId, templateData } = body;

    if (!issueId) {
      return NextResponse.json(
        { error: 'Issue ID is required' },
        { status: 400 }
      );
    }

    let sectionsToCreate: any[] = [];

    // If templateId provided, load from predefined templates
    if (templateId) {
      const template = magazineTemplateService.getTemplateById(templateId);
      if (!template) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        );
      }
      sectionsToCreate = template.sections;
    }
    // If templateData provided, use custom template data
    else if (templateData && Array.isArray(templateData.sections)) {
      sectionsToCreate = templateData.sections;
    }
    else {
      return NextResponse.json(
        { error: 'Either templateId or templateData is required' },
        { status: 400 }
      );
    }

    // Create sections from template
    const createdSections = await magazineSectionService.createSectionsFromTemplate(
      db,
      {
        issueId,
        sections: sectionsToCreate.map((section, index) => ({
          type: section.type,
          title: section.title || section.type,
          subtitle: section.subtitle || '',
          content: section.content || section,
          order: index
        })),
        userId: currentUser.uid,
        userEmail: currentUser.email || ''
      }
    );

    if (!createdSections || createdSections.length === 0) {
      return NextResponse.json(
        { error: 'Failed to apply template' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Created ${createdSections.length} sections from template`,
      sections: createdSections
    });
  } catch (error) {
    console.error('Error applying template:', error);
    return NextResponse.json(
      { error: 'Failed to apply template' },
      { status: 500 }
    );
  }
}