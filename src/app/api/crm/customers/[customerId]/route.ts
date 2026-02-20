import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import {
  getCustomerById,
  updateCustomer,
  deleteCustomer
} from '@/lib/features/crm/services/customerDbService';
import { UpdateCustomerInput } from '@/lib/features/crm/types/customer';

interface RouteParams {
  params: Promise<{ customerId: string }>;
}

// GET /api/crm/customers/[customerId] - Get a single customer
export async function GET(
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
    const customer = await getCustomerById(db, brandId, customerId);

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

// PATCH /api/crm/customers/[customerId] - Update a customer
export async function PATCH(
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
    const updates: UpdateCustomerInput = await request.json();

    // Validate email format if provided
    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    const customer = await updateCustomer(db, brandId, customerId, updates);

    return NextResponse.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error('Error updating customer:', error);

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      if (error.message.includes('already exists')) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE /api/crm/customers/[customerId] - Delete a customer
export async function DELETE(
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
    await deleteCustomer(db, brandId, customerId);

    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting customer:', error);

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
