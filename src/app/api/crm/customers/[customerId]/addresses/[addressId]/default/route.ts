import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { setDefaultAddress } from '@/lib/features/crm/services/customerDbService';

interface RouteParams {
  params: Promise<{ customerId: string; addressId: string }>;
}

// POST /api/crm/customers/[customerId]/addresses/[addressId]/default
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { customerId, addressId } = await params;
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const brandId = currentUser.uid;
    await setDefaultAddress(db, brandId, customerId, addressId);

    return NextResponse.json({
      success: true,
      message: 'Default address updated successfully',
    });
  } catch (error) {
    console.error('Error setting default address:', error);

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to set default address' },
      { status: 500 }
    );
  }
}
