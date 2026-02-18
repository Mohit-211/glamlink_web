"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/lib/pages/admin/components/shared/editing/form/FormProvider";
import { FormRenderer } from "@/lib/pages/admin/components/shared/editing/form/FormRenderer";
import { useDragPosition } from "@/lib/features/digital-cards/components/editor/shared/DragPositionContext";
import EditPreviewPanel from "@/lib/features/digital-cards/components/editor/professional/EditPreviewPanel";
import CondensedCardPreview from "@/lib/features/digital-cards/components/condensed/CondensedCardPreview";
import { StyledDigitalCardPreview } from "@/lib/features/digital-cards/preview";
import { transformFormDataForPreview } from "@/lib/pages/admin/components/professionals/preview/transformers";
import type { Professional, ProfessionalSectionConfig } from "@/lib/pages/for-professionals/types/professional";
import type { CondensedCardConfig, CondensedCardSectionInstance } from "@/lib/features/digital-cards/types/condensedCardConfig";
import type { PositionConfig } from "@/lib/pages/admin/components/shared/editing/fields/custom/positioning";
import { EDIT_TABS, TAB_FIELDS } from "./fieldConfigs";
import { ProfileCondensedCardEditor } from "@/lib/features/digital-cards/components/editor/profile";
import { STYLING_SECTION_TYPES, setConfig } from "@/lib/features/digital-cards/store";
import { useAppDispatch } from "@/store/hooks";

interface DigitalCardEditFormProps {
  professional: Professional;
}

