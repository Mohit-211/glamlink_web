"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/config/firebase';

export interface FormSubmissionCounts {
  digitalCard: number;
  getFeatured: number;
  total: number;
}

export interface FormSubmission {
  id: string;
  type: 'digital-card' | 'get-featured';
  name: string;
  email: string;
  submittedAt: Date;
  status: string;
}

export function useFormSubmissions() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [digitalCardSubmissions, setDigitalCardSubmissions] = useState<FormSubmission[]>([]);
  const [getFeaturedSubmissions, setGetFeaturedSubmissions] = useState<FormSubmission[]>([]);

  const fetchSubmissions = useCallback(async () => {
    if (!db) {
      setError('Database not available');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Calculate 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Helper to parse date from various formats
      const parseSubmissionDate = (data: any): Date | null => {
        // Try Firestore Timestamp first
        if (data.createdAt?.toDate) {
          return data.createdAt.toDate();
        }
        // Try submittedAt as ISO string
        if (data.submittedAt && typeof data.submittedAt === 'string') {
          const parsed = new Date(data.submittedAt);
          if (!isNaN(parsed.getTime())) {
            return parsed;
          }
        }
        // Try createdAt as ISO string
        if (data.createdAt && typeof data.createdAt === 'string') {
          const parsed = new Date(data.createdAt);
          if (!isNaN(parsed.getTime())) {
            return parsed;
          }
        }
        // No valid date found - return null to exclude this submission
        return null;
      };

      // Fetch digital card submissions
      const digitalCardRef = collection(db, 'digital-card-applications');
      const digitalCardSnapshot = await getDocs(digitalCardRef);

      const digitalCards: FormSubmission[] = [];
      digitalCardSnapshot.forEach((doc) => {
        const data = doc.data();
        const submittedAt = parseSubmissionDate(data);

        // Only include if we have a valid date AND it's within the last 7 days
        if (submittedAt && submittedAt >= sevenDaysAgo) {
          digitalCards.push({
            id: doc.id,
            type: 'digital-card',
            name: data.name || 'Unknown',
            email: data.email || '',
            submittedAt,
            status: data.status || 'pending_review'
          });
        }
      });

      // Fetch get featured submissions
      const getFeaturedRef = collection(db, 'get-featured-forms');
      const getFeaturedSnapshot = await getDocs(getFeaturedRef);

      const featuredForms: FormSubmission[] = [];
      getFeaturedSnapshot.forEach((doc) => {
        const data = doc.data();
        const submittedAt = parseSubmissionDate(data);

        // Only include if we have a valid date AND it's within the last 7 days
        if (submittedAt && submittedAt >= sevenDaysAgo) {
          featuredForms.push({
            id: doc.id,
            type: 'get-featured',
            name: data.fullName || data.name || 'Unknown',
            email: data.email || '',
            submittedAt,
            status: data.status || 'pending_review'
          });
        }
      });

      // Sort by submission date (newest first)
      digitalCards.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
      featuredForms.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());

      setDigitalCardSubmissions(digitalCards);
      setGetFeaturedSubmissions(featuredForms);
    } catch (err) {
      console.error('Error fetching form submissions:', err);
      setError('Failed to load form submissions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const counts = useMemo<FormSubmissionCounts>(() => ({
    digitalCard: digitalCardSubmissions.length,
    getFeatured: getFeaturedSubmissions.length,
    total: digitalCardSubmissions.length + getFeaturedSubmissions.length
  }), [digitalCardSubmissions, getFeaturedSubmissions]);

  return {
    digitalCardSubmissions,
    getFeaturedSubmissions,
    counts,
    isLoading,
    error,
    refetch: fetchSubmissions
  };
}
