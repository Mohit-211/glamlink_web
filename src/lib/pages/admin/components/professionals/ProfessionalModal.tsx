"use client";

import { useState, useRef, useCallback } from 'react';
import { Professional } from '@/lib/pages/for-professionals/types/professional';
import {
  getProfessionalFieldsForModalType,
  getDefaultProfessionalValues,
  professionalModalTabs,
  professionalPreviewComponents
} from "@/lib/pages/admin/config/fields";
import { FormModal } from "../shared/editing";
import type { OnFieldChangeCallback } from "../shared/editing/types";
import { ProfessionalPreviewContainer } from "./preview";
import CreateUserModal from "./CreateUserModal";
import { Download, Upload, Check, AlertCircle, UserPlus } from 'lucide-react';

interface ProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Professional) => Promise<void>;
  initialData?: Partial<Professional>;
  title: string;
  onFieldChange?: OnFieldChangeCallback<Professional>;
  isSaving?: boolean;
}

/**
 * ProfessionalModal - Uses the refactored form system
 *
 * This version:
 * - Uses the new FormModal from editing
 * - No focus loss issues
 * - Efficient rendering
 * - JSON Export/Import functionality for pushing professionals live
 */
export default function ProfessionalModalRefactored({
  isOpen,
  onClose,
  onSave,
  initialData,
  title,
  onFieldChange,
  isSaving = false,
}: ProfessionalModalProps) {
  // Get filtered fields based on modal type
  const modalType = initialData?.modalType || 'standard';
  const fields = getProfessionalFieldsForModalType(modalType);

  // JSON Import state
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create User Modal state
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  /**
   * Handle newly created user - update Profile Owner (ownerId) field
   */
  const handleUserCreated = useCallback((user: { uid: string; email: string; displayName: string }) => {
    // Update the ownerId field in the form
    if (onFieldChange) {
      onFieldChange('ownerId', user.uid, { ...initialData, ownerId: user.uid }, () => {});
    }
  }, [onFieldChange, initialData]);

  /**
   * Handle field changes - pass through to external handler
   */
  const handleFieldChange: OnFieldChangeCallback<Professional> = useCallback((
    name,
    value,
    data,
    updateFields
  ) => {
    // Call external handler if provided
    if (onFieldChange) {
      onFieldChange(name, value, data, updateFields);
    }
  }, [onFieldChange]);

  /**
   * Export professional data as JSON file
   */
  const handleExportJSON = useCallback(() => {
    if (!initialData?.id) {
      alert('Please save the professional first before exporting.');
      return;
    }

    // Create a clean export object (remove internal/computed fields)
    const exportData = {
      ...initialData,
      // Ensure we have all the important fields
      id: initialData.id,
      name: initialData.name,
      title: initialData.title,
      specialty: initialData.specialty,
      customHandle: initialData.customHandle,
      cardUrl: initialData.cardUrl,
      // Don't include timestamps in export - they'll be regenerated
      createdAt: undefined,
      updatedAt: undefined,
    };

    // Clean up undefined values
    const cleanedData = JSON.parse(JSON.stringify(exportData));

    const json = JSON.stringify(cleanedData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Generate filename from professional name
    const safeName = (initialData.name || 'professional')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const link = document.createElement('a');
    link.download = `${safeName}.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [initialData]);

  /**
   * Handle JSON file import
   */
  const handleImportJSON = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(false);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Validate required fields
      const requiredFields = ['name', 'title', 'specialty'];
      const missingFields = requiredFields.filter(field => !data[field]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Ensure certificationLevel is valid
      const validLevels = ['Bronze', 'Silver', 'Gold', 'Platinum'];
      if (data.certificationLevel && !validLevels.includes(data.certificationLevel)) {
        data.certificationLevel = 'Bronze';
      }

      // Merge with existing data (preserve ID if editing)
      const mergedData: Professional = {
        ...data,
        id: initialData?.id || data.id || `professional-${Date.now()}`,
        certificationLevel: data.certificationLevel || 'Bronze',
        yearsExperience: data.yearsExperience || 0,
      };

      // Save the imported data
      await onSave(mergedData);
      setImportSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setImportSuccess(false), 3000);

    } catch (err) {
      console.error('Error importing JSON:', err);
      setImportError(err instanceof Error ? err.message : 'Failed to import JSON file');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [initialData, onSave]);

  /**
   * Trigger file input click
   */
  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Enhanced save handler with professional-specific logic
  const handleSave = async (data: any): Promise<void> => {
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
      id: initialData?.id || `professional-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Condensed card config is the single source of truth
      condensedCardConfig: data.condensedCardConfig,
    };

    await onSave(professionalData);
  };

  // Default data with professional-specific defaults
  const defaultData: Partial<Professional> = {
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
    ...initialData
  };

  // Custom action bar for JSON Export/Import
  const customActionBar = (
    <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-4">
      {/* Hidden file input for JSON import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportJSON}
        className="hidden"
      />

      {/* Export JSON button */}
      <button
        type="button"
        onClick={handleExportJSON}
        disabled={!initialData?.id}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title={initialData?.id ? "Export professional data as JSON" : "Save professional first to export"}
      >
        <Download className="w-4 h-4" />
        Save Professional
      </button>

      {/* Import JSON button */}
      <button
        type="button"
        onClick={handleImportClick}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        title="Import professional data from JSON file"
      >
        <Upload className="w-4 h-4" />
        Update Professional
      </button>

      {/* Create User button */}
      <button
        type="button"
        onClick={() => setShowCreateUserModal(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-glamlink-teal text-white rounded-md hover:bg-glamlink-teal/90 transition-colors"
        title="Create a new user account and assign as Profile Owner"
      >
        <UserPlus className="w-4 h-4" />
        Create User
      </button>

      {/* Status messages */}
      {importSuccess && (
        <span className="inline-flex items-center gap-1 text-sm text-green-600">
          <Check className="w-4 h-4" />
          Imported successfully!
        </span>
      )}

      {importError && (
        <span className="inline-flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          {importError}
        </span>
      )}
    </div>
  );

  return (
    <>
      <FormModal<Professional>
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        initialData={defaultData}
        fields={fields}
        onSave={handleSave}
        onFieldChange={handleFieldChange}
        showTabs={true}
        customTabs={professionalModalTabs}
        previewComponents={professionalPreviewComponents}
        PreviewContainer={ProfessionalPreviewContainer}
        saveButtonText="Save Professional"
        size="2xl"
        isSaving={isSaving}
        customActionBar={customActionBar}
      />

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onUserCreated={handleUserCreated}
        initialDisplayName={initialData?.name || ''}
        initialEmail={initialData?.email || ''}
      />
    </>
  );
}
