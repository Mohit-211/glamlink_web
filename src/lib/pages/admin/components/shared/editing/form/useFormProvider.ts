'use client';

import { useState, useCallback, useRef } from 'react';
import type { FormContextValue } from '../types';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

/**
 * Set a value at a nested path using dot notation (e.g., "layout.imagePosition")
 * Returns a new object with the value set at the path (immutable)
 */
function setNestedValue<T extends Record<string, any>>(obj: T, path: string, value: any): T {
  const parts = path.split('.');
  const result = { ...obj };

  let current: any = result;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    current[part] = current[part] != null ? { ...current[part] } : {};
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;

  return result;
}

/**
 * Get a value at a nested path using dot notation (e.g., "layout.imagePosition")
 */
function getNestedValue(obj: Record<string, any>, path: string): any {
  const parts = path.split('.');
  let current = obj;

  for (const part of parts) {
    if (current == null) return undefined;
    current = current[part];
  }

  return current;
}

/**
 * Function to update multiple fields at once
 */
export type UpdateFieldsFn<T> = (updates: Partial<T>) => void;

/**
 * Extended field change callback that receives updateFields function
 * This allows the callback to trigger updates to other fields (e.g., for linked fields)
 */
export type OnFieldChangeCallback<T = Record<string, any>> = (
  name: string,
  value: any,
  data: Partial<T>,
  updateFields: UpdateFieldsFn<T>
) => void;

// Configuration for useFormProvider hook
export interface UseFormProviderConfig<T = Record<string, any>> {
  initialData: Partial<T>;
  fields: FieldConfig[];
  onFieldChange?: OnFieldChangeCallback<T>;
  context?: Record<string, any>;
}

/**
 * useFormProvider - Core form state management hook
 *
 * Extracted from FormProvider for reusability and testing.
 * Provides single source of truth for form data with validation.
 */
