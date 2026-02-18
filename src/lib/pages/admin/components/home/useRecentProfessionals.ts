"use client";

import { useMemo, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Professional } from '@/lib/pages/for-professionals/types/professional';
import { useProfessionalsRedux } from '../professionals/useProfessionalsRedux';

export interface RecentProfessionalItem {
  professional: Professional;
  relativeTime: string;  // "2 days ago", "5 hours ago"
}

export function useRecentProfessionals() {
  const { professionals, isLoading, fetchProfessionals } = useProfessionalsRedux();

  // Fetch professionals on mount if not already loaded
  useEffect(() => {
    if (professionals.length === 0 && !isLoading) {
      fetchProfessionals();
    }
  }, [professionals.length, isLoading, fetchProfessionals]);

  const recentProfessionals = useMemo<RecentProfessionalItem[]>(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return professionals
      .filter(p => {
        // Filter by createdAt if available
        if (!p.createdAt) return false;
        const createdDate = new Date(p.createdAt);
        return createdDate >= oneWeekAgo;
      })
      .sort((a, b) => {
        // Sort by most recent first
        const aDate = new Date(a.createdAt!).getTime();
        const bDate = new Date(b.createdAt!).getTime();
        return bDate - aDate;
      })
      .map(p => ({
        professional: p,
        relativeTime: formatDistanceToNow(new Date(p.createdAt!), { addSuffix: true })
      }));
  }, [professionals]);

  const recentCount = recentProfessionals.length;

  return {
    recentProfessionals,
    recentCount,
    isLoading,
    fetchProfessionals
  };
}
