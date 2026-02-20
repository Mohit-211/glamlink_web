'use client';

import { useState, useMemo, useCallback, ComponentType } from 'react';
import { useFormContext } from '@/lib/pages/admin/components/shared/editing/form/FormProvider';
import type { Professional, ProfessionalSectionConfig } from '@/lib/pages/for-professionals/types/professional';
import { DEFAULT_SECTIONS_CONFIG } from '@/lib/pages/admin/config/sectionsRegistry';

// =============================================================================
// TYPES (moved from types.ts)
// =============================================================================

// Re-export types from professionalPreviewComponents.ts for convenience
export type {
  ProfessionalPreviewComponentProps,
  ProfessionalPreviewComponent,
} from '@/lib/pages/admin/config/professionalPreviewComponents';

// Import for internal use
import type { ProfessionalPreviewComponent } from '@/lib/pages/admin/config/professionalPreviewComponents';

/**
 * Configuration for a single DBC section in the preview
 * Used by DigitalBusinessCardPreview to render sections dynamically
 */
export interface SectionConfig {
  /** Unique section identifier */
  id: string;
  /** Human-readable label */
  label: string;
  /** React component to render for this section */
  component: ComponentType<{ professional: Professional }>;
  /** Additional props to pass to the component */
  props?: Record<string, any>;
  /** Tailwind CSS class for the container */
  containerClassName?: string;
}

/**
 * Props for ProfessionalPreviewContainer component
 */
export interface ProfessionalPreviewContainerProps {
  previewComponents: Array<{
    id: string;
    label: string;
    component: ComponentType<{ professional: Partial<Professional> }>;
  }>;
}

/**
 * Progress tracking for preprocessing steps
 */
export interface PreprocessingProgress {
  current: number;
  total: number;
}

/**
 * Default values for professional data when creating previews
 * Used to ensure all required fields have fallback values
 */
export interface ProfessionalDefaults {
  id: string;
  name: string;
  title: string;
  specialty: string;
  location: string;
  certificationLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  yearsExperience: number;
  isFounder: boolean;
  hasDigitalCard: boolean;
  featured: boolean;
}

/**
 * The default values used when transforming partial professional data
 */
export const DEFAULT_PROFESSIONAL_PREVIEW_VALUES: ProfessionalDefaults = {
  id: 'preview',
  name: 'Professional Name',
  title: 'Beauty Professional',
  specialty: 'General',
  location: 'Location',
  certificationLevel: 'Silver',
  yearsExperience: 5,
  isFounder: false,
  hasDigitalCard: true,
  featured: false,
};

// =============================================================================
// HOOK TYPES
// =============================================================================

export interface UseDigitalBusinessCardPreviewReturn {
  // Transformed data
  transformedProfessional: Professional;

  // Section configuration
  sectionConfig: ProfessionalSectionConfig[];
  effectiveSections: SectionConfig[];

  // Media
  videoItem: { type: string; url: string; thumbnail?: string } | null;
}

export interface UseProfessionalPreviewContainerReturn {
  selectedPreviewId: string;
  setSelectedPreviewId: (id: string) => void;
  refreshKey: number;
  transformedProfessional: Partial<Professional>;
  selectedPreview: ProfessionalPreviewComponent | undefined;
  PreviewComponent: React.ComponentType<{ professional: Partial<Professional>; onProfessionalUpdate?: (updated: Partial<Professional>) => void }> | undefined;
  handleRefresh: () => void;
  handleProfessionalUpdate: (updated: Partial<Professional>) => void;
}

// =============================================================================
// IMPORTS FROM TRANSFORMERS
// =============================================================================

// Import transform functions from separate file
import {
  transformProfessionalWithDefaults,
  transformFormDataForPreview,
  getAllSectionConfigs,
} from './transformers';

// =============================================================================
// HOOKS
// =============================================================================

/**
 * useDigitalBusinessCardPreview - Hook for managing DBC preview data transformations
 *
 * Features:
 * - Transforms partial professional data to complete structure
 * - Respects sectionsConfig for section ordering and visibility
 * - Provides effective sections based on configuration
 * - Handles video item extraction from gallery
 */
export function useDigitalBusinessCardPreview(
  professional: Partial<Professional>
): UseDigitalBusinessCardPreviewReturn {
  // Transform partial professional data to complete structure with defaults
  const transformedProfessional = useMemo<Professional>(() => {
    return transformProfessionalWithDefaults(professional);
  }, [professional]);

  // Get section configuration (use defaults if not provided)
  const sectionConfig = useMemo(() => {
    return transformedProfessional.sectionsConfig?.length
      ? transformedProfessional.sectionsConfig
      : DEFAULT_SECTIONS_CONFIG;
  }, [transformedProfessional.sectionsConfig]);

  // Get sub-sections config for SignatureWorkAndActions
  const signatureWorkSubSections = useMemo(() => {
    const swConfig = sectionConfig.find(s => s.id === 'signature-work-actions');
    return swConfig?.subSections;
  }, [sectionConfig]);

  // Find video from gallery
  const videoItem = useMemo(() => {
    return transformedProfessional.gallery?.find(item => item.type === 'video') || null;
  }, [transformedProfessional.gallery]);

  // Get effective sections based on configuration
  const effectiveSections = useMemo(() => {
    const allSections = getAllSectionConfigs(videoItem, signatureWorkSubSections);

    // Filter visible sections and sort by order
    const visibleSectionIds = sectionConfig
      .filter(c => c.visible)
      .sort((a, b) => (a.desktopOrder ?? 0) - (b.desktopOrder ?? 0))
      .map(c => c.id);

    // Return sections in configured order
    return visibleSectionIds
      .map(id => allSections.find(s => s.id === id))
      .filter((s): s is SectionConfig => s !== undefined);
  }, [sectionConfig, videoItem, signatureWorkSubSections]);

  return {
    transformedProfessional,
    sectionConfig,
    effectiveSections,
    videoItem,
  };
}

/**
 * useProfessionalPreviewContainer - Hook for managing preview container state
 *
 * Features:
 * - Manages selected preview type dropdown state
 * - Transforms form data for preview components
 * - Provides refresh functionality
 * - Supports updating professional data from preview components
 */
export function useProfessionalPreviewContainer(
  previewComponents: ProfessionalPreviewComponent[]
): UseProfessionalPreviewContainerReturn {
  const { formData, updateFields } = useFormContext<Partial<Professional>>();
  const [selectedPreviewId, setSelectedPreviewId] = useState<string>(
    previewComponents[0]?.id || ''
  );
  const [refreshKey, setRefreshKey] = useState(0);

  // Transform form data to Professional structure with defaults
  const transformedProfessional = useMemo<Partial<Professional>>(() => {
    return transformFormDataForPreview(formData);
  }, [formData, refreshKey]);

  // Find selected preview component
  const selectedPreview = previewComponents.find(p => p.id === selectedPreviewId);

  // Get the component
  const PreviewComponent = selectedPreview?.component;

  // Handle refresh button
  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // Handle professional update from preview components (e.g., when default image is saved)
  const handleProfessionalUpdate = useCallback((updated: Partial<Professional>) => {
    updateFields(updated);
    // Trigger a refresh to update the preview
    setRefreshKey(prev => prev + 1);
  }, [updateFields]);

  return {
    selectedPreviewId,
    setSelectedPreviewId,
    refreshKey,
    transformedProfessional,
    selectedPreview,
    PreviewComponent,
    handleRefresh,
    handleProfessionalUpdate,
  };
}