export function useFormProvider<T extends Record<string, any> = Record<string, any>>({
  initialData = {} as Partial<T>,
  fields,
  onFieldChange,
  context = {},
}: UseFormProviderConfig<T>): FormContextValue<T> {
  // ============================================
  // STATE - Single source of truth
  // ============================================

  // Form data state - this is the ONLY place form values live
  const [formData, setFormDataState] = useState<T>(() => {
    console.log('🟣 [FormProvider] Initializing with data:', JSON.stringify(initialData, null, 2));
    console.log('🟣 [FormProvider] initialData["layout.imagePosition"]:', (initialData as any)['layout.imagePosition']);
    console.log('🟣 [FormProvider] initialData.layout:', (initialData as any).layout);
    return { ...initialData } as T;
  });

  // Validation errors per field
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Track if form has been modified
  const [isDirty, setIsDirty] = useState(false);

  // Track if form is currently submitting
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ref to access latest data in callbacks without re-creating them
  const formDataRef = useRef<T>(formData);
  formDataRef.current = formData;

  // Ref to access fields for validation
  const fieldsRef = useRef<FieldConfig[]>(fields);
  fieldsRef.current = fields;

  // Ref to access onFieldChange callback
  const onFieldChangeRef = useRef(onFieldChange);
  onFieldChangeRef.current = onFieldChange;

  // ============================================
  // DATA ACCESS
  // ============================================

  // Get a single field value - supports dot notation for nested paths
  const getFieldValue = useCallback((name: string): any => {
    if (name.includes('.')) {
      return getNestedValue(formDataRef.current, name);
    }
    return formDataRef.current[name];
  }, []);

  // ============================================
  // DATA MUTATION - Single setState per action
  // ============================================

  // Update multiple fields at once (defined first since updateField depends on it)
  const updateFields = useCallback((updates: Partial<T>) => {
    const newData = { ...formDataRef.current, ...updates };
    formDataRef.current = newData;
    setFormDataState(newData);
    setIsDirty(true);
  }, []);

  // Update a single field - supports dot notation for nested paths (e.g., "layout.imagePosition")
  const updateField = useCallback((name: string, value: any) => {
    console.log('🟣 [FormProvider] updateField called:', name, '=', value);

    const newData = name.includes('.')
      ? setNestedValue(formDataRef.current, name, value)
      : { ...formDataRef.current, [name]: value };

    console.log('🟣 [FormProvider] newData after update:', JSON.stringify(newData, null, 2));
    formDataRef.current = newData;
    setFormDataState(newData);
    setIsDirty(true);

    // Clear error for this field when user starts typing
    setErrors(prev => {
      if (prev[name]) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      return prev;
    });

    // Call external field change handler if provided
    // This is called AFTER state update, so it won't cause focus issues
    if (onFieldChangeRef.current) {
      // Use setTimeout to ensure state update is committed first
      setTimeout(() => {
        // Pass updateFields so callback can update other fields (e.g., linked fields)
        onFieldChangeRef.current?.(name, value, newData, updateFields);
      }, 0);
    }
  }, [updateFields]);

  // Replace entire form data (used by JSON editor)
  const setFormData = useCallback((data: T) => {
    formDataRef.current = data;
    setFormDataState(data);
    setIsDirty(true);
    setErrors({}); // Clear all errors when replacing data
  }, []);

  // ============================================
  // VALIDATION
  // ============================================

  // Set error for a specific field
  const setFieldError = useCallback((name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  // Clear error for a specific field
  const clearFieldError = useCallback((name: string) => {
    setErrors(prev => {
      if (prev[name]) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, []);

  // Validate a single field - returns error message or null
  const validateField = useCallback((name: string): string | null => {
    const field = fieldsRef.current.find(f => f.name === name);
    if (!field) return null;

    const value = formDataRef.current[name];

    // Required validation
    if (field.required) {
      if (value === undefined || value === null || value === '') {
        const error = `${field.label} is required`;
        setErrors(prev => ({ ...prev, [name]: error }));
        return error;
      }
      // Array required check
      if (Array.isArray(value) && value.length === 0) {
        const error = `${field.label} is required`;
        setErrors(prev => ({ ...prev, [name]: error }));
        return error;
      }
    }

    // Custom validation
    if (field.validation?.custom) {
      const error = field.validation.custom(value);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
        return error;
      }
    }

    // Min/max validation for numbers
    if (field.type === 'number' && value !== undefined && value !== null && value !== '') {
      const numValue = Number(value);
      if (field.min !== undefined && numValue < field.min) {
        const error = `${field.label} must be at least ${field.min}`;
        setErrors(prev => ({ ...prev, [name]: error }));
        return error;
      }
      if (field.max !== undefined && numValue > field.max) {
        const error = `${field.label} must be at most ${field.max}`;
        setErrors(prev => ({ ...prev, [name]: error }));
        return error;
      }
    }

    // Email format validation
    if (field.type === 'email' && value && typeof value === 'string' && value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        const error = `Please enter a valid email address`;
        setErrors(prev => ({ ...prev, [name]: error }));
        return error;
      }
    }

    // Phone format validation - must be at least 10 digits
    if (field.type === 'tel' && value && typeof value === 'string' && value.trim()) {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        const error = `Phone number must be at least 10 digits`;
        setErrors(prev => ({ ...prev, [name]: error }));
        return error;
      }
      if (digitsOnly.length > 11) {
        const error = `Phone number is too long`;
        setErrors(prev => ({ ...prev, [name]: error }));
        return error;
      }
    }

    // URL format validation
    if (field.type === 'url' && value && typeof value === 'string' && value.trim()) {
      // Accepts: sample.com, www.sample.ai, https://www.sample.net, http://sample.org
      const urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
      if (!urlRegex.test(value)) {
        const error = `Please enter a valid website URL`;
        setErrors(prev => ({ ...prev, [name]: error }));
        return error;
      }
    }

    // Clear error if validation passes
    clearFieldError(name);
    return null;
  }, [clearFieldError]);

  // Validate all fields - returns true if valid
  const validateAllFields = useCallback((): boolean => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    for (const field of fieldsRef.current) {
      if (field.hide) continue; // Skip hidden fields

      const error = validateField(field.name);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [validateField]);

  // ============================================
  // RETURN VALUE
  // ============================================

  return {
    formData,
    getFieldValue,
    updateField,
    updateFields,
    setFormData,
    errors,
    setFieldError,
    clearFieldError,
    validateField,
    validateAllFields,
    isDirty,
    isSubmitting,
    context,
  };
}
