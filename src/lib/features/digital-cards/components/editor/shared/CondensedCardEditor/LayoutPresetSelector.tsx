'use client';

/**
 * LayoutPresetSelector - Manage section layout presets
 *
 * Supports two modes:
 * - 'full': Load, Save, Update, Delete (admin)
 * - 'readonly': Load only (profile)
 *
 * Allows users to:
 * - Select from saved section layout presets
 * - Load a preset into the current card
 * - Add a new preset from current sections (full mode)
 * - Update an existing preset with current sections (full mode)
 * - Delete a preset (except Default) (full mode)
 * - Preview sections in a selected preset
 */

import React, { useState, useMemo } from 'react';
import type {
  SectionLayoutPreset,
  CondensedCardSectionInstance,
} from '@/lib/features/digital-cards/types/condensedCardConfig';
import { useLayoutPresets } from './useLayoutPresets';
import { LoadPresetConfirmDialog } from './util';

// =============================================================================
// TYPES
// =============================================================================

export type LayoutPresetSelectorMode = 'full' | 'readonly';

export interface LayoutPresetSelectorProps {
  /** Current sections in the editor */
  currentSections: CondensedCardSectionInstance[];
  /** Callback when user loads a preset */
  onLoadPreset: (sections: CondensedCardSectionInstance[]) => void;
  /** Whether the component is disabled */
  disabled?: boolean;
  /**
   * Mode: 'full' (admin) or 'readonly' (profile)
   * - 'full': Shows Load dropdown + Save/Update/Delete buttons
   * - 'readonly': Shows only Load dropdown + Load button
   * @default 'full'
   */
  mode?: LayoutPresetSelectorMode;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function LayoutPresetSelector({
  currentSections,
  onLoadPreset,
  disabled = false,
  mode = 'full',
}: LayoutPresetSelectorProps) {
  const {
    presets,
    isLoading,
    error,
    isSaving,
    createPreset,
    updatePreset,
    deletePreset,
  } = useLayoutPresets();

  // Selected preset ID (for preview and actions)
  const [selectedPresetId, setSelectedPresetId] = useState<string>('default');

  // State for load confirmation dialog
  const [showLoadConfirm, setShowLoadConfirm] = useState(false);

  const isReadonly = mode === 'readonly';

  // Get selected preset
  const selectedPreset = useMemo(() => {
    return presets.find((p) => p.id === selectedPresetId) || presets[0] || null;
  }, [presets, selectedPresetId]);

  // Handle dropdown change
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPresetId(e.target.value);
  };

  // Show load confirmation dialog
  const handleLoadClick = () => {
    if (!selectedPreset) return;
    setShowLoadConfirm(true);
  };

  // Actually load the preset after confirmation
  const handleLoadConfirm = () => {
    if (!selectedPreset) return;

    // Deep clone the sections to avoid reference issues
    const clonedSections = JSON.parse(JSON.stringify(selectedPreset.sections));
    onLoadPreset(clonedSections);
    setShowLoadConfirm(false);
  };

  // Cancel load
  const handleLoadCancel = () => {
    setShowLoadConfirm(false);
  };

  // Add new preset (full mode only)
  const handleAdd = async () => {
    if (isReadonly) return;

    const name = prompt('Enter preset name:');
    if (!name || name.trim() === '') return;

    const newPreset = await createPreset(name.trim(), currentSections);
    if (newPreset) {
      setSelectedPresetId(newPreset.id);
    }
  };

  // Update existing preset (full mode only)
  const handleUpdate = async () => {
    if (isReadonly || !selectedPreset) return;

    const confirmMsg = `Update preset "${selectedPreset.name}" with current sections?`;
    if (!confirm(confirmMsg)) return;

    await updatePreset(selectedPreset.id, currentSections);
  };

  // Delete preset (full mode only)
  const handleDelete = async () => {
    if (isReadonly || !selectedPreset) return;

    if (selectedPreset.id === 'default') {
      alert('Cannot delete the default preset.');
      return;
    }

    const confirmMsg = `Delete preset "${selectedPreset.name}"? This cannot be undone.`;
    if (!confirm(confirmMsg)) return;

    const success = await deletePreset(selectedPreset.id);
    if (success) {
      setSelectedPresetId('default');
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Loading presets...
      </div>
    );
  }

