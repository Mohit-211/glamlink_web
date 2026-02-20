"use client";

/**
 * useVerificationStatus - Hook to check user's verification status
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/features/auth/useAuth";
import type {
  VerificationStatus,
  VerificationSubmission,
  UseVerificationStatusReturn,
} from "../types";

export function useVerificationStatus(): UseVerificationStatusReturn {
  const { user } = useAuth();
  const [status, setStatus] = useState<VerificationStatus>("none");
  const [submission, setSubmission] = useState<VerificationSubmission | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!user?.uid) {
      setStatus("none");
      setSubmission(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/verification/status", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch verification status");
      }

      const data = await response.json();

      if (data.success) {
        setStatus(data.data.status);
        setSubmission(data.data.submission);
      } else {
        throw new Error(data.error || "Failed to fetch status");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch status");
      setStatus("none");
      setSubmission(null);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    submission,
    isLoading,
    error,
    refetch: fetchStatus,
  };
}
