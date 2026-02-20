'use client';

/**
 * useDigitalCardFormConfig - Fetch digital card form configuration dynamically
 *
 * Fetches form configuration from the database via public API endpoint.
 * Falls back to static configuration if API fails.
 * Provides converted fields_layout for form component compatibility.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  DigitalCardFormConfig,
  FormSectionConfig,
  FormFieldConfig
} from '@/lib/pages/admin/components/form-submissions/form-configurations/types';
import { digitalCardFormConfig } from '@/lib/pages/admin/components/form-submissions/form-configurations/data';
import type { FieldConfig, TabConfig } from '../config/fields';

// =============================================================================
// TYPES
// =============================================================================

export interface FieldsLayout {
  profile: TabConfig;
  glamlinkIntegration: TabConfig;
}

export interface UseDigitalCardFormConfigReturn {
  config: DigitalCardFormConfig | null;
  sections: FormSectionConfig[];
  fieldsLayout: FieldsLayout;
  isLoading: boolean;
  error: string | null;
  source: 'database' | 'static' | 'static-fallback' | null;
  refetch: () => Promise<void>;
}

// =============================================================================
// UTILITY: Convert database sections to fields_layout format
// =============================================================================

/**
 * Converts the database sections format to the flat fields_layout format
 * used by the form components.
 */
function convertSectionsToFieldsLayout(sections: FormSectionConfig[]): FieldsLayout {
  const profileFields: TabConfig = {};
  const glamlinkFields: TabConfig = {};

  // Profile section IDs (everything except glamlink-integration)
  const profileSectionIds = ['basic-info', 'locations-hours', 'media-portfolio', 'services-booking'];
  const glamlinkSectionId = 'glamlink-integration';

  sections.forEach(section => {
    section.fields?.forEach(field => {
      // Convert database field format to FieldConfig format
      const fieldConfig: FieldConfig = {
        type: field.type,
        label: field.label,
        required: field.required,
        placeholder: field.placeholder,
        helperText: field.helperText,
        options: field.options,
        validation: field.validation ? {
          minChars: field.validation.minChars,
          maxChars: field.validation.maxLength, // Map maxLength to maxChars for consistency
          maxLength: field.validation.maxLength,
          pattern: field.validation.pattern ? new RegExp(field.validation.pattern) : undefined
        } : undefined,
        minSelections: field.minSelections,
        maxSelections: field.maxSelections,
        columns: field.columns as 1 | 2 | undefined
      };

      // Clean up undefined values
      Object.keys(fieldConfig).forEach(key => {
        if (fieldConfig[key as keyof FieldConfig] === undefined) {
          delete fieldConfig[key as keyof FieldConfig];
        }
      });

      // Assign to appropriate category
      if (section.id === glamlinkSectionId) {
        glamlinkFields[field.name] = fieldConfig;
      } else if (profileSectionIds.includes(section.id)) {
        profileFields[field.name] = fieldConfig;
      } else {
        // Default to profile for any other sections
        profileFields[field.name] = fieldConfig;
      }
    });
  });

  return {
    profile: profileFields,
    glamlinkIntegration: glamlinkFields
  };
}

// =============================================================================
// DEFAULT FIELDS LAYOUT (from static config)
// =============================================================================

const defaultFieldsLayout = convertSectionsToFieldsLayout(digitalCardFormConfig.sections);

// =============================================================================
// HOOK
// =============================================================================

export function useDigitalCardFormConfig(): UseDigitalCardFormConfigReturn {
  const [config, setConfig] = useState<DigitalCardFormConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'database' | 'static' | 'static-fallback' | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/public/form-configs/digital-card', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setConfig(data.data as DigitalCardFormConfig);
        setSource(data.source || 'database');
      } else {
        throw new Error(data.error || 'Invalid response');
      }
    } catch (err) {
      console.error('Error fetching digital card form config:', err);
      // Fallback to static config
      setConfig(digitalCardFormConfig);
      setSource('static-fallback');
      setError(err instanceof Error ? err.message : 'Failed to fetch configuration');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Convert sections to fields_layout format
  const fieldsLayout = useMemo(() => {
    if (!config?.sections || config.sections.length === 0) {
      return defaultFieldsLayout;
    }
    return convertSectionsToFieldsLayout(config.sections);
  }, [config]);

  return {
    config,
    sections: config?.sections || [],
    fieldsLayout,
    isLoading,
    error,
    source,
    refetch: fetchConfig
  };
}

export default useDigitalCardFormConfig;