  // Readonly mode: simplified single-column layout
  if (isReadonly) {
    return (
      <div className="space-y-3">
        {/* Error Display */}
        {error && (
          <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
            {error}
          </div>
        )}

        {/* Single Column: Load Preset */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
            Load Layout Preset
          </label>
          <div className="flex gap-2">
            <select
              value={selectedPresetId}
              onChange={handleSelectChange}
              disabled={disabled}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              {presets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name} ({preset.sections.length} sections)
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleLoadClick}
              disabled={disabled || !selectedPreset}
              className="px-4 py-2 text-sm font-medium text-white bg-glamlink-teal rounded-md hover:bg-glamlink-teal/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Load
            </button>
          </div>
        </div>

        {/* Preview section removed for readonly mode - users can see actual preview in the card */}

        {/* Load Preset Confirmation Dialog */}
        <LoadPresetConfirmDialog
          isOpen={showLoadConfirm}
          onConfirm={handleLoadConfirm}
          onCancel={handleLoadCancel}
          presetName={selectedPreset?.name || ''}
          sectionCount={selectedPreset?.sections.length || 0}
        />
      </div>
    );
  }

  // Full mode: two-column layout with all controls
  return (
    <div className="space-y-3">
      {/* Error Display */}
      {error && (
        <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
          {error}
        </div>
      )}

      {/* Two Column Layout: Load Preset | Save Current */}
      <div className="grid grid-cols-2 gap-4">
        {/* Load Preset Column */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
            Load Preset
          </label>
          <select
            value={selectedPresetId}
            onChange={handleSelectChange}
            disabled={disabled || isSaving}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100"
          >
            {presets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name} ({preset.sections.length} sections)
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleLoadClick}
            disabled={disabled || isSaving || !selectedPreset}
            className="w-full px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Load Layout
          </button>
        </div>

        {/* Save Current Column */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
            Save Current Layout
          </label>
          <button
            type="button"
            onClick={handleAdd}
            disabled={disabled || isSaving}
            className="w-full px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Save as New Preset
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={disabled || isSaving || !selectedPreset || selectedPreset.id === 'default'}
            className="w-full px-3 py-2 text-sm font-medium text-amber-700 bg-amber-100 border border-amber-300 rounded-md hover:bg-amber-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Update "{selectedPreset?.name || 'Selected'}"
          </button>
        </div>
      </div>

      {/* Saving Indicator */}
      {isSaving && (
        <div className="flex items-center gap-2 text-xs text-purple-600">
          <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Saving...
        </div>
      )}

      {/* Collapsible Preview with Delete Option */}
      {selectedPreset && (
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer text-xs text-gray-600 hover:text-gray-800">
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Preview: {selectedPreset.name} ({selectedPreset.sections.length} sections)
            </span>
            {selectedPreset.id !== 'default' && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
                disabled={disabled || isSaving}
                className="text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                title="Delete this preset"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </summary>
          <div className="mt-2 border border-gray-200 rounded-md bg-white p-2 max-h-32 overflow-y-auto">
            {selectedPreset.sections.length === 0 ? (
              <div className="text-xs text-gray-400 italic">No sections in this preset</div>
            ) : (
              <ul className="space-y-1">
                {selectedPreset.sections
                  .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                  .map((section, index) => (
                    <li
                      key={section.id || index}
                      className="flex items-center justify-between text-xs text-gray-700"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            section.visible ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                        {section.label}
                      </span>
                      <span className="text-gray-400">Z: {section.zIndex ?? 0}</span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </details>
      )}

      {/* Load Preset Confirmation Dialog */}
      <LoadPresetConfirmDialog
        isOpen={showLoadConfirm}
        onConfirm={handleLoadConfirm}
        onCancel={handleLoadCancel}
        presetName={selectedPreset?.name || ''}
        sectionCount={selectedPreset?.sections.length || 0}
      />
    </div>
  );
}

export default LayoutPresetSelector;
