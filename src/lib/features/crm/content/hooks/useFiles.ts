/**
 * useFiles Hook
 *
 * Manages file listing, filtering, sorting, and CRUD operations
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { ContentFile, FileFilter, FileSortOption } from '../types';

interface UseFilesOptions {
  brandId: string;
  initialFilter?: FileFilter;
  initialSort?: FileSortOption;
  pageSize?: number;
}

interface UseFilesReturn {
  files: ContentFile[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  page: number;
  pageSize: number;
  filter: FileFilter;
  sort: FileSortOption;
  setFilter: (filter: FileFilter) => void;
  setSort: (sort: FileSortOption) => void;
  setPage: (page: number) => void;
  uploadFiles: (files: File[]) => Promise<ContentFile[]>;
  deleteFiles: (ids: string[]) => Promise<void>;
  updateFile: (id: string, updates: Partial<ContentFile>) => Promise<void>;
  refresh: () => void;
}

export function useFiles(options: UseFilesOptions): UseFilesReturn {
  const {
    brandId,
    initialFilter = {},
    initialSort = { field: 'date', direction: 'desc' },
    pageSize: initialPageSize = 50,
  } = options;

  const [files, setFiles] = useState<ContentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [filter, setFilter] = useState<FileFilter>(initialFilter);
  const [sort, setSort] = useState<FileSortOption>(initialSort);

  const fetchFiles = useCallback(async () => {
    if (!brandId) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        brandId,
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortField: sort.field,
        sortDirection: sort.direction,
      });

      if (filter.search) params.set('search', filter.search);
      if (filter.fileType && filter.fileType !== 'all') params.set('fileType', filter.fileType);
      if (filter.usedIn && filter.usedIn !== 'all') params.set('usedIn', filter.usedIn);

      const response = await fetch(`/api/crm/content/files?${params}`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch files');

      const data = await response.json();
      setFiles(data.files || []);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Set empty state on error for now
      setFiles([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [brandId, page, pageSize, filter, sort]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const uploadFiles = async (filesToUpload: File[]): Promise<ContentFile[]> => {
    const formData = new FormData();
    formData.append('brandId', brandId);
    filesToUpload.forEach((file) => formData.append('files', file));

    const response = await fetch('/api/crm/content/files/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to upload files');

    const data = await response.json();
    await fetchFiles(); // Refresh list
    return data.files;
  };

  const deleteFiles = async (ids: string[]): Promise<void> => {
    const response = await fetch('/api/crm/content/files', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brandId, ids }),
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to delete files');
    await fetchFiles();
  };

  const updateFile = async (id: string, updates: Partial<ContentFile>): Promise<void> => {
    const response = await fetch(`/api/crm/content/files/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brandId, ...updates }),
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to update file');
    await fetchFiles();
  };

  return {
    files,
    loading,
    error,
    totalCount,
    page,
    pageSize,
    filter,
    sort,
    setFilter,
    setSort,
    setPage,
    uploadFiles,
    deleteFiles,
    updateFile,
    refresh: fetchFiles,
  };
}
