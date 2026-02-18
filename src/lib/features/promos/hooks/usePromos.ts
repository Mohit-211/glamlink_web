"use client";

import { useState, useEffect, useCallback } from 'react';
import { PromosStateInterface, PromoItem, PromosPageHandlersType, PromosApiResponse } from '../config';

interface UsePromosReturn {
  state: PromosStateInterface;
  handlers: PromosPageHandlersType;
  refetch: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}


export const usePromos = (): UsePromosReturn => {
  const [state, setState] = useState<PromosStateInterface>({
    promos: [],
    featuredPromos: [],
    isLoading: true,
    error: null
  });

  // Modal state (separate from promos data state)
  const [selectedPromo, setSelectedPromo] = useState<PromoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch promos data from API
  const fetchPromos = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Fetch promos from API
      const response = await fetch('/api/promos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store' // Ensure fresh data
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch promos: ${response.statusText}`);
      }

      const data: PromosApiResponse = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || 'No data received');
      }

      setState(prev => ({
        ...prev,
        promos: data.data?.promos || [],
        featuredPromos: data.data?.featuredPromos || [],
        isLoading: false,
        error: null
      }));

      console.log(`Loaded ${data.data?.promos?.length || 0} promos, ${data.data?.featuredPromos?.length || 0} featured`);
    } catch (error) {
      console.error('Error fetching promos:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load promotions. Please try again later.'
      }));
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  // Handle promo card click
  const handlePromoClick = useCallback((promo: PromoItem) => {
    console.log('Promo clicked:', promo.title);
    setSelectedPromo(promo);
    setIsModalOpen(true);
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPromo(null);
  }, []);

  // Handle CTA click
  const handleCtaClick = useCallback((promo: PromoItem, e?: React.MouseEvent) => {
    console.log('CTA clicked for promo:', promo.title);

    // Prevent default behavior if event is provided
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Open link in new tab if available
    if (promo.link) {
      window.open(promo.link, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('No link available for promo:', promo.title);
    }
  }, []);

  // Manual refetch function
  const refetch = useCallback(async () => {
    await fetchPromos();
  }, [fetchPromos]);

  // Handler object for components
  const handlers: PromosPageHandlersType = {
    onPromoClick: handlePromoClick,
    onModalClose: handleModalClose,
    onCtaClick: handleCtaClick
  };

  return {
    state: {
      ...state
    },
    handlers,
    refetch,
    isLoading: state.isLoading,
    error: state.error
  };
};

// Hook for fetching promos by category
export const usePromosByCategory = (category: string) => {
  const [promos, setPromos] = useState<PromoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryPromos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/promos?category=${encodeURIComponent(category)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch category promos: ${response.statusText}`);
      }

      const data: PromosApiResponse = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || 'No data received');
      }

      setPromos(data.data.promos || []);
    } catch (error) {
      console.error(`Error fetching promos for category ${category}:`, error);
      setError('Failed to load promos for this category.');
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchCategoryPromos();
  }, [fetchCategoryPromos]);

  const refetch = useCallback(() => {
    fetchCategoryPromos();
  }, [fetchCategoryPromos]);

  return { promos, isLoading, error, refetch };
};

// Hook for fetching a single promo by ID
export const usePromoById = (id: string) => {
  const [promo, setPromo] = useState<PromoItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromo = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/promos/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError('Promo not found');
          } else {
            throw new Error(`Failed to fetch promo: ${response.statusText}`);
          }
          return;
        }

        const data = await response.json();

        if (!data.success || !data.data) {
          throw new Error(data.error || 'No data received');
        }

        setPromo(data.data);
      } catch (error) {
        console.error(`Error fetching promo ${id}:`, error);
        setError('Failed to load promo details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromo();
  }, [id]);

  return { promo, isLoading, error };
};

// Hook for promo statistics
export const usePromoStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    featured: 0,
    expired: 0,
    upcoming: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/promos?stats=true', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch promo stats: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success || !data.data?.stats) {
          throw new Error(data.error || 'No stats data received');
        }

        setStats(data.data.stats);
      } catch (error) {
        console.error('Error fetching promo stats:', error);
        setError('Failed to load promo statistics.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading, error };
};

// Hook for checking if promos data exists
export const usePromosDataCheck = () => {
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkData = async () => {
      try {
        const response = await fetch('/api/promos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        });

        if (response.ok) {
          const data = await response.json();
          setHasData(data.success && data.data?.promos && data.data.promos.length > 0);
        } else {
          setHasData(false);
        }
      } catch (error) {
        console.error('Error checking promos data:', error);
        setHasData(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkData();
  }, []);

  return { hasData, isLoading };
};

export default usePromos;