"use client";

import { PromoItem } from "@/lib/features/promos/config";
import { getPromoFieldsForModalType, getDefaultPromoValues } from "@/lib/pages/admin/config/fields";
import { FormModal } from "../shared/editing";

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PromoItem) => Promise<void>;
  initialData?: Partial<PromoItem>;
  title: string;
  onFieldChange?: (fieldName: string, value: any, data: Partial<PromoItem>) => void;
}

/**
 * PromoModal - Uses the refactored form system
 *
 * This version:
 * - Uses the new FormModal from editing
 * - No focus loss issues
 * - Efficient rendering
 * - Follows ProfessionalModal pattern
 */
export default function PromoModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  title,
  onFieldChange
}: PromoModalProps) {
  // Get filtered fields based on modal type
  const modalType = initialData?.modalType || 'standard';
  const fields = getPromoFieldsForModalType(modalType);

  // Enhanced save handler with promo-specific logic
  const handleSave = async (data: any): Promise<void> => {
    const promoData: PromoItem = {
      ...data,
      id: initialData?.id || `promo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      modalType: data.modalType || 'standard',
      customModalId: data.customModalId || '',
      title: data.title!,
      link: data.link!,
      ctaText: data.ctaText!,
      startDate: data.startDate!,
      endDate: data.endDate!,
      description: data.description || "",
      image: data.image || "",
      popupDisplay: data.popupDisplay || "Special Offer",
      visible: data.visible ?? true,
      featured: data.featured ?? false,
      priority: data.priority ?? 5,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await onSave(promoData);
  };

  // Merge default values with initial data
  const defaultData: Partial<PromoItem> = {
    ...getDefaultPromoValues(),
    ...initialData
  };

  return (
    <FormModal<PromoItem>
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      initialData={defaultData}
      fields={fields}
      onSave={handleSave}
      onFieldChange={onFieldChange}
      showTabs={true}
      saveButtonText="Save Promo"
      size="2xl"
    />
  );
}