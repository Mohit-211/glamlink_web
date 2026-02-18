"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/features/auth/useAuth";
import { DEFAULT_PREFERENCES } from "../config";
import type {
  NotificationPreferences,
  UseNotificationsReturn,
} from "../types";

export function useNotifications(): UseNotificationsReturn {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    DEFAULT_PREFERENCES
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = useCallback(async () => {
    if (!user?.uid) {
      setPreferences(DEFAULT_PREFERENCES);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/profile/notifications", {
        method: "GET",
        credentials: "include",  // CRITICAL for auth
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notification preferences");
      }

      const data = await response.json();

      if (data.success) {
        setPreferences(data.preferences);
      } else {
        throw new Error(data.error || "Failed to fetch preferences");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch preferences");
      setPreferences(DEFAULT_PREFERENCES);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const updatePreference = async (
    key: keyof NotificationPreferences,
    value: boolean
  ) => {
    if (!user?.uid) {
      setError("You must be logged in");
      return;
    }

    // Prevent disabling required notifications
    if (key === 'emailSecurity' && !value) {
      setError("Security alerts cannot be disabled");
      return;
    }

    setIsSaving(true);
    setError(null);

    // Optimistic update
    const previousPreferences = { ...preferences };
    setPreferences({ ...preferences, [key]: value });

    try {
      const response = await fetch("/api/profile/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ [key]: value }),
      });

      if (!response.ok) {
        throw new Error("Failed to update preference");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update preference");
      }
    } catch (err) {
      // Revert on error
      setPreferences(previousPreferences);
      setError(err instanceof Error ? err.message : "Failed to update preference");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const updateAllInCategory = async (
    keys: (keyof NotificationPreferences)[],
    value: boolean
  ) => {
    if (!user?.uid) {
      setError("You must be logged in");
      return;
    }

    setIsSaving(true);
    setError(null);

    // Filter out required preferences when disabling
    const keysToUpdate = value
      ? keys
      : keys.filter(key => key !== 'emailSecurity');

    // Optimistic update
    const previousPreferences = { ...preferences };
    const updates = keysToUpdate.reduce((acc, key) => {
      acc[key] = value;
      return acc;
    }, {} as Partial<NotificationPreferences>);

    setPreferences({ ...preferences, ...updates });

    try {
      const response = await fetch("/api/profile/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update preferences");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update preferences");
      }
    } catch (err) {
      // Revert on error
      setPreferences(previousPreferences);
      setError(err instanceof Error ? err.message : "Failed to update preferences");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    preferences,
    isLoading,
    isSaving,
    error,
    updatePreference,
    updateAllInCategory,
  };
}
