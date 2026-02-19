/**
 * Digital Layouts Batch Upload API
 *
 * POST /api/digital-layouts/batch - Replace all layouts for an issue with uploaded data
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import digitalLayoutsServerService from '@/lib/services/firebase/digitalLayoutsServerService';
import type {
  BatchUploadLayoutsRequest,
  DigitalLayoutsResponse
} from '@/lib/pages/admin/types/digitalLayouts';

// =============================================================================
// POST - Batch upload layouts
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" } as DigitalLayoutsResponse,
        { status: 401 }
      );
    }

    const body: BatchUploadLayoutsRequest = await request.json();
    const { layouts } = body;

    // Validate request body
    if (!Array.isArray(layouts)) {
      return NextResponse.json({
        success: false,
        error: "Invalid request: layouts must be an array"
      } as DigitalLayoutsResponse, { status: 400 });
    }

    if (layouts.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Cannot upload empty layouts array"
      } as DigitalLayoutsResponse, { status: 400 });
    }

    // Validate each layout item
    for (let i = 0; i < layouts.length; i++) {
      const layout = layouts[i];

      if (!layout || typeof layout !== 'object') {
        return NextResponse.json({
          success: false,
          error: `Invalid layout at index ${i}: must be an object`
        } as DigitalLayoutsResponse, { status: 400 });
      }

      if (!layout.id) {
        return NextResponse.json({
          success: false,
          error: `Invalid layout at index ${i}: missing required field 'id'`
        } as DigitalLayoutsResponse, { status: 400 });
      }

      if (!layout.issueId) {
        return NextResponse.json({
          success: false,
          error: `Invalid layout at index ${i}: missing required field 'issueId'`
        } as DigitalLayoutsResponse, { status: 400 });
      }

      if (!layout.layoutName) {
        return NextResponse.json({
          success: false,
          error: `Invalid layout at index ${i}: missing required field 'layoutName'`
        } as DigitalLayoutsResponse, { status: 400 });
      }

      if (!layout.layoutData) {
        return NextResponse.json({
          success: false,
          error: `Invalid layout at index ${i}: missing required field 'layoutData'`
        } as DigitalLayoutsResponse, { status: 400 });
      }
    }

    // Get issueId from first layout (all should be same issue)
    const issueId = layouts[0].issueId;

    // Verify all layouts are for the same issue
    const allSameIssue = layouts.every(l => l.issueId === issueId);
    if (!allSameIssue) {
      return NextResponse.json({
        success: false,
        error: "All layouts must belong to the same issue"
      } as DigitalLayoutsResponse, { status: 400 });
    }

    // Delete existing layouts for this issue
    const deleteCount = await digitalLayoutsServerService.deleteLayoutsByIssue(db, issueId);
    console.log(`Deleted ${deleteCount} existing layouts for issue ${issueId}`);

    // Add createdBy field to each layout
    const layoutsWithCreator = layouts.map(layout => ({
      ...layout,
      createdBy: currentUser.uid
    }));

    // Bulk upload new layouts
    const result = await digitalLayoutsServerService.bulkUploadLayouts(
      db,
      layoutsWithCreator
    );

    if (result.failed > 0) {
      return NextResponse.json({
        success: false,
        error: `Failed to upload ${result.failed} out of ${layouts.length} layouts`,
        message: `Successfully uploaded ${result.success} layouts`
      } as DigitalLayoutsResponse, { status: 500 });
    }

    // Return uploaded layouts
    const uploadedLayouts = await digitalLayoutsServerService.getLayoutsByIssue(
      db,
      issueId
    );

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${result.success} layouts`,
      data: uploadedLayouts
    } as DigitalLayoutsResponse);

  } catch (error) {
    console.error("Error in layouts batch upload:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload layouts"
      } as DigitalLayoutsResponse,
      { status: 500 }
    );
  }
}

// GET method not allowed
export async function GET() {
  return NextResponse.json({
    success: false,
    error: "Method not allowed"
  } as DigitalLayoutsResponse, { status: 405 });
}
