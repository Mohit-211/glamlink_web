import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import magazineSectionService from '@/lib/pages/magazine/services/magazineSectionService';
import { MagazineSectionDocument } from '@/lib/pages/magazine/types/collaboration';

// GET /api/magazine/sections?issueId=xxx - List sections with lock status
export async function GET(request: NextRequest) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();
    
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const issueId = request.nextUrl.searchParams.get('issueId');
    const skipLockChecks = request.nextUrl.searchParams.get('skipLockChecks') === 'true';
    
    if (!issueId) {
      return NextResponse.json(
        { error: 'Issue ID is required' },
        { status: 400 }
      );
    }

    let sections;
    
    if (skipLockChecks) {
      // Just get sections without lock status checks (faster, no additional API calls)
      console.log(`📦 Fetching sections WITHOUT lock checks for issue ${issueId}`);
      sections = await magazineSectionService.getSectionsByIssueId(db, issueId);
    } else {
      // Get sections with lock status for current user (includes lock checks)
      console.log(`📦 Fetching sections WITH lock checks for issue ${issueId}`);
      sections = await magazineSectionService.getSectionsWithLockStatus(
        db,
        issueId,
        currentUser.uid
      );
    }

    // If no sections exist, return empty array (not an error - sections might not be created yet)
    if (!sections || sections.length === 0) {
      console.log(`No sections found for issue ${issueId} - this is okay for new issues`);
      return NextResponse.json({
        success: true,
        sections: [],
        activeEditors: []
      });
    }

    // Get list of active editors (users with locks on sections) - only when lock checks are enabled
    const activeEditors = new Set<string>();
    if (!skipLockChecks && sections) {
      sections.forEach(section => {
        if (section.lockedBy && section.lockStatus?.isLocked) {
          activeEditors.add(section.lockedByEmail || section.lockedBy);
        }
      });
    }

    return NextResponse.json({
      success: true,
      sections,
      activeEditors: skipLockChecks ? [] : Array.from(activeEditors)
    });
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}

// POST /api/magazine/sections - Create new section(s)
export async function POST(request: NextRequest) {
  console.log("🎆 API: POST /api/magazine/sections CALLED");
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();
    
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("📦 API: Request body received:", body);
    const { issueId, sections, sectionData } = body;
    console.log("📋 API: Extracted - issueId:", issueId, "sections:", sections?.length, "sectionData:", !!sectionData);

    if (!issueId) {
      return NextResponse.json(
        { error: 'Issue ID is required' },
        { status: 400 }
      );
    }

    // Handle single section creation
    if (sectionData) {
      console.log("🚀 API: Creating SINGLE section");
      const newSection = await magazineSectionService.createSection(
        db,
        {
          ...sectionData,
          issueId
        },
        currentUser.uid,
        currentUser.email || ''
      );

      if (!newSection) {
        return NextResponse.json(
          { error: 'Failed to create section' },
          { status: 500 }
        );
      }

      console.log("✅ API: Single section created:", newSection?.id);
      return NextResponse.json({
        success: true,
        section: newSection
      });
    }

    // Handle multiple sections creation (from template)
    if (sections && Array.isArray(sections)) {
      console.log("🔥 API: CREATING MULTIPLE SECTIONS FROM TEMPLATE - THIS IS WHAT WE WANT!");
      console.log("🎆 API: Creating", sections.length, "sections for issue", issueId);
      const createdSections = await magazineSectionService.createSectionsFromTemplate(
        db,
        {
          issueId,
          sections,
          userId: currentUser.uid,
          userEmail: currentUser.email || ''
        }
      );

      console.log("✅ API: SUCCESSFULLY CREATED", createdSections.length, "SECTIONS IN THE SECTIONS COLLECTION!");
      return NextResponse.json({
        success: true,
        sections: createdSections
      });
    }

    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error creating sections:', error);
    return NextResponse.json(
      { error: 'Failed to create sections' },
      { status: 500 }
    );
  }
}

// PUT /api/magazine/sections/reorder - Bulk update section order
export async function PUT(request: NextRequest) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();
    
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sections } = body;

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json(
        { error: 'Sections array is required' },
        { status: 400 }
      );
    }

    const success = await magazineSectionService.updateSectionOrder(db, {
      sections: sections.map((s, index) => ({
        id: s.id,
        order: index
      }))
    });

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update section order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Section order updated successfully'
    });
  } catch (error) {
    console.error('Error updating section order:', error);
    return NextResponse.json(
      { error: 'Failed to update section order' },
      { status: 500 }
    );
  }
}