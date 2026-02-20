/**
 * Orders Management System - Type Definitions
 *
 * Comprehensive type system for order management including orders, customers,
 * items, addresses, and related entities.
 */

// ============================================================================
// Core Order Types
// ============================================================================

export interface Order {
  id: string;
  orderNumber: number;
  createdAt: string;
  updatedAt: string;

  // Customer Information (denormalized for quick display)
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };

  // Channel & Source
  channel: OrderChannel;
  source?: string;

  // Financial Details
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;

  // Payment Information
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paidAt?: string;

  // Fulfillment Information
  fulfillmentStatus: FulfillmentStatus;
  fulfilledAt?: string;

  // Delivery Information
  deliveryStatus: DeliveryStatus;
  deliveryMethod: DeliveryMethod;
  trackingNumber?: string;
  trackingUrl?: string;
  deliveredAt?: string;

  // Order Items
  items: OrderItem[];
  itemCount: number; // Denormalized for quick access

  // Addresses
  shippingAddress?: Address;
  billingAddress?: Address;

  // Metadata
  flags: OrderFlag[];
  tags: string[];
  notes?: string;
  internalNotes?: string;

  // Returns
  hasReturn: boolean;
  returnAmount?: number;

  // Risk Assessment
  riskLevel?: RiskLevel;
  riskIndicators?: string[];
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  sku?: string;
  quantity: number;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  total: number;
  imageUrl?: string;
  fulfillmentStatus: 'unfulfilled' | 'fulfilled';
}

export interface OrderFlag {
  type: 'chargeback' | 'fraud_warning' | 'high_risk' | 'customer_note' | 'custom';
  message: string;
  createdAt: string;
}

// ============================================================================
// Customer Types
// ============================================================================

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;

  // Denormalized Stats
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;

  // Metadata
  tags: string[];
  notes?: string;

  // Default Addresses
  defaultShippingAddress?: Address;
  defaultBillingAddress?: Address;
}

export interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
}

// ============================================================================
// Enums and Constants
// ============================================================================

export type OrderChannel = 'shop' | 'online_store' | 'pos' | 'draft' | 'api';

export type PaymentStatus = 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'voided';

export type FulfillmentStatus = 'unfulfilled' | 'partially_fulfilled' | 'fulfilled' | 'scheduled';

export type DeliveryStatus = 'pending' | 'in_transit' | 'delivered' | 'returned' | 'failed';

export type DeliveryMethod = 'shipping' | 'pickup' | 'local_delivery' | 'not_required';

export type RiskLevel = 'low' | 'medium' | 'high';

// ============================================================================
// Filter and Query Types
// ============================================================================

export interface OrdersFilter {
  search?: string;
  paymentStatus?: PaymentStatus[];
  fulfillmentStatus?: FulfillmentStatus[];
  deliveryStatus?: DeliveryStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  channel?: OrderChannel[];
  minTotal?: number;
  maxTotal?: number;
}

export interface OrdersPagination {
  page: number;
  limit: number;
  orderBy: 'createdAt' | 'total' | 'orderNumber' | 'customer.name';
  direction: 'asc' | 'desc';
  cursor?: string; // For cursor-based pagination
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  hasMore: boolean;
  cursor?: string;
}

// ============================================================================
// Metrics Types
// ============================================================================

export interface OrderMetrics {
  // Total Orders
  totalOrders: number;
  totalOrdersChange: number; // Percentage change from comparison period

  // Items Ordered
  itemsOrdered: number;
  itemsOrderedChange: number;

  // Returns
  returnValue: number;
  returnValueChange: number;

  // Orders Fulfilled
  ordersFulfilled: number;
  ordersFulfilledChange: number;

  // Orders Delivered
  ordersDelivered: number;
  ordersDeliveredChange: number;

  // Average Fulfillment Time
  avgFulfillmentTime: number; // In hours
  avgFulfillmentTimeChange: number;

  // Additional Metrics
  revenue?: number;
  revenueChange?: number;
  unpaidCount?: number;
  unfulfilledCount?: number;
}

export interface MetricsRequest {
  startDate: string;
  endDate: string;
  compareStartDate?: string;
  compareEndDate?: string;
}

// ============================================================================
// Draft Order Types
// ============================================================================

export interface DraftOrder extends Partial<Order> {
  id: string;
  isDraft: true;
  lastSavedAt: string;
}

// ============================================================================
// Order Activity/Timeline Types
// ============================================================================

export interface OrderActivity {
  id: string;
  orderId: string;
  type: OrderActivityType;
  message: string;
  createdAt: string;
  userId?: string;
  userName?: string;
  metadata?: Record<string, any>;
}

export type OrderActivityType =
  | 'order_created'
  | 'order_updated'
  | 'payment_captured'
  | 'payment_refunded'
  | 'fulfillment_created'
  | 'fulfillment_updated'
  | 'shipment_created'
  | 'delivered'
  | 'note_added'
  | 'tag_added'
  | 'tag_removed'
  | 'email_sent'
  | 'custom';

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// Export Options Types
// ============================================================================

export interface ExportOptions {
  format: 'csv_excel' | 'csv_plain' | 'json';
  scope: 'current_page' | 'all' | 'selected' | 'filtered' | 'date_range';
  orderIds?: string[]; // For 'selected' scope
  filters?: OrdersFilter; // For 'filtered' scope
  dateRange?: {
    // For 'date_range' scope
    start: string;
    end: string;
  };
  columns?: string[]; // Optional column selection
}

// ============================================================================
// Helper Type Guards
// ============================================================================

export function isOrder(obj: any): obj is Order {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.orderNumber === 'number' &&
    typeof obj.total === 'number'
  );
}

export function isCustomer(obj: any): obj is Customer {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.email === 'string'
  );
}

// ============================================================================
// Utility Types
// ============================================================================

export type OrderSortField = OrdersPagination['orderBy'];
export type OrderSortDirection = OrdersPagination['direction'];

export type OrderStatusGroup = 'all' | 'unfulfilled' | 'unpaid' | 'open' | 'archived';

// Tab filter configuration
export interface OrderTabFilter {
  id: OrderStatusGroup;
  label: string;
  count?: number;
  filter: (order: Order) => boolean;
}

// ============================================================================
// Form Types (for order creation/editing)
// ============================================================================

export interface CreateOrderInput {
  customer: {
    id?: string; // Existing customer ID or undefined for new
    name: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    productId: string;
    variantId?: string;
    name: string;
    quantity: number;
    price: number;
    sku?: string;
  }>;
  shippingAddress?: Address;
  billingAddress?: Address;
  channel: OrderChannel;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  deliveryMethod: DeliveryMethod;
  notes?: string;
  internalNotes?: string;
  tags?: string[];
  discount?: number;
  shipping?: number;
  tax?: number;
}

export interface UpdateOrderInput {
  fulfillmentStatus?: FulfillmentStatus;
  paymentStatus?: PaymentStatus;
  deliveryStatus?: DeliveryStatus;
  trackingNumber?: string;
  trackingUrl?: string;
  notes?: string;
  internalNotes?: string;
  tags?: string[];
}
