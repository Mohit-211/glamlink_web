'use client';

/**
 * CondensedCardEditor - Unified editor component for condensed card design
 *
 * This component provides a complete interface for configuring the condensed card layout.
 * It supports two modes:
 *
 * - 'admin': Full feature set
 *   - Page dimensions with presets
 *   - Layout presets with full CRUD (save, update, delete)
 *   - Styling section group
 *   - Section visibility toggles and remove buttons
 *   - Generate preview button
 *
 * - 'profile': Simplified view
 *   - No page dimensions
 *   - Layout presets readonly (load only)
 *   - No styling section
 *   - Section styling hidden
 *   - Info box with instructions
 *   - Reset confirmation dialog
 */

import React, { useMemo, useState, useCallback } from 'react';
import {
  DimensionPresetSelector,
  SectionEditor,
  SectionGroup,
  AddableSectionRow,
  InfoBox,
  ResetConfirmDialog,
} from '../index';
import { LayoutPresetSelector } from './LayoutPresetSelector';
import { ColumnLayoutEditor } from '../ColumnLayoutEditor';
import { isStylingSection, isContentSection } from '@/lib/features/digital-cards/store';
import type { CondensedCardEditorProps, EditorMode } from './types';
import type { CondensedCardSectionInstance } from '@/lib/features/digital-cards/types/sections';
import { getModeDefaults } from './types';

// =============================================================================
// COMPONENT
// =============================================================================

