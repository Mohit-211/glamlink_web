import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import {
  getCustomers,
  createCustomer
} from '@/lib/features/crm/services/customerDbService';
import { CreateCustomerInput } from '@/lib/features/crm/types/customer';

// GET /api/crm/customers - List all customers for the brand
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
    const customers = await getCustomers(db, brandId);

    return NextResponse.json({
      success: true,
      data: customers,
      total: customers.length,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST /api/crm/customers - Create a new customer
export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const brandId = currentUser.uid;
    const input: CreateCustomerInput = await request.json();

    // Validate required fields
    if (!input.firstName || !input.lastName || !input.email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const customer = await createCustomer(db, brandId, input);

    return NextResponse.json({
      success: true,
      data: customer,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);

    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
