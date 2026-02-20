import { useState, useEffect, useCallback, useMemo } from 'react';
import { ProfileTabConfig } from '@/lib/config/profileTabs';

interface UseProfileTabsSectionProps {
  tabs: ProfileTabConfig[];
  onUpdate: (tabs: ProfileTabConfig[]) => Promise<void>;
  isSaving: boolean;
}

export function useProfileTabsSection({ tabs, onUpdate, isSaving }: UseProfileTabsSectionProps) {
  const [localTabs, setLocalTabs] = useState<ProfileTabConfig[]>(tabs);
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedTabs, setExpandedTabs] = useState<Set<string>>(new Set());
  const [showBatchModal, setShowBatchModal] = useState(false);

  useEffect(() => {
    setLocalTabs(tabs);
  }, [tabs]);

  const hasChanges = JSON.stringify(localTabs) !== JSON.stringify(tabs);

  const handleToggleTab = (id: string) => {
    setLocalTabs(prev =>
      prev.map(tab =>
        tab.id === id ? { ...tab, isVisible: !tab.isVisible } : tab
      )
    );
  };

  const handleToggleSubsection = (tabId: string, subsectionId: string) => {
    setLocalTabs(prev =>
      prev.map(tab => {
        if (tab.id !== tabId) return tab;

        return {
          ...tab,
          subsections: tab.subsections.map(subsection =>
            subsection.id === subsectionId
              ? { ...subsection, isVisible: !subsection.isVisible }
              : subsection
          )
        };
      })
    );
  };

  const toggleExpanded = (tabId: string) => {
    setExpandedTabs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tabId)) {
        newSet.delete(tabId);
      } else {
        newSet.add(tabId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    try {
      await onUpdate(localTabs);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save profile tabs:', error);
    }
  };

  const handleReset = () => {
    setLocalTabs(tabs);
  };

  const handleBatchUpload = useCallback(async (data: any[]) => {
    // Transform data: ensure proper ProfileTabConfig structure
    const tabConfigs: ProfileTabConfig[] = data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      isVisible: item.isVisible,
      subsections: item.subsections || []
    }));

    await onUpdate(tabConfigs);
    setLocalTabs(tabConfigs);
  }, [onUpdate]);

  // Transform data for BatchModal (add id field if needed for validation)
  const tabsWithId = useMemo(() =>
    localTabs.map(tab => ({
      ...tab,
      id: tab.id  // Already has id, but ensuring it's present
    })),
    [localTabs]
  );

  return {
    localTabs,
    hasChanges,
    showSuccess,
    expandedTabs,
    showBatchModal,
    setShowBatchModal,
    handleToggleTab,
    handleToggleSubsection,
    toggleExpanded,
    handleSave,
    handleReset,
    handleBatchUpload,
    tabsWithId
  };
}
