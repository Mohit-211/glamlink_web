'use client';

import { useState, useCallback, useRef } from 'react';
import { useFormContext } from './form/FormProvider';

// Size classes for modal widths
export const MODAL_SIZE_CLASSES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-6xl',
  full: 'max-w-[calc(100vw-4rem)]',
} as const;

export type ModalSize = keyof typeof MODAL_SIZE_CLASSES;
export type SubTabType = 'default' | 'form' | 'preview' | 'json';

// Configuration for useFormModal hook
export interface UseFormModalConfig<T = Record<string, any>> {
  size: ModalSize;
  onSave: (data: T) => Promise<void>;
  onClose: () => void;
  onTabChange?: (tabId: string) => void;
}

// Return type for useFormModal hook
export interface UseFormModalReturn<T = Record<string, any>> {
  // State
  isLoading: boolean;
  saveError: string | null;
  activeSubTab: SubTabType;
  modalRef: React.RefObject<HTMLDivElement | null>;
  effectiveSize: ModalSize;
  sizeClasses: typeof MODAL_SIZE_CLASSES;

  // Handlers
  handleTabChangeInternal: (tabId: string) => void;
  handleSave: () => Promise<void>;
  handleJsonApply: (data: T) => void;
}

/**
 * useFormModal - Hook for FormModal state and handlers
 *
 * Handles:
 * - Loading and error state
 * - Tab switching and sizing
 * - Save with validation
 * - JSON apply functionality
 */
export function useFormModal<T extends Record<string, any> = Record<string, any>>({
  size,
  onSave,
  onClose,
  onTabChange,
}: UseFormModalConfig<T>): UseFormModalReturn<T> {
  const {
    formData,
    setFormData,
    validateAllFields,
  } = useFormContext<T>();

  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('default');
  const modalRef = useRef<HTMLDivElement>(null);

  // Determine effective size based on active subtab
  const effectiveSize: ModalSize = activeSubTab === 'default' ? 'full' : size;

  // Track subtab changes for conditional sizing
  const handleTabChangeInternal = useCallback((tabId: string) => {
    // Update subtab state if it's one of the 4 subtabs
    if (tabId === 'default' || tabId === 'form' || tabId === 'preview' || tabId === 'json') {
      setActiveSubTab(tabId as SubTabType);
    }

    // Call parent's onTabChange if provided
    if (onTabChange) {
      onTabChange(tabId);
    }
  }, [onTabChange]);

  // Handle save
  const handleSave = useCallback(async () => {
    setSaveError(null);

    // Validate all fields
    const isValid = validateAllFields();
    if (!isValid) {
      setSaveError('Please fix the validation errors before saving.');
      return;
    }

    // Set loading state
    setIsLoading(true);

    // Use setTimeout to ensure React processes the state update and re-renders
    // before we start the async save operation
    await new Promise(resolve => setTimeout(resolve, 0));

    try {
      await onSave(formData as T);
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateAllFields, onSave, onClose]);

  // Handle JSON apply
  const handleJsonApply = useCallback((data: T) => {
    setFormData(data);
    // Note: Tab switching is now handled by TabsContainer
  }, [setFormData]);

  return {
    // State
    isLoading,
    saveError,
    activeSubTab,
    modalRef,
    effectiveSize,
    sizeClasses: MODAL_SIZE_CLASSES,

    // Handlers
    handleTabChangeInternal,
    handleSave,
    handleJsonApply,
  };
}
