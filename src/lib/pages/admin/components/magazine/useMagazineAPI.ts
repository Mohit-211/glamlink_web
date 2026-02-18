import { useState, useEffect, useCallback } from 'react';
import { MagazineIssue } from '@/lib/pages/magazine/types/magazine/core';

export interface UseMagazineAPIReturn {
  issues: MagazineIssue[];
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  isDeleting: boolean;

  fetchIssues: () => Promise<void>;
  createIssue: (data: Partial<MagazineIssue>) => Promise<void>;
  updateIssue: (data: Partial<MagazineIssue>) => Promise<void>;
  deleteIssue: (id: string) => Promise<void>;
  toggleFeatured: (issue: MagazineIssue) => Promise<void>;
  batchUpload: (issues: Partial<MagazineIssue>[]) => Promise<void>;
}

export function useMagazineAPI(): UseMagazineAPIReturn {
  const [issues, setIssues] = useState<MagazineIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch magazine issues from API (admin can see all, including hidden)
  const fetchIssues = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/magazine/issues?includeHidden=true', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch magazine issues: ${response.status}`);
      }

      const data = await response.json();

      // API returns array directly, not wrapped in { success, data }
      if (Array.isArray(data)) {
        setIssues(data);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch magazine issues");
      console.error("Error fetching magazine issues:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // Create magazine issue
  const createIssue = async (data: Partial<MagazineIssue>) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/magazine/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create magazine issue");

      const result = await response.json();

      // API returns the issue directly, not wrapped
      if (result.error) {
        throw new Error(result.error);
      }

      // Add to state
      setIssues(prev => [...prev, result]);
    } catch (err) {
      console.error("Error creating magazine issue:", err);
      setError("Failed to create magazine issue");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Update magazine issue
  const updateIssue = async (data: Partial<MagazineIssue>) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/magazine/issues/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update magazine issue");

      const result = await response.json();

      // API returns the updated issue directly
      if (result.error) {
        throw new Error(result.error);
      }

      // Update state with the returned issue
      setIssues(prev =>
        prev.map(issue => issue.id === data.id ? result : issue)
      );
    } catch (err) {
      console.error("Error updating magazine issue:", err);
      setError("Failed to update magazine issue");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Delete magazine issue
  const deleteIssue = async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/magazine/issues/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error("Failed to delete magazine issue");

      setIssues(prev => prev.filter(issue => issue.id !== id));
    } catch (err) {
      console.error("Error deleting magazine issue:", err);
      setError("Failed to delete magazine issue");
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle featured status
  const toggleFeatured = async (issue: MagazineIssue) => {
    try {
      const response = await fetch(`/api/magazine/issues/${issue.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ featured: !issue.featured }),
      });

      if (!response.ok) throw new Error("Failed to update featured status");

      setIssues(prev =>
        prev.map(i => i.id === issue.id ? { ...i, featured: !i.featured } : i)
      );
    } catch (err) {
      console.error("Error toggling featured:", err);
      setError("Failed to update featured status");
      throw err;
    }
  };

  // Batch upload magazine issues
  const batchUpload = async (data: Partial<MagazineIssue>[]) => {
    try {
      const response = await fetch('/api/magazine/issues/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ issues: data }),
      });

      if (!response.ok) {
        throw new Error(`Failed to upload magazine issues: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setIssues(result.data);
      } else {
        throw new Error(result.error || "Failed to upload magazine issues");
      }
    } catch (err) {
      console.error("Error uploading magazine issues:", err);
      setError("Failed to upload magazine issues");
      throw err;
    }
  };

  return {
    issues,
    isLoading,
    error,
    isSaving,
    isDeleting,
    fetchIssues,
    createIssue,
    updateIssue,
    deleteIssue,
    toggleFeatured,
    batchUpload
  };
}
