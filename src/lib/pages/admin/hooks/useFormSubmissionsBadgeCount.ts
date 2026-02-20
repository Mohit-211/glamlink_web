/**
 * Hook to get pending form submissions count for admin sidebar badge
 *
 * Counts pending submissions from both:
 * - Digital Card applications (pending_review, not hidden)
 * - Get Featured submissions (pending_review)
 *
 * Uses real-time Firestore listeners to update badge automatically.
 */

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/config/firebase';
import { useAuth } from '@/lib/features/auth/useAuth';

interface UseFormSubmissionsBadgeCountReturn {
  /** Combined count of all pending submissions */
  count: number;
  /** Count of pending Digital Card submissions (visible only) */
  digitalCardPendingCount: number;
  /** Count of pending Get Featured submissions */
  getFeaturedPendingCount: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const DIGITAL_CARD_COLLECTION = 'digital-card-applications';
const GET_FEATURED_COLLECTION = 'get-featured-submissions';

export function useFormSubmissionsBadgeCount(): UseFormSubmissionsBadgeCountReturn {
  const { user } = useAuth();
  const [digitalCardPendingCount, setDigitalCardPendingCount] = useState(0);
  const [getFeaturedPendingCount, setGetFeaturedPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only set up listeners if user is authenticated (admin)
    if (!user || !db) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    let loadedCount = 0;
    const totalToLoad = 2;

    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount >= totalToLoad) {
        setIsLoading(false);
      }
    };

    // Listener 1: Digital Card pending submissions (only pending_review, not hidden)
    const digitalCardQuery = query(
      collection(db, DIGITAL_CARD_COLLECTION),
      where('status', '==', 'pending_review')
    );

    const unsubDigitalCard = onSnapshot(
      digitalCardQuery,
      (snapshot) => {
        // Filter out hidden items client-side
        const visiblePending = snapshot.docs.filter(
          doc => doc.data().hidden !== true
        );
        setDigitalCardPendingCount(visiblePending.length);
        checkLoaded();
      },
      (err) => {
        console.error('Error listening to digital card submissions:', err);
        setError(err.message);
        checkLoaded();
      }
    );

    // Listener 2: Get Featured pending submissions
    const getFeaturedQuery = query(
      collection(db, GET_FEATURED_COLLECTION),
      where('status', '==', 'pending_review')
    );

    const unsubGetFeatured = onSnapshot(
      getFeaturedQuery,
      (snapshot) => {
        setGetFeaturedPendingCount(snapshot.size);
        checkLoaded();
      },
      (err) => {
        console.error('Error listening to get featured submissions:', err);
        if (!error) {
          setError(err.message);
        }
        checkLoaded();
      }
    );

    return () => {
      unsubDigitalCard();
      unsubGetFeatured();
    };
  }, [user]);

  return {
    count: digitalCardPendingCount + getFeaturedPendingCount,
    digitalCardPendingCount,
    getFeaturedPendingCount,
    isLoading,
    error,
    refetch: () => {}, // Real-time listeners auto-update
  };
}

export default useFormSubmissionsBadgeCount;
