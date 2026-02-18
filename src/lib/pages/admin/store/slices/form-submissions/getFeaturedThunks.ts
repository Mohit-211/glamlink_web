/**
 * Get Featured Submissions Async Thunks
 *
 * Redux async thunks for Get Featured form submissions CRUD operations.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import type { GetFeaturedSubmission } from '@/lib/pages/apply/featured/types';

// =============================================================================
// FETCH
// =============================================================================

export const fetchGetFeaturedSubmissions = createAsyncThunk(
  'formSubmissions/fetchGetFeatured',
  async () => {
    const response = await fetch('/api/get-featured/submissions', {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch submissions: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.submissions) {
      return data.submissions as GetFeaturedSubmission[];
    }

    throw new Error(data.error || 'Invalid response format');
  }
);

// =============================================================================
// UPDATE STATUS
// =============================================================================

export const updateGetFeaturedStatus = createAsyncThunk(
  'formSubmissions/updateGetFeaturedStatus',
  async ({ id, reviewed, status }: { id: string; reviewed: boolean; status?: string }) => {
    const body: { reviewed: boolean; status?: string } = { reviewed };
    if (status) body.status = status;

    const response = await fetch(`/api/get-featured/submissions/${id}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to update submission status');
    }

    const data = await response.json();

    if (data.success && data.submission) {
      return data.submission as GetFeaturedSubmission;
    }

    throw new Error(data.error || 'Failed to update submission');
  }
);

// =============================================================================
// DELETE
// =============================================================================

export const deleteGetFeaturedSubmission = createAsyncThunk(
  'formSubmissions/deleteGetFeatured',
  async (id: string) => {
    const response = await fetch(`/api/get-featured/submissions/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete submission');
    }

    const data = await response.json();

    if (data.success) {
      return id;
    }

    throw new Error(data.error || 'Failed to delete submission');
  }
);
