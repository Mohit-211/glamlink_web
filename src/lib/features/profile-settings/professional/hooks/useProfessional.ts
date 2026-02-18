"use client";

/**
 * useProfessional - Hook to manage professional display settings
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/features/auth/useAuth";
import { DEFAULT_PROFESSIONAL_SETTINGS } from "../config";
import type {
  ProfessionalSettings,
  CertificationDisplaySettings,
  PortfolioSettings,
  PricingSettings,
  ReviewSettings,
  UseProfessionalReturn,
} from "../types";

export function useProfessional(): UseProfessionalReturn {
  const { user } = useAuth();
  const [settings, setSettings] = useState<ProfessionalSettings>(
    DEFAULT_PROFESSIONAL_SETTINGS
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!user?.uid) {
      setSettings(DEFAULT_PROFESSIONAL_SETTINGS);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/profile/professional-settings", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch professional settings");
      }

      const data = await response.json();

      if (data.success) {
        setSettings(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch settings");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch settings");
      setSettings(DEFAULT_PROFESSIONAL_SETTINGS);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateCertificationSettings = async (
    updates: Partial<CertificationDisplaySettings>
  ) => {
    setIsSaving(true);
    setError(null);

    // Optimistic update
    const previousSettings = { ...settings };
    setSettings({
      ...settings,
      certifications: { ...settings.certifications, ...updates },
    });

    try {
      const response = await fetch(
        "/api/profile/professional-settings/certifications",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update certification settings");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update settings");
      }
    } catch (err) {
      // Revert on error
      setSettings(previousSettings);
      setError(err instanceof Error ? err.message : "Failed to update settings");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const updatePortfolioSettings = async (updates: Partial<PortfolioSettings>) => {
    setIsSaving(true);
    setError(null);

    // Optimistic update
    const previousSettings = { ...settings };
    setSettings({
      ...settings,
      portfolio: { ...settings.portfolio, ...updates },
    });

    try {
      const response = await fetch(
        "/api/profile/professional-settings/portfolio",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update portfolio settings");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update settings");
      }
    } catch (err) {
      // Revert on error
      setSettings(previousSettings);
      setError(err instanceof Error ? err.message : "Failed to update settings");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const updatePricingSettings = async (updates: Partial<PricingSettings>) => {
    setIsSaving(true);
    setError(null);

    // Optimistic update
    const previousSettings = { ...settings };
    setSettings({
      ...settings,
      pricing: { ...settings.pricing, ...updates },
    });

    try {
      const response = await fetch("/api/profile/professional-settings/pricing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update pricing settings");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update settings");
      }
    } catch (err) {
      // Revert on error
      setSettings(previousSettings);
      setError(err instanceof Error ? err.message : "Failed to update settings");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const updateReviewSettings = async (updates: Partial<ReviewSettings>) => {
    setIsSaving(true);
    setError(null);

    // Optimistic update
    const previousSettings = { ...settings };
    setSettings({
      ...settings,
      reviews: { ...settings.reviews, ...updates },
    });

    try {
      const response = await fetch("/api/profile/professional-settings/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update review settings");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update settings");
      }
    } catch (err) {
      // Revert on error
      setSettings(previousSettings);
      setError(err instanceof Error ? err.message : "Failed to update settings");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings,
    isLoading,
    isSaving,
    error,
    updateCertificationSettings,
    updatePortfolioSettings,
    updatePricingSettings,
    updateReviewSettings,
  };
}
