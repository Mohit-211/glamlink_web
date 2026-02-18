"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/features/auth/useAuth";
import { DEFAULT_BUSINESS_HOURS, validateSlug } from "../config";
import type { BrandSettings, DayOfWeek, DayHours, BusinessHours, SpecialHours, ServiceArea, Address, UseBrandSettingsReturn } from "../types";

export function useBrandSettings(): UseBrandSettingsReturn {
  const { user } = useAuth();
  const [settings, setSettings] = useState<BrandSettings | null>(null);
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
      const response = await fetch("/api/profile/brand-settings", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch brand settings");
      }

      const data = await response.json();
      setSettings(data.settings);
    } catch (err) {
      console.error("Error fetching brand settings:", err);
      setError(err instanceof Error ? err.message : "Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // URL Methods
  const checkSlugAvailability = useCallback(async (slug: string): Promise<{ available: boolean; suggestion?: string }> => {
    // Validate format first
    const validation = validateSlug(slug);
    if (!validation.valid) {
      return { available: false };
    }

    try {
      const response = await fetch(`/api/profile/brand-settings/slug/check?slug=${encodeURIComponent(slug)}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to check slug availability");
      }

      const data = await response.json();
      return { available: data.available, suggestion: data.suggestion };
    } catch (err) {
      console.error("Error checking slug availability:", err);
      return { available: false };
    }
  }, []);

  const updateSlug = useCallback(async (slug: string) => {
    if (!user?.uid || !settings) {
      setError("You must be logged in to update slug");
      return;
    }

    // Validate slug
    const validation = validateSlug(slug);
    if (!validation.valid) {
      setError(validation.error || "Invalid slug");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/profile/brand-settings/slug", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update slug");
      }

      const data = await response.json();
      setSettings(data.settings);
    } catch (err) {
      console.error("Error updating slug:", err);
      setError(err instanceof Error ? err.message : "Failed to update slug");
    } finally {
      setIsSaving(false);
    }
  }, [user?.uid, settings]);

  // Hours Methods
  const updateDayHours = useCallback(async (day: DayOfWeek, hours: DayHours) => {
    if (!user?.uid || !settings) {
      setError("You must be logged in to update hours");
      return;
    }

    // Optimistic update
    const previousSettings = settings;
    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        hours: {
          ...prev.hours,
          [day]: hours,
        },
      };
    });
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/profile/brand-settings/hours", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day, hours }),
      });

      if (!response.ok) {
        throw new Error("Failed to update hours");
      }

      const data = await response.json();
      setSettings(data.settings);
    } catch (err) {
      console.error("Error updating hours:", err);
      setError(err instanceof Error ? err.message : "Failed to update hours");
      // Rollback on error
      setSettings(previousSettings);
    } finally {
      setIsSaving(false);
    }
  }, [user?.uid, settings]);

  const updateAllHours = useCallback(async (hours: BusinessHours) => {
    if (!user?.uid || !settings) {
      setError("You must be logged in to update hours");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/profile/brand-settings/hours", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ allHours: hours }),
      });

      if (!response.ok) {
        throw new Error("Failed to update hours");
      }

      const data = await response.json();
      setSettings(data.settings);
    } catch (err) {
      console.error("Error updating hours:", err);
      setError(err instanceof Error ? err.message : "Failed to update hours");
    } finally {
      setIsSaving(false);
    }
  }, [user?.uid, settings]);

  const addSpecialHours = useCallback(async (special: Omit<SpecialHours, 'id'>) => {
    if (!user?.uid || !settings) {
      setError("You must be logged in to add special hours");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/profile/brand-settings/hours/special", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(special),
      });

      if (!response.ok) {
        throw new Error("Failed to add special hours");
      }

      const data = await response.json();
      setSettings(data.settings);
    } catch (err) {
      console.error("Error adding special hours:", err);
      setError(err instanceof Error ? err.message : "Failed to add special hours");
    } finally {
      setIsSaving(false);
    }
  }, [user?.uid, settings]);

  const removeSpecialHours = useCallback(async (id: string) => {
    if (!user?.uid || !settings) {
      setError("You must be logged in to remove special hours");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/profile/brand-settings/hours/special/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to remove special hours");
      }

      const data = await response.json();
      setSettings(data.settings);
    } catch (err) {
      console.error("Error removing special hours:", err);
      setError(err instanceof Error ? err.message : "Failed to remove special hours");
    } finally {
      setIsSaving(false);
    }
  }, [user?.uid, settings]);

  // Location Methods
  const updateLocation = useCallback(async (location: Partial<ServiceArea>) => {
    if (!user?.uid || !settings) {
      setError("You must be logged in to update location");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/profile/brand-settings/location", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(location),
      });

      if (!response.ok) {
        throw new Error("Failed to update location");
      }

      const data = await response.json();
      setSettings(data.settings);
    } catch (err) {
      console.error("Error updating location:", err);
      setError(err instanceof Error ? err.message : "Failed to update location");
    } finally {
      setIsSaving(false);
    }
  }, [user?.uid, settings]);

  const updateAddress = useCallback(async (address: Address) => {
    if (!user?.uid || !settings) {
      setError("You must be logged in to update address");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/profile/brand-settings/location/address", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address),
      });

      if (!response.ok) {
        throw new Error("Failed to update address");
      }

      const data = await response.json();
      setSettings(data.settings);
    } catch (err) {
      console.error("Error updating address:", err);
      setError(err instanceof Error ? err.message : "Failed to update address");
    } finally {
      setIsSaving(false);
    }
  }, [user?.uid, settings]);

  return {
    settings,
    isLoading,
    isSaving,
    error,
    checkSlugAvailability,
    updateSlug,
    updateDayHours,
    updateAllHours,
    addSpecialHours,
    removeSpecialHours,
    updateLocation,
    updateAddress,
  };
}
