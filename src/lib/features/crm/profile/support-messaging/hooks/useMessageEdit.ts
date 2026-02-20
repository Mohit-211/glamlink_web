'use client';

import { useState, useCallback } from 'react';
import { EDIT_CONFIG } from '../config';
import { getCsrfToken } from '@/lib/shared/utils/security/csrf';
import type { Message } from '../types';

interface UseMessageEditReturn {
  /** Whether edit mode is active */
  isEditing: boolean;
  /** Current edit content */
  editContent: string;
  /** Start editing a message */
  startEdit: (content: string) => void;
  /** Cancel editing */
  cancelEdit: () => void;
  /** Save the edited message */
  saveEdit: () => Promise<boolean>;
  /** Update edit content */
  setEditContent: (content: string) => void;
  /** Check if a message can be edited */
  canEdit: (message: Message, currentUserId?: string) => boolean;
  /** Whether save is in progress */
  isSaving: boolean;
  /** Error message if save failed */
  error: string | null;
}

/**
 * Hook for editing messages with time window and edit limit enforcement.
 *
 * @param messageId - ID of the message to edit
 * @param conversationId - ID of the conversation containing the message
 * @param onEditComplete - Callback when edit is saved successfully
 *
 * @example
 * ```tsx
 * const {
 *   isEditing,
 *   editContent,
 *   startEdit,
 *   cancelEdit,
 *   saveEdit,
 *   setEditContent,
 *   canEdit,
 * } = useMessageEdit(message.id, conversationId, () => refetch());
 *
 * if (canEdit(message, currentUserId) && !isEditing) {
 *   return <button onClick={() => startEdit(message.content)}>Edit</button>;
 * }
 * ```
 */
export function useMessageEdit(
  messageId: string,
  conversationId: string,
  onEditComplete?: () => void
): UseMessageEditReturn {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check if a message can be edited
   */
  const canEdit = useCallback((message: Message, currentUserId?: string): boolean => {
    // Can't edit if not the sender
    if (!currentUserId || message.senderId !== currentUserId) {
      return false;
    }

    // Can't edit messages that are still sending or failed
    if (message.status === 'sending' || message.status === 'failed') {
      return false;
    }

    // Check time window
    const timeSinceSent = Date.now() - message.timestamp.getTime();
    if (timeSinceSent >= EDIT_CONFIG.allowedWindowMs) {
      return false;
    }

    // Check edit limit
    const editCount = message.editHistory?.length || 0;
    if (editCount >= EDIT_CONFIG.maxEdits) {
      return false;
    }

    return true;
  }, []);

  /**
   * Start editing a message
   */
  const startEdit = useCallback((content: string) => {
    setEditContent(content);
    setIsEditing(true);
    setError(null);
  }, []);

  /**
   * Cancel editing
   */
  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditContent('');
    setError(null);
  }, []);

  /**
   * Save the edited message
   */
  const saveEdit = useCallback(async (): Promise<boolean> => {
    if (!editContent.trim()) {
      setError('Message cannot be empty');
      return false;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/support/conversations/${conversationId}/messages/${messageId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': getCsrfToken(),
          },
          credentials: 'include',
          body: JSON.stringify({ content: editContent.trim() }),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update message');
      }

      setIsEditing(false);
      setEditContent('');
      onEditComplete?.();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save edit';
      setError(errorMessage);
      console.error('Edit failed:', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [editContent, conversationId, messageId, onEditComplete]);

  return {
    isEditing,
    editContent,
    startEdit,
    cancelEdit,
    saveEdit,
    setEditContent,
    canEdit,
    isSaving,
    error,
  };
}

/**
 * Calculate remaining time to edit a message
 */
export function getEditTimeRemaining(message: Message): number {
  const timeSinceSent = Date.now() - message.timestamp.getTime();
  const remaining = EDIT_CONFIG.allowedWindowMs - timeSinceSent;
  return Math.max(0, remaining);
}

/**
 * Format remaining edit time for display
 */
export function formatEditTimeRemaining(message: Message): string {
  const remaining = getEditTimeRemaining(message);
  if (remaining <= 0) return 'expired';

  const minutes = Math.ceil(remaining / 60000);
  if (minutes > 1) return `${minutes} min left to edit`;
  return 'Less than a minute to edit';
}
