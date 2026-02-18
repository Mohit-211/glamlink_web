'use client';

/**
 * useLayoutPresets - Hook for managing section layout presets
 *
 * Provides CRUD operations for section layout presets stored in Firestore.
 * Used by LayoutPresetSelector component.
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  SectionLayoutPreset,
  CondensedCardSectionInstance,
} from '@/lib/features/digital-cards/types/condensedCardConfig';

// =============================================================================
// TYPES
// =============================================================================

export interface UseLayoutPresetsReturn {
  /** All available presets */
  presets: SectionLayoutPreset[];

  /** Loading state for initial fetch */
  isLoading: boolean;

  /** Error message if any */
  error: string | null;

  /** Saving state for mutations */
  isSaving: boolean;

  /** Fetch all presets from API */
  fetchPresets: () => Promise<void>;

  /** Create a new preset */
  createPreset: (name: string, sections: CondensedCardSectionInstance[]) => Promise<SectionLayoutPreset | null>;

  /** Update an existing preset */
  updatePreset: (id: string, sections: CondensedCardSectionInstance[]) => Promise<SectionLayoutPreset | null>;

  /** Delete a preset (not allowed for 'default') */
  deletePreset: (id: string) => Promise<boolean>;
}

// =============================================================================
// HOOK
// =============================================================================

export function useLayoutPresets(): UseLayoutPresetsReturn {
  const [presets, setPresets] = useState<SectionLayoutPreset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all presets
  const fetchPresets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/section-layout-presets', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch presets');
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setPresets(data.data);
      } else {
        throw new Error(data.error || 'Invalid response');
      }
    } catch (err) {
      console.error('Error fetching section layout presets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch presets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new preset
  const createPreset = useCallback(
    async (name: string, sections: CondensedCardSectionInstance[]): Promise<SectionLayoutPreset | null> => {
      setIsSaving(true);
      setError(null);

      try {
        const response = await fetch('/api/section-layout-presets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name, sections }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to create preset');
        }

        const data = await response.json();

        if (data.success && data.data) {
          const newPreset = data.data as SectionLayoutPreset;
          setPresets((prev) => [...prev, newPreset].sort((a, b) => {
            if (a.id === 'default') return -1;
            if (b.id === 'default') return 1;
            return a.name.localeCompare(b.name);
          }));
          return newPreset;
        }

        throw new Error('Invalid response');
      } catch (err) {
        console.error('Error creating preset:', err);
        setError(err instanceof Error ? err.message : 'Failed to create preset');
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  // Update an existing preset
  const updatePreset = useCallback(
    async (id: string, sections: CondensedCardSectionInstance[]): Promise<SectionLayoutPreset | null> => {
      setIsSaving(true);
      setError(null);

      try {
        const response = await fetch(`/api/section-layout-presets/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ sections }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to update preset');
        }

        const data = await response.json();

        if (data.success && data.data) {
          const updatedPreset = data.data as SectionLayoutPreset;
          setPresets((prev) =>
            prev.map((p) => (p.id === id ? updatedPreset : p))
          );
          return updatedPreset;
        }

        throw new Error('Invalid response');
      } catch (err) {
        console.error('Error updating preset:', err);
        setError(err instanceof Error ? err.message : 'Failed to update preset');
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  // Delete a preset
  const deletePreset = useCallback(async (id: string): Promise<boolean> => {
    if (id === 'default') {
      setError('Cannot delete the default preset');
      return false;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/section-layout-presets/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete preset');
      }

      setPresets((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting preset:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete preset');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Fetch presets on mount
  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  return {
    presets,
    isLoading,
    error,
    isSaving,
    fetchPresets,
    createPreset,
    updatePreset,
    deletePreset,
  };
}
