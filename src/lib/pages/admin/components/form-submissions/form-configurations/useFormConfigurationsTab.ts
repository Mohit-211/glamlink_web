'use client';

/**
 * useFormConfigurationsTab - Combined hook for Form Configurations admin tab
 *
 * Provides presentation layer with filtering, computed values, modal state,
 * and all handlers for managing form configurations across all categories.
 *
 * Uses Redux for caching - data is fetched only once and cached in Redux state.
 */

import { useState, useMemo, useCallback } from 'react';
import { useFormConfigurationsRedux } from './useFormConfigurationsRedux';
import type {
  UnifiedFormConfig,
  FormConfigDisplay,
  FormConfigStats,
  FormConfigCategoryFilter,
  FormCategory
} from './types';
import { transformToDisplay, FORM_CATEGORY_LABELS } from './types';

// =============================================================================
// TYPES
// =============================================================================

export interface UseFormConfigurationsTabReturn {
  // Data
  allConfigs: UnifiedFormConfig[];
  filteredConfigs: FormConfigDisplay[];

  // State
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  isDeleting: boolean;
  isMigrating: boolean;
  lastUpdated: number | null;

  // Modal state
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  editingConfig: UnifiedFormConfig | null;
  setEditingConfig: (config: UnifiedFormConfig | null) => void;
  showBatchUpload: boolean;
  setShowBatchUpload: (show: boolean) => void;

  // Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: FormConfigCategoryFilter;
  setCategoryFilter: (filter: FormConfigCategoryFilter) => void;
  showDisabled: boolean;
  setShowDisabled: (show: boolean) => void;

  // Stats
  stats: FormConfigStats;

  // Handlers
  handleRefresh: () => Promise<void>;
  handleAdd: (category?: FormCategory) => void;
  handleEdit: (row: FormConfigDisplay) => void;
  handleDelete: (row: FormConfigDisplay) => Promise<void>;
  handleToggleEnabled: (row: FormConfigDisplay) => Promise<void>;
  handleSave: (data: Partial<UnifiedFormConfig>) => Promise<void>;
  handleBatchUpload: (configs: UnifiedFormConfig[]) => Promise<void>;
  handleMigrateGetFeatured: () => Promise<void>;
  handleMigrateDigitalCard: () => Promise<void>;
}

// =============================================================================
// HOOK
// =============================================================================

