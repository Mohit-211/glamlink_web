'use client';

import React, { useState, useMemo } from 'react';
import { useFormContext } from '@/lib/pages/admin/components/shared/editing/form/FormProvider';
import type { ProfessionalPreviewComponent } from '@/lib/pages/admin/config/professionalPreviewComponents';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import { RefreshIcon } from '@/lib/pages/admin/components/shared/common';
import { DEFAULT_SECTIONS_CONFIG } from '@/lib/pages/admin/config/sectionsRegistry';

interface ProfessionalPreviewContainerProps {
  previewComponents: ProfessionalPreviewComponent[];
}

/**
 * ProfessionalPreviewContainer - Manages professional preview rendering with live form data
 *
 * Key features:
 * - Dropdown to select preview type (Professional Card, Digital Business Card)
 * - Real-time updates via useFormContext()
 * - Transforms Partial<Professional> data for preview components
 * - Refresh button to force re-render
 * - Displays message if no preview components configured
 */
export default function ProfessionalPreviewContainer({ previewComponents }: ProfessionalPreviewContainerProps) {
  const { formData } = useFormContext<Partial<Professional>>();
  const [selectedPreviewId, setSelectedPreviewId] = useState<string>(
    previewComponents[0]?.id || ''
  );
  const [refreshKey, setRefreshKey] = useState(0);

  // Transform form data to Professional structure with defaults
  const transformedProfessional = useMemo<Partial<Professional>>(() => {
    return {
      // Core fields
      id: formData.id || 'preview',
      name: formData.name || 'Professional Name',
      title: formData.title || 'Beauty Professional',
      specialty: formData.specialty || 'General',
      location: formData.location || formData.locationData?.address || 'Location',
      certificationLevel: formData.certificationLevel || 'Silver',
      yearsExperience: formData.yearsExperience ?? 5,

      // Status flags
      instagram: formData.instagram,
      isFounder: formData.isFounder ?? false,
      hasDigitalCard: formData.hasDigitalCard ?? true,
      featured: formData.featured ?? false,

      // Media
      profileImage: formData.profileImage,
      portraitImage: formData.portraitImage,
      image: formData.image,
      gallery: formData.gallery,

      // Content
      bio: formData.bio,
      description: formData.description,

      // Services & promotions
      services: formData.services || [],
      specialties: formData.specialties,
      promotions: formData.promotions,

      // Contact
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      bookingUrl: formData.bookingUrl,

      // Location (both legacy single and new multi-location array)
      locationData: formData.locationData,
      locations: formData.locations,

      // Social
      enhancedSocialLinks: formData.enhancedSocialLinks,

      // Business
      business_name: formData.business_name,
      businessHours: formData.businessHours,
      tags: formData.tags,

      // Ratings
      rating: formData.rating,
      reviewCount: formData.reviewCount,

      // Section configuration (use defaults if empty)
      sectionsConfig: formData.sectionsConfig?.length
        ? formData.sectionsConfig
        : DEFAULT_SECTIONS_CONFIG,
    };
  }, [formData, refreshKey]);

  // Find selected preview component
  const selectedPreview = previewComponents.find(p => p.id === selectedPreviewId);

  // Handle refresh button
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // No preview components configured
  if (!previewComponents || previewComponents.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500 text-sm">No preview components configured</p>
      </div>
    );
  }

  // No preview selected
  if (!selectedPreview) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500 text-sm">Select a preview type</p>
      </div>
    );
  }

  const PreviewComponent = selectedPreview.component;

  return (
    <div className="space-y-4">
      {/* Preview Controls */}
      <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
        <label htmlFor="preview-select" className="text-sm font-medium text-gray-700">
          Preview:
        </label>
        <select
          id="preview-select"
          value={selectedPreviewId}
          onChange={(e) => setSelectedPreviewId(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {previewComponents.map((preview) => (
            <option key={preview.id} value={preview.id}>
              {preview.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleRefresh}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          title="Refresh preview"
        >
          <RefreshIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Preview Content */}
      <div className="bg-gray-50 rounded-lg overflow-auto max-h-[calc(90vh-16rem)]">
        <PreviewComponent key={refreshKey} professional={transformedProfessional} />
      </div>
    </div>
  );
}
