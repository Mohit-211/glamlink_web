/**
 * Single Order API Routes
 *
 * GET    /api/crm/orders/[id] - Get single order
 * PATCH  /api/crm/orders/[id] - Update order
 * DELETE /api/crm/orders/[id] - Delete order
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { OrdersService } from '@/lib/features/crm/orders/services/ordersService';
import type { ApiResponse, Order, UpdateOrderInput } from '@/lib/features/crm/orders/types';

/**
 * GET /api/crm/orders/[id]
 * Get a single order by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // CRITICAL: Must await params in Next.js 15
    const { id } = await params;

    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse<never>,
        { status: 401 }
      );
    }

    // Get brandId from user
    const brandId = (currentUser as any).brandId || currentUser.uid;

    // Fetch order
    const order = await OrdersService.getOrderById(db, brandId, id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' } as ApiResponse<never>,
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    } as ApiResponse<Order>);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch order',
        details: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/crm/orders/[id]
 * Update an existing order
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // CRITICAL: Must await params in Next.js 15
    const { id } = await params;

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
    const updates: UpdateOrderInput = await request.json();

    // Check if order exists
    const existingOrder = await OrdersService.getOrderById(db, brandId, id);
    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' } as ApiResponse<never>,
        { status: 404 }
      );
    }

    // Update order
    await OrdersService.updateOrder(db, brandId, id, updates);

    // Fetch updated order
    const updatedOrder = await OrdersService.getOrderById(db, brandId, id);

    return NextResponse.json({
      success: true,
      data: updatedOrder,
    } as ApiResponse<Order>);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update order',
        details: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/crm/orders/[id]
 * Delete an order (use with caution)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // CRITICAL: Must await params in Next.js 15
    const { id } = await params;

    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse<never>,
        { status: 401 }
      );
    }

    // Get brandId from user
    const brandId = (currentUser as any).brandId || currentUser.uid;

    // Check if order exists
    const existingOrder = await OrdersService.getOrderById(db, brandId, id);
    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' } as ApiResponse<never>,
        { status: 404 }
      );
    }

    // Delete order
    await OrdersService.deleteOrder(db, brandId, id);

    return NextResponse.json({
      success: true,
      data: { id },
    } as ApiResponse<{ id: string }>);
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete order',
        details: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
