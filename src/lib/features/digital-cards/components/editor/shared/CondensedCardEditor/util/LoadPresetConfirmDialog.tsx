'use client';

/**
 * LoadPresetConfirmDialog - Confirmation dialog for loading a layout preset
 *
 * Uses the shared ConfirmDialog with preset values for the load action.
 * Warns users that loading a preset will replace their current sections.
 */

import React from 'react';
import { ConfirmDialog } from './ConfirmDialog';

// =============================================================================
// TYPES
// =============================================================================

export interface LoadPresetConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  /** Name of the preset being loaded */
  presetName: string;
  /** Number of sections in the preset */
  sectionCount: number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function LoadPresetConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  presetName,
  sectionCount,
}: LoadPresetConfirmDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onConfirm={onConfirm}
      onCancel={onCancel}
      title="Load Layout Preset?"
      message={`Loading "${presetName}" will replace your current sections with ${sectionCount} sections from this preset.\n\nYour current section arrangement will be lost. Make sure to save your current layout as a preset first if you want to keep it.`}
      confirmText="Load Preset"
      cancelText="Cancel"
      variant="warning"
    />
  );
}

export default LoadPresetConfirmDialog;