export default function DigitalCardEditForm({ professional }: DigitalCardEditFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { formData, validateAllFields, updateField, getFieldValue } = useFormContext();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewType, setPreviewType] = useState<'access-card-page' | 'access-card-image'>('access-card-page');
  const [moveSectionsMode, setMoveSectionsMode] = useState(false);

  // Auto-switch preview to Access Card Image when entering move mode
  useEffect(() => {
    if (moveSectionsMode) {
      setPreviewType('access-card-image');
    }
  }, [moveSectionsMode]);

  // Get drag position context
  const { activeSectionId, previewPosition, cancelEditMode } = useDragPosition();

  // Initialize Redux store from form data on mount
  useEffect(() => {
    const config = getFieldValue('condensedCardConfig') as CondensedCardConfig | undefined;
    if (config) {
      dispatch(setConfig({
        sections: config.sections || [],
        dimensions: config.dimensions,
        styles: config.styles,
      }));
    }
  }, []); // Only on mount

  // Transform form data to Professional for condensed card preview
  const transformedProfessional = useMemo(() => {
    return transformFormDataForPreview(formData) as Professional;
  }, [formData]);

  // Check if we're on the condensed card tab
  const isCondensedCardTab = activeTab === "condensedCard";

  // Handle position change during drag (updates form data in real-time)
  const handlePositionChange = useCallback((newPosition: PositionConfig) => {
    if (!activeSectionId) return;

    const condensedCardConfig = getFieldValue('condensedCardConfig') as CondensedCardConfig | undefined;
    if (!condensedCardConfig?.sections) return;

    // Update the section's position in the config
    const updatedSections = condensedCardConfig.sections.map(section =>
      section.id === activeSectionId
        ? { ...section, position: newPosition }
        : section
    );

    updateField('condensedCardConfig', {
      ...condensedCardConfig,
      sections: updatedSections,
    });
  }, [activeSectionId, getFieldValue, updateField]);

  // Handle save position (exits edit mode - position already updated via handlePositionChange)
  const handleSavePosition = useCallback((newPosition: PositionConfig) => {
    // Position is already updated in real-time during drag via handlePositionChange
    // Just exit edit mode
    cancelEditMode();
  }, [cancelEditMode]);

  // Handle cancel edit (exits edit mode)
  const handleCancelEdit = useCallback(() => {
    cancelEditMode();
  }, [cancelEditMode]);

  // Handle position change in move mode (any section)
  const handleMoveModePositionChange = useCallback((sectionId: string, newPosition: PositionConfig) => {
    const condensedCardConfig = getFieldValue('condensedCardConfig') as CondensedCardConfig | undefined;
    if (!condensedCardConfig?.sections) return;

    // Update the section's position in the config
    const updatedSections = condensedCardConfig.sections.map(section =>
      section.id === sectionId
        ? { ...section, position: newPosition }
        : section
    );

    updateField('condensedCardConfig', {
      ...condensedCardConfig,
      sections: updatedSections,
    });
  }, [getFieldValue, updateField]);

  // ==========================================================================
  // AUTO-REMOVE: sectionsConfig → condensedCardConfig.sections
  // ==========================================================================
  // When a section is hidden in Sections tab, remove it from condensedCardConfig.
  // NOTE: We do NOT auto-add sections anymore. Users must use "Add Section" button.
  // - Styling sections are preserved (admin-defined, auto-included)
  // - Content sections are removed if their source section becomes hidden

  // Track previous sectionsConfig to detect changes
  const prevSectionsConfigRef = useRef<string | null>(null);

  useEffect(() => {
    const sectionsConfig = getFieldValue('sectionsConfig') as ProfessionalSectionConfig[] | undefined;
    const condensedCardConfig = getFieldValue('condensedCardConfig') as CondensedCardConfig | undefined;

    // Skip if no sectionsConfig or no condensedCardConfig
    if (!sectionsConfig || !Array.isArray(sectionsConfig)) {
      return;
    }

    // Create a stable key for comparison to avoid unnecessary updates
    const sectionsKey = JSON.stringify(
      sectionsConfig.map((s) => ({ id: s.id, visible: s.visible }))
    );

    // Skip if sectionsConfig hasn't changed
    if (sectionsKey === prevSectionsConfigRef.current) {
      return;
    }
    prevSectionsConfigRef.current = sectionsKey;

    // Get current styling sections from condensedCardConfig (keep unchanged)
    const stylingSections: CondensedCardSectionInstance[] = condensedCardConfig?.sections?.filter(
      (s) => STYLING_SECTION_TYPES.includes(s.sectionType as any)
    ) || [];

    // Get existing content sections and filter out any whose source is now hidden
    // This is the AUTO-REMOVE logic: when a section is hidden in Sections tab, remove from condensed card
    const existingContentSections: CondensedCardSectionInstance[] = condensedCardConfig?.sections?.filter(
      (s) => !STYLING_SECTION_TYPES.includes(s.sectionType as any)
    ) || [];

    // Filter content sections: keep only those whose source section is still visible
    const visibleContentSections = existingContentSections.filter((contentSection) => {
      // Extract original section ID from condensed ID (e.g., "map-section-content" -> "map-section")
      const originalId = contentSection.id.replace(/-content$/, '');
      const sourceSection = sectionsConfig.find((s) => s.id === originalId);
      // Keep if source section exists and is visible
      return sourceSection?.visible === true;
    });

    // Merge styling + filtered content sections
    const newSections = [...stylingSections, ...visibleContentSections];

    // Check if sections actually changed (avoid infinite loops)
    const currentSectionsKey = JSON.stringify(condensedCardConfig?.sections?.map((s) => s.id) || []);
    const newSectionsKey = JSON.stringify(newSections.map((s) => s.id));

    if (currentSectionsKey !== newSectionsKey) {
      console.log('[DigitalCardEditForm] Auto-removing hidden sections from condensedCardConfig');
      updateField('condensedCardConfig', {
        ...condensedCardConfig,
        dimensions: condensedCardConfig?.dimensions || {
          preset: 'instagram-portrait',
          width: 1080,
          height: 1350,
        },
        styles: condensedCardConfig?.styles || {
          backgroundColor: '#ffffff',
          headerGradient: { from: '#22B8C8', to: '#8B5CF6', angle: 135 },
          padding: 0,
          borderRadius: 24,
        },
        sections: newSections,
      });
    }
  }, [getFieldValue, updateField]);

  const handleSave = async () => {
    const isValid = validateAllFields();
    if (!isValid) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const response = await fetch(`/api/profile/professional`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save changes");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving professional:", error);
      setSaveError(error instanceof Error ? error.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const viewDigitalCard = () => {
    const cardUrl = professional.cardUrl || professional.id;
    router.push(`/${cardUrl}`);
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex">
      {/* Left: Form panel (45%) */}
      <div className="w-[45%] min-w-[400px] border-r border-gray-200 overflow-y-auto bg-white">
        <div className="py-8 px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Edit Your Digital Card
            </h1>
            <p className="text-gray-600">
              Update your professional information displayed on your digital business card.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
              {EDIT_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? "border-glamlink-teal text-glamlink-teal"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 overflow-auto" style={{ maxHeight: '650px' }}>
            {isCondensedCardTab ? (
              <ProfileCondensedCardEditor
                professional={transformedProfessional}
                moveSectionsMode={moveSectionsMode}
                onEnterMoveMode={() => {
                  setMoveSectionsMode(true);
                  setPreviewType('access-card-image');
                }}
                onExitMoveMode={() => setMoveSectionsMode(false)}
              />
            ) : (
              <FormRenderer
                fields={TAB_FIELDS[activeTab] || []}
                columns={1}
              />
            )}
          </div>

          {/* Error/Success Messages */}
          {saveError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{saveError}</p>
            </div>
          )}
          {saveSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">Changes saved successfully!</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={viewDigitalCard}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              View Digital Card
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 text-sm font-medium text-white bg-glamlink-teal rounded-md hover:bg-glamlink-teal-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right: Preview panel (55%) */}
      <div className="flex-1 bg-gray-100 overflow-y-auto">
        {isCondensedCardTab ? (
          <div className="p-4">
            {/* Preview Type Selector */}
            <div className="mb-4 flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Preview:</label>
              <select
                value={previewType}
                onChange={(e) => {
                  setPreviewType(e.target.value as 'access-card-page' | 'access-card-image');
                  // Exit move mode if switching away from Access Card Image
                  if (e.target.value !== 'access-card-image') {
                    setMoveSectionsMode(false);
                  }
                }}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:border-glamlink-teal"
              >
                <option value="access-card-page">Access Card Page</option>
                <option value="access-card-image">Access Card Image</option>
              </select>

              {/* Exit Move Mode button - only shows when in move mode */}
              {moveSectionsMode && (
                <button
                  type="button"
                  onClick={() => setMoveSectionsMode(false)}
                  className="px-3 py-1.5 text-sm rounded-md transition-colors bg-purple-600 text-white hover:bg-purple-700"
                >
                  Exit Move Mode
                </button>
              )}
            </div>

            {/* Conditional Preview Rendering */}
            {previewType === 'access-card-page' ? (
              <StyledDigitalCardPreview
                professional={transformedProfessional}
              />
            ) : (
              <CondensedCardPreview
                professional={transformedProfessional}
                onProfessionalUpdate={() => {
                  // No-op for profile page - changes are handled through form context
                }}
                editingSectionId={activeSectionId}
                editingPosition={previewPosition}
                onSavePosition={handleSavePosition}
                onCancelEdit={handleCancelEdit}
                onPositionChange={handlePositionChange}
                profileMode={true}
                moveSectionsMode={moveSectionsMode}
                onMoveModePositionChange={handleMoveModePositionChange}
              />
            )}
          </div>
        ) : (
          <EditPreviewPanel />
        )}
      </div>
    </div>
  );
}