export function CondensedCardEditor(props: CondensedCardEditorProps) {
  const {
    // Core
    config,
    professional,
    mode = 'admin',

    // Data for profile mode
    addableSections = [],
    newlyAddedSectionId = null,

    // Handlers
    onPresetChange,
    onDimensionsChange,
    onSectionChange,
    onRemoveSection,
    onSetSections,
    onAddSection,
    onCancelAdd,
    onEditSectionPosition,
    onSavePosition,
    onResetToDefaults,
    onResetContentSections,
    onShowResetDialog,
    onGeneratePreview,

    // State
    isGenerating = false,
    previewError,
    disabled = false,
    activeSectionId,

    // Move sections mode (profile mode)
    moveSectionsMode = false,
    onEnterMoveMode,
    onExitMoveMode,
  } = props;

  // Apply mode defaults, then override with explicit props
  const modeDefaults = getModeDefaults(mode);
  const effectiveProps = { ...modeDefaults, ...props };

  const {
    showDimensions,
    layoutPresetMode,
    showStylingSection,
    showGeneratePreview,
    showInfoBox,
    useResetDialog,
    showSectionVisibilityToggle,
    showSectionRemoveButton,
    showSectionCustomLayouts,
    hideSectionStyling,
    showEditingHighlight,
    useColumnLayout,
  } = effectiveProps;

  // Local state for reset dialog (when useResetDialog is true)
  const [showResetDialogLocal, setShowResetDialogLocal] = useState(false);

  // Local state for section group expand/collapse
  const [stylingSectionExpanded, setStylingSectionExpanded] = useState(true);
  const [contentSectionExpanded, setContentSectionExpanded] = useState(true);

  // Group sections into Styling and Content
  const { stylingSections, contentSections } = useMemo(() => {
    const styling = config.sections.filter(s => isStylingSection(s.sectionType));
    const content = config.sections.filter(s => isContentSection(s.sectionType));
    return { stylingSections: styling, contentSections: content };
  }, [config.sections]);

  // Handle reset dialog
  const handleResetClick = () => {
    if (useResetDialog) {
      if (onShowResetDialog) {
        onShowResetDialog();
      } else {
        setShowResetDialogLocal(true);
      }
    } else if (onResetContentSections) {
      onResetContentSections();
    }
  };

  const handleResetConfirm = () => {
    if (onResetContentSections) {
      onResetContentSections();
    }
    setShowResetDialogLocal(false);
  };

  // Check if we have content sections
  const hasContentSections = contentSections.length > 0;

  // Handler for when ColumnLayoutEditor updates content sections
  // This preserves styling sections while replacing content sections
  const handleContentSectionsChange = useCallback((updatedContentSections: CondensedCardSectionInstance[]) => {
    if (onSetSections) {
      // Combine styling sections (unchanged) with updated content sections
      const allSections = [...stylingSections, ...updatedContentSections];
      onSetSections(allSections);
    }
  }, [stylingSections, onSetSections]);

  return (
    <div className="space-y-6" style={{ maxHeight: '600px', overflowY: 'auto' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            {mode === 'admin' ? 'Condensed Card Designer' : 'Condensed Card Styling'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {mode === 'admin'
              ? 'Configure the layout and dimensions for the condensed card image export'
              : 'Add and customize sections on your condensed digital card. Click "Add Section" next to any section to add it to your card.'
            }
          </p>
        </div>

        {/* Reset Buttons (admin mode only, without dialog) */}
        {mode === 'admin' && !useResetDialog && (
          <div className="flex items-center gap-2">
            {onResetContentSections && (
              <button
                type="button"
                onClick={onResetContentSections}
                disabled={disabled}
                className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                title="Remove all content sections, keep styling sections"
              >
                Reset Content Sections
              </button>
            )}
            {onResetToDefaults && (
              <button
                type="button"
                onClick={onResetToDefaults}
                disabled={disabled}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
              >
                Reset All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Page Dimensions Section (admin mode) */}
      {showDimensions && onPresetChange && onDimensionsChange && (
        <div className="bg-gray-50 rounded-lg p-4">
          <DimensionPresetSelector
            value={config.dimensions}
            onPresetChange={onPresetChange}
            onDimensionsChange={onDimensionsChange}
            disabled={disabled}
          />
        </div>
      )}

      {/* Layout Presets Section */}
      {layoutPresetMode !== 'hidden' && (
        <div className={`border rounded-lg p-4 ${
          mode === 'admin'
            ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200'
            : 'bg-gray-50 border-gray-200'
        }`}>
          {mode === 'admin' && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                <h4 className="text-sm font-semibold text-purple-900">Layout Presets</h4>
                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                  Save &amp; Load Layouts
                </span>
              </div>
              <p className="text-xs text-purple-700 mb-3">
                Save your current section arrangement as a preset, or load a saved layout to quickly set up new profiles.
              </p>
            </>
          )}
          <LayoutPresetSelector
            currentSections={config.sections}
            onLoadPreset={onSetSections}
            disabled={disabled}
            mode={layoutPresetMode === 'readonly' ? 'readonly' : 'full'}
          />
        </div>
      )}

      {/* Sections Configuration */}
      <div className="space-y-4">
        {/* Styling Sections Group (admin mode or explicitly enabled) */}
        {showStylingSection && stylingSections.length > 0 && (
          <SectionGroup
            title="Styling"
            count={stylingSections.length}
            isExpanded={stylingSectionExpanded}
            onToggle={() => setStylingSectionExpanded(!stylingSectionExpanded)}
          >
            {stylingSections.map((section) => (
              <SectionEditor
                key={section.id}
                section={section}
                onChange={(updates) => onSectionChange(section.id, updates)}
                onRemove={showSectionRemoveButton && onRemoveSection ? () => onRemoveSection(section.id) : undefined}
                onEditPosition={onEditSectionPosition ? () => onEditSectionPosition(section.id) : undefined}
                onSavePosition={activeSectionId === section.id ? onSavePosition : undefined}
                isEditing={activeSectionId === section.id}
                disabled={disabled}
                showVisibilityToggle={showSectionVisibilityToggle}
                showCustomSections={showSectionCustomLayouts}
                hideSectionStyling={hideSectionStyling}
                showEditingHighlight={showEditingHighlight}
              />
            ))}
          </SectionGroup>
        )}

        {/* Content Sections Group */}
        <SectionGroup
          title="Content"
          count={contentSections.length}
          isExpanded={contentSectionExpanded}
          onToggle={() => setContentSectionExpanded(!contentSectionExpanded)}
          headerActions={
            // Only show reset button when NOT using column layout (ColumnLayoutEditor has its own reset button)
            mode === 'profile' && hasContentSections && !useColumnLayout ? (
              <button
                type="button"
                onClick={handleResetClick}
                disabled={disabled}
                className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
              >
                Reset Sections
              </button>
            ) : null
          }
        >
          {/* Column-based drag-and-drop layout (admin mode or when useColumnLayout is true) */}
          {useColumnLayout && (
            <ColumnLayoutEditor
              sections={contentSections}
              onSectionsChange={handleContentSectionsChange}
              onSectionChange={onSectionChange}
              onEditPosition={onEditSectionPosition || (() => {})}
              onSavePosition={onSavePosition}
              activeSectionId={activeSectionId}
              onDeleteSection={onRemoveSection || (() => {})}
              onReset={onResetContentSections}
              addableSections={addableSections.map(s => ({
                sectionId: s.sectionId,
                label: s.label,
              }))}
              onAddSection={onAddSection}
              disabled={disabled}
              hidePositionButton={mode === 'profile'}
              mode={mode}
              moveSectionsMode={moveSectionsMode}
              onEnterMoveMode={onEnterMoveMode}
              onExitMoveMode={onExitMoveMode}
            />
          )}

          {/* Traditional accordion list (when useColumnLayout is false) */}
          {!useColumnLayout && (
            <>
              {/* Already-added content sections */}
              {contentSections.map((section) => {
                const isNewlyAdded = newlyAddedSectionId === section.id;
                return (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    onChange={(updates) => onSectionChange(section.id, updates)}
                    onRemove={showSectionRemoveButton && onRemoveSection ? () => onRemoveSection(section.id) : undefined}
                    onEditPosition={onEditSectionPosition ? () => onEditSectionPosition(section.id) : undefined}
                    onSavePosition={activeSectionId === section.id ? onSavePosition : undefined}
                    onCancelAdd={isNewlyAdded && onCancelAdd ? () => onCancelAdd(section.id) : undefined}
                    isEditing={activeSectionId === section.id}
                    isNewlyAdded={isNewlyAdded}
                    disabled={disabled}
                    showVisibilityToggle={showSectionVisibilityToggle}
                    showCustomSections={showSectionCustomLayouts}
                    hideSectionStyling={hideSectionStyling}
                    showEditingHighlight={showEditingHighlight}
                  />
                );
              })}

              {/* Addable sections (profile mode only) */}
              {addableSections.map((section) => (
                <AddableSectionRow
                  key={section.sectionId}
                  section={section}
                  onAdd={onAddSection ? () => onAddSection(section.sectionId) : undefined}
                  disabled={disabled || !!activeSectionId}
                />
              ))}
            </>
          )}

          {/* Empty state when no sections at all */}
          {contentSections.length === 0 && addableSections.length === 0 && (
            <div className="py-8 text-center">
              <div className="text-gray-400 mb-2">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mb-1">No content sections available</p>
              <p className="text-xs text-gray-400">
                Make sections visible in the &quot;Sections&quot; tab first
              </p>
            </div>
          )}
        </SectionGroup>
      </div>

      {/* Info Box (profile mode) */}
      {showInfoBox && (
        <InfoBox title="How Section Adding Works">
          <p>
            1. Make a section visible in the &quot;Sections&quot; tab<br />
            2. Click &quot;Add Section&quot; next to any section below<br />
            3. Position and size the section, then click &quot;Save Position&quot;
          </p>
        </InfoBox>
      )}

      {/* Generate Preview Button (admin mode) */}
      {showGeneratePreview && onGeneratePreview && (
        <div className="pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onGeneratePreview}
            disabled={disabled || isGenerating || !professional}
            className="w-full px-4 py-3 bg-glamlink-teal text-white rounded-lg font-medium hover:bg-glamlink-teal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating Preview...
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Generate Preview
              </>
            )}
          </button>

          {!professional && (
            <p className="mt-2 text-xs text-amber-600 text-center">
              Save the professional first to enable preview generation
            </p>
          )}

          {previewError && (
            <p className="mt-2 text-xs text-red-600 text-center">
              {previewError}
            </p>
          )}
        </div>
      )}

      {/* Reset Confirmation Dialog (local state version) */}
      {useResetDialog && !onShowResetDialog && (
        <ResetConfirmDialog
          isOpen={showResetDialogLocal}
          onConfirm={handleResetConfirm}
          onCancel={() => setShowResetDialogLocal(false)}
        />
      )}
    </div>
  );
}

export default CondensedCardEditor;
