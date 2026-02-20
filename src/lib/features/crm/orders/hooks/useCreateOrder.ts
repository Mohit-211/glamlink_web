/**
 * useCreateOrder Hook
 *
 * Manages form state and logic for creating new orders
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type {
  OrderItem,
  Address,
  OrderChannel,
  PaymentStatus,
  DeliveryMethod,
} from '../types';

/**
 * Draft Order State
 */
export interface DraftOrder {
  // Customer
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;

  // Items
  items: OrderItem[];

  // Pricing
  subtotal: number;
  tax: number;
  taxRate: number; // percentage
  shipping: number;
  discount: number;
  total: number;

  // Payment
  paymentStatus: PaymentStatus;
  paymentMethod?: string;

  // Delivery
  deliveryMethod: DeliveryMethod;
  shippingAddress?: Address;
  billingAddress?: Address;
  sameAsShipping: boolean;

  // Metadata
  channel: OrderChannel;
  tags: string[];
  notes?: string;
}

/**
 * Hook Return Type
 */
export interface UseCreateOrderReturn {
  // Draft State
  draft: DraftOrder;
  isDirty: boolean;
  lastSaved: Date | null;

  // Actions
  updateCustomer: (data: Partial<Pick<DraftOrder, 'customerId' | 'customerName' | 'customerEmail' | 'customerPhone'>>) => void;
  addItem: (item: OrderItem) => void;
  updateItem: (index: number, updates: Partial<OrderItem>) => void;
  removeItem: (index: number) => void;
  updatePricing: (updates: Partial<Pick<DraftOrder, 'taxRate' | 'shipping' | 'discount'>>) => void;
  updatePayment: (updates: Partial<Pick<DraftOrder, 'paymentStatus' | 'paymentMethod'>>) => void;
  updateDelivery: (updates: Partial<Pick<DraftOrder, 'deliveryMethod' | 'shippingAddress' | 'billingAddress' | 'sameAsShipping'>>) => void;
  updateMetadata: (updates: Partial<Pick<DraftOrder, 'channel' | 'tags' | 'notes'>>) => void;

  // Form Actions
  saveDraft: () => void;
  loadDraft: () => void;
  clearDraft: () => void;
  submitOrder: () => Promise<void>;

  // Status
  isSubmitting: boolean;
  error: string | null;
  validationErrors: Record<string, string>;
}

/**
 * Initial Draft State
 */
const initialDraft: DraftOrder = {
  customerName: '',
  customerEmail: '',
  items: [],
  subtotal: 0,
  tax: 0,
  taxRate: 8.5, // Default 8.5%
  shipping: 0,
  discount: 0,
  total: 0,
  paymentStatus: 'pending',
  deliveryMethod: 'shipping',
  sameAsShipping: true,
  channel: 'online_store',
  tags: [],
};

/**
 * Local Storage Key
 */
const DRAFT_STORAGE_KEY = 'glamlink-order-draft';

/**
 * Calculate totals
 */
function calculateTotals(draft: DraftOrder): Pick<DraftOrder, 'subtotal' | 'tax' | 'total'> {
  const subtotal = draft.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * (draft.taxRate / 100);
  const total = subtotal + tax + draft.shipping - draft.discount;

  return {
    subtotal,
    tax,
    total: Math.max(0, total), // Prevent negative totals
  };
}

/**
 * Validate draft
 */
function validateDraft(draft: DraftOrder): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!draft.customerName.trim()) {
    errors.customerName = 'Customer name is required';
  }

  if (!draft.customerEmail.trim()) {
    errors.customerEmail = 'Customer email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.customerEmail)) {
    errors.customerEmail = 'Invalid email format';
  }

  if (draft.items.length === 0) {
    errors.items = 'At least one item is required';
  }

  if (draft.deliveryMethod === 'shipping' && !draft.shippingAddress) {
    errors.shippingAddress = 'Shipping address is required';
  }

  if (draft.paymentStatus === 'paid' && !draft.paymentMethod) {
    errors.paymentMethod = 'Payment method is required when status is paid';
  }

  return errors;
}

/**
 * useCreateOrder Hook
 */
