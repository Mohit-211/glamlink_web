import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import {
  addCustomerAddress
} from '@/lib/features/crm/services/customerDbService';
import { AddressFormData } from '@/lib/features/crm/types/customer';

interface RouteParams {
  params: Promise<{ customerId: string }>;
}

// POST /api/crm/customers/[customerId]/addresses - Add an address
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { customerId } = await params;
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const brandId = currentUser.uid;
    const body = await request.json();
    const { address, setAsDefault } = body as {
      address: AddressFormData;
      setAsDefault?: boolean;
    };

    // Validate required fields
    if (!address.address1 || !address.city || !address.country) {
      return NextResponse.json(
        { error: 'Address, city, and country are required' },
        { status: 400 }
      );
    }

    const newAddress = await addCustomerAddress(
      db,
      brandId,
      customerId,
      address,
      setAsDefault
    );

    return NextResponse.json({
      success: true,
      data: newAddress,
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding address:', error);

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to add address' },
      { status: 500 }
    );
  }
}
