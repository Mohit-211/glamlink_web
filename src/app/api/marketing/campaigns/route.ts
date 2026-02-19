/**
 * Marketing Campaigns API Routes
 *
 * Handles listing and creating campaigns.
 *
 * Routes:
 * - GET /api/marketing/campaigns - List campaigns for a brand
 * - POST /api/marketing/campaigns - Create a new campaign
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import marketingServerService from '@/lib/features/crm/marketing/server/marketingServerService';
import type { Campaign, CampaignStatus } from '@/lib/features/crm/marketing/types';

/**
 * GET /api/marketing/campaigns
 *
 * List all campaigns for a brand with optional filters
 *
 * Query params:
 * - brandId: string (required)
 * - status: CampaignStatus (optional)
 * - limit: number (optional)
 */
export async function GET(request: NextRequest) {
  // Auth check
  const { db, currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser || !db) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Extract query params
  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get('brandId');
  const status = searchParams.get('status') as CampaignStatus | null;
  const limitStr = searchParams.get('limit');

  if (!brandId) {
    return NextResponse.json(
      { success: false, error: 'Brand ID required' },
      { status: 400 }
    );
  }

  try {
    const options: { status?: CampaignStatus; limit?: number } = {};

    if (status) {
      options.status = status;
    }

    if (limitStr) {
      const limitNum = parseInt(limitStr, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        options.limit = limitNum;
      }
    }

    const campaigns = await marketingServerService.getCampaigns(db, brandId, options);

    return NextResponse.json({
      success: true,
      data: campaigns,
    });
  } catch (error) {
    console.error('Error in GET /api/marketing/campaigns:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/marketing/campaigns
 *
 * Create a new campaign
 *
 * Body:
 * - brandId: string (required)
 * - name: string (required)
 * - type: CampaignType (required)
 * - subject?: string
 * - previewText?: string
 * - content: CampaignContent (required)
 * - recipientType: 'all' | 'segment' | 'manual' (required)
 * - recipientCount: number (required)
 * - ... other campaign fields
 */
export async function POST(request: NextRequest) {
  // Auth check
  const { db, currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser || !db) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { brandId, ...campaignData } = body;

    // Validation
    const requiredFields = ['name', 'type', 'brandId', 'content', 'recipientType', 'recipientCount'];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Create campaign with defaults
    const campaign: Campaign = {
      ...campaignData,
      id: crypto.randomUUID(),
      brandId,
      status: campaignData.status || 'draft',
      createdBy: currentUser.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metrics: campaignData.metrics || {
        sent: 0,
        delivered: 0,
        deliveryRate: 0,
        opened: 0,
        openRate: 0,
        clicked: 0,
        clickRate: 0,
        unsubscribed: 0,
        bounced: 0,
        complained: 0,
        conversions: 0,
        conversionRate: 0,
        revenue: 0,
      },
    };

    const success = await marketingServerService.createCampaign(db, brandId, campaign);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to create campaign' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: campaign,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/marketing/campaigns:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
