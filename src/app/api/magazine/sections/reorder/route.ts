import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import magazineSectionService from '@/lib/pages/magazine/services/magazineSectionService';

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
        order: typeof s.order !== 'undefined' ? s.order : index
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