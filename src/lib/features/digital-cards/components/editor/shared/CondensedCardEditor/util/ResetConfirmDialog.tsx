'use client';

/**
 * ResetConfirmDialog - Confirmation dialog for resetting sections
 *
 * Uses the shared ConfirmDialog with preset values for the reset action.
 */

import React from 'react';
import { ConfirmDialog } from './ConfirmDialog';

// =============================================================================
// TYPES
// =============================================================================

export interface ResetConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ResetConfirmDialog({ isOpen, onConfirm, onCancel }: ResetConfirmDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onConfirm={onConfirm}
      onCancel={onCancel}
      title="Reset Content Sections?"
      message="This will remove all content sections from your condensed card. Styling sections will remain. You can add sections back using the &quot;Add Section&quot; button."
      confirmText="Reset Sections"
      cancelText="Cancel"
      variant="danger"
    />
  );
}

export default ResetConfirmDialog;
