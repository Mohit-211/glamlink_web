"use client";

import { useState, useEffect, useCallback } from "react";

// Simplified Promotion interface aligned with professional.ts
interface Promotion {
  id: string;
  title: string;
  description?: string;
  html?: string;
  value?: string;
  promoCode?: string;
  startDate?: string;
  endDate?: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt?: string;
}

interface UsePromotionFieldProps {
  value: Promotion[];
  fieldName: string;
  onChange: (fieldName: string, value: Promotion[]) => void;
}

export interface UsePromotionFieldReturn {
  // State
  promotions: Promotion[];
  showAddForm: boolean;
  editingId: string | null;
  formData: Partial<Promotion>;

  // Setters
  setShowAddForm: (show: boolean) => void;
  setFormData: (data: Partial<Promotion>) => void;

  // Handlers
  handleAddPromotion: () => void;
  handleEdit: (promotion: Promotion) => void;
  handleDelete: (id: string) => void;
  handleCancel: () => void;
  resetForm: () => void;
}

const defaultFormData: Partial<Promotion> = {
  title: '',
  html: '',
  value: '',
  promoCode: '',
  startDate: '',
  endDate: '',
  isFeatured: false,
  isActive: true
};

export function usePromotionField({
  value,
  fieldName,
  onChange,
}: UsePromotionFieldProps): UsePromotionFieldReturn {
  const [promotions, setPromotions] = useState<Promotion[]>(value || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Promotion>>(defaultFormData);

  // Sync local state with parent value
  useEffect(() => {
    console.log('🔄 Sync effect - value prop length:', value?.length || 0, 'local promotions length:', promotions.length);
    if (JSON.stringify(value) !== JSON.stringify(promotions)) {
      console.log('🔄 Updating local promotions to match value prop');
      setPromotions(value || []);
    }
  }, [value]); // Only depend on value, not promotions to avoid infinite loops

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setEditingId(null);
  }, []);

  const handleAddPromotion = useCallback(() => {
    if (!formData.title?.trim()) return;

    const newPromotion: Promotion = {
      id: editingId || `promo-${Date.now()}`,
      title: formData.title?.trim() || '',
      html: formData.html?.trim(),
      value: formData.value?.trim(),
      promoCode: formData.promoCode?.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      isFeatured: formData.isFeatured || false,
      isActive: formData.isActive !== false,
      createdAt: editingId ? undefined : new Date().toISOString()
    };

    let updatedPromotions: Promotion[];
    if (editingId) {
      // Update existing promotion
      updatedPromotions = promotions.map(p => p.id === editingId ? newPromotion : p);
    } else {
      // Add new promotion
      updatedPromotions = [...promotions, newPromotion];
    }

    // Update local state immediately
    setPromotions(updatedPromotions);

    // Call onChange with the updated promotions
    onChange(fieldName, updatedPromotions);

    resetForm();
    setShowAddForm(false);
  }, [formData, editingId, promotions, fieldName, onChange, resetForm]);

  const handleEdit = useCallback((promotion: Promotion) => {
    setFormData({
      title: promotion.title,
      html: promotion.html,
      value: promotion.value,
      promoCode: promotion.promoCode,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      isFeatured: promotion.isFeatured,
      isActive: promotion.isActive
    });
    setEditingId(promotion.id);
    setShowAddForm(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    console.log('🗑️ Deleting promotion:', id);
    const updatedPromotions = promotions.filter(p => p.id !== id);
    console.log('🗑️ Updated promotions count:', updatedPromotions.length);
    setPromotions(updatedPromotions);
    onChange(fieldName, updatedPromotions);
  }, [promotions, fieldName, onChange]);

  const handleCancel = useCallback(() => {
    resetForm();
    setShowAddForm(false);
  }, [resetForm]);

  return {
    // State
    promotions,
    showAddForm,
    editingId,
    formData,

    // Setters
    setShowAddForm,
    setFormData,

    // Handlers
    handleAddPromotion,
    handleEdit,
    handleDelete,
    handleCancel,
    resetForm,
  };
}

export type { Promotion };
