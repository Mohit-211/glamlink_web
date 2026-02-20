/**
 * Digital Layouts API
 *
 * GET /api/digital-layouts?issueId=xxx - List all layouts for an issue
 * POST /api/digital-layouts - Create a new layout
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import digitalLayoutsServerService from '@/lib/services/firebase/digitalLayoutsServerService';
import type {
  CreateDigitalLayoutRequest,
  DigitalLayoutsResponse
} from '@/lib/pages/admin/types/digitalLayouts';

// =============================================================================
// GET - List layouts for an issue
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as DigitalLayoutsResponse,
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const issueId = searchParams.get('issueId');

    if (!issueId) {
      return NextResponse.json(
        { success: false, error: 'Issue ID is required' } as DigitalLayoutsResponse,
        { status: 400 }
      );
    }

    const layouts = await digitalLayoutsServerService.getLayoutsByIssue(db, issueId);

    return NextResponse.json({
      success: true,
      data: layouts
    } as DigitalLayoutsResponse);
  } catch (error) {
    console.error('Error fetching digital layouts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch digital layouts' } as DigitalLayoutsResponse,
      { status: 500 }
    );
  }
}

// =============================================================================
// POST - Create a new layout
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as DigitalLayoutsResponse,
        { status: 401 }
      );
    }

    const body: CreateDigitalLayoutRequest = await request.json();

    // Validate required fields
    if (!body.issueId) {
      return NextResponse.json(
        { success: false, error: 'Issue ID is required' } as DigitalLayoutsResponse,
        { status: 400 }
      );
    }

    if (!body.layoutName) {
      return NextResponse.json(
        { success: false, error: 'Layout name is required' } as DigitalLayoutsResponse,
        { status: 400 }
      );
    }

    if (!body.layoutData) {
      return NextResponse.json(
        { success: false, error: 'Layout data is required' } as DigitalLayoutsResponse,
        { status: 400 }
      );
    }

    // Create the layout
    const newLayout = await digitalLayoutsServerService.createLayout(db, {
      issueId: body.issueId,
      layoutName: body.layoutName,
      layoutDescription: body.layoutDescription,
      previewImage: body.previewImage,
      layoutData: body.layoutData,
      createdBy: currentUser.uid,
    });

    if (!newLayout) {
      return NextResponse.json(
        { success: false, error: 'Failed to create layout' } as DigitalLayoutsResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newLayout,
      message: 'Layout created successfully'
    } as DigitalLayoutsResponse);
  } catch (error) {
    console.error('Error creating digital layout:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create digital layout' } as DigitalLayoutsResponse,
      { status: 500 }
    );
  }
}
