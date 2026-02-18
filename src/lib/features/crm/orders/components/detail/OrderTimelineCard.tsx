/**
 * OrderTimelineCard Component
 *
 * Activity feed showing order history events
 */

'use client';

import React from 'react';
import type { Order } from '../../types';

interface TimelineEvent {
  id: string;
  type: 'created' | 'paid' | 'fulfilled' | 'delivered' | 'refunded' | 'cancelled' | 'note';
  title: string;
  description?: string;
  timestamp: string;
  user?: string;
  icon: React.ReactNode;
  iconBgColor: string;
}

interface OrderTimelineCardProps {
  order: Order;
}

/**
 * Timeline Icons
 */
const ShoppingBagIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);

const CheckCircleIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const TruckIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const CreditCardIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
);

const XCircleIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ChatIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

/**
 * Format relative time
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Generate timeline events from order data
 */
function generateTimelineEvents(order: Order): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Order created
  events.push({
    id: 'created',
    type: 'created',
    title: 'Order created',
    description: `Order #${order.orderNumber} was placed via ${order.channel.replace('_', ' ')}`,
    timestamp: order.createdAt,
    icon: <ShoppingBagIcon className="text-white" />,
    iconBgColor: 'bg-blue-500',
  });

  // Payment status
  if (order.paymentStatus === 'paid' && order.paidAt) {
    events.push({
      id: 'paid',
      type: 'paid',
      title: 'Payment received',
      description: `${order.paymentMethod ? `Paid via ${order.paymentMethod.replace('_', ' ')}` : 'Payment completed'}`,
      timestamp: order.paidAt,
      icon: <CreditCardIcon className="text-white" />,
      iconBgColor: 'bg-green-500',
    });
  } else if (order.paymentStatus === 'refunded' && order.hasReturn) {
    events.push({
      id: 'refunded',
      type: 'refunded',
      title: 'Order refunded',
      description: `Refunded ${order.returnAmount ? `$${order.returnAmount.toFixed(2)}` : 'full amount'}`,
      timestamp: order.updatedAt,
      icon: <XCircleIcon className="text-white" />,
      iconBgColor: 'bg-red-500',
    });
  }

  // Fulfillment status
  if (order.fulfillmentStatus === 'fulfilled' && order.fulfilledAt) {
    events.push({
      id: 'fulfilled',
      type: 'fulfilled',
      title: 'Order fulfilled',
      description: 'All items have been prepared and shipped',
      timestamp: order.fulfilledAt,
      icon: <CheckCircleIcon className="text-white" />,
      iconBgColor: 'bg-green-500',
    });
  }

  // Delivery status
  if (order.deliveryStatus === 'delivered' && order.deliveredAt) {
    events.push({
      id: 'delivered',
      type: 'delivered',
      title: 'Order delivered',
      description: `Delivered to ${order.shippingAddress?.city || 'customer'}`,
      timestamp: order.deliveredAt,
      icon: <TruckIcon className="text-white" />,
      iconBgColor: 'bg-green-500',
    });
  }

  // Notes (if any)
  if (order.notes) {
    events.push({
      id: 'note',
      type: 'note',
      title: 'Note added',
      description: order.notes,
      timestamp: order.updatedAt,
      icon: <ChatIcon className="text-white" />,
      iconBgColor: 'bg-gray-400',
    });
  }

  // Sort by timestamp (newest first)
  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return events;
}

/**
 * OrderTimelineCard Component
 */
export function OrderTimelineCard({ order }: OrderTimelineCardProps) {
  const events = generateTimelineEvents(order);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Timeline</h2>

      {/* Timeline List */}
      <div className="flow-root">
        <ul className="-mb-8">
          {events.map((event, eventIdx) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {/* Connector Line */}
                {eventIdx !== events.length - 1 && (
                  <span
                    className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}

                <div className="relative flex items-start space-x-3">
                  {/* Icon */}
                  <div>
                    <div
                      className={`relative h-10 w-10 flex items-center justify-center rounded-full ${event.iconBgColor}`}
                    >
                      {event.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      {event.description && (
                        <p className="text-sm text-gray-500 mt-0.5">{event.description}</p>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      {formatRelativeTime(event.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <div className="text-center py-8">
          <ChatIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">No activity yet</p>
        </div>
      )}
    </div>
  );
}

export default OrderTimelineCard;
