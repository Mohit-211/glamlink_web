"use client";

/**
 * usePreferences Hook
 * Manages preferences editing in the settings page
 */

import { useState, useEffect, useCallback } from 'react';
import { usePreferencesContext } from '../context/PreferencesContext';
import { DEFAULT_PREFERENCES } from '../config';
import type { UserPreferences, UsePreferencesReturn } from '../types';

export function usePreferences(): UsePreferencesReturn {
  const { preferences, refreshPreferences } = usePreferencesContext();

  const [preferencesForm, setPreferencesForm] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [originalForm, setOriginalForm] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Initialize from context
  useEffect(() => {
    setPreferencesForm(preferences);
    setOriginalForm(preferences);
    setIsLoading(false);
  }, [preferences]);

  // Calculate hasChanges
  const hasChanges = JSON.stringify(preferencesForm) !== JSON.stringify(originalForm);

  const handleChange = useCallback(<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferencesForm(prev => ({ ...prev, [key]: value }));
    setError(null);
    setSuccess(false);
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/profile/preferences', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferencesForm)
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      await refreshPreferences();
      setOriginalForm(preferencesForm);
      setSuccess(true);

      // Clear success after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  }, [preferencesForm, refreshPreferences]);

  const handleCancel = useCallback(() => {
    setPreferencesForm(originalForm);
    setError(null);
    setSuccess(false);
  }, [originalForm]);

  const handleReset = useCallback(async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/profile/preferences', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(DEFAULT_PREFERENCES)
      });

      if (!response.ok) {
        throw new Error('Failed to reset preferences');
      }

      await refreshPreferences();
      setPreferencesForm(DEFAULT_PREFERENCES);
      setOriginalForm(DEFAULT_PREFERENCES);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset preferences');
    } finally {
      setIsSaving(false);
    }
  }, [refreshPreferences]);

  return {
    preferencesForm,
    originalForm,
    isLoading,
    isSaving,
    error,
    success,
    hasChanges,
    handleChange,
    handleSave,
    handleCancel,
    handleReset
  };
}
