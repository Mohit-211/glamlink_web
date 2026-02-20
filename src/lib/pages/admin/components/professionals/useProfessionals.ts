'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Professional } from '@/lib/pages/for-professionals/types/professional';
import {
  professionalEditFields,
  getProfessionalFieldsForModalType,
  getDefaultProfessionalValues
} from '@/lib/pages/admin/config/fields';

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Extract city and state from a full address string or locationData
 * Example: "1770 N Green Valley Pkwy, Henderson, NV 89074, USA" -> "Henderson, NV"
 */
export function getShortLocation(professional: Professional): string {
  // First, check if locationData has city and state
  if (professional.locationData) {
    const { city, state } = professional.locationData;
    if (city && state) {
      return `${city}, ${state}`;
    }
    if (city) return city;
    if (state) return state;
  }

  // If no locationData, try to parse the location string
  const location = professional.location;
  if (!location) return '';

  // Common US address format: "Street, City, State ZIP, Country"
  const parts = location.split(',').map(p => p.trim());

  if (parts.length >= 3) {
    const city = parts[1];
    const stateZipPart = parts[2];
    const stateMatch = stateZipPart.match(/^([A-Z]{2})\s*\d*/);
    if (stateMatch) {
      return `${city}, ${stateMatch[1]}`;
    }
    return city;
  } else if (parts.length === 2) {
    return location;
  }

  return location.length > 25 ? location.substring(0, 25) + '...' : location;
}

/**
 * Get Tailwind CSS classes for certification level badge colors
 */
export function getCertificationColor(level: string): string {
  switch (level) {
    case 'Platinum':
      return 'bg-gray-100 text-gray-800';
    case 'Gold':
      return 'bg-yellow-100 text-yellow-800';
    case 'Silver':
      return 'bg-blue-100 text-blue-800';
    case 'Bronze':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// =============================================================================
// DEFAULT DATA
// =============================================================================

/**
 * Get default professional data for creating new professionals
 */
export function getDefaultProfessionalData(): Partial<Professional> {
  return {
    name: "",
    title: "",
    specialty: "",
    location: "",
    locationData: undefined,
    certificationLevel: "Bronze",
    yearsExperience: 0,
    instagram: "",
    email: "",
    phone: "",
    website: "",
    bio: "",
    description: "",
    profileImage: "https://source.unsplash.com/300x300/?beauty,professional",
    salonName: "",
    pricing: {
      consultation: 0,
      standard: 0,
      premium: 0
    },
    bookingUrl: "",
    featured: false,
    isFounder: false,
    rating: 0,
    reviewCount: 0,
  };
}

// =============================================================================
// DATA TRANSFORMATION
// =============================================================================

/**
 * Transform form data to Professional object for saving
 * Handles location data backward compatibility
 */
export function transformProfessionalForSave(
  data: Partial<Professional>,
  existingId?: string
): Professional {
  // Handle location data - create location string for backward compatibility
  let locationString = "";
  if (data.locationData && data.locationData.address) {
    const locationParts = [];
    if (data.locationData.city) locationParts.push(data.locationData.city);
    if (data.locationData.state) locationParts.push(data.locationData.state);
    locationString = locationParts.length > 0 ? locationParts.join(", ") : data.locationData.address;
  } else if (data.location) {
    locationString = data.location;
  }

  // Generate ID for new professionals
  const professionalData: Professional = {
    ...data,
    id: existingId || `professional-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: data.name!,
    title: data.title!,
    specialty: data.specialty!,
    location: locationString,
    locationData: data.locationData || null,
    certificationLevel: (data.certificationLevel as "Bronze" | "Silver" | "Gold" | "Platinum") || "Bronze",
    yearsExperience: data.yearsExperience || 0,
    profileImage: data.profileImage || 'https://source.unsplash.com/300x300/?beauty,professional',
    rating: data.rating || 0,
    reviewCount: data.reviewCount || 0,
    featured: data.featured || false,
    isFounder: data.isFounder || false,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  } as Professional;

  return professionalData;
}

// =============================================================================
// DISPLAY HELPERS
// =============================================================================

/**
 * Transform professionals data for table display with shortened locations
 */
export function transformProfessionalsForDisplay(professionals: Professional[]): Professional[] {
  return professionals.map(pro => ({
    ...pro,
    location: getShortLocation(pro)
  }));
}

// =============================================================================
// HOOK: useProfessionalsTab
// =============================================================================

export interface UseProfessionalsTabReturn {
  // Modal UI State
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  editingProfessional: Professional | null;
  setEditingProfessional: (professional: Professional | null) => void;
  showBatchUpload: boolean;
  setShowBatchUpload: (show: boolean) => void;

  // Modal Type Management
  currentModalType: string;
  filteredFields: typeof professionalEditFields;
  handleModalTypeChange: (fieldName: string, value: any) => void;
}

/**
 * Hook for managing ProfessionalsTab UI state
 * Handles modal visibility and modal type field filtering
 */
export function useProfessionalsTab(): UseProfessionalsTabReturn {
  // UI state (modals)
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [showBatchUpload, setShowBatchUpload] = useState(false);

  // Modal type management (unique to professionals - UI concern)
  const [currentModalType, setCurrentModalType] = useState<string>('standard');
  const [filteredFields, setFilteredFields] = useState(professionalEditFields);

  // Modal type management useEffect
  useEffect(() => {
    if (showAddForm || editingProfessional) {
      const modalType = editingProfessional?.modalType || 'standard';
      setCurrentModalType(modalType);
      setFilteredFields(getProfessionalFieldsForModalType(modalType));
    }
  }, [showAddForm, editingProfessional]);

  // Handle modal type change
  const handleModalTypeChange = useCallback((fieldName: string, value: any) => {
    if (fieldName === 'modalType') {
      setCurrentModalType(value);
      setFilteredFields(getProfessionalFieldsForModalType(value));
    }
  }, []);

  return {
    showAddForm,
    setShowAddForm,
    editingProfessional,
    setEditingProfessional,
    showBatchUpload,
    setShowBatchUpload,
    currentModalType,
    filteredFields,
    handleModalTypeChange,
  };
}

// =============================================================================
// HOOK: useProfessionalModal
// =============================================================================

export interface UseProfessionalModalReturn {
  // Computed values
  modalType: string;
  fields: typeof professionalEditFields;
  defaultData: Partial<Professional>;

  // Save handler
  handleSave: (data: any, existingId?: string) => Promise<Professional>;
}

/**
 * Hook for managing ProfessionalModal form state
 */
export function useProfessionalModal(
  initialData?: Partial<Professional>,
  onSave?: (data: Professional) => Promise<void>
): UseProfessionalModalReturn {
  // Get filtered fields based on modal type
  const modalType = initialData?.modalType || 'standard';
  const fields = useMemo(() => getProfessionalFieldsForModalType(modalType), [modalType]);

  // Default data with professional-specific defaults
  const defaultData = useMemo<Partial<Professional>>(() => ({
    ...getDefaultProfessionalData(),
    ...initialData
  }), [initialData]);

  // Enhanced save handler with professional-specific logic
  const handleSave = useCallback(async (data: any, existingId?: string): Promise<Professional> => {
    const professionalData = transformProfessionalForSave(data, existingId || initialData?.id);

    if (onSave) {
      await onSave(professionalData);
    }

    return professionalData;
  }, [initialData?.id, onSave]);

  return {
    modalType,
    fields,
    defaultData,
    handleSave,
  };
}
