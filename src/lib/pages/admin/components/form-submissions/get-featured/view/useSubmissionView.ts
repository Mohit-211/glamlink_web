'use client';

import { useState, useEffect, useCallback } from 'react';
import type { GetFeaturedSubmission } from '@/lib/pages/apply/featured/types';
import { SUBMISSION_STATUS_OPTIONS, FORM_TYPE_OPTIONS } from '@/lib/pages/admin/config/fields/getFeatured';

interface UseSubmissionViewProps {
  submission: GetFeaturedSubmission | null;
  onUpdateStatus: (id: string, reviewed: boolean, status?: string) => Promise<void>;
}

export function useSubmissionView({ submission, onUpdateStatus }: UseSubmissionViewProps) {
  const [status, setStatus] = useState<string>(submission?.status || 'pending_review');

  // Sync state when submission changes
  useEffect(() => {
    if (submission) {
      setStatus(submission.status || 'pending_review');
    }
  }, [submission]);

  const handleSaveStatus = useCallback(async () => {
    if (submission) {
      await onUpdateStatus(submission.id, true, status);
    }
  }, [submission, status, onUpdateStatus]);

  const getFormTypeLabel = useCallback((type: string) => {
    const option = FORM_TYPE_OPTIONS.find(o => o.value === type);
    return option?.label || type;
  }, []);

  const getStatusLabel = useCallback((statusValue: string) => {
    const option = SUBMISSION_STATUS_OPTIONS.find(o => o.value === statusValue);
    return option?.label || statusValue;
  }, []);

  return {
    status,
    setStatus,
    handleSaveStatus,
    getFormTypeLabel,
    getStatusLabel
  };
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}
