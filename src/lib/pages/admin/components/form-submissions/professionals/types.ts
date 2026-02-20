/**
 * Professional Submissions Types
 *
 * Types and filter configurations for professional submissions management.
 */

import type {
  SelectFilterConfig,
  CheckboxFilterConfig,
  StatBadgeConfig,
  ActionButtonConfig
} from '@/lib/pages/admin/components/shared/common';
import type { SubmissionStatusFilter } from '../types';

// =============================================================================
// STATS TYPES
// =============================================================================

export interface ProfessionalStats {
  total: number;
  visible: number;
  hidden: number;
  pendingReview: number;
  approved: number;
  rejected: number;
}

// =============================================================================
// FILTER CONFIGURATIONS (for DisplayFilters component)
// =============================================================================

export const PROFESSIONAL_SEARCH_PLACEHOLDER = 'Search by name, email, business, or specialty...';
export const PROFESSIONAL_ACCENT_COLOR = 'indigo' as const;

const STATUS_OPTIONS = [
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' }
];

export function getProfessionalSelectFilters(
  statusFilter: SubmissionStatusFilter,
  onStatusFilterChange: (status: SubmissionStatusFilter) => void
): SelectFilterConfig[] {
  return [{
    id: 'status',
    value: statusFilter,
    onChange: (value) => onStatusFilterChange(value as SubmissionStatusFilter),
    placeholder: 'All Statuses',
    options: STATUS_OPTIONS
  }];
}

export function getProfessionalCheckboxFilters(
  showHidden: boolean,
  onShowHiddenChange: (show: boolean) => void,
  hiddenCount: number
): CheckboxFilterConfig[] {
  return [{
    id: 'showHidden',
    checked: showHidden,
    onChange: onShowHiddenChange,
    label: `Show Hidden (${hiddenCount})`
  }];
}

export function getProfessionalStatBadges(stats: ProfessionalStats): StatBadgeConfig[] {
  return [
    { id: 'pending', count: stats.pendingReview, label: 'pending', color: 'yellow' },
    { id: 'approved', count: stats.approved, label: 'approved', color: 'green' },
    { id: 'rejected', count: stats.rejected, label: 'rejected', color: 'red' }
  ];
}

export function getProfessionalActionButtons(
  onRefresh: () => void,
  isLoading: boolean
): ActionButtonConfig[] {
  return [{
    id: 'refresh',
    label: 'Refresh',
    loadingLabel: 'Loading...',
    onClick: onRefresh,
    isLoading: isLoading,
    variant: 'secondary'
  }];
}
