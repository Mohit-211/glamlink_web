import type { Order, AccessCard, Address } from './types';

export const ORDERS: Order[] = [
  { id: '#ORD-001', date: '2024-01-15', amount: 299.99, status: 'completed', description: 'Premium Membership (12 months)' },
  { id: '#ORD-002', date: '2024-01-10', amount: 49.99,  status: 'completed', description: 'GlamCard Pro Bundle' },
  { id: '#ORD-003', date: '2024-01-05', amount: 150.00, status: 'pending',   description: 'Professional Photoshoot Package' },
  { id: '#ORD-004', date: '2023-12-28', amount: 79.99,  status: 'completed', description: 'Digital Magazine Subscription' },
];

export const CARDS: AccessCard[] = [
  { id: 'card-1', lastFour: '4242', brand: 'Visa',       expiryMonth: 12, expiryYear: 2025, isDefault: true  },
  { id: 'card-2', lastFour: '5555', brand: 'Mastercard', expiryMonth: 8,  expiryYear: 2026, isDefault: false },
];

export const ADDRESSES: Address[] = [];

export const CARD_GRADIENTS: Record<string, string> = {
  Visa:       'from-[#1a1f71] to-[#2563eb]',
  Mastercard: 'from-[#eb001b] to-[#f79e1b]',
  Amex:       'from-[#007b5e] to-[#00b388]',
};
