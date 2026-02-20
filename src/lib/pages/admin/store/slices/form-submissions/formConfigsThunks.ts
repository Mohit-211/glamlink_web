/**
 * Form Configs Async Thunks
 *
 * Redux async thunks for Form Configurations CRUD and migration operations.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import type { UnifiedFormConfig, FormCategory } from '@/lib/pages/admin/components/form-submissions/form-configurations/types';

// =============================================================================
// FETCH
// =============================================================================

export const fetchFormConfigs = createAsyncThunk(
  'formSubmissions/fetchFormConfigs',
  async () => {
    // Fetch from both sources in parallel
    const [getFeaturedResponse, digitalCardResponse] = await Promise.all([
      fetch('/api/get-featured/forms', { credentials: 'include' }),
      fetch('/api/form-configs/digital-card', { credentials: 'include' }),
    ]);

    const results: UnifiedFormConfig[] = [];

    // Process Get Featured configs
    if (getFeaturedResponse.ok) {
      const getFeaturedData = await getFeaturedResponse.json();
      if (getFeaturedData.success && getFeaturedData.data) {
        const configs = getFeaturedData.data.map((c: UnifiedFormConfig) => ({
          ...c,
          category: 'get-featured' as FormCategory,
        }));
        results.push(...configs);
      }
    }

    // Process Digital Card configs
    if (digitalCardResponse.ok) {
      const digitalCardData = await digitalCardResponse.json();
      if (digitalCardData.success && digitalCardData.data) {
        const configs = Array.isArray(digitalCardData.data)
          ? digitalCardData.data
          : [digitalCardData.data];
        results.push(...configs);
      }
    }

    return results;
  }
);

// =============================================================================
// CREATE
// =============================================================================

export const createFormConfig = createAsyncThunk(
  'formSubmissions/createFormConfig',
  async (config: Partial<UnifiedFormConfig>) => {
    if (!config.category) {
      throw new Error('Category is required');
    }

    const endpoint =
      config.category === 'get-featured'
        ? '/api/get-featured/forms'
        : '/api/form-configs/digital-card';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error('Failed to create form configuration');
    }

    const result = await response.json();

    if (result.success && result.data) {
      return { ...result.data, category: config.category } as UnifiedFormConfig;
    }

    throw new Error(result.error || 'Failed to create form configuration');
  }
);

// =============================================================================
// UPDATE
// =============================================================================

export const updateFormConfig = createAsyncThunk(
  'formSubmissions/updateFormConfig',
  async (config: Partial<UnifiedFormConfig>) => {
    if (!config.id || !config.category) {
      throw new Error('Form configuration ID and category are required');
    }

    const endpoint =
      config.category === 'get-featured'
        ? `/api/get-featured/forms/${config.id}`
        : `/api/form-configs/digital-card/${config.id}`;

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error('Failed to update form configuration');
    }

    const result = await response.json();

    if (result.success && result.data) {
      return { ...result.data, category: config.category } as UnifiedFormConfig;
    }

    throw new Error(result.error || 'Failed to update form configuration');
  }
);

// =============================================================================
// DELETE
// =============================================================================

export const deleteFormConfig = createAsyncThunk(
  'formSubmissions/deleteFormConfig',
  async ({ id, category }: { id: string; category: FormCategory }) => {
    const endpoint =
      category === 'get-featured'
        ? `/api/get-featured/forms/${id}`
        : `/api/form-configs/digital-card/${id}`;

    const response = await fetch(endpoint, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete form configuration');
    }

    const result = await response.json();

    if (result.success) {
      return { id, category };
    }

    throw new Error(result.error || 'Failed to delete form configuration');
  }
);

// =============================================================================
// MIGRATION
// =============================================================================

export const migrateGetFeaturedForms = createAsyncThunk(
  'formSubmissions/migrateGetFeatured',
  async () => {
    const response = await fetch('/api/get-featured/forms/migrate', {
      method: 'POST',
      credentials: 'include',
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return result.message || 'Migration completed successfully';
    }

    throw new Error(result.error || 'Migration failed');
  }
);

export const migrateDigitalCardForm = createAsyncThunk(
  'formSubmissions/migrateDigitalCard',
  async () => {
    const response = await fetch('/api/form-configs/digital-card/migrate', {
      method: 'POST',
      credentials: 'include',
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return result.message || 'Migration completed successfully';
    }

    throw new Error(result.error || 'Migration failed');
  }
);
