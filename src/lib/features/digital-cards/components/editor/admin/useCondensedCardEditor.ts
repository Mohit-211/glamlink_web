'use client';

/**
 * useCondensedCardEditor - Hook for condensed card editor state management
 *
 * Manages the configuration state and preview generation for the
 * condensed card designer.
 *
 * IMPORTANT: This hook dispatches section changes to Redux for live preview updates.
 * Both Access Card Page and Access Card Image previews read from Redux.
 */

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import type {
  CondensedCardConfig,
  CondensedCardDimensionPreset,
  CondensedCardSectionInstance,
  CondensedCardDimensions,
  CondensedCardStyles,
} from '@/lib/features/digital-cards/types/condensedCardConfig';
import {
  DEFAULT_CONDENSED_CARD_CONFIG,
  getDimensionsForPreset,
  migrateCondensedCardConfig,
  mergeWithDefaultConfig,
} from '@/lib/features/digital-cards/types/condensedCardConfig';
import { SECTION_REGISTRY, getSectionById } from '@/lib/features/digital-cards/config/sectionRegistry';
import { STYLING_SECTION_TYPES, generateSectionInstanceId, setSections, setConfig as setReduxConfig } from '@/lib/features/digital-cards/store';
import { createCondensedCardSection, hasCondensedMapping } from '@/lib/features/digital-cards/utils/sectionMapping';
import { useAppDispatch } from '@/store/hooks';

// =============================================================================
// TYPES
// =============================================================================

export interface UseCondensedCardEditorParams {
  /** Current configuration value */
  initialConfig?: CondensedCardConfig;
  /** Callback when config changes */
  onChange: (config: CondensedCardConfig) => void;
  /** Professional data for preview */
  professional?: Professional;
}

export interface AddableSectionInfo {
  sectionId: string;
  label: string;
  innerSectionType: string;
}

export interface UseCondensedCardEditorReturn {
  // State
  config: CondensedCardConfig;
  previewImage: string | null;
  isGeneratingPreview: boolean;
  previewError: string | null;
  addableSections: AddableSectionInfo[];

  // Refs
  previewRef: React.RefObject<HTMLDivElement>;

  // Dimension handlers
  handlePresetChange: (preset: CondensedCardDimensionPreset) => void;
  handleDimensionsChange: (dimensions: Partial<CondensedCardDimensions>) => void;

  // Section handlers
  handleSectionChange: (instanceId: string, updates: Partial<CondensedCardSectionInstance>) => void;
  handleAddSection: (sectionType: string) => void;
  handleRemoveSection: (instanceId: string) => void;
  handleSetSections: (sections: CondensedCardSectionInstance[]) => void;

  // Style handlers
  handleStylesChange: (styles: Partial<CondensedCardStyles>) => void;

  // Preview handlers
  generatePreview: () => Promise<void>;
  clearPreview: () => void;

  // Reset
  resetToDefaults: () => void;
  resetContentSections: () => void;
}

// =============================================================================
// HOOK
// =============================================================================

