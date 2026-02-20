/**
 * Finance Feature Configuration
 *
 * Constants and configuration for financial management
 */

import type { PayoutStatus, TransactionType, PaymentMethod } from './types';

export const PAYOUT_STATUSES: {
  value: PayoutStatus;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
}[] = [
  {
    value: 'pending',
    label: 'Pending',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  },
  {
    value: 'in_transit',
    label: 'In Transit',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  {
    value: 'deposited',
    label: 'Deposited',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  },
  {
    value: 'failed',
    label: 'Failed',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800'
  },
  {
    value: 'withdrawn',
    label: 'Withdrawn',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800'
  },
];

export const TRANSACTION_TYPES: {
  value: TransactionType;
  label: string;
  description: string;
}[] = [
  { value: 'charge', label: 'Charge', description: 'Customer payment' },
  { value: 'refund', label: 'Refund', description: 'Order refund' },
  { value: 'chargeback', label: 'Chargeback', description: 'Disputed charge' },
  { value: 'sales_tax', label: 'Sales Tax', description: 'Marketplace sales tax' },
  { value: 'fee', label: 'Fee', description: 'Platform or processing fee' },
  { value: 'adjustment', label: 'Adjustment', description: 'Manual adjustment' },
];

export const PAYMENT_METHODS: {
  value: PaymentMethod;
  label: string;
}[] = [
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'amex', label: 'American Express' },
  { value: 'discover', label: 'Discover' },
  { value: 'shop_pay', label: 'Shop Pay' },
  { value: 'cash', label: 'Cash' },
  { value: 'other', label: 'Other' },
];

export const FINANCE_DATE_RANGES = [
  { label: 'All', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'this_week' },
  { label: 'This month', value: 'this_month' },
  { label: 'Last month', value: 'last_month' },
  { label: 'This quarter', value: 'this_quarter' },
  { label: 'This year', value: 'this_year' },
  { label: 'Custom', value: 'custom' },
];

// Platform fee configuration
export const PLATFORM_FEE_PERCENTAGE = 0.10; // 10% platform fee
export const PROCESSING_FEE_PERCENTAGE = 0.029; // 2.9% per transaction
export const PROCESSING_FEE_FIXED = 0.30; // $0.30 per transaction

// Payout schedule
export const PAYOUT_SCHEDULE = {
  frequency: 'weekly', // 'daily' | 'weekly' | 'monthly'
  dayOfWeek: 1, // Monday = 1
  minimumAmount: 25.00, // Minimum payout amount
  holdPeriod: 7, // Days to hold funds
};

// Format currency
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Get payout status config
export function getPayoutStatusConfig(status: PayoutStatus) {
  return PAYOUT_STATUSES.find(s => s.value === status) || PAYOUT_STATUSES[0];
}

// Get transaction type config
export function getTransactionTypeConfig(type: TransactionType) {
  return TRANSACTION_TYPES.find(t => t.value === type) || TRANSACTION_TYPES[0];
}

// Get payment method config
export function getPaymentMethodConfig(method: PaymentMethod) {
  return PAYMENT_METHODS.find(m => m.value === method) || PAYMENT_METHODS[PAYMENT_METHODS.length - 1];
}
