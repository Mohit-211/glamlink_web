/**
 * Orders Service
 *
 * Service layer for managing orders in Firestore subcollections.
 * Schema: brands/{brandId}/orders/{orderId}
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
  Timestamp,
  type Firestore,
  type QueryConstraint,
  type DocumentSnapshot,
} from 'firebase/firestore';

import type {
  Order,
  OrdersFilter,
  OrdersPagination,
  OrdersResponse,
  CreateOrderInput,
  UpdateOrderInput,
  OrderMetrics,
  MetricsRequest,
} from '../types';

/**
 * Orders Service Class
 */
export class OrdersService {
  /**
   * Get all orders for a brand with filtering and pagination
   */
  static async getOrders(
    db: Firestore,
    brandId: string,
    filters?: OrdersFilter,
    pagination?: Partial<OrdersPagination>
  ): Promise<OrdersResponse> {
    const ordersRef = collection(db, `brands/${brandId}/orders`);

    // Build query constraints
    const constraints: QueryConstraint[] = [];

    // Apply filters
    if (filters) {
      if (filters.paymentStatus && filters.paymentStatus.length > 0) {
        constraints.push(where('paymentStatus', 'in', filters.paymentStatus));
      }

      if (filters.fulfillmentStatus && filters.fulfillmentStatus.length > 0) {
        constraints.push(where('fulfillmentStatus', 'in', filters.fulfillmentStatus));
      }

      if (filters.deliveryStatus && filters.deliveryStatus.length > 0) {
        constraints.push(where('deliveryStatus', 'in', filters.deliveryStatus));
      }

      if (filters.dateRange) {
        constraints.push(where('createdAt', '>=', filters.dateRange.start));
        constraints.push(where('createdAt', '<=', filters.dateRange.end));
      }

      if (filters.channel && filters.channel.length > 0) {
        constraints.push(where('channel', 'in', filters.channel));
      }

      // Note: minTotal, maxTotal, tags, and search are handled client-side after fetch
      // to avoid Firestore's composite index limitations
    }

    // Apply sorting
    const sortField = pagination?.orderBy || 'createdAt';
    const sortDirection = pagination?.direction || 'desc';
    constraints.push(orderBy(sortField, sortDirection));

    // Apply pagination
    const pageLimit = pagination?.limit || 50;
    constraints.push(limit(pageLimit + 1)); // +1 to check if there are more results

    // Apply cursor for pagination
    if (pagination?.cursor) {
      const cursorDoc = await getDoc(doc(db, `brands/${brandId}/orders`, pagination.cursor));
      if (cursorDoc.exists()) {
        constraints.push(startAfter(cursorDoc));
      }
    }

    // Execute query
    const q = query(ordersRef, ...constraints);
    const snapshot = await getDocs(q);

    // Process results
    const orders: Order[] = [];
    snapshot.docs.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      orders.push({
        ...data,
        id: docSnapshot.id,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      } as Order);
    });

    // Check if there are more results
    const hasMore = orders.length > pageLimit;
    if (hasMore) {
      orders.pop(); // Remove the extra item
    }

    // Apply client-side filters
    let filteredOrders = orders;

    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredOrders = filteredOrders.filter(
          (order) =>
            order.orderNumber.toString().includes(searchLower) ||
            order.customer.name.toLowerCase().includes(searchLower) ||
            order.customer.email.toLowerCase().includes(searchLower) ||
            order.items.some((item) => item.name.toLowerCase().includes(searchLower))
        );
      }

      if (filters.tags && filters.tags.length > 0) {
        filteredOrders = filteredOrders.filter((order) =>
          filters.tags!.some((tag) => order.tags.includes(tag))
        );
      }

      if (filters.minTotal !== undefined) {
        filteredOrders = filteredOrders.filter((order) => order.total >= filters.minTotal!);
      }

      if (filters.maxTotal !== undefined) {
        filteredOrders = filteredOrders.filter((order) => order.total <= filters.maxTotal!);
      }
    }

    // Get total count (approximate)
    const countQuery = query(ordersRef);
    const countSnapshot = await getCountFromServer(countQuery);

    return {
      orders: filteredOrders,
      total: countSnapshot.data().count,
      page: pagination?.page || 1,
      hasMore,
      cursor: hasMore ? orders[orders.length - 1]?.id : undefined,
    };
  }

  /**
   * Get a single order by ID
   */
  static async getOrderById(
    db: Firestore,
    brandId: string,
    orderId: string
  ): Promise<Order | null> {
    const orderRef = doc(db, `brands/${brandId}/orders`, orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      return null;
    }

    const data = orderSnap.data();
    return {
      ...data,
      id: orderSnap.id,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    } as Order;
  }

  /**
   * Create a new order
   */
  static async createOrder(
    db: Firestore,
    brandId: string,
    orderInput: CreateOrderInput
  ): Promise<Order> {
    const ordersRef = collection(db, `brands/${brandId}/orders`);

    // Generate order number (simple incrementing, could be improved)
    const orderNumber = await this.generateOrderNumber(db, brandId);

    // Calculate totals
    const subtotal = orderInput.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = orderInput.tax || 0;
    const shipping = orderInput.shipping || 0;
    const discount = orderInput.discount || 0;
    const total = subtotal + tax + shipping - discount;

    // Build order object
    const now = new Date().toISOString();
    const order: Omit<Order, 'id'> = {
      orderNumber,
      createdAt: now,
      updatedAt: now,

      customer: {
        ...orderInput.customer,
        id: orderInput.customer.id || `guest-${Date.now()}`,
      },

      channel: orderInput.channel,
      source: undefined,

      subtotal,
      tax,
      shipping,
      discount,
      total,
      currency: 'USD',

      paymentStatus: orderInput.paymentStatus,
      paymentMethod: orderInput.paymentMethod,
      paidAt: orderInput.paymentStatus === 'paid' ? now : undefined,

      fulfillmentStatus: 'unfulfilled',
      fulfilledAt: undefined,

      deliveryStatus: 'pending',
      deliveryMethod: orderInput.deliveryMethod,
      trackingNumber: undefined,
      trackingUrl: undefined,
      deliveredAt: undefined,

      items: orderInput.items.map((item) => ({
        id: crypto.randomUUID(),
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
        compareAtPrice: undefined,
        discount: 0,
        total: item.price * item.quantity,
        imageUrl: undefined,
        fulfillmentStatus: 'unfulfilled',
      })),
      itemCount: orderInput.items.reduce((sum, item) => sum + item.quantity, 0),

      shippingAddress: orderInput.shippingAddress,
      billingAddress: orderInput.billingAddress,

      flags: [],
      tags: orderInput.tags || [],
      notes: orderInput.notes,
      internalNotes: orderInput.internalNotes,

      hasReturn: false,
      returnAmount: undefined,

      riskLevel: 'low',
      riskIndicators: [],
    };

    // Create order document with auto-generated ID
    const newOrderRef = doc(ordersRef);
    await setDoc(newOrderRef, order);

    return {
      ...order,
      id: newOrderRef.id,
    };
  }

  /**
   * Update an existing order
   */
  static async updateOrder(
    db: Firestore,
    brandId: string,
    orderId: string,
    updates: UpdateOrderInput
  ): Promise<void> {
    const orderRef = doc(db, `brands/${brandId}/orders`, orderId);

    const updateData: any = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Set timestamps based on status changes
    if (updates.fulfillmentStatus === 'fulfilled' && !updates.fulfillmentStatus) {
      updateData.fulfilledAt = new Date().toISOString();
    }

    if (updates.deliveryStatus === 'delivered') {
      updateData.deliveredAt = new Date().toISOString();
    }

    await updateDoc(orderRef, updateData);
  }

  /**
   * Delete an order (use with caution - consider archiving instead)
   */
  static async deleteOrder(db: Firestore, brandId: string, orderId: string): Promise<void> {
    const orderRef = doc(db, `brands/${brandId}/orders`, orderId);
    await deleteDoc(orderRef);
  }

  /**
   * Get order metrics for a date range
   */
  static async getOrderMetrics(
    db: Firestore,
    brandId: string,
    metricsRequest: MetricsRequest
  ): Promise<OrderMetrics> {
    const { startDate, endDate, compareStartDate, compareEndDate } = metricsRequest;

    // Fetch current period orders
    const currentOrders = await this.getOrdersInDateRange(db, brandId, startDate, endDate);

    // Fetch comparison period orders (if provided)
    let comparisonOrders: Order[] = [];
    if (compareStartDate && compareEndDate) {
      comparisonOrders = await this.getOrdersInDateRange(
        db,
        brandId,
        compareStartDate,
        compareEndDate
      );
    }

    // Calculate current metrics
    const currentMetrics = this.calculateMetrics(currentOrders);

    // Calculate comparison metrics
    const comparisonMetrics = this.calculateMetrics(comparisonOrders);

    // Calculate percentage changes
    return {
      totalOrders: currentMetrics.totalOrders,
      totalOrdersChange: this.calculatePercentageChange(
        comparisonMetrics.totalOrders,
        currentMetrics.totalOrders
      ),

      itemsOrdered: currentMetrics.itemsOrdered,
      itemsOrderedChange: this.calculatePercentageChange(
        comparisonMetrics.itemsOrdered,
        currentMetrics.itemsOrdered
      ),

      returnValue: currentMetrics.returnValue,
      returnValueChange: this.calculatePercentageChange(
        comparisonMetrics.returnValue,
        currentMetrics.returnValue
      ),

      ordersFulfilled: currentMetrics.ordersFulfilled,
      ordersFulfilledChange: this.calculatePercentageChange(
        comparisonMetrics.ordersFulfilled,
        currentMetrics.ordersFulfilled
      ),

      ordersDelivered: currentMetrics.ordersDelivered,
      ordersDeliveredChange: this.calculatePercentageChange(
        comparisonMetrics.ordersDelivered,
        currentMetrics.ordersDelivered
      ),

      avgFulfillmentTime: currentMetrics.avgFulfillmentTime,
      avgFulfillmentTimeChange: this.calculatePercentageChange(
        comparisonMetrics.avgFulfillmentTime,
        currentMetrics.avgFulfillmentTime
      ),

      revenue: currentMetrics.revenue,
      revenueChange: this.calculatePercentageChange(
        comparisonMetrics.revenue,
        currentMetrics.revenue
      ),

      unpaidCount: currentMetrics.unpaidCount,
      unfulfilledCount: currentMetrics.unfulfilledCount,
    };
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Generate next order number for a brand
   */
  private static async generateOrderNumber(db: Firestore, brandId: string): Promise<number> {
    const ordersRef = collection(db, `brands/${brandId}/orders`);
    const q = query(ordersRef, orderBy('orderNumber', 'desc'), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return 1000; // Starting order number
    }

    const lastOrder = snapshot.docs[0].data() as Order;
    return lastOrder.orderNumber + 1;
  }

  /**
   * Get orders in a specific date range
   */
  private static async getOrdersInDateRange(
    db: Firestore,
    brandId: string,
    startDate: string,
    endDate: string
  ): Promise<Order[]> {
    const ordersRef = collection(db, `brands/${brandId}/orders`);
    const q = query(
      ordersRef,
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnapshot) => ({
      ...docSnapshot.data(),
      id: docSnapshot.id,
    })) as Order[];
  }

  /**
   * Calculate metrics from an array of orders
   */
  private static calculateMetrics(orders: Order[]): {
    totalOrders: number;
    itemsOrdered: number;
    returnValue: number;
    ordersFulfilled: number;
    ordersDelivered: number;
    avgFulfillmentTime: number;
    revenue: number;
    unpaidCount: number;
    unfulfilledCount: number;
  } {
    const totalOrders = orders.length;
    const itemsOrdered = orders.reduce((sum, order) => sum + order.itemCount, 0);
    const returnValue = orders.reduce((sum, order) => sum + (order.returnAmount || 0), 0);
    const ordersFulfilled = orders.filter((o) => o.fulfillmentStatus === 'fulfilled').length;
    const ordersDelivered = orders.filter((o) => o.deliveryStatus === 'delivered').length;
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    const unpaidCount = orders.filter(
      (o) => o.paymentStatus === 'pending' || o.paymentStatus === 'partially_paid'
    ).length;
    const unfulfilledCount = orders.filter((o) => o.fulfillmentStatus === 'unfulfilled').length;

    // Calculate average fulfillment time (in hours)
    const fulfilledOrders = orders.filter(
      (o) => o.fulfillmentStatus === 'fulfilled' && o.fulfilledAt
    );
    let avgFulfillmentTime = 0;
    if (fulfilledOrders.length > 0) {
      const totalFulfillmentTime = fulfilledOrders.reduce((sum, order) => {
        const createdAt = new Date(order.createdAt).getTime();
        const fulfilledAt = new Date(order.fulfilledAt!).getTime();
        return sum + (fulfilledAt - createdAt);
      }, 0);
      avgFulfillmentTime = totalFulfillmentTime / fulfilledOrders.length / (1000 * 60 * 60); // Convert to hours
    }

    return {
      totalOrders,
      itemsOrdered,
      returnValue,
      ordersFulfilled,
      ordersDelivered,
      avgFulfillmentTime,
      revenue,
      unpaidCount,
      unfulfilledCount,
    };
  }

  /**
   * Calculate percentage change between two values
   */
  private static calculatePercentageChange(oldValue: number, newValue: number): number {
    if (oldValue === 0) {
      return newValue > 0 ? 100 : 0;
    }
    return ((newValue - oldValue) / oldValue) * 100;
  }
}

export default OrdersService;
