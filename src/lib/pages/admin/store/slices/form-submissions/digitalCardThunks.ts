/**
 * Digital Card Submissions Async Thunks
 *
 * Redux async thunks for Digital Card form submissions CRUD operations.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import type { DigitalCardSubmission } from '@/lib/pages/admin/components/form-submissions/types';

// =============================================================================
// FETCH
// =============================================================================

export const fetchDigitalCardSubmissions = createAsyncThunk(
  'formSubmissions/fetchDigitalCard',
  async () => {
    const response = await fetch('/api/apply/digital-card/submissions', {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch submissions: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.submissions) {
      return data.submissions as DigitalCardSubmission[];
    }

    throw new Error(data.error || 'Invalid response format');
  }
);

// =============================================================================
// UPDATE STATUS
// =============================================================================

export const updateDigitalCardStatus = createAsyncThunk(
  'formSubmissions/updateDigitalCardStatus',
  async ({
    id,
    reviewed,
    status,
    hidden,
  }: {
    id: string;
    reviewed: boolean;
    status?: string;
    hidden?: boolean;
  }) => {
    const body: { reviewed: boolean; status?: string; hidden?: boolean } = { reviewed };
    if (status) body.status = status;
    if (typeof hidden === 'boolean') body.hidden = hidden;

    const response = await fetch(`/api/apply/digital-card/submissions/${id}/review`, {
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
      return data.submission as DigitalCardSubmission;
    }

    throw new Error(data.error || 'Failed to update submission');
  }
);

// =============================================================================
// DELETE
// =============================================================================

export const deleteDigitalCardSubmission = createAsyncThunk(
  'formSubmissions/deleteDigitalCard',
  async (id: string) => {
    const response = await fetch(`/api/apply/digital-card/submissions/${id}`, {
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

// =============================================================================
// CONVERT TO PROFESSIONAL
// =============================================================================

export const convertDigitalCardToProfessional = createAsyncThunk(
  'formSubmissions/convertToProfessional',
  async (id: string) => {
    const response = await fetch(`/api/apply/digital-card/submissions/${id}/convert`, {
      method: 'POST',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to convert submission to professional');
    }

    if (data.success) {
      return { id, professionalId: data.professionalId };
    }

    throw new Error(data.error || 'Failed to convert submission');
  }
);
