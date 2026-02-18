"use client";

import { MagazineIssue } from "@/lib/pages/magazine/types/magazine/core";
import { magazineEditFields, getDefaultMagazineValues, issuePreviewComponents } from "@/lib/pages/admin/config/fields";
import { FormModal } from "../shared/editing";
import type { CustomTab } from "../shared/editing/types";

interface MagazineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<MagazineIssue>) => Promise<void>;
  initialData?: Partial<MagazineIssue>;
  title: string;
  onFieldChange?: (fieldName: string, value: any, data: Partial<MagazineIssue>) => void;
  customTabs?: CustomTab[];  // NEW: Support for custom tabs
}

/**
 * MagazineModal - Magazine issue editing modal
 *
 * Uses the refactored form system:
 * - FormModal from editing
 * - No focus loss issues
 * - Efficient rendering
 * - Follows ProfessionalModal/PromoModal pattern
 * - Supports custom tabs (Basic Info, Cover Configuration)
 */
export default function MagazineModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  title,
  onFieldChange,
  customTabs  // NEW: Custom tab configuration
}: MagazineModalProps) {
  // Enhanced save handler with magazine-specific logic
  const handleSave = async (data: any): Promise<void> => {
    // Construct complete magazine issue data
    const magazineData: Partial<MagazineIssue> = {
      ...data,
      id: initialData?.id || data.id,
      urlId: data.urlId || data.id,
      title: data.title!,
      subtitle: data.subtitle || "",
      issueNumber: data.issueNumber!,
      issueDate: data.issueDate!,
      description: data.description || "",
      editorNote: data.editorNote || "",
      publuuLink: data.publuuLink || "",
      featured: data.featured ?? false,
      visible: data.visible ?? true,
      isEmpty: data.isEmpty ?? false,
      sections: initialData?.sections || []
    };

    await onSave(magazineData);
  };

  // Merge default values with initial data
  const defaultData: Partial<MagazineIssue> = {
    ...getDefaultMagazineValues(),
    ...initialData
  };

  return (
    <FormModal<Partial<MagazineIssue>>
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      initialData={defaultData}
      fields={magazineEditFields}  // Fallback if no custom tabs
      onSave={handleSave}
      onFieldChange={onFieldChange}
      showTabs={!!customTabs}  // Enable tabs if custom tabs provided
      customTabs={customTabs}  // Pass custom tabs to FormModal
      previewComponents={issuePreviewComponents}  // NEW: Pass preview components for magazine issues
      saveButtonText="Save Issue"
      size="2xl"
    />
  );
}
