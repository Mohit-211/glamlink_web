/**
 * useFile Hook
 *
 * Manages single file fetching and editing operations
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { ContentFile, ImageTransform } from '../types';

interface UseFileReturn {
  file: ContentFile | null;
  loading: boolean;
  error: string | null;
  updateFile: (updates: Partial<ContentFile>) => Promise<void>;
  applyTransform: (transform: ImageTransform) => Promise<void>;
  refresh: () => void;
}

export function useFile(fileId: string): UseFileReturn {
  const [file, setFile] = useState<ContentFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFile = useCallback(async () => {
    if (!fileId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/crm/content/files/${fileId}`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch file');

      const data = await response.json();
      setFile(data.file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [fileId]);

  useEffect(() => {
    fetchFile();
  }, [fetchFile]);

  const updateFile = async (updates: Partial<ContentFile>): Promise<void> => {
    if (!file) return;

    const response = await fetch(`/api/crm/content/files/${fileId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to update file');

    // Update local state
    setFile((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const applyTransform = async (transform: ImageTransform): Promise<void> => {
    if (!file) return;

    const response = await fetch(`/api/crm/content/files/${fileId}/transform`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transform),
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to apply transform');

    const data = await response.json();
    setFile(data.file);
  };

  return {
    file,
    loading,
    error,
    updateFile,
    applyTransform,
    refresh: fetchFile,
  };
}