export function useCreateOrder(): UseCreateOrderReturn {
  const router = useRouter();
  const [draft, setDraft] = useState<DraftOrder>(initialDraft);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Auto-save timer
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Update draft and mark as dirty
   */
  const updateDraft = useCallback((updates: Partial<DraftOrder>) => {
    setDraft((prev) => {
      const updated = { ...prev, ...updates };
      const totals = calculateTotals(updated);
      return { ...updated, ...totals };
    });
    setIsDirty(true);
  }, []);

  /**
   * Customer actions
   */
  const updateCustomer = useCallback(
    (data: Partial<Pick<DraftOrder, 'customerId' | 'customerName' | 'customerEmail' | 'customerPhone'>>) => {
      updateDraft(data);
    },
    [updateDraft]
  );

  /**
   * Item actions
   */
  const addItem = useCallback(
    (item: OrderItem) => {
      setDraft((prev) => {
        const items = [...prev.items, item];
        const updated = { ...prev, items };
        const totals = calculateTotals(updated);
        return { ...updated, ...totals };
      });
      setIsDirty(true);
    },
    []
  );

  const updateItem = useCallback((index: number, updates: Partial<OrderItem>) => {
    setDraft((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], ...updates };
      const updated = { ...prev, items };
      const totals = calculateTotals(updated);
      return { ...updated, ...totals };
    });
    setIsDirty(true);
  }, []);

  const removeItem = useCallback((index: number) => {
    setDraft((prev) => {
      const items = prev.items.filter((_, i) => i !== index);
      const updated = { ...prev, items };
      const totals = calculateTotals(updated);
      return { ...updated, ...totals };
    });
    setIsDirty(true);
  }, []);

  /**
   * Pricing actions
   */
  const updatePricing = useCallback(
    (updates: Partial<Pick<DraftOrder, 'taxRate' | 'shipping' | 'discount'>>) => {
      updateDraft(updates);
    },
    [updateDraft]
  );

  /**
   * Payment actions
   */
  const updatePayment = useCallback(
    (updates: Partial<Pick<DraftOrder, 'paymentStatus' | 'paymentMethod'>>) => {
      updateDraft(updates);
    },
    [updateDraft]
  );

  /**
   * Delivery actions
   */
  const updateDelivery = useCallback(
    (updates: Partial<Pick<DraftOrder, 'deliveryMethod' | 'shippingAddress' | 'billingAddress' | 'sameAsShipping'>>) => {
      // If sameAsShipping is true, copy shipping to billing
      if (updates.sameAsShipping && draft.shippingAddress) {
        updates.billingAddress = draft.shippingAddress;
      }
      updateDraft(updates);
    },
    [updateDraft, draft.shippingAddress]
  );

  /**
   * Metadata actions
   */
  const updateMetadata = useCallback(
    (updates: Partial<Pick<DraftOrder, 'channel' | 'tags' | 'notes'>>) => {
      updateDraft(updates);
    },
    [updateDraft]
  );

  /**
   * Save draft to localStorage
   */
  const saveDraft = useCallback(() => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      setLastSaved(new Date());
      setIsDirty(false);
    } catch (err) {
      console.error('Failed to save draft:', err);
    }
  }, [draft]);

  /**
   * Load draft from localStorage
   */
  const loadDraft = useCallback(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setDraft(parsed);
        setIsDirty(false);
        setLastSaved(new Date());
      }
    } catch (err) {
      console.error('Failed to load draft:', err);
    }
  }, []);

  /**
   * Clear draft
   */
  const clearDraft = useCallback(() => {
    setDraft(initialDraft);
    setIsDirty(false);
    setLastSaved(null);
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  }, []);

  /**
   * Submit order
   */
  const submitOrder = useCallback(async () => {
    setError(null);
    setValidationErrors({});

    // Validate
    const errors = validateDraft(draft);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please fix validation errors');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to API
      const response = await fetch('/api/crm/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(draft),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create order');
      }

      // Success - clear draft and redirect
      clearDraft();
      router.push(`/admin/crm/orders/${result.data.id}`);
    } catch (err) {
      console.error('Submit error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  }, [draft, clearDraft, router]);

  /**
   * Auto-save effect
   */
  useEffect(() => {
    if (isDirty) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer (30 seconds)
      autoSaveTimerRef.current = setTimeout(() => {
        saveDraft();
      }, 30000);
    }

    // Cleanup
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [isDirty, saveDraft]);

  /**
   * Load draft on mount
   */
  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  return {
    draft,
    isDirty,
    lastSaved,
    updateCustomer,
    addItem,
    updateItem,
    removeItem,
    updatePricing,
    updatePayment,
    updateDelivery,
    updateMetadata,
    saveDraft,
    loadDraft,
    clearDraft,
    submitOrder,
    isSubmitting,
    error,
    validationErrors,
  };
}

export default useCreateOrder;
