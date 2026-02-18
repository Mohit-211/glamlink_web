"use client";

/**
 * useVerificationAPI - Admin hook for verification submissions
 */

import { useState, useCallback, useEffect } from "react";
import type {
  VerificationSubmission,
  VerificationStatus,
  VerificationReviewRequest,
} from "@/lib/features/profile-settings/verification/types";

export interface UseVerificationAPIReturn {
  // Data
  submissions: VerificationSubmission[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;

  // Filters
  statusFilter: VerificationStatus | "all";
  setStatusFilter: (filter: VerificationStatus | "all") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredSubmissions: VerificationSubmission[];

  // Stats
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };

  // Operations
  fetchSubmissions: () => Promise<void>;
  updateSubmissionStatus: (
    id: string,
    request: VerificationReviewRequest
  ) => Promise<void>;
  isSaving: boolean;
}

export function useVerificationAPI(): UseVerificationAPIReturn {
  const [submissions, setSubmissions] = useState<VerificationSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all submissions
  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url =
        statusFilter === "all"
          ? "/api/verification/submissions"
          : `/api/verification/submissions?status=${statusFilter}`;

      const response = await fetch(url, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch submissions");
      }

      const data = await response.json();

      if (data.success) {
        setSubmissions(data.data);
        setLastUpdated(Date.now());
      } else {
        throw new Error(data.error || "Failed to fetch submissions");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  // Update submission status
  const updateSubmissionStatus = useCallback(
    async (id: string, request: VerificationReviewRequest) => {
      setIsSaving(true);

      try {
        const response = await fetch(`/api/verification/submissions/${id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update submission");
        }

        // Update local state
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === id
              ? {
                  ...sub,
                  status: request.status,
                  reviewNotes: request.reviewNotes,
                  rejectionReason: request.rejectionReason,
                  reviewedAt: new Date().toISOString(),
                }
              : sub
          )
        );
      } catch (err) {
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  // Filtered submissions
  const filteredSubmissions = submissions.filter((sub) => {
    // Status filter (already handled by API, but keep for local filtering)
    if (statusFilter !== "all" && sub.status !== statusFilter) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        sub.businessName.toLowerCase().includes(query) ||
        sub.ownerFullName.toLowerCase().includes(query) ||
        sub.brandId.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Stats
  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  // Initial fetch
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return {
    submissions,
    isLoading,
    error,
    lastUpdated,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    filteredSubmissions,
    stats,
    fetchSubmissions,
    updateSubmissionStatus,
    isSaving,
  };
}
