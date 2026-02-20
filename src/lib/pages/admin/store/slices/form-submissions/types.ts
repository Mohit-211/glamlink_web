/**
 * Form Submissions Redux State Types
 *
 * State interfaces and initial state for all form submissions data.
 */

import type { GetFeaturedSubmission } from '@/lib/pages/apply/featured/types';
import type { DigitalCardSubmission } from '@/lib/pages/admin/components/form-submissions/types';
import type { UnifiedFormConfig } from '@/lib/pages/admin/components/form-submissions/form-configurations/types';

// =============================================================================
// STATE INTERFACES
// =============================================================================

export interface GetFeaturedState {
  data: GetFeaturedSubmission[];
  lastUpdated: number | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  isDeleting: boolean;
}

export interface DigitalCardState {
  data: DigitalCardSubmission[];
  lastUpdated: number | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  isDeleting: boolean;
  isConverting: boolean;
}

export interface FormConfigsState {
  data: UnifiedFormConfig[];
  lastUpdated: number | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  isDeleting: boolean;
  isMigrating: boolean;
}

export interface FormSubmissionsState {
  getFeatured: GetFeaturedState;
  digitalCard: DigitalCardState;
  formConfigs: FormConfigsState;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

export const initialState: FormSubmissionsState = {
  getFeatured: {
    data: [],
    lastUpdated: null,
    isLoading: false,
    error: null,
    isSaving: false,
    isDeleting: false,
  },
  digitalCard: {
    data: [],
    lastUpdated: null,
    isLoading: false,
    error: null,
    isSaving: false,
    isDeleting: false,
    isConverting: false,
  },
  formConfigs: {
    data: [],
    lastUpdated: null,
    isLoading: false,
    error: null,
    isSaving: false,
    isDeleting: false,
    isMigrating: false,
  },
};
