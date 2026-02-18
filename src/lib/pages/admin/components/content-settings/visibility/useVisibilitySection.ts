import { useState, useEffect, useCallback, useMemo } from 'react';
import { PageConfig } from '@/lib/config/pageVisibility';

export interface UseVisibilitySectionProps {
  settings: PageConfig[];
  onUpdate: (settings: PageConfig[]) => Promise<void>;
  isSaving: boolean;
}

export interface UseVisibilitySectionReturn {
  // State
  localSettings: PageConfig[];
  hasChanges: boolean;
  showSuccess: boolean;
  showBatchModal: boolean;
  expandedGroups: Record<string, boolean>;

  // Setters
  setShowBatchModal: (show: boolean) => void;

  // Handlers
  toggleGroup: (groupTitle: string) => void;
  handleToggle: (path: string) => void;
  handleSave: () => Promise<void>;
  handleReset: () => void;
  handleBatchUpload: (data: any[]) => Promise<void>;

  // Computed
  settingsWithId: (PageConfig & { id: string })[];
}

export function useVisibilitySection({
  settings,
  onUpdate,
  isSaving
}: UseVisibilitySectionProps): UseVisibilitySectionReturn {
  const [localSettings, setLocalSettings] = useState<PageConfig[]>(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Forms': true,
    'Pages': true,
    'Services': true,
    'Legal': true
  });

  // Update local settings when props change
  useEffect(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings]);

  const toggleGroup = useCallback((groupTitle: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle]
    }));
  }, []);

  const handleToggle = useCallback((path: string) => {
    setLocalSettings(prev =>
      prev.map(page =>
        page.path === path ? { ...page, isVisible: !page.isVisible } : page
      )
    );
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      await onUpdate(localSettings);
      setHasChanges(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update visibility settings:', error);
    }
  }, [localSettings, onUpdate]);

  const handleReset = useCallback(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings]);

  const handleBatchUpload = useCallback(async (data: any[]) => {
    // Transform data: remove 'id' field (added for BatchModal), keep only PageConfig fields
    const pageConfigs: PageConfig[] = data.map(item => ({
      path: item.path,
      name: item.name,
      description: item.description,
      isVisible: item.isVisible
    }));

    await onUpdate(pageConfigs);
    setLocalSettings(pageConfigs);
    setHasChanges(false);
  }, [onUpdate]);

  // Transform data for BatchModal: add 'id' field (required by BatchModal validation)
  const settingsWithId = useMemo(() =>
    localSettings.map(setting => ({
      ...setting,
      id: setting.path  // Use path as id for BatchModal
    })),
    [localSettings]
  );

  return {
    // State
    localSettings,
    hasChanges,
    showSuccess,
    showBatchModal,
    expandedGroups,

    // Setters
    setShowBatchModal,

    // Handlers
    toggleGroup,
    handleToggle,
    handleSave,
    handleReset,
    handleBatchUpload,

    // Computed
    settingsWithId
  };
}
