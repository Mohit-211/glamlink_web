/**
 * Orders API Routes
 *
 * GET  /api/crm/orders - List orders with filters and pagination
 * POST /api/crm/orders - Create a new order
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { OrdersService } from '@/lib/features/crm/orders/services/ordersService';
import { CustomersService } from '@/lib/features/crm/orders/services/customersService';
import type {
  OrdersFilter,
  OrdersPagination,
  CreateOrderInput,
  ApiResponse,
  OrdersResponse,
  Order,
} from '@/lib/features/crm/orders/types';

/**
 * GET /api/crm/orders
 * List orders with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse<never>,
        { status: 401 }
      );
    }

    // Get brandId from user (assuming user has a brandId property)
    // TODO: Adjust based on your actual user structure
    const brandId = (currentUser as any).brandId || currentUser.uid;

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;

    // Build filters
    const filters: OrdersFilter = {};

    const search = searchParams.get('search');
    if (search) {
      filters.search = search;
    }

    const paymentStatus = searchParams.get('paymentStatus');
    if (paymentStatus) {
      filters.paymentStatus = paymentStatus.split(',') as any;
    }

    const fulfillmentStatus = searchParams.get('fulfillmentStatus');
    if (fulfillmentStatus) {
      filters.fulfillmentStatus = fulfillmentStatus.split(',') as any;
    }

    const deliveryStatus = searchParams.get('deliveryStatus');
    if (deliveryStatus) {
      filters.deliveryStatus = deliveryStatus.split(',') as any;
    }

    const channel = searchParams.get('channel');
    if (channel) {
      filters.channel = channel.split(',') as any;
    }

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    if (startDate && endDate) {
      filters.dateRange = { start: startDate, end: endDate };
    }

    const tags = searchParams.get('tags');
    if (tags) {
      filters.tags = tags.split(',');
    }

    const minTotal = searchParams.get('minTotal');
    if (minTotal) {
      filters.minTotal = parseFloat(minTotal);
    }

    const maxTotal = searchParams.get('maxTotal');
    if (maxTotal) {
      filters.maxTotal = parseFloat(maxTotal);
    }

    // Build pagination
    const pagination: Partial<OrdersPagination> = {};

    const page = searchParams.get('page');
    if (page) {
      pagination.page = parseInt(page, 10);
    }

    const limit = searchParams.get('limit');
    if (limit) {
      pagination.limit = parseInt(limit, 10);
    }

    const orderBy = searchParams.get('orderBy');
    if (orderBy) {
      pagination.orderBy = orderBy as any;
    }

    const direction = searchParams.get('direction');
    if (direction) {
      pagination.direction = direction as 'asc' | 'desc';
    }

    const cursor = searchParams.get('cursor');
    if (cursor) {
      pagination.cursor = cursor;
    }

    // Fetch orders
    const ordersResponse = await OrdersService.getOrders(db, brandId, filters, pagination);

    return NextResponse.json({
      success: true,
      data: ordersResponse,
    } as ApiResponse<OrdersResponse>);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}

/**
 * POST /api/crm/orders
 * Create a new order
 */
export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse<never>,
        { status: 401 }
      );
    }

    // Get brandId from user
    const brandId = (currentUser as any).brandId || currentUser.uid;

    // Parse request body
    const orderInput: CreateOrderInput = await request.json();

    // Validate required fields
    if (!orderInput.customer || !orderInput.items || orderInput.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid order data',
          details: 'Customer and items are required',
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Find or create customer
    const customer = await CustomersService.findOrCreateCustomer(db, brandId, orderInput.customer);

    // Update order input with confirmed customer ID
    orderInput.customer = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    };

    // Create order
    const newOrder = await OrdersService.createOrder(db, brandId, orderInput);

    // Update customer stats
    await CustomersService.updateCustomerStats(
      db,
      brandId,
      customer.id,
      newOrder.total,
      newOrder.createdAt,
      true
    );

    return NextResponse.json(
      {
        success: true,
        data: newOrder,
      } as ApiResponse<Order>,
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
