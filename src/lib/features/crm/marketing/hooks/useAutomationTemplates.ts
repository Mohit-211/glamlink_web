/**
 * useAutomationTemplates Hook
 *
 * Fetches available automation templates
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AutomationTemplate } from '../types';

/**
 * Hook Return Type
 */
interface UseAutomationTemplatesReturn {
  templates: AutomationTemplate[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * useAutomationTemplates Hook
 */
export function useAutomationTemplates(): UseAutomationTemplatesReturn {
  const [templates, setTemplates] = useState<AutomationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch templates
   */
  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/crm/marketing/automations/templates', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch automation templates');
      }

      const result = await response.json();

      if (result.success) {
        setTemplates(result.data || []);
      } else {
        throw new Error(result.error || 'Failed to fetch automation templates');
      }
    } catch (err) {
      console.error('Error fetching automation templates:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh
   */
  const refresh = useCallback(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  /**
   * Fetch on mount
   */
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    loading,
    error,
    refresh,
  };
}

/**
 * useAutomationTemplate Hook (single template)
 */
interface UseAutomationTemplateReturn {
  template: AutomationTemplate | null;
  loading: boolean;
  error: string | null;
}

export function useAutomationTemplate(templateId: string): UseAutomationTemplateReturn {
  const [template, setTemplate] = useState<AutomationTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!templateId) {
      setLoading(false);
      return;
    }

    const fetchTemplate = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/crm/marketing/automations/templates/${templateId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch automation template');
        }

        const result = await response.json();

        if (result.success) {
          setTemplate(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch automation template');
        }
      } catch (err) {
        console.error('Error fetching automation template:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setTemplate(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  return {
    template,
    loading,
    error,
  };
}

export default useAutomationTemplates;
