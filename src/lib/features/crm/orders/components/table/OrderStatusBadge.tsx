/**
 * OrderStatusBadge Component
 *
 * Displays status badges for payment, fulfillment, and delivery statuses
 */

import React from 'react';
import type { PaymentStatus, FulfillmentStatus, DeliveryStatus } from '../../types';

interface OrderStatusBadgeProps {
  type: 'payment' | 'fulfillment' | 'delivery';
  status: PaymentStatus | FulfillmentStatus | DeliveryStatus;
  className?: string;
}

/**
 * Get badge styling based on status type and value
 */
function getBadgeStyles(type: string, status: string): {
  bgColor: string;
  textColor: string;
  dotColor?: string;
} {
  if (type === 'payment') {
    switch (status) {
      case 'paid':
        return { bgColor: 'bg-green-100', textColor: 'text-green-800', dotColor: 'bg-green-600' };
      case 'pending':
        return { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', dotColor: 'bg-yellow-600' };
      case 'partially_paid':
        return { bgColor: 'bg-orange-100', textColor: 'text-orange-800', dotColor: 'bg-orange-600' };
      case 'refunded':
        return { bgColor: 'bg-blue-100', textColor: 'text-blue-800', dotColor: 'bg-blue-600' };
      case 'voided':
        return { bgColor: 'bg-red-100', textColor: 'text-red-800', dotColor: 'bg-red-600' };
      default:
        return { bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    }
  }

  if (type === 'fulfillment') {
    switch (status) {
      case 'fulfilled':
        return { bgColor: 'bg-green-100', textColor: 'text-green-800', dotColor: 'bg-green-600' };
      case 'unfulfilled':
        return { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', dotColor: 'bg-yellow-500' };
      case 'partially_fulfilled':
        return { bgColor: 'bg-orange-100', textColor: 'text-orange-800', dotColor: 'bg-orange-600' };
      case 'scheduled':
        return { bgColor: 'bg-blue-100', textColor: 'text-blue-800', dotColor: 'bg-blue-600' };
      default:
        return { bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    }
  }

  if (type === 'delivery') {
    switch (status) {
      case 'delivered':
        return { bgColor: 'bg-green-100', textColor: 'text-green-800', dotColor: 'bg-green-600' };
      case 'in_transit':
        return { bgColor: 'bg-blue-100', textColor: 'text-blue-800', dotColor: 'bg-blue-600' };
      case 'pending':
        return { bgColor: 'bg-gray-100', textColor: 'text-gray-800', dotColor: 'bg-gray-600' };
      case 'returned':
        return { bgColor: 'bg-purple-100', textColor: 'text-purple-800', dotColor: 'bg-purple-600' };
      case 'failed':
        return { bgColor: 'bg-red-100', textColor: 'text-red-800', dotColor: 'bg-red-600' };
      default:
        return { bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    }
  }

  return { bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
}

/**
 * Format status text for display
 */
function formatStatusText(status: string): string {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * OrderStatusBadge Component
 */
export function OrderStatusBadge({ type, status, className = '' }: OrderStatusBadgeProps) {
  const styles = getBadgeStyles(type, status);
  const text = formatStatusText(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles.bgColor} ${styles.textColor} ${className}`}
    >
      {styles.dotColor && (
        <span className={`w-1.5 h-1.5 rounded-full ${styles.dotColor}`} aria-hidden="true" />
      )}
      <span>{text}</span>
    </span>
  );
}

export default OrderStatusBadge;
