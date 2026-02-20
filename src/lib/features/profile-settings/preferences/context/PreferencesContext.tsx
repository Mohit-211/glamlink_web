"use client";

/**
 * Preferences Context
 * Global preferences provider with formatting utilities
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/lib/features/auth/useAuth';
import { ThemeManager, PreferencesFormatter } from '../utils';
import { DEFAULT_PREFERENCES } from '../config';
import type { UserPreferences, ThemeMode, PreferencesContextValue } from '../types';

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  // Create formatter instance (memoized)
  const formatter = useMemo(() => new PreferencesFormatter(preferences), [preferences]);

  // Apply theme whenever it changes
  useEffect(() => {
    ThemeManager.applyTheme(preferences.theme);
  }, [preferences.theme]);

  // Watch system theme changes
  useEffect(() => {
    if (preferences.theme !== 'system') return;

    return ThemeManager.watchSystemTheme(() => {
      ThemeManager.applyTheme('system');
    });
  }, [preferences.theme]);

  // Initial load
  useEffect(() => {
    const loadPreferences = async () => {
      // Apply stored theme immediately (before API)
      const storedTheme = ThemeManager.getStoredTheme();
      if (storedTheme) {
        ThemeManager.applyTheme(storedTheme);
      }

      // Fetch from API if authenticated
      if (user?.uid) {
        try {
          const response = await fetch('/api/profile/preferences', {
            credentials: 'include'
          });

          if (response.ok) {
            const data = await response.json();
            setPreferences(data.preferences);
          }
        } catch (error) {
          console.error('Failed to load preferences:', error);
        }
      }

      setIsLoading(false);
    };

    loadPreferences();
  }, [user?.uid]);

  // Immediate theme update
  const updateTheme = useCallback(async (theme: ThemeMode) => {
    ThemeManager.applyTheme(theme);
    setPreferences(prev => ({ ...prev, theme }));

    // Save to API (non-blocking)
    if (user?.uid) {
      fetch('/api/profile/preferences', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme })
      }).catch(err => console.error('Failed to save theme:', err));
    }
  }, [user?.uid]);

  // Formatting utilities
  const formatDate = useCallback((date: Date | string) => {
    return formatter.formatDate(date);
  }, [formatter]);

  const formatTime = useCallback((date: Date | string) => {
    return formatter.formatTime(date);
  }, [formatter]);

  const formatCurrency = useCallback((amount: number) => {
    return formatter.formatCurrency(amount);
  }, [formatter]);

  // Refresh preferences from API
  const refreshPreferences = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const response = await fetch('/api/profile/preferences', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error('Failed to refresh preferences:', error);
    }
  }, [user?.uid]);

  const value: PreferencesContextValue = {
    preferences,
    isLoading,
    updateTheme,
    formatDate,
    formatTime,
    formatCurrency,
    refreshPreferences
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferencesContext() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferencesContext must be used within PreferencesProvider');
  }
  return context;
}
