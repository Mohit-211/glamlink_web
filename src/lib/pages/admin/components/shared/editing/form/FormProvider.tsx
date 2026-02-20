'use client';

import React, { createContext, useContext } from 'react';
import { useFormProvider, type OnFieldChangeCallback } from './useFormProvider';
import type { FormContextValue } from '../types';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

// Create context with undefined default (will be provided by FormProvider)
const FormContext = createContext<FormContextValue | undefined>(undefined);

// Hook to access form context - throws if used outside provider
export function useFormContext<T = Record<string, any>>(): FormContextValue<T> {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context as FormContextValue<T>;
}

// Props for FormProvider
interface FormProviderProps<T = Record<string, any>> {
  children: React.ReactNode;
  initialData?: Partial<T>;
  fields: FieldConfig[];
  onFieldChange?: OnFieldChangeCallback<T>;
  context?: Record<string, any>;
}

export function FormProvider<T extends Record<string, any> = Record<string, any>>({
  children,
  initialData = {},
  fields,
  onFieldChange,
  context = {},
}: FormProviderProps<T>) {
  // Use the extracted hook for all form state management
  const contextValue = useFormProvider<T>({
    initialData: initialData as Partial<T>,
    fields,
    onFieldChange,
    context,
  });

  return (
    <FormContext.Provider value={contextValue as FormContextValue}>
      {children}
    </FormContext.Provider>
  );
}

// Export context for advanced use cases
export { FormContext };
