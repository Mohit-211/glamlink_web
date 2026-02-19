import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { getCustomerTags } from '@/lib/features/crm/services/customerDbService';

// GET /api/crm/customers/tags - Get all customer tags for autocomplete
export async function GET(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const brandId = currentUser.uid;
    const tags = await getCustomerTags(db, brandId);

    return NextResponse.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}
