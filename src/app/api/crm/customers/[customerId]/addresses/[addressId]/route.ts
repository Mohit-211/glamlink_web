import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import {
  updateCustomerAddress,
  deleteCustomerAddress
} from '@/lib/features/crm/services/customerDbService';
import { AddressFormData } from '@/lib/features/crm/types/customer';

interface RouteParams {
  params: Promise<{ customerId: string; addressId: string }>;
}

// PATCH /api/crm/customers/[customerId]/addresses/[addressId]
export async function PATCH(
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
    const updates: Partial<AddressFormData> = await request.json();

    const address = await updateCustomerAddress(
      db,
      brandId,
      customerId,
      addressId,
      updates
    );

    return NextResponse.json({
      success: true,
      data: address,
    });
  } catch (error) {
    console.error('Error updating address:', error);

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    );
  }
}

// DELETE /api/crm/customers/[customerId]/addresses/[addressId]
export async function DELETE(
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
    await deleteCustomerAddress(db, brandId, customerId, addressId);

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting address:', error);

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}
