'use client';

/**
 * ColumnLayoutEditor - Main column-based drag-and-drop section editor
 *
 * Displays sections in a visual column layout (left/right/full-width).
 * Sections can be dragged between columns and reordered.
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import type { CondensedCardSectionInstance, SectionColumn } from '@/lib/features/digital-cards/types/sections';
import { LayoutRow, InsertionRow } from './LayoutRow';
import { DraggableSectionCard } from './DraggableSectionCard';
import { SectionOptionsEditor } from './SectionOptionsEditor';
import {
  groupSectionsIntoRows,
  moveSectionToPosition,
  normalizeRowOrders,
} from './rowUtils';
import { updateSection, updateSectionProps, setSections } from '@/lib/features/digital-cards/store';
import { useAppDispatch } from '../../../../../../../../store/hooks';

// =============================================================================
// TYPES
// =============================================================================

export interface AddableSectionInfo {
  sectionId: string;
  label: string;
}

export interface ColumnLayoutEditorProps {
  /** The sections to display */
  sections: CondensedCardSectionInstance[];
  /** Callback when sections are updated */
  onSectionsChange: (sections: CondensedCardSectionInstance[]) => void;
  /** Callback to update a single section */
  onSectionChange: (sectionId: string, updates: Partial<CondensedCardSectionInstance>) => void;
  /** Callback when "Update Position + Size" is clicked */
  onEditPosition: (sectionId: string) => void;
  /** Callback when "Save" is clicked for position editing */
  onSavePosition?: () => void;
  /** Currently active section ID for position editing */
  activeSectionId?: string | null;
  /** Callback when a section is deleted */
  onDeleteSection: (sectionId: string) => void;
  /** Callback when reset is clicked */
  onReset?: () => void;
  /** Sections that can be added */
  addableSections?: AddableSectionInfo[];
  /** Callback when a section is added */
  onAddSection?: (sectionType: string) => void;
  /** Whether the editor is disabled */
  disabled?: boolean;
  /** Hide the "Update Position + Size" button (for profile mode) */
  hidePositionButton?: boolean;
  /** Editor mode - determines which options are shown */
  mode?: 'admin' | 'profile';
  /** Whether move sections mode is active (profile mode) */
  moveSectionsMode?: boolean;
  /** Callback to enter move sections mode */
  onEnterMoveMode?: () => void;
  /** Callback to exit move sections mode */
  onExitMoveMode?: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ColumnLayoutEditor({
  sections,
  onSectionsChange,
  onSectionChange,
  onEditPosition,
  onSavePosition,
  activeSectionId: activeSectionIdProp,
  onDeleteSection,
  onReset,
  addableSections = [],
  onAddSection,
  disabled = false,
  hidePositionButton = false,
  mode = 'admin',
  moveSectionsMode = false,
  onEnterMoveMode,
  onExitMoveMode,
}: ColumnLayoutEditorProps) {
  // Redux dispatch for updating store
  const dispatch = useAppDispatch();

  // State for tracking selected section (for props editor)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // State for tracking active drag
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  // State for add section dropdown
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Start drag after 8px movement
      },
    })
  );

  // Group sections into rows
  const rows = useMemo(() => groupSectionsIntoRows(sections), [sections]);

  // Get the currently dragging section
  const activeDragSection = useMemo(
    () => sections.find(s => s.id === activeDragId),
    [sections, activeDragId]
  );

  // Get the selected section for props editing
  const selectedSection = useMemo(
    () => sections.find(s => s.id === selectedSectionId),
    [sections, selectedSectionId]
  );

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over) return;

    const sectionId = active.id as string;
    const dropData = over.data.current as {
      column: SectionColumn;
      rowIndex: number;
      insertNewRow?: boolean;
    } | undefined;

    if (!dropData) return;

    const { column, rowIndex, insertNewRow } = dropData;

    // Move the section to the new position
    const updatedSections = moveSectionToPosition(
      sections,
      sectionId,
      column,
      rowIndex,
      insertNewRow
    );

    // Normalize row orders and notify parent
    const normalized = normalizeRowOrders(updatedSections);

    // DISPATCH TO REDUX - Keep preview in sync
    dispatch(setSections(normalized));

    // Keep prop callback for form state (for save to Firestore)
    onSectionsChange(normalized);
  }, [dispatch, sections, onSectionsChange]);

  const handleToggleVisibility = useCallback((sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      const newVisible = section.visible === false ? true : false;

      // DISPATCH TO REDUX - Keep preview in sync
      dispatch(updateSection({ sectionId, updates: { visible: newVisible } }));

      // Keep prop callback for form state (for save to Firestore)
      onSectionChange(sectionId, { visible: newVisible });
    }
  }, [dispatch, sections, onSectionChange]);

  const handleOpenSettings = useCallback((sectionId: string) => {
    setSelectedSectionId(prev => prev === sectionId ? null : sectionId);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setSelectedSectionId(null);
  }, []);

  const handlePropsChange = useCallback((newProps: Record<string, any>) => {
    if (selectedSectionId) {
      const section = sections.find(s => s.id === selectedSectionId);
      if (section) {
        const isWrapper = section.sectionType === 'contentContainer' ||
                          section.sectionType === 'mapAndContentContainer';

        // DISPATCH TO REDUX - Keep preview in sync
        if (isWrapper && section.props?.innerSectionType) {
          // For wrapper sections, update innerSectionProps
          dispatch(updateSectionProps({ sectionId: selectedSectionId, props: newProps.innerSectionProps || newProps }));
        } else {
          // For direct sections, update props directly
          dispatch(updateSection({
            sectionId: selectedSectionId,
            updates: { props: { ...section.props, ...newProps } }
          }));
        }

        // Keep prop callback for form state (for save to Firestore)
        onSectionChange(selectedSectionId, {
          props: { ...section.props, ...newProps },
        });
      }
    }
  }, [dispatch, selectedSectionId, sections, onSectionChange]);

  const handleSectionOptionsChange = useCallback((updates: Partial<CondensedCardSectionInstance>) => {
    if (selectedSectionId) {
      // DISPATCH TO REDUX - Keep preview in sync
      dispatch(updateSection({ sectionId: selectedSectionId, updates }));

      // Keep prop callback for form state (for save to Firestore)
      onSectionChange(selectedSectionId, updates);
    }
  }, [dispatch, selectedSectionId, onSectionChange]);

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="space-y-4">
      {/* Header with count, add button, and reset button */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {sections.length} section{sections.length !== 1 ? 's' : ''}
        </span>
        <div className="flex items-center gap-3">
          {/* Move Sections Button (profile mode only) */}
          {mode === 'profile' && onEnterMoveMode && sections.length > 0 && (
            <button
              type="button"
              onClick={moveSectionsMode ? onExitMoveMode : onEnterMoveMode}
              disabled={disabled}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors disabled:opacity-50 ${
                moveSectionsMode
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'border border-purple-300 text-purple-600 hover:bg-purple-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              {moveSectionsMode ? 'Exit Move Mode' : 'Move Sections'}
            </button>
          )}

          {/* Add Section Button */}
          {onAddSection && addableSections.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAddDropdown(!showAddDropdown)}
                disabled={disabled}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Section
              </button>

              {/* Dropdown */}
              {showAddDropdown && (
                <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-1 max-h-64 overflow-y-auto">
                    {addableSections.map((section) => (
                      <button
                        key={section.sectionId}
                        type="button"
                        onClick={() => {
                          onAddSection(section.sectionId);
                          setShowAddDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                      >
                        {section.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reset Sections Button */}
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              disabled={disabled}
              className="text-sm text-purple-600 hover:text-purple-800 hover:underline disabled:opacity-50"
            >
              Reset Sections
            </button>
          )}
        </div>
      </div>

      {/* Props Editor Panel (shows when a section is selected) */}
      {selectedSection && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-purple-900">
              Editing: {selectedSection.label}
            </h4>
            <button
              type="button"
              onClick={handleCloseSettings}
              className="p-1 rounded hover:bg-purple-100 text-purple-600"
              title="Close settings"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Unified Section Options Editor (all options in one component) */}
          <SectionOptionsEditor
            section={selectedSection}
            mode={mode}
            onChange={handleSectionOptionsChange}
            onInnerPropsChange={(newInnerProps) => {
              // Handle props for wrapper sections vs direct sections
              if (selectedSection.props?.innerSectionType) {
                // It's a wrapper section - update innerSectionProps
                handlePropsChange({
                  ...selectedSection.props,
                  innerSectionProps: newInnerProps,
                });
              } else {
                // Direct section - update props directly
                handlePropsChange(newInnerProps);
              }
            }}
            disabled={disabled}
          />
        </div>
      )}

      {/* Column Layout with Drag and Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          {/* Column Headers */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <div className="text-center">Left Column</div>
            <div className="text-center">Right Column</div>
          </div>

          {/* Rows */}
          {rows.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No sections configured.</p>
              <p className="text-sm mt-1">Add sections using the button below.</p>
            </div>
          ) : (
            <>
              {rows.map((row, index) => (
                <React.Fragment key={row.rowIndex}>
                  {/* Insertion zone between rows */}
                  {index === 0 && <InsertionRow rowIndex={0} />}

                  <LayoutRow
                    row={row}
                    selectedSectionId={selectedSectionId}
                    activeSectionId={activeSectionIdProp}
                    onToggleVisibility={handleToggleVisibility}
                    onOpenSettings={handleOpenSettings}
                    onEditPosition={onEditPosition}
                    onSavePosition={onSavePosition ? () => onSavePosition() : undefined}
                    onDelete={onDeleteSection}
                    disabled={disabled}
                    hidePositionButton={hidePositionButton}
                  />

                  {/* Insertion zone after each row */}
                  <InsertionRow rowIndex={row.rowIndex + 1} />
                </React.Fragment>
              ))}
            </>
          )}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeDragSection && (
            <div className="opacity-90 shadow-xl">
              <DraggableSectionCard
                section={activeDragSection}
                isSelected={false}
                onToggleVisibility={() => {}}
                onOpenSettings={() => {}}
                onEditPosition={() => {}}
                onDelete={() => {}}
                disabled
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default ColumnLayoutEditor;
