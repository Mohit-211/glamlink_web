import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import magazineServerService from '@/lib/services/firebase/magazineServerService';
import { SectionPageConfig } from '@/lib/pages/magazine/config/sectionPageConfig';
import { PdfConfiguration } from '@/lib/pages/magazine/types/digitalMagazine';

// Enhanced configuration type that can include full PDF settings
type EnhancedSectionConfig = SectionPageConfig & { pdfSettings?: PdfConfiguration };

// GET /api/magazine/issues/[id]/config - Get page configurations for an issue
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: issueId } = await params;
    
    // Get authenticated Firebase instance
    const { db } = await getAuthenticatedAppForUser();
    
    if (!db) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      );
    }
    
    // Get the issue to retrieve its page configurations
    const issue = await magazineServerService.getIssueById(db, issueId, false);
    
    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }
    
    // Return the page configurations or empty object if none exist
    return NextResponse.json(issue.pageConfigurations || {});
  } catch (error) {
    console.error('Error fetching page configurations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page configurations' },
      { status: 500 }
    );
  }
}

// PUT /api/magazine/issues/[id]/config - Update page configurations for an issue
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: issueId } = await params;
    
    // Get authenticated Firebase instance
    const { db, currentUser } = await getAuthenticatedAppForUser();
    
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      );
    }
    
    // Get the configurations from the request body - now supports enhanced config with PDF settings
    const configurations: Record<string, EnhancedSectionConfig> = await request.json();
    
    // Update the issue with the new page configurations
    const success = await magazineServerService.updateIssue(db, issueId, {
      pageConfigurations: configurations
    });
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update page configurations' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, configurations });
  } catch (error) {
    console.error('Error updating page configurations:', error);
    return NextResponse.json(
      { error: 'Failed to update page configurations' },
      { status: 500 }
    );
  }
}

// PATCH /api/magazine/issues/[id]/config - Update a single section configuration
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: issueId } = await params;
    
    // Get authenticated Firebase instance
    const { db, currentUser } = await getAuthenticatedAppForUser();
    
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      );
    }
    
    // Get the section ID and configuration from the request body - now supports enhanced config
    const { sectionId, config }: { sectionId: string; config: EnhancedSectionConfig } = await request.json();
    
    if (!sectionId || !config) {
      return NextResponse.json(
        { error: 'Section ID and configuration required' },
        { status: 400 }
      );
    }
    
    // Get the current issue to retrieve existing configurations
    const issue = await magazineServerService.getIssueById(db, issueId, false);
    
    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }
    
    // Update the specific section configuration
    const updatedConfigurations = {
      ...(issue.pageConfigurations || {}),
      [sectionId]: config
    };
    
    // Save the updated configurations
    const success = await magazineServerService.updateIssue(db, issueId, {
      pageConfigurations: updatedConfigurations
    });
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update section configuration' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, configuration: config });
  } catch (error) {
    console.error('Error updating section configuration:', error);
    return NextResponse.json(
      { error: 'Failed to update section configuration' },
      { status: 500 }
    );
  }
}