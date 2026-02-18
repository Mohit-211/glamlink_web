'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  increment,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db as clientDb } from '@/lib/config/firebase';
import { useAuth } from '@/lib/features/auth/useAuth';
import type {
  MessageTemplate,
  CreateTemplateInput,
  UpdateTemplateInput,
  TemplateCategory,
} from '../types/template';

const TEMPLATES_COLLECTION = 'support_message_templates';

interface UseMessageTemplatesReturn {
  /** List of available templates */
  templates: MessageTemplate[];
  /** Whether templates are loading */
  isLoading: boolean;
  /** Error message if loading failed */
  error: string | null;
  /** Create a new template */
  createTemplate: (input: CreateTemplateInput) => Promise<string | null>;
  /** Update an existing template */
  updateTemplate: (id: string, updates: UpdateTemplateInput) => Promise<boolean>;
  /** Delete a template */
  deleteTemplate: (id: string) => Promise<boolean>;
  /** Get a template and increment its usage count */
  useTemplate: (id: string) => MessageTemplate | undefined;
  /** Get templates by category */
  getTemplatesByCategory: (category: TemplateCategory | 'all') => MessageTemplate[];
}

/**
 * Hook for managing message templates.
 *
 * Templates are stored in Firestore and shared across all admins.
 * Provides CRUD operations and usage tracking.
 *
 * @example
 * ```tsx
 * const { templates, createTemplate, useTemplate } = useMessageTemplates();
 *
 * // Insert template content
 * const handleSelectTemplate = (id: string) => {
 *   const template = useTemplate(id);
 *   if (template) {
 *     setMessageContent(template.content);
 *   }
 * };
 * ```
 */
export function useMessageTemplates(): UseMessageTemplatesReturn {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract stable user ID to avoid callback recreation
  const userId = user?.uid;

  // Fetch templates once (not real-time to avoid permission/refresh issues)
  useEffect(() => {
    if (!clientDb) {
      setIsLoading(false);
      setTemplates([]);
      return;
    }

    // Store db reference to ensure TypeScript knows it's non-null in async function
    const db = clientDb;
    let isMounted = true;

    const fetchTemplates = async () => {
      try {
        const templatesRef = collection(db, TEMPLATES_COLLECTION);
        const templatesQuery = query(templatesRef, orderBy('usageCount', 'desc'));
        const snapshot = await getDocs(templatesQuery);

        if (!isMounted) return;

        const templatesData = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            name: data.name || '',
            content: data.content || '',
            category: data.category || 'custom',
            createdBy: data.createdBy || '',
            createdAt: data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : new Date(data.createdAt || Date.now()),
            updatedAt: data.updatedAt instanceof Timestamp
              ? data.updatedAt.toDate()
              : new Date(data.updatedAt || Date.now()),
            usageCount: data.usageCount || 0,
          } as MessageTemplate;
        });

        setTemplates(templatesData);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        // If collection doesn't exist or permission denied, just show empty
        console.log('Templates not available:', err);
        setTemplates([]);
        setIsLoading(false);
        setError(null); // Don't show error, just empty state
      }
    };

    fetchTemplates();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Create a new template
   */
  const createTemplate = useCallback(
    async (input: CreateTemplateInput): Promise<string | null> => {
      if (!clientDb || !userId) return null;

      try {
        const templatesRef = collection(clientDb, TEMPLATES_COLLECTION);
        const now = new Date();
        const docRef = await addDoc(templatesRef, {
          name: input.name.trim(),
          content: input.content.trim(),
          category: input.category,
          createdBy: userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          usageCount: 0,
        });

        // Update local state immediately
        const newTemplate: MessageTemplate = {
          id: docRef.id,
          name: input.name.trim(),
          content: input.content.trim(),
          category: input.category,
          createdBy: userId,
          createdAt: now,
          updatedAt: now,
          usageCount: 0,
        };
        setTemplates(prev => [newTemplate, ...prev]);

        return docRef.id;
      } catch (err) {
        console.error('Error creating template:', err);
        return null;
      }
    },
    [userId]
  );

  /**
   * Update an existing template
   */
  const updateTemplate = useCallback(
    async (id: string, updates: UpdateTemplateInput): Promise<boolean> => {
      if (!clientDb) return false;

      try {
        const templateRef = doc(clientDb, TEMPLATES_COLLECTION, id);
        const updateData: Record<string, unknown> = {
          updatedAt: serverTimestamp(),
        };

        if (updates.name !== undefined) {
          updateData.name = updates.name.trim();
        }
        if (updates.content !== undefined) {
          updateData.content = updates.content.trim();
        }
        if (updates.category !== undefined) {
          updateData.category = updates.category;
        }

        await updateDoc(templateRef, updateData);

        // Update local state immediately
        setTemplates(prev => prev.map(t => {
          if (t.id !== id) return t;
          return {
            ...t,
            ...(updates.name !== undefined && { name: updates.name.trim() }),
            ...(updates.content !== undefined && { content: updates.content.trim() }),
            ...(updates.category !== undefined && { category: updates.category }),
            updatedAt: new Date(),
          };
        }));

        return true;
      } catch (err) {
        console.error('Error updating template:', err);
        return false;
      }
    },
    []
  );

  /**
   * Delete a template
   */
  const deleteTemplate = useCallback(async (id: string): Promise<boolean> => {
    if (!clientDb) return false;

    try {
      const templateRef = doc(clientDb, TEMPLATES_COLLECTION, id);
      await deleteDoc(templateRef);

      // Update local state immediately
      setTemplates(prev => prev.filter(t => t.id !== id));

      return true;
    } catch (err) {
      console.error('Error deleting template:', err);
      return false;
    }
  }, []);

  /**
   * Get a template and increment its usage count
   * Returns the template for immediate use
   */
  const useTemplate = useCallback(
    (id: string): MessageTemplate | undefined => {
      const template = templates.find((t) => t.id === id);
      if (!template || !clientDb) return template;

      // Increment usage count in background (don't await)
      const templateRef = doc(clientDb, TEMPLATES_COLLECTION, id);
      updateDoc(templateRef, { usageCount: increment(1) }).catch((err) => {
        console.error('Error incrementing usage count:', err);
      });

      return template;
    },
    [templates]
  );

  /**
   * Get templates filtered by category
   */
  const getTemplatesByCategory = useCallback(
    (category: TemplateCategory | 'all'): MessageTemplate[] => {
      if (category === 'all') return templates;
      return templates.filter((t) => t.category === category);
    },
    [templates]
  );

  return {
    templates,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    useTemplate,
    getTemplatesByCategory,
  };
}
