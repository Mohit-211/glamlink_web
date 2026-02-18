"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/features/auth/useAuth";
import { DEFAULT_PAUSE_SETTINGS } from "../config";
import type {
  AccountStatus,
  AccountPauseSettings,
  AccountDeletionRequest,
  BrandTransferRequest,
  DataCategory,
  ExportFormat,
  DataExportRequest,
  UseAccountManagementReturn,
} from "../types";

export function useAccountManagement(): UseAccountManagementReturn {
  const { user } = useAuth();

  // State
  const [accountStatus, setAccountStatus] = useState<AccountStatus>('active');
  const [pauseSettings, setPauseSettings] = useState<AccountPauseSettings>(DEFAULT_PAUSE_SETTINGS);
  const [deletionRequest, setDeletionRequest] = useState<AccountDeletionRequest | null>(null);
  const [transferRequest, setTransferRequest] = useState<BrandTransferRequest | null>(null);
  const [exportHistory, setExportHistory] = useState<DataExportRequest[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch account data on mount
  const fetchAccountData = useCallback(async () => {
    if (!user?.uid) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/profile/account", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch account data");
      }

      const data = await response.json();
      setAccountStatus(data.accountStatus || 'active');
      setPauseSettings(data.pauseSettings || DEFAULT_PAUSE_SETTINGS);
      setDeletionRequest(data.deletionRequest || null);
      setTransferRequest(data.transferRequest || null);
      setExportHistory(data.exportHistory || []);
    } catch (err) {
      console.error("Error fetching account data:", err);
      setError(err instanceof Error ? err.message : "Failed to load account data");
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  // PHASE A - Account Pause (Fully Functional)
  const pauseAccount = useCallback(async (settings: Partial<AccountPauseSettings>) => {
    if (!user?.uid) {
      setError("You must be logged in to pause your account");
      return;
    }

    setIsPausing(true);
    setError(null);

    try {
      const response = await fetch("/api/profile/account/pause", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to pause account");
      }

      const data = await response.json();
      setPauseSettings(data.pauseSettings);
      setAccountStatus('paused');
    } catch (err) {
      console.error("Error pausing account:", err);
      setError(err instanceof Error ? err.message : "Failed to pause account");
    } finally {
      setIsPausing(false);
    }
  }, [user?.uid]);

  const resumeAccount = useCallback(async () => {
    if (!user?.uid) {
      setError("You must be logged in to resume your account");
      return;
    }

    setIsPausing(true);
    setError(null);

    try {
      const response = await fetch("/api/profile/account/pause", {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to resume account");
      }

      const data = await response.json();
      setPauseSettings(data.pauseSettings);
      setAccountStatus('active');
    } catch (err) {
      console.error("Error resuming account:", err);
      setError(err instanceof Error ? err.message : "Failed to resume account");
    } finally {
      setIsPausing(false);
    }
  }, [user?.uid]);

  // PHASE B - Data Export (Stub - requires background jobs)
  const requestExport = useCallback(async (categories: DataCategory[], format: ExportFormat) => {
    setError("Data export requires background job infrastructure (coming soon)");
    console.log("Export requested:", { categories, format });
  }, []);

  const downloadExport = useCallback(async (requestId: string) => {
    setError("Data export requires background job infrastructure (coming soon)");
    console.log("Download requested:", requestId);
  }, []);

  // PHASE C - Account Deletion (Stub - requires scheduled tasks)
  const requestDeletion = useCallback(async (reason?: string, feedback?: string) => {
    setError("Account deletion requires scheduled task infrastructure (coming soon)");
    console.log("Deletion requested:", { reason, feedback });
  }, []);

  const cancelDeletion = useCallback(async () => {
    setError("Account deletion requires scheduled task infrastructure (coming soon)");
    console.log("Deletion cancelled");
  }, []);

  // PHASE D - Brand Transfer (Stub - requires email service)
  const initiateTransfer = useCallback(async (toEmail: string, message?: string) => {
    setError("Brand transfer requires transactional email service (coming soon)");
    console.log("Transfer initiated:", { toEmail, message });
  }, []);

  const cancelTransfer = useCallback(async () => {
    setError("Brand transfer requires transactional email service (coming soon)");
    console.log("Transfer cancelled");
  }, []);

  return {
    accountStatus,
    pauseSettings,
    deletionRequest,
    transferRequest,
    isLoading,
    isExporting,
    isPausing,
    isDeleting,
    isTransferring,
    error,
    requestExport,
    downloadExport,
    exportHistory,
    pauseAccount,
    resumeAccount,
    requestDeletion,
    cancelDeletion,
    initiateTransfer,
    cancelTransfer,
  };
}
