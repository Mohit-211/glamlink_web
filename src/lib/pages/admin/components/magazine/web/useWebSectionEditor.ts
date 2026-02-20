/**
 * useWebSectionEditor - Main hook for web section editor
 *
 * Manages section data, type selection, save operations, and lock management
 */

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/lib/features/auth/useAuth';
import { releaseSectionLock, refreshSectionLock } from '@/lib/packages/admin-lock-management';
import type { WebSectionData, WebSectionType } from './types';
import { getDefaultWebSectionData } from './types';

interface UseWebSectionEditorParams {
  /**
   * Initial section data (null for new section)
   */
  initialSection: Partial<WebSectionData> | null;
  /**
   * Issue ID this section belongs to
   */
  issueId: string;
  /**
   * Callback when section is saved
   */
  onSave: (data: Partial<WebSectionData>) => Promise<void>;
  /**
   * Callback to go back
   */
  onBack: () => void;
}

interface UseWebSectionEditorReturn {
  // State
  sectionData: Partial<WebSectionData>;
  sectionType: WebSectionType;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  isNewSection: boolean;
  error: string | null;

  // Handlers
  handleDataChange: (data: Partial<WebSectionData>) => void;
  handleTypeChange: (type: WebSectionType) => void;
  handleSave: () => Promise<void>;
  handleBack: () => Promise<void>;
}

export function useWebSectionEditor({
  initialSection,
  issueId,
  onSave,
  onBack,
}: UseWebSectionEditorParams): UseWebSectionEditorReturn {
  // Get current user for lock management
  const { user } = useAuth();

  // Determine if this is a new section
  const isNewSection = initialSection === null;

  // Initialize section type
  const initialType: WebSectionType = (initialSection?.type as WebSectionType) || 'join-glamlink';

  // State
  const [sectionType, setSectionType] = useState<WebSectionType>(initialType);
  const [sectionData, setSectionData] = useState<Partial<WebSectionData>>(() => {
    if (initialSection) {
      return { ...initialSection, issueId };
    }
    return { ...getDefaultWebSectionData(initialType), issueId };
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle data change from form
  const handleDataChange = useCallback((data: Partial<WebSectionData>) => {
    setSectionData(prev => ({
      ...prev,
      ...data,
    }));
    setHasUnsavedChanges(true);
    setError(null);
  }, []);

  // Handle type change
  const handleTypeChange = useCallback((newType: WebSectionType) => {
    if (newType !== sectionType) {
      setSectionType(newType);
      // Reset to defaults for new type, but keep issueId
      setSectionData({
        ...getDefaultWebSectionData(newType),
        issueId,
      });
      setHasUnsavedChanges(true);
    }
  }, [sectionType, issueId]);

  // Validate section data before save
  const validateSection = useCallback((): string | null => {
    if (!sectionData.title || sectionData.title.trim() === '') {
      return 'Title is required';
    }
    return null;
  }, [sectionData]);

  // Simple save handler (no lock management needed - lock acquired before opening editor)
  const handleSave = useCallback(async () => {
    // Validate before saving
    const validationError = validateSection();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Prepare data for save
      const dataToSave: Partial<WebSectionData> = {
        ...sectionData,
        type: sectionType,
        issueId,
        updatedAt: new Date().toISOString(),
      };

      // If new section, add createdAt
      if (isNewSection) {
        dataToSave.createdAt = new Date().toISOString();
      }

      await onSave(dataToSave);
      setHasUnsavedChanges(false);
      // Lock will be released in handleBack after save
    } catch (err) {
      console.error('Failed to save section:', err);
      setError(err instanceof Error ? err.message : 'Failed to save section');
    } finally {
      setIsSaving(false);
    }
  }, [sectionData, sectionType, issueId, isNewSection, onSave, validateSection]);

  // Simple back handler with lock release
  const handleBack = useCallback(async () => {
    // Check for unsaved changes
    if (hasUnsavedChanges) {
      const confirmed = confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }

    // Release lock if editing existing section
    if (!isNewSection && sectionData.id && user) {
      try {
        await releaseSectionLock(sectionData.id, user.uid);
      } catch {
        // Continue with back navigation even if release fails
      }
    }

    onBack();
  }, [hasUnsavedChanges, isNewSection, sectionData.id, user, onBack]);

  // Auto-refresh lock every 1 minute while editing
  useEffect(() => {
    if (!isNewSection && sectionData.id && user) {
      // Refresh lock every 1 minute (60000ms)
      const intervalId = setInterval(async () => {
        try {
          await refreshSectionLock(sectionData.id!, user.uid);
        } catch {
          // Silently handle refresh failures
        }
      }, 60000); // 1 minute

      return () => clearInterval(intervalId);
    }
  }, [isNewSection, sectionData.id, user]);

  return {
    sectionData,
    sectionType,
    isSaving,
    hasUnsavedChanges,
    isNewSection,
    error,
    handleDataChange,
    handleTypeChange,
    handleSave,
    handleBack,
  };
}

export default useWebSectionEditor;
