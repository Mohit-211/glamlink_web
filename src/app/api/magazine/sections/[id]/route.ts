import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import magazineSectionService from '@/lib/pages/magazine/services/magazineSectionService';
import { lockService } from '@/lib/packages/lock-management/services/LockService';

// GET /api/magazine/sections/[id] - Get single section with lock status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();
    
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    const section = await magazineSectionService.getSection(db, id);
    
    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    // Note: Lock status is now handled separately through /api/magazine/sections/[id]/lock
    return NextResponse.json({
      success: true,
      section
    });
  } catch (error) {
    console.error('Error fetching section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch section' },
      { status: 500 }
    );
  }
}

// PUT /api/magazine/sections/[id] - Update section (checks lock)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();
    
    if (!currentUser || !db) {
      console.log('❌ [PUT /api/magazine/sections/[id]] Unauthorized request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    console.log('📥 [PUT /api/magazine/sections/[id]] Request received:', {
      sectionId: id,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      bodyKeys: Object.keys(body),
      hasContent: !!body.content,
      hasContentBlocks: !!body.contentBlocks,
      hasContentContentBlocks: !!(body.content?.contentBlocks),
      contentBlocksCount: body.content?.contentBlocks?.length || body.contentBlocks?.length || 0,
      sectionType: body.type
    });

    // Log detailed contentBlocks structure if present
    if (body.content?.contentBlocks || body.contentBlocks) {
      const blocks = body.content?.contentBlocks || body.contentBlocks;
      console.log('📦 [PUT /api/magazine/sections/[id]] ContentBlocks structure:', {
        count: blocks.length,
        blockTypes: blocks.map((b: any) => b.type),
        firstBlock: blocks[0] ? {
          type: blocks[0].type,
          propsKeys: Object.keys(blocks[0].props || {})
        } : null
      });
    }

    // Check lock status
    const lockStatus = await lockService.getLockStatus(
      db,
      id,
      'magazine_sections',
      currentUser.uid
    );

    console.log('🔒 [PUT /api/magazine/sections/[id]] Lock status:', {
      sectionId: id,
      canEdit: lockStatus.canEdit,
      isLocked: lockStatus.isLocked,
      lockedBy: lockStatus.lockedBy
    });

    if (!lockStatus.canEdit) {
      console.log('🚫 [PUT /api/magazine/sections/[id]] Section locked by another user');
      return NextResponse.json(
        {
          error: 'Section is locked by another user',
          lockedBy: lockStatus.lockedBy,
          lockedByName: lockStatus.lockedByName,
          lockExpiresIn: lockStatus.lockExpiresIn
        },
        { status: 423 } // 423 Locked
      );
    }

    console.log('🔄 [PUT /api/magazine/sections/[id]] Calling updateSection service...');
    
    // Update section
    const success = await magazineSectionService.updateSection(
      db,
      id,
      body,
      currentUser.uid,
      currentUser.email || ''
    );

    if (!success) {
      console.error('❌ [PUT /api/magazine/sections/[id]] updateSection returned false');
      return NextResponse.json(
        { error: 'Failed to update section' },
        { status: 500 }
      );
    }

    console.log('✅ [PUT /api/magazine/sections/[id]] Section updated successfully:', {
      sectionId: id,
      contentBlocksUpdated: body.content?.contentBlocks?.length || body.contentBlocks?.length || 0
    });

    return NextResponse.json({
      success: true,
      message: 'Section updated successfully'
    });
  } catch (error) {
    console.error('❌ [PUT /api/magazine/sections/[id]] Error updating section:', error);
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    );
  }
}

// DELETE /api/magazine/sections/[id] - Delete section
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();
    
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    console.log(`🗑️ DELETE /api/magazine/sections/${id} - Attempting to delete section`);
    console.log(`User: ${currentUser.email}, Section ID: ${id}`);
    
    // Get section to find issueId
    const section = await magazineSectionService.getSection(db, id);
    
    if (!section) {
      console.error(`❌ Section not found in database with ID: ${id}`);
      console.log(`Tried to find document in 'sections' collection with ID: ${id}`);
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }
    
    console.log(`✅ Section found: ${section.title} (Issue: ${section.issueId})`)

    // Check if section is locked by another user
    const lockStatus = await lockService.getLockStatus(
      db,
      id,
      'magazine_sections',
      currentUser.uid
    );

    if (lockStatus.isLocked && !lockStatus.canEdit) {
      return NextResponse.json(
        {
          error: 'Cannot delete section locked by another user',
          lockedBy: lockStatus.lockedBy,
          lockedByName: lockStatus.lockedByName
        },
        { status: 423 }
      );
    }

    const success = await magazineSectionService.deleteSection(
      db,
      id,
      section.issueId
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete section' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Section deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting section:', error);
    return NextResponse.json(
      { error: 'Failed to delete section' },
      { status: 500 }
    );
  }
}