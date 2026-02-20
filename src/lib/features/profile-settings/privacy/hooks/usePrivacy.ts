"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/features/auth/useAuth";
import { DEFAULT_PRIVACY_SETTINGS } from "../config";
import type { PrivacySettings, UsePrivacyReturn } from "../types";

export function usePrivacy(): UsePrivacyReturn {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings>(DEFAULT_PRIVACY_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!user?.uid) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/profile/privacy", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch privacy settings");
      }

      const data = await response.json();
      setSettings(data.settings || DEFAULT_PRIVACY_SETTINGS);
    } catch (err) {
      console.error("Error fetching privacy settings:", err);
      setError(err instanceof Error ? err.message : "Failed to load settings");
      // Use defaults on error
      setSettings(DEFAULT_PRIVACY_SETTINGS);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSetting = useCallback(
    async <K extends keyof PrivacySettings>(key: K, value: PrivacySettings[K]) => {
      if (!user?.uid) {
        setError("You must be logged in to update settings");
        return;
      }

      // Optimistic update
      const previousSettings = settings;
      setSettings((prev) => ({ ...prev, [key]: value }));
      setIsSaving(true);
      setError(null);

      try {
        const response = await fetch("/api/profile/privacy", {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ [key]: value }),
        });

        if (!response.ok) {
          throw new Error("Failed to update privacy setting");
        }

        const data = await response.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      } catch (err) {
        console.error("Error updating privacy setting:", err);
        setError(err instanceof Error ? err.message : "Failed to update setting");
        // Rollback on error
        setSettings(previousSettings);
      } finally {
        setIsSaving(false);
      }
    },
    [user?.uid, settings]
  );

  return {
    settings,
    isLoading,
    isSaving,
    error,
    updateSetting,
  };
}
