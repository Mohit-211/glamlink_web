/**
 * useMagazineSections - Hook for managing magazine sections
 *
 * Handles all state and business logic for the MagazineSections component
 */

import { useState, useCallback } from 'react';
import { useSectionsRedux } from '@/lib/pages/admin/hooks/useSectionsRedux';
import { useAuth } from '@/lib/features/auth/useAuth';
import { checkSectionLock, acquireSectionLock } from '@/lib/packages/admin-lock-management';
import type { WebSectionData, WebSectionType, WebSectionAsDocument } from './web/types';
import { toSectionDocument, fromSectionDocument } from './useSectionsTransformations';

interface UseMagazineSectionsParams {
  issueId: string;
  issueTitle: string;
}

interface UseMagazineSectionsReturn {
  // Data from Redux
  sections: any[];
  lastUpdated: number | null;
  isLoading: boolean;
  error: string | null;
  fetchSections: () => Promise<void>;

  // UI State
  editingSection: any;
  isAddingSection: boolean;
  showBatchUpload: boolean;
  loadingSectionId: string | null;

  // Handlers
  handleEdit: (section: any) => void;
  handleDelete: (section: any) => Promise<void>;
  handleAddSection: () => void;
  handleBatchUpload: (sectionsData: any[]) => Promise<any>;
  handleBackFromWebEditor: () => void;
  handleBackFromAddSection: () => void;
  handleSaveNewSection: (data: Partial<WebSectionData>) => Promise<void>;
  handleSaveExistingSection: (data: Partial<WebSectionData>) => Promise<void>;
  setShowBatchUpload: (show: boolean) => void;

  // Transformation utilities
  toSectionDocument: (data: Partial<WebSectionData>) => Partial<WebSectionAsDocument>;
  fromSectionDocument: (doc: Partial<WebSectionAsDocument>) => Partial<WebSectionData>;
}

export function useMagazineSections({ issueId, issueTitle }: UseMagazineSectionsParams): UseMagazineSectionsReturn {
  const {
    sections,
    lastUpdated,
    isLoading,
    error,
    fetchSections,
    createSection,
    updateSection,
  } = useSectionsRedux(issueId);

  // Get current user for lock management
  const { user } = useAuth();

  // UI State
  const [editingSection, setEditingSection] = useState<any>(null);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [showBatchUpload, setShowBatchUpload] = useState(false);
  const [loadingSectionId, setLoadingSectionId] = useState<string | null>(null);

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  /**
   * Handle edit - checks lock and opens the web section editor
   * Uses admin-lock-management for simple conflict resolution
   */
  const handleEdit = useCallback(async (section: any) => {
    setLoadingSectionId(section.id);  // Start loading

    try {
      // Verify user is authenticated
      if (!user) {
        alert('You must be logged in to edit sections');
        return;
      }

      // 1. Check lock status first
      const lockStatus = await checkSectionLock(section.id, user.uid);

      // 2. Handle conflicts
      if (lockStatus.isLocked) {
        if (lockStatus.canOverride) {
          // User's own lock - ask to override
          const override = confirm(
            `Do you want to override your other lock? Updates could override the changes you made on another tab`
          );
          if (!override) {
            await fetchSections();  // Refresh table to show accurate lock status
            return;
          }
        } else {
          // Locked by someone else
          alert(
            `This section is locked by ${lockStatus.lockedByName || 'another user'}. ` +
            `Please try again later.`
          );
          await fetchSections();  // Refresh table to show accurate lock status
          return;
        }
      }

      // 3. Acquire lock
      const acquired = await acquireSectionLock({
        sectionId: section.id,
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || user.email || 'Unknown User',
        override: lockStatus.canOverride,
      });

      if (!acquired.success) {
        alert(acquired.error || 'Failed to acquire lock');
        await fetchSections();  // Refresh table to show accurate lock status
        return;
      }

      // 4. Fetch fresh section data from API before opening editor
      let freshSection: any;
      try {
        const response = await fetch(
          `/api/magazine/sections/${section.id}`,
          { credentials: 'include' }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch fresh section data');
        }

        const data = await response.json();
        freshSection = data.section;  // Extract section from response wrapper

      } catch (error) {
        console.error('Failed to fetch fresh section:', error);
        // Fall back to cached section if fetch fails
        freshSection = section;
      }

      // 5. Open editor with fresh data
      setEditingSection(freshSection);
    } finally {
      setLoadingSectionId(null);  // End loading
    }
  }, [user, fetchSections]);

  /**
   * Handle delete with confirmation
   */
  const handleDelete = useCallback(async (section: any) => {
    if (!confirm(`Are you sure you want to delete section "${section.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      // Call delete API
      const response = await fetch(`/api/magazine/sections/${section.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete section');
      }

      // Refresh sections list
      await fetchSections();
    } catch (error) {
      console.error('Failed to delete section:', error);
      alert('Failed to delete section. Please try again.');
    }
  }, [fetchSections]);

  /**
   * Handle batch upload
   */
  const handleBatchUpload = useCallback(async (sectionsData: any[]) => {
    try {
      const response = await fetch(`/api/magazine/sections/batch?issueId=${issueId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sections: sectionsData })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload sections');
      }

      const result = await response.json();

      // Refresh sections list
      await fetchSections();

      return result;
    } catch (error) {
      console.error('Batch upload failed:', error);
      throw error;
    }
  }, [issueId, fetchSections]);

  /**
   * Handle back from web editor
   */
  const handleBackFromWebEditor = useCallback(() => {
    setEditingSection(null);
  }, []);

  /**
   * Handle add section - opens the web section editor with null section
   */
  const handleAddSection = useCallback(() => {
    setIsAddingSection(true);
  }, []);

  /**
   * Handle back from adding section
   */
  const handleBackFromAddSection = useCallback(() => {
    setIsAddingSection(false);
  }, []);

  /**
   * Handle save new section
   */
  const handleSaveNewSection = useCallback(async (data: Partial<WebSectionData>) => {
    try {
      // Convert WebSectionData to document format for API
      const documentData = toSectionDocument(data);
      await createSection(documentData as any);  // Type compatibility handled at runtime
      setIsAddingSection(false);
    } catch (error) {
      console.error('Failed to create section:', error);
      throw error;
    }
  }, [createSection]);

  /**
   * Handle save existing section
   */
  const handleSaveExistingSection = useCallback(async (data: Partial<WebSectionData>) => {
    if (!editingSection?.id) return;
    try {
      // Convert WebSectionData to document format for API
      const documentData = toSectionDocument(data);
      await updateSection(editingSection.id, documentData as any);  // Type compatibility handled at runtime
      setEditingSection(null);
    } catch (error) {
      console.error('Failed to update section:', error);
      throw error;
    }
  }, [editingSection?.id, updateSection]);

  return {
    // Data from Redux
    sections,
    lastUpdated,
    isLoading,
    error,
    fetchSections,

    // UI State
    editingSection,
    isAddingSection,
    showBatchUpload,
    loadingSectionId,

    // Handlers
    handleEdit,
    handleDelete,
    handleAddSection,
    handleBatchUpload,
    handleBackFromWebEditor,
    handleBackFromAddSection,
    handleSaveNewSection,
    handleSaveExistingSection,
    setShowBatchUpload,

    // Transformation utilities
    toSectionDocument,
    fromSectionDocument,
  };
}

export default useMagazineSections;
