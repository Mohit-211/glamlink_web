'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

export interface CustomTab {
  id: string;
  label: string;
  fields: FieldConfig[];
  icon?: React.ComponentType<{ className?: string }>;
}

export type SubTabType = 'default' | 'form' | 'preview' | 'json';

export interface UseTabContainerConfig {
  customTabs?: CustomTab[];
  defaultTab?: string;
  allFields: FieldConfig[];
  onTabChange?: (tabId: string) => void;
}

export interface UseTabContainerReturn {
  // State
  activeCustomTab: string | null;
  activeSubTab: SubTabType;
  activeFields: FieldConfig[];

  // Handlers
  handleCustomTabClick: (tabId: string) => void;
  handleSubTabClick: (subTab: SubTabType) => void;
}

/**
 * useTabContainer - Hook for TabsContainer state and handlers
 *
 * Handles:
 * - Custom tab state management
 * - Subtab state (default/form/preview/json)
 * - Field filtering based on active tab
 * - Tab click handlers
 */
export function useTabContainer({
  customTabs,
  defaultTab = 'default',
  allFields,
  onTabChange,
}: UseTabContainerConfig): UseTabContainerReturn {
  // State management
  const [activeCustomTab, setActiveCustomTab] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('default');

  // Initialize active custom tab
  useEffect(() => {
    if (customTabs && customTabs.length > 0) {
      // Set first custom tab as active on mount
      const initialTab = customTabs.find((t) => t.id === defaultTab) || customTabs[0];
      setActiveCustomTab(initialTab.id);
    }
  }, [customTabs, defaultTab]);

  // Initialize activeSubTab based on defaultTab
  useEffect(() => {
    if (!customTabs || customTabs.length === 0) {
      // Simple tabs mode - defaultTab can be 'default', 'form', 'preview', or 'json'
      if (defaultTab === 'default' || defaultTab === 'form' || defaultTab === 'preview' || defaultTab === 'json') {
        setActiveSubTab(defaultTab as SubTabType);
      }
    }
  }, [defaultTab, customTabs]);

  // Determine which fields to render
  const activeFields = useMemo(() => {
    if (customTabs && customTabs.length > 0 && activeCustomTab) {
      const tab = customTabs.find((t) => t.id === activeCustomTab);
      return tab?.fields || [];
    }
    // No custom tabs - return all fields
    return allFields;
  }, [customTabs, activeCustomTab, allFields]);

  // Handle custom tab click
  const handleCustomTabClick = useCallback((tabId: string) => {
    setActiveCustomTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  }, [onTabChange]);

  // Handle subtab click
  const handleSubTabClick = useCallback((subTab: SubTabType) => {
    setActiveSubTab(subTab);
    if (onTabChange && !customTabs) {
      // In simple mode, notify parent of subtab change
      onTabChange(subTab);
    }
  }, [onTabChange, customTabs]);

  return {
    // State
    activeCustomTab,
    activeSubTab,
    activeFields,

    // Handlers
    handleCustomTabClick,
    handleSubTabClick,
  };
}