export function useCondensedCardEditor({
  initialConfig,
  onChange,
  professional,
}: UseCondensedCardEditorParams): UseCondensedCardEditorReturn {
  // Redux dispatch for live preview updates
  const dispatch = useAppDispatch();

  // Migrate and merge initial config with defaults
  const [config, setConfig] = useState<CondensedCardConfig>(() => {
    if (!initialConfig) return { ...DEFAULT_CONDENSED_CARD_CONFIG };

    // Migrate if needed (handles old Record format)
    const migrated = migrateCondensedCardConfig(initialConfig);

    // Merge with defaults
    return mergeWithDefaultConfig(migrated);
  });

  // Initialize Redux with current config on mount
  // This ensures preview components have data to read
  useEffect(() => {
    console.log('[useCondensedCardEditor] Initializing Redux with sections:', config.sections.length);
    dispatch(setSections(config.sections));
  }, []); // Only run on mount

  // Sync external config changes back to internal state AND Redux
  // This is needed when position is updated from the preview's drag overlay
  useEffect(() => {
    if (!initialConfig) return;

    // Only update if the external config has actually changed
    const externalSectionsJSON = JSON.stringify(initialConfig.sections);
    const internalSectionsJSON = JSON.stringify(config.sections);

    if (externalSectionsJSON !== internalSectionsJSON) {
      console.log('[useCondensedCardEditor] Syncing external config changes to internal state and Redux');
      const migrated = migrateCondensedCardConfig(initialConfig);
      const mergedConfig = mergeWithDefaultConfig(migrated);
      setConfig(mergedConfig);

      // Also update Redux for live preview
      dispatch(setSections(mergedConfig.sections));
    }
  }, [initialConfig, dispatch]);

  // Preview state
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Ref for preview container
  const previewRef = useRef<HTMLDivElement>(null);

  // Update local state, parent state, AND Redux for live preview updates
  const updateConfig = useCallback((newConfig: CondensedCardConfig) => {
    setConfig(newConfig);
    onChange(newConfig);

    // Dispatch to Redux so preview components update immediately
    // Preview components read from Redux using selectPropsByInnerSectionType
    dispatch(setSections(newConfig.sections));
  }, [onChange, dispatch]);

  // =============================================================================
  // DIMENSION HANDLERS
  // =============================================================================

  const handlePresetChange = useCallback((preset: CondensedCardDimensionPreset) => {
    const dimensions = getDimensionsForPreset(preset);
    updateConfig({
      ...config,
      dimensions: {
        preset,
        width: dimensions.width,
        height: dimensions.height,
      },
    });
  }, [config, updateConfig]);

  const handleDimensionsChange = useCallback((updates: Partial<CondensedCardDimensions>) => {
    updateConfig({
      ...config,
      dimensions: {
        ...config.dimensions,
        ...updates,
        // If width or height changed manually, switch to custom preset
        preset: (updates.width !== undefined || updates.height !== undefined)
          ? 'custom'
          : updates.preset ?? config.dimensions.preset,
      },
    });
  }, [config, updateConfig]);

  // =============================================================================
  // SECTION HANDLERS
  // =============================================================================

  const handleSectionChange = useCallback((
    instanceId: string,
    updates: Partial<CondensedCardSectionInstance>
  ) => {
    updateConfig({
      ...config,
      sections: config.sections.map(section =>
        section.id === instanceId
          ? { ...section, ...updates }
          : section
      ),
    });
  }, [config, updateConfig]);

  const handleAddSection = useCallback((sectionType: string) => {
    // Use sectionMapping to create properly wrapped section (contentContainer or mapAndContentContainer)
    if (hasCondensedMapping(sectionType)) {
      const newSection = createCondensedCardSection(
        sectionType,
        true, // visible
        undefined, // no existing section
        true // useDefaultAddPosition - positions at top-left corner
      );

      if (newSection) {
        // Make ID unique if needed
        const existingIds = config.sections.map(s => s.id);
        let finalId = newSection.id;
        let counter = 1;
        while (existingIds.includes(finalId)) {
          finalId = `${newSection.id}-${counter}`;
          counter++;
        }
        newSection.id = finalId;
        newSection.zIndex = config.sections.length;

        console.log('[handleAddSection] Adding wrapped section:', newSection);

        updateConfig({
          ...config,
          sections: [...config.sections, newSection],
        });
        return;
      }
    }

    // Fallback: direct section from registry (for non-mapped sections)
    const registryItem = getSectionById(sectionType);
    if (!registryItem) {
      console.warn(`Section type not found in registry: ${sectionType}`);
      return;
    }

    // Generate unique instance ID
    const instanceId = generateSectionInstanceId(sectionType, config.sections);

    // Create new section instance
    const newSection: CondensedCardSectionInstance = {
      id: instanceId,
      sectionType,
      label: registryItem.label,
      visible: true,
      position: registryItem.defaultPosition,
      zIndex: config.sections.length,
      props: registryItem.defaultProps,
    };

    console.log('[handleAddSection] Adding direct section:', newSection);

    updateConfig({
      ...config,
      sections: [...config.sections, newSection],
    });
  }, [config, updateConfig]);

  const handleRemoveSection = useCallback((instanceId: string) => {
    updateConfig({
      ...config,
      sections: config.sections.filter(section => section.id !== instanceId),
    });
  }, [config, updateConfig]);

  const handleSetSections = useCallback((sections: CondensedCardSectionInstance[]) => {
    updateConfig({
      ...config,
      sections,
    });
  }, [config, updateConfig]);

  // =============================================================================
  // STYLE HANDLERS
  // =============================================================================

  const handleStylesChange = useCallback((updates: Partial<CondensedCardStyles>) => {
    updateConfig({
      ...config,
      styles: {
        ...config.styles,
        ...updates,
      },
    });
  }, [config, updateConfig]);

  // =============================================================================
  // PREVIEW HANDLERS
  // =============================================================================

  const generatePreview = useCallback(async () => {
    if (!professional || !previewRef.current) {
      setPreviewError('No professional data or preview container available');
      return;
    }

    setIsGeneratingPreview(true);
    setPreviewError(null);

    try {
      // Dynamic import html2canvas to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;

      // Generate canvas from preview element
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: config.styles.backgroundColor,
        width: config.dimensions.width,
        height: config.dimensions.height,
      });

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      setPreviewImage(dataUrl);
    } catch (error) {
      console.error('Preview generation failed:', error);
      setPreviewError(error instanceof Error ? error.message : 'Failed to generate preview');
    } finally {
      setIsGeneratingPreview(false);
    }
  }, [professional, config]);

  const clearPreview = useCallback(() => {
    setPreviewImage(null);
    setPreviewError(null);
  }, []);

  // =============================================================================
  // RESET
  // =============================================================================

  const resetToDefaults = useCallback(() => {
    updateConfig({ ...DEFAULT_CONDENSED_CARD_CONFIG });
    clearPreview();
  }, [updateConfig, clearPreview]);

  // Reset content sections to default layout
  // Creates: Bio, Location Map, Signature Work, Specialties, Important Info, Promos
  const resetContentSections = useCallback(() => {
    // Keep styling sections
    const stylingSections = config.sections.filter(
      (s) => STYLING_SECTION_TYPES.includes(s.sectionType as any)
    );

    // Define default content sections with column layout
    const defaultContentSectionTypes = [
      'bio-preview',
      'map',
      'signature-work',
      'specialties',
      'importantInfo',
      'current-promotions',
    ];

    // Create default content sections using the mapping utility
    const defaultContentSections: CondensedCardSectionInstance[] = [];
    let zIndex = stylingSections.length;
    let rowOrder = 1;

    for (const sectionType of defaultContentSectionTypes) {
      if (hasCondensedMapping(sectionType)) {
        const newSection = createCondensedCardSection(
          sectionType,
          true, // visible
          undefined, // no existing section
          true // useDefaultAddPosition
        );

        if (newSection) {
          // Assign column and rowOrder for column layout
          // Alternate left/right for variety, with some full-width
          let column: 'left' | 'right' | 'full' = 'left';
          if (sectionType === 'signature-work') {
            column = 'full'; // Signature work looks better full width
          } else if (sectionType === 'map' || sectionType === 'current-promotions') {
            column = 'right';
          }

          newSection.zIndex = zIndex++;
          newSection.column = column;
          newSection.rowOrder = column === 'full' ? rowOrder++ : rowOrder;

          // Increment row after right column or full width
          if (column === 'right' || column === 'full') {
            rowOrder++;
          }

          defaultContentSections.push(newSection);
        }
      }
    }

    console.log('[resetContentSections] Created default sections:', defaultContentSections);

    updateConfig({
      ...config,
      sections: [...stylingSections, ...defaultContentSections],
    });
    clearPreview();
  }, [config, updateConfig, clearPreview]);

  // =============================================================================
  // ADDABLE SECTIONS
  // =============================================================================

  /**
   * 1:1 Mapping from Card Section IDs to Condensed Card section IDs.
   * ONE Card Section = ONE Condensed Section. No choices, no duplicates.
   */
  const CARD_SECTION_TO_CONDENSED_SECTIONS: Record<string, string[]> = {
    // Media sections
    'signature-work-actions': ['signature-work'],
    'signature-work': ['signature-work'],
    'video-display': ['signature-work'],
    // Map sections
    'map': ['map'],
    'map-section': ['map'],
    // Bio sections
    'bio-simple': ['bio-preview'],
    'bio-preview': ['bio-preview'],
    // Promotions sections
    'current-promotions': ['current-promotions'],
    'current-promotions-detailed': ['current-promotions'],
    // Content sections
    'specialties': ['specialties'],
    'specialties-section': ['specialties'],
    'importantInfo': ['importantInfo'],
    'important-info': ['importantInfo'],
    'business-hours': ['business-hours'],
    'overview-stats': ['overview-stats'],
  };

  /**
   * Sections that are always available regardless of Card Sections visibility.
   * EMPTY - Only sections mapped from visible Card Sections should be available.
   */
  const ALWAYS_AVAILABLE_SECTIONS: string[] = [];

  // Compute sections that can be added based on visible Card Sections
  const addableSections = useMemo((): AddableSectionInfo[] => {
    // Get visible Card Section IDs from professional's sectionsConfig
    const visibleCardSectionIds = professional?.sectionsConfig
      ?.filter(section => section.visible)
      ?.map(section => section.id) || [];

    console.log('🔍 [addableSections] visibleCardSectionIds:', visibleCardSectionIds);
    console.log('🔍 [addableSections] CARD_SECTION_TO_CONDENSED_SECTIONS keys:', Object.keys(CARD_SECTION_TO_CONDENSED_SECTIONS));

    // Build set of allowed Condensed Card section IDs
    const allowedCondensedSectionIds = new Set<string>(ALWAYS_AVAILABLE_SECTIONS);

    // Add sections enabled by visible Card Sections
    for (const cardSectionId of visibleCardSectionIds) {
      const condensedSectionIds = CARD_SECTION_TO_CONDENSED_SECTIONS[cardSectionId];
      console.log(`🔍 [addableSections] Mapping "${cardSectionId}" -> `, condensedSectionIds);
      if (condensedSectionIds) {
        for (const id of condensedSectionIds) {
          allowedCondensedSectionIds.add(id);
        }
      }
    }

    console.log('🔍 [addableSections] allowedCondensedSectionIds:', [...allowedCondensedSectionIds]);

    // Check if a section type is already added (either directly or as innerSectionType)
    const isSectionAlreadyAdded = (sectionId: string): boolean => {
      return config.sections.some(s => {
        // Check direct sectionType match
        if (s.sectionType === sectionId) return true;
        // Check innerSectionType match (for contentContainer/mapAndContentContainer)
        if (s.props?.innerSectionType === sectionId) return true;
        // Check if section ID matches the pattern "{sectionId}-content"
        if (s.id === `${sectionId}-content`) return true;
        return false;
      });
    };

    // Filter SECTION_REGISTRY to only include allowed sections that can be added
    return SECTION_REGISTRY
      .filter(item =>
        allowedCondensedSectionIds.has(item.id) &&
        !isSectionAlreadyAdded(item.id)
      )
      .map(item => ({
        sectionId: item.id,
        label: item.label,
        innerSectionType: item.id,
      }));
  }, [config.sections, professional?.sectionsConfig]);

  return {
    // State
    config,
    previewImage,
    isGeneratingPreview,
    previewError,
    addableSections,

    // Refs
    // @ts-expect-error - RefObject type includes null
    previewRef,

    // Dimension handlers
    handlePresetChange,
    handleDimensionsChange,

    // Section handlers
    handleSectionChange,
    handleAddSection,
    handleRemoveSection,
    handleSetSections,

    // Style handlers
    handleStylesChange,

    // Preview handlers
    generatePreview,
    clearPreview,

    // Reset
    resetToDefaults,
    resetContentSections,
  };
}

export default useCondensedCardEditor;
