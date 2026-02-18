"use client";

/**
 * useTwoFactor - Hook for managing two-factor authentication
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/features/auth/useAuth";
import type { TwoFactorMethod, TwoFactorConfig, UseTwoFactorReturn } from "./types";

export function useTwoFactor(): UseTwoFactorReturn {
  const { user } = useAuth();

  // State
  const [twoFactorConfig, setTwoFactorConfig] = useState<TwoFactorConfig>({
    enabled: false,
    backupCodes: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEnabling, setIsEnabling] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch two-factor config
  const fetchTwoFactorConfig = useCallback(async () => {
    if (!user?.uid) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/profile/two-factor", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch two-factor config");
      }

      const data = await response.json();
      if (data.success && data.data) {
        setTwoFactorConfig(data.data);
      }
    } catch (err) {
      console.error("Error fetching two-factor config:", err);
      // Don't set error for initial fetch - just use default disabled state
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchTwoFactorConfig();
  }, [fetchTwoFactorConfig]);

  // Enable two-factor authentication
  const enableTwoFactor = async (method: TwoFactorMethod, phoneNumber?: string) => {
    if (!user?.uid) {
      setError("You must be logged in to enable two-factor authentication");
      return;
    }

    // Validate phone number for SMS method
    if (method === "sms" && !phoneNumber) {
      setError("Phone number is required for SMS authentication");
      return;
    }

    setIsEnabling(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/profile/two-factor/enable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ method, phoneNumber }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to enable two-factor authentication");
      }

      const data = await response.json();
      if (data.success && data.data) {
        setTwoFactorConfig(data.data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to enable two-factor authentication";
      setError(errorMessage);
    } finally {
      setIsEnabling(false);
    }
  };

  // Disable two-factor authentication
  const disableTwoFactor = async () => {
    if (!user?.uid) {
      setError("You must be logged in to disable two-factor authentication");
      return;
    }

    setIsDisabling(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/profile/two-factor/disable", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to disable two-factor authentication");
      }

      setTwoFactorConfig({
        enabled: false,
        backupCodes: [],
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to disable two-factor authentication";
      setError(errorMessage);
    } finally {
      setIsDisabling(false);
    }
  };

  // Regenerate backup codes
  const regenerateBackupCodes = async () => {
    if (!user?.uid) {
      setError("You must be logged in to regenerate backup codes");
      return;
    }

    if (!twoFactorConfig.enabled) {
      setError("Two-factor authentication must be enabled first");
      return;
    }

    setError(null);

    try {
      const response = await fetch("/api/profile/two-factor/regenerate-codes", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to regenerate backup codes");
      }

      const data = await response.json();
      if (data.success && data.data?.backupCodes) {
        setTwoFactorConfig((prev) => ({
          ...prev,
          backupCodes: data.data.backupCodes,
        }));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to regenerate backup codes";
      setError(errorMessage);
    }
  };

  // Verify two-factor code
  const verifyCode = async (code: string): Promise<boolean> => {
    if (!user?.uid) {
      setError("You must be logged in to verify code");
      return false;
    }

    setError(null);

    try {
      const response = await fetch("/api/profile/two-factor/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Invalid verification code");
      }

      const data = await response.json();
      return data.success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Invalid verification code";
      setError(errorMessage);
      return false;
    }
  };

  return {
    // State
    twoFactorEnabled: twoFactorConfig.enabled,
    twoFactorMethod: twoFactorConfig.method,
    backupCodes: twoFactorConfig.backupCodes || [],

    // Status
    isLoading,
    isEnabling,
    isDisabling,
    error,
    success,

    // Handlers
    enableTwoFactor,
    disableTwoFactor,
    regenerateBackupCodes,
    verifyCode,
  };
}
