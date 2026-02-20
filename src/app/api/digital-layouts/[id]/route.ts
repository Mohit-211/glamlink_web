/**
 * Digital Layout by ID API
 *
 * GET /api/digital-layouts/[id] - Get a specific layout
 * PUT /api/digital-layouts/[id] - Update a layout
 * DELETE /api/digital-layouts/[id] - Delete a layout
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import digitalLayoutsServerService from '@/lib/services/firebase/digitalLayoutsServerService';
import type { DigitalLayoutsResponse } from '@/lib/pages/admin/types/digitalLayouts';

// =============================================================================
// GET - Get layout by ID
// =============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as DigitalLayoutsResponse,
        { status: 401 }
      );
    }

    const { id } = await params;

    const layout = await digitalLayoutsServerService.getLayoutById(db, id);

    if (!layout) {
      return NextResponse.json(
        { success: false, error: 'Layout not found' } as DigitalLayoutsResponse,
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: layout
    } as DigitalLayoutsResponse);
  } catch (error) {
    console.error('Error fetching layout:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch layout' } as DigitalLayoutsResponse,
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE - Delete layout
// =============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as DigitalLayoutsResponse,
        { status: 401 }
      );
    }

    const { id } = await params;

    const deleted = await digitalLayoutsServerService.deleteLayout(db, id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete layout' } as DigitalLayoutsResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Layout deleted successfully'
    } as DigitalLayoutsResponse);
  } catch (error) {
    console.error('Error deleting layout:', error);

    // Check if it was a "not found" error
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { success: false, error: 'Layout not found' } as DigitalLayoutsResponse,
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete layout' } as DigitalLayoutsResponse,
      { status: 500 }
    );
  }
}

// =============================================================================
// PUT - Update layout
// =============================================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as DigitalLayoutsResponse,
        { status: 401 }
      );
    }

    const { id } = await params;
    const data = await request.json();

    // Remove fields that shouldn't be updated directly
    const { id: _id, createdAt, updatedAt, createdBy, ...updates } = data;

    const updated = await digitalLayoutsServerService.updateLayout(db, id, updates);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Failed to update layout' } as DigitalLayoutsResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Layout updated successfully'
    } as DigitalLayoutsResponse);
  } catch (error) {
    console.error('Error updating layout:', error);

    // Check if it was a "not found" error
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { success: false, error: 'Layout not found' } as DigitalLayoutsResponse,
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update layout' } as DigitalLayoutsResponse,
      { status: 500 }
    );
  }
}
