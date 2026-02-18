import { useEffect, useCallback } from 'react';
import { Professional } from '@/lib/pages/for-professionals/types/professional';
import { useAdminDispatch, useAdminSelector } from '../../hooks/useReduxAdmin';
import {
  fetchProfessionals as fetchProfessionalsAsync,
  createProfessional as createProfessionalAsync,
  updateProfessional as updateProfessionalAsync,
  deleteProfessional as deleteProfessionalAsync,
  batchUploadProfessionals as batchUploadProfessionalsAsync,
  toggleFeatured as toggleFeaturedAction,
  reorderProfessional as reorderProfessionalAsync,
  initializeOrders as initializeOrdersAsync,
} from '../../store/slices/professionalsSlice';
import {
  calculateInsertOrder,
  positionToOrder,
  needsRebalancing
} from '../../utils/orderUtils';

export interface UseProfessionalsReduxReturn {
  // Data & state
  professionals: Professional[];
  lastUpdated: number | null;  // NEW: Timestamp for cache display
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  isDeleting: boolean;

  // Operations
  fetchProfessionals: () => Promise<void>;
  createProfessional: (data: Professional) => Promise<void>;
  updateProfessional: (data: Professional) => Promise<void>;
  deleteProfessional: (id: string) => Promise<void>;
  toggleFeatured: (professional: Professional) => Promise<void>;
  batchUpload: (professionals: Professional[]) => Promise<void>;
  // Order management
  handleMoveUp: (professional: Professional) => Promise<void>;
  handleMoveDown: (professional: Professional) => Promise<void>;
  handleOrderChange: (professional: Professional, newPosition: number) => Promise<void>;
}

export function useProfessionalsRedux(): UseProfessionalsReduxReturn {
  const dispatch = useAdminDispatch();
  const { data, lastUpdated, isLoading, error, isSaving, isDeleting } = useAdminSelector(
    state => state.admin.professionals
  );

  // Auto-fetch ONLY if cache is empty
  // Also auto-initialize orders if any professionals are missing order values
  useEffect(() => {
    const initData = async () => {
      if (data.length === 0 && !isLoading) {
        const result = await dispatch(fetchProfessionalsAsync()).unwrap();

        // Check if any professionals need order initialization
        const needsInit = result.some(
          (p: Professional) => p.order === null || p.order === undefined
        );

        if (needsInit) {
          console.log('Initializing order values for professionals...');
          await dispatch(initializeOrdersAsync()).unwrap();
        }
      }
    };
    initData();
  }, []); // Empty deps - run once on mount

  // Manual refresh (always fetches from Firebase)
  const fetchProfessionals = useCallback(async () => {
    await dispatch(fetchProfessionalsAsync()).unwrap();
  }, [dispatch]);

  // Create professional
  const createProfessional = useCallback(async (professionalData: Professional) => {
    await dispatch(createProfessionalAsync(professionalData)).unwrap();
  }, [dispatch]);

  // Update professional
  const updateProfessional = useCallback(async (professionalData: Professional) => {
    await dispatch(updateProfessionalAsync(professionalData)).unwrap();
  }, [dispatch]);

  // Delete professional
  const deleteProfessional = useCallback(async (id: string) => {
    await dispatch(deleteProfessionalAsync(id)).unwrap();
  }, [dispatch]);

  // Toggle featured with optimistic update and revert on failure
  const toggleFeatured = useCallback(async (professional: Professional) => {
    // Optimistic update
    dispatch(toggleFeaturedAction(professional.id));

    try {
      // NOTE: Uses ID endpoint for toggle operations
      const response = await fetch(`/api/admin/professionals/${professional.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ featured: !professional.featured }),
      });

      if (!response.ok) {
        // Revert on failure
        dispatch(toggleFeaturedAction(professional.id));
        throw new Error('Failed to update featured status');
      }
    } catch (err) {
      // Revert on error
      dispatch(toggleFeaturedAction(professional.id));
      throw err;
    }
  }, [dispatch]);

  // Batch upload
  const batchUpload = useCallback(async (professionals: Professional[]) => {
    await dispatch(batchUploadProfessionalsAsync(professionals)).unwrap();
  }, [dispatch]);

  // Move professional up (swap with previous item)
  const handleMoveUp = useCallback(async (professional: Professional) => {
    const sorted = [...data].sort((a, b) => {
      const aOrder = a.order ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.order ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.name.localeCompare(b.name);
    });

    const index = sorted.findIndex(p => p.id === professional.id);
    if (index <= 0) return; // Already at top

    // Calculate new order value between item at index-2 and item at index-1
    const prevPrevOrder = sorted[index - 2]?.order ?? null;
    const prevOrder = sorted[index - 1].order ?? 0;
    const newOrder = calculateInsertOrder(prevPrevOrder, prevOrder);

    await dispatch(reorderProfessionalAsync({ id: professional.id, newOrder })).unwrap();

    // Check if rebalancing needed (automatic, no UI)
    if (needsRebalancing(data)) {
      console.log('Rebalancing order values...');
      await dispatch(initializeOrdersAsync()).unwrap();
    }
  }, [dispatch, data]);

  // Move professional down (swap with next item)
  const handleMoveDown = useCallback(async (professional: Professional) => {
    const sorted = [...data].sort((a, b) => {
      const aOrder = a.order ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.order ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.name.localeCompare(b.name);
    });

    const index = sorted.findIndex(p => p.id === professional.id);
    if (index < 0 || index >= sorted.length - 1) return; // Already at bottom

    // Calculate new order value between item at index+1 and item at index+2
    const nextOrder = sorted[index + 1].order ?? 0;
    const nextNextOrder = sorted[index + 2]?.order ?? null;
    const newOrder = calculateInsertOrder(nextOrder, nextNextOrder);

    await dispatch(reorderProfessionalAsync({ id: professional.id, newOrder })).unwrap();

    // Check if rebalancing needed (automatic, no UI)
    if (needsRebalancing(data)) {
      console.log('Rebalancing order values...');
      await dispatch(initializeOrdersAsync()).unwrap();
    }
  }, [dispatch, data]);

  // Move professional to specific position
  const handleOrderChange = useCallback(async (professional: Professional, newPosition: number) => {
    const sorted = [...data].sort((a, b) => {
      const aOrder = a.order ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.order ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.name.localeCompare(b.name);
    });

    // Calculate the order value for the target position
    const newOrder = positionToOrder(newPosition, sorted, professional.id);

    await dispatch(reorderProfessionalAsync({ id: professional.id, newOrder })).unwrap();

    // Check if rebalancing needed (automatic, no UI)
    if (needsRebalancing(data)) {
      console.log('Rebalancing order values...');
      await dispatch(initializeOrdersAsync()).unwrap();
    }
  }, [dispatch, data]);

  return {
    professionals: data,
    lastUpdated,  // EXPOSE TIMESTAMP
    isLoading,
    error,
    isSaving,
    isDeleting,
    fetchProfessionals,
    createProfessional,
    updateProfessional,
    deleteProfessional,
    toggleFeatured,
    batchUpload,
    // Order management
    handleMoveUp,
    handleMoveDown,
    handleOrderChange,
  };
}
