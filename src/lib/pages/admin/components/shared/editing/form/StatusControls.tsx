'use client';

/**
 * StatusControls - Unified status review component for submissions
 *
 * Displays current status with badge, dropdown selector, and save button.
 * Used in submission modals to allow status updates.
 *
 * Supports both get-featured and professional submissions with flexible props.
 */

import { STATUS_LABELS } from '@/lib/pages/admin/components/form-submissions/types';

// =============================================================================
// TYPES & CONSTANTS
// =============================================================================

const DEFAULT_STATUS_OPTIONS = [
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' }
];

interface StatusOption {
  value: string;
  label: string;
}

interface StatusControlsProps {
  /** Current status value */
  status: string;
  /** Callback when status changes */
  onStatusChange: (status: string) => void;
  /** Callback to save status */
  onSave: () => void;
  /** Whether save operation is in progress */
  isSaving: boolean;
  /** Optional function to get status label (overrides default lookup) */
  getStatusLabel?: (status: string) => string;
  /** Optional custom status options (defaults to pending_review, approved, rejected) */
  statusOptions?: StatusOption[];
  /** Optional title for the section (defaults to "Review Status") */
  title?: string;
  /** Optional button text (defaults to "Update Status") */
  saveButtonText?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function StatusControls({
  status,
  onStatusChange,
  onSave,
  isSaving,
  getStatusLabel,
  statusOptions = DEFAULT_STATUS_OPTIONS,
  title = 'Review Status',
  saveButtonText = 'Update Status',
}: StatusControlsProps) {
  // Determine status label: use custom function if provided, otherwise fall back to STATUS_LABELS
  const statusLabel = getStatusLabel
    ? getStatusLabel(status)
    : (STATUS_LABELS[status] || status);

  // Determine badge color based on status
  const getBadgeColor = (statusValue: string): string => {
    if (statusValue === 'approved') return 'bg-green-100 text-green-800';
    if (statusValue === 'rejected') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <span className="text-sm font-medium text-gray-700">
          Status:{' '}
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(
              status
            )}`}
          >
            {statusLabel}
          </span>
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          aria-label="Select status"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label={saveButtonText}
        >
          {isSaving ? 'Saving...' : saveButtonText}
        </button>
      </div>
    </div>
  );
}

// Default export for backwards compatibility
export default StatusControls;