export function useFormConfigurationsTab(): UseFormConfigurationsTabReturn {
  // Redux hook with caching - auto-fetches only if cache is empty
  const {
    formConfigs,
    fetchFormConfigs,
    createFormConfig,
    updateFormConfig,
    deleteFormConfig,
    toggleFormConfigEnabledState,
    migrateGetFeaturedForms,
    migrateDigitalCardForm,
  } = useFormConfigurationsRedux();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<FormConfigCategoryFilter>('all');
  const [showDisabled, setShowDisabled] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<UnifiedFormConfig | null>(null);
  const [showBatchUpload, setShowBatchUpload] = useState(false);

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  const filteredConfigs = useMemo((): FormConfigDisplay[] => {
    let filtered = [...formConfigs.data];

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(config => config.category === categoryFilter);
    }

    // Filter by enabled status
    if (!showDisabled) {
      filtered = filtered.filter(config => config.enabled);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(config =>
        config.title.toLowerCase().includes(query) ||
        config.description?.toLowerCase().includes(query) ||
        config.id.toLowerCase().includes(query)
      );
    }

    // Sort by category then order
    filtered.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.order - b.order;
    });

    // Transform to display format
    return filtered.map(transformToDisplay);
  }, [formConfigs.data, categoryFilter, showDisabled, searchQuery]);

  const stats = useMemo((): FormConfigStats => {
    const configs = formConfigs.data;
    const byCategory: Record<FormCategory, number> = {
      'get-featured': 0,
      'digital-card': 0
    };

    configs.forEach(c => {
      byCategory[c.category] = (byCategory[c.category] || 0) + 1;
    });

    return {
      total: configs.length,
      enabled: configs.filter(c => c.enabled).length,
      disabled: configs.filter(c => !c.enabled).length,
      totalFields: configs.reduce((sum, c) => {
        const fieldCount = c.sections?.reduce((s, sec) => s + (sec.fields?.length || 0), 0) || 0;
        return sum + fieldCount;
      }, 0),
      byCategory
    };
  }, [formConfigs.data]);

  // =============================================================================
  // HANDLERS
  // =============================================================================

  const handleRefresh = useCallback(async () => {
    await fetchFormConfigs();
  }, [fetchFormConfigs]);

  const handleAdd = useCallback((category?: FormCategory) => {
    setEditingConfig(null);
    setShowModal(true);
  }, []);

  const handleEdit = useCallback((row: FormConfigDisplay) => {
    const config = formConfigs.data.find(
      c => c.id === row.id && c.category === row.category
    );
    if (config) {
      setEditingConfig(config);
      setShowModal(true);
    }
  }, [formConfigs.data]);

  const handleDelete = useCallback(async (row: FormConfigDisplay) => {
    if (!confirm(`Delete form "${row.title}"? This cannot be undone.`)) {
      return;
    }
    await deleteFormConfig(row.id, row.category);
  }, [deleteFormConfig]);

  const handleToggleEnabled = useCallback(async (row: FormConfigDisplay) => {
    const config = formConfigs.data.find(
      c => c.id === row.id && c.category === row.category
    );
    if (config) {
      await toggleFormConfigEnabledState(config);
    }
  }, [formConfigs.data, toggleFormConfigEnabledState]);

  const handleSave = useCallback(async (data: Partial<UnifiedFormConfig>) => {
    if (editingConfig) {
      await updateFormConfig({ ...data, id: editingConfig.id, category: editingConfig.category });
    } else {
      await createFormConfig(data);
    }
    setShowModal(false);
    setEditingConfig(null);
  }, [editingConfig, createFormConfig, updateFormConfig]);

  const handleBatchUpload = useCallback(async (configs: UnifiedFormConfig[]) => {
    // Note: Batch upload not implemented in Redux yet, will need to refetch
    // For now, creating each config individually
    for (const config of configs) {
      await createFormConfig(config);
    }
    setShowBatchUpload(false);
  }, [createFormConfig]);

  const handleMigrateGetFeatured = useCallback(async () => {
    if (!confirm('Migrate Get Featured form configurations from static files? This will create database records for any forms that do not already exist.')) {
      return;
    }
    const result = await migrateGetFeaturedForms();
    alert(result.message);
  }, [migrateGetFeaturedForms]);

  const handleMigrateDigitalCard = useCallback(async () => {
    if (!confirm('Migrate Digital Card form configuration to database? This will create a database record if one does not already exist.')) {
      return;
    }
    const result = await migrateDigitalCardForm();
    alert(result.message);
  }, [migrateDigitalCardForm]);

  // =============================================================================
  // RETURN
  // =============================================================================

  return {
    // Data
    allConfigs: formConfigs.data,
    filteredConfigs,

    // State
    isLoading: formConfigs.isLoading,
    error: formConfigs.error,
    isSaving: formConfigs.isSaving,
    isDeleting: formConfigs.isDeleting,
    isMigrating: formConfigs.isMigrating,
    lastUpdated: formConfigs.lastUpdated,

    // Modal state
    showModal,
    setShowModal,
    editingConfig,
    setEditingConfig,
    showBatchUpload,
    setShowBatchUpload,

    // Filters
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    showDisabled,
    setShowDisabled,

    // Stats
    stats,

    // Handlers
    handleRefresh,
    handleAdd,
    handleEdit,
    handleDelete,
    handleToggleEnabled,
    handleSave,
    handleBatchUpload,
    handleMigrateGetFeatured,
    handleMigrateDigitalCard
  };
}

export default useFormConfigurationsTab;
