"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/features/auth/useAuth";
import type {
  TwoFactorMethod,
  TwoFactorStatus,
  TwoFactorSetupData,
  Session,
  LoginEvent,
  ConnectedApp,
  UseSecuritySettingsReturn,
} from "../types";

export function useSecuritySettings(): UseSecuritySettingsReturn {
  const { user } = useAuth();

  // Two-Factor Auth State
  const [twoFactorStatus, setTwoFactorStatus] = useState<TwoFactorStatus | null>(null);
  const [setupData, setSetupData] = useState<TwoFactorSetupData | null>(null);
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);

  // Sessions State
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  // Login History State
  const [loginHistory, setLoginHistory] = useState<LoginEvent[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Connected Apps State
  const [connectedApps, setConnectedApps] = useState<ConnectedApp[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(true);

  // General State
  const [error, setError] = useState<string | null>(null);

  // Fetch all security data
  const fetchSecurityData = useCallback(async () => {
    if (!user?.uid) {
      setIsLoadingSessions(false);
      setIsLoadingHistory(false);
      setIsLoadingApps(false);
      return;
    }

    try {
      // Fetch all data in parallel
      const [statusRes, sessionsRes, historyRes, appsRes] = await Promise.all([
        fetch("/api/profile/security/2fa/status", { credentials: "include" }),
        fetch("/api/profile/security/sessions", { credentials: "include" }),
        fetch("/api/profile/security/login-history", { credentials: "include" }),
        fetch("/api/profile/security/connected-apps", { credentials: "include" }),
      ]);

      // 2FA Status
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setTwoFactorStatus(statusData.status);
      }

      // Sessions
      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData.sessions || []);
      }
      setIsLoadingSessions(false);

      // Login History
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setLoginHistory(historyData.loginHistory || []);
      }
      setIsLoadingHistory(false);

      // Connected Apps
      if (appsRes.ok) {
        const appsData = await appsRes.json();
        setConnectedApps(appsData.connectedApps || []);
      }
      setIsLoadingApps(false);
    } catch (err) {
      console.error("Error fetching security data:", err);
      setError("Failed to load security settings");
      setIsLoadingSessions(false);
      setIsLoadingHistory(false);
      setIsLoadingApps(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchSecurityData();
  }, [fetchSecurityData]);

  // Enable 2FA
  const enable2FA = useCallback(
    async (method: TwoFactorMethod): Promise<TwoFactorSetupData> => {
      if (!user?.uid) {
        throw new Error("You must be logged in");
      }

      setIsEnabling2FA(true);
      setError(null);

      try {
        const response = await fetch("/api/profile/security/2fa/enable", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ method }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to enable 2FA");
        }

        const data = await response.json();
        setSetupData(data.setupData);
        return data.setupData;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to enable 2FA";
        setError(errorMsg);
        throw err;
      } finally {
        setIsEnabling2FA(false);
      }
    },
    [user?.uid]
  );

  // Verify 2FA code
  const verify2FA = useCallback(
    async (code: string): Promise<boolean> => {
      if (!user?.uid) {
        throw new Error("You must be logged in");
      }

      setError(null);

      try {
        const response = await fetch("/api/profile/security/2fa/verify", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Invalid verification code");
        }

        // Update status
        await fetchSecurityData();
        setSetupData(null);
        return true;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Verification failed";
        setError(errorMsg);
        return false;
      }
    },
    [user?.uid, fetchSecurityData]
  );

  // Disable 2FA
  const disable2FA = useCallback(
    async (code: string): Promise<void> => {
      if (!user?.uid) {
        throw new Error("You must be logged in");
      }

      setError(null);

      try {
        const response = await fetch("/api/profile/security/2fa/disable", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to disable 2FA");
        }

        // Update status
        await fetchSecurityData();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to disable 2FA";
        setError(errorMsg);
        throw err;
      }
    },
    [user?.uid, fetchSecurityData]
  );

  // Regenerate backup codes
  const regenerateBackupCodes = useCallback(
    async (): Promise<string[]> => {
      if (!user?.uid) {
        throw new Error("You must be logged in");
      }

      setError(null);

      try {
        const response = await fetch("/api/profile/security/2fa/backup-codes", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: "" }), // Will need to prompt for code
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to regenerate backup codes");
        }

        const data = await response.json();
        await fetchSecurityData();
        return data.backupCodes;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to regenerate backup codes";
        setError(errorMsg);
        throw err;
      }
    },
    [user?.uid, fetchSecurityData]
  );

  // Revoke specific session
  const revokeSession = useCallback(
    async (sessionId: string): Promise<void> => {
      if (!user?.uid) {
        throw new Error("You must be logged in");
      }

      setError(null);

      try {
        const response = await fetch(`/api/profile/security/sessions/${sessionId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to revoke session");
        }

        // Update sessions list
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to revoke session";
        setError(errorMsg);
        throw err;
      }
    },
    [user?.uid]
  );

  // Revoke all other sessions
  const revokeAllOtherSessions = useCallback(async (): Promise<void> => {
    if (!user?.uid) {
      throw new Error("You must be logged in");
    }

    setError(null);

    try {
      const response = await fetch("/api/profile/security/sessions?all=true", {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to revoke sessions");
      }

      // Keep only current session
      setSessions((prev) => prev.filter((s) => s.isCurrent));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to revoke sessions";
      setError(errorMsg);
      throw err;
    }
  }, [user?.uid]);

  // Disconnect app
  const disconnectApp = useCallback(
    async (appId: string): Promise<void> => {
      if (!user?.uid) {
        throw new Error("You must be logged in");
      }

      setError(null);

      try {
        const response = await fetch(`/api/profile/security/connected-apps/${appId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to disconnect app");
        }

        // Update apps list
        setConnectedApps((prev) => prev.filter((a) => a.id !== appId));
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to disconnect app";
        setError(errorMsg);
        throw err;
      }
    },
    [user?.uid]
  );

  return {
    // Two-Factor Auth
    twoFactorStatus,
    isEnabling2FA,
    setupData,
    enable2FA,
    verify2FA,
    disable2FA,
    regenerateBackupCodes,

    // Sessions
    sessions,
    isLoadingSessions,
    revokeSession,
    revokeAllOtherSessions,

    // Login History
    loginHistory,
    isLoadingHistory,

    // Connected Apps
    connectedApps,
    isLoadingApps,
    disconnectApp,

    // General
    isLoading: isLoadingSessions || isLoadingHistory || isLoadingApps,
    error,
  };
}
