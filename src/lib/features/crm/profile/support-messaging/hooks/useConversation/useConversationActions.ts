'use client';

import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db as clientDb } from '@/lib/config/firebase';
import { useAuth } from '@/lib/features/auth/useAuth';
import type { ConversationStatus, ConversationPriority, ConversationTag, ConversationWithMessages } from '../../types';
import { createAuditLog } from '../../utils/auditLog';
import { COLLECTION_PATHS } from '../../config';
import {
  updateConversationStatus,
  updateConversationPriority,
  updateConversationTags,
} from '../../store/supportMessagingSlice';
import type { AppDispatch } from 'store/store';

interface UseConversationActionsProps {
  conversationId: string;
  conversation: ConversationWithMessages | null;
}

export function useConversationActions({
  conversationId,
  conversation,
}: UseConversationActionsProps) {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [localError, setLocalError] = useState<string | null>(null);

  // Extract stable user values to avoid callback recreation on user object changes
  const userId = user?.uid;
  const userEmail = user?.email;
  const userDisplayName = user?.displayName;

  const updateStatus = useCallback(async (status: ConversationStatus): Promise<void> => {
    if (!conversationId || !userId || !clientDb) return;

    const oldStatus = conversation?.status;

    try {
      const conversationRef = doc(clientDb, COLLECTION_PATHS.conversations, conversationId);
      await updateDoc(conversationRef, {
        status,
        updatedAt: new Date(),
      });

      dispatch(updateConversationStatus({ id: conversationId, status }));

      await createAuditLog({
        conversationId,
        action: 'status_changed',
        oldValue: oldStatus,
        newValue: status,
        userId: userId,
        userName: userDisplayName || userEmail?.split('@')[0] || 'User',
        userEmail: userEmail || '',
      });
    } catch (err) {
      console.error('Error updating status:', err);
      setLocalError('Failed to update status');
      throw err;
    }
  }, [conversationId, userId, userEmail, userDisplayName, dispatch, conversation?.status]);

  const updatePriority = useCallback(async (priority: ConversationPriority): Promise<void> => {
    if (!conversationId || !userId || !clientDb) return;

    const oldPriority = conversation?.priority;

    try {
      const conversationRef = doc(clientDb, COLLECTION_PATHS.conversations, conversationId);
      await updateDoc(conversationRef, {
        priority,
        updatedAt: new Date(),
      });

      dispatch(updateConversationPriority({ id: conversationId, priority }));

      await createAuditLog({
        conversationId,
        action: 'priority_changed',
        oldValue: oldPriority,
        newValue: priority,
        userId: userId,
        userName: userDisplayName || userEmail?.split('@')[0] || 'User',
        userEmail: userEmail || '',
      });
    } catch (err) {
      console.error('Error updating priority:', err);
      setLocalError('Failed to update priority');
      throw err;
    }
  }, [conversationId, userId, userEmail, userDisplayName, dispatch, conversation?.priority]);

  const updateTagsHandler = useCallback(async (tags: ConversationTag[]): Promise<void> => {
    if (!conversationId || !userId || !clientDb) return;

    const oldTags = conversation?.tags || [];

    try {
      const conversationRef = doc(clientDb, COLLECTION_PATHS.conversations, conversationId);
      await updateDoc(conversationRef, {
        tags,
        updatedAt: new Date(),
      });

      dispatch(updateConversationTags({ id: conversationId, tags }));

      await createAuditLog({
        conversationId,
        action: 'tags_updated',
        oldValue: oldTags,
        newValue: tags,
        userId: userId,
        userName: userDisplayName || userEmail?.split('@')[0] || 'User',
        userEmail: userEmail || '',
      });
    } catch (err) {
      console.error('Error updating tags:', err);
      setLocalError('Failed to update tags');
      throw err;
    }
  }, [conversationId, userId, userEmail, userDisplayName, dispatch, conversation?.tags]);

  const addReaction = useCallback(async (messageId: string, emoji: string): Promise<void> => {
    if (!conversationId || !userId || !clientDb) return;

    try {
      const msgRef = doc(clientDb, COLLECTION_PATHS.messages(conversationId), messageId);
      await updateDoc(msgRef, {
        reactions: arrayUnion({
          emoji,
          userId: userId,
          userName: userDisplayName || userEmail?.split('@')[0] || 'User',
          createdAt: new Date(),
        }),
      });
    } catch (err) {
      console.error('Error adding reaction:', err);
      setLocalError('Failed to add reaction');
      throw err;
    }
  }, [conversationId, userId, userEmail, userDisplayName]);

  const removeReaction = useCallback(async (messageId: string, emoji: string): Promise<void> => {
    if (!conversationId || !userId || !clientDb) return;

    try {
      const messages = conversation?.messages || [];
      const message = messages.find(m => m.id === messageId);
      if (!message?.reactions) return;

      const reactionToRemove = message.reactions.find(
        r => r.emoji === emoji && r.userId === userId
      );
      if (!reactionToRemove) return;

      const msgRef = doc(clientDb, COLLECTION_PATHS.messages(conversationId), messageId);
      const updatedReactions = message.reactions.filter(
        r => !(r.emoji === emoji && r.userId === userId)
      );

      await updateDoc(msgRef, {
        reactions: updatedReactions.map(r => ({
          emoji: r.emoji,
          userId: r.userId,
          userName: r.userName,
          createdAt: r.createdAt,
        })),
      });
    } catch (err) {
      console.error('Error removing reaction:', err);
      setLocalError('Failed to remove reaction');
      throw err;
    }
  }, [conversationId, userId, conversation?.messages]);

  /**
   * Pin a message in the conversation
   */
  const pinMessage = useCallback(async (messageId: string): Promise<void> => {
    if (!conversationId || !userId || !clientDb) return;

    try {
      const msgRef = doc(clientDb, COLLECTION_PATHS.messages(conversationId), messageId);
      await updateDoc(msgRef, {
        isPinned: true,
        pinnedBy: userId,
        pinnedAt: new Date(),
      });

      await createAuditLog({
        conversationId,
        action: 'message_pinned',
        oldValue: undefined,
        newValue: messageId,
        userId: userId,
        userName: userDisplayName || userEmail?.split('@')[0] || 'User',
        userEmail: userEmail || '',
      });
    } catch (err) {
      console.error('Error pinning message:', err);
      setLocalError('Failed to pin message');
      throw err;
    }
  }, [conversationId, userId, userEmail, userDisplayName]);

  /**
   * Unpin a message from the conversation
   */
  const unpinMessage = useCallback(async (messageId: string): Promise<void> => {
    if (!conversationId || !userId || !clientDb) return;

    try {
      const msgRef = doc(clientDb, COLLECTION_PATHS.messages(conversationId), messageId);
      await updateDoc(msgRef, {
        isPinned: false,
        pinnedBy: null,
        pinnedAt: null,
      });

      await createAuditLog({
        conversationId,
        action: 'message_unpinned',
        oldValue: messageId,
        newValue: undefined,
        userId: userId,
        userName: userDisplayName || userEmail?.split('@')[0] || 'User',
        userEmail: userEmail || '',
      });
    } catch (err) {
      console.error('Error unpinning message:', err);
      setLocalError('Failed to unpin message');
      throw err;
    }
  }, [conversationId, userId, userEmail, userDisplayName]);

  /**
   * Edit a message content
   */
  const editMessage = useCallback(async (messageId: string, newContent: string): Promise<void> => {
    if (!conversationId || !userId || !clientDb) return;

    const messages = conversation?.messages || [];
    const message = messages.find(m => m.id === messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    // Only the sender can edit their own message
    if (message.senderId !== userId) {
      throw new Error('You can only edit your own messages');
    }

    try {
      const msgRef = doc(clientDb, COLLECTION_PATHS.messages(conversationId), messageId);

      // Build edit history
      const editHistory = message.editHistory || [];
      const newEditHistory = [
        ...editHistory,
        { content: message.content, editedAt: new Date() },
      ];

      await updateDoc(msgRef, {
        content: newContent.trim(),
        editedAt: new Date(),
        editHistory: newEditHistory.map(e => ({
          content: e.content,
          editedAt: e.editedAt,
        })),
      });

      await createAuditLog({
        conversationId,
        action: 'message_edited',
        oldValue: message.content.slice(0, 50),
        newValue: newContent.slice(0, 50),
        userId: userId,
        userName: userDisplayName || userEmail?.split('@')[0] || 'User',
        userEmail: userEmail || '',
      });
    } catch (err) {
      console.error('Error editing message:', err);
      setLocalError('Failed to edit message');
      throw err;
    }
  }, [conversationId, userId, userEmail, userDisplayName, conversation?.messages]);

  return {
    updateStatus,
    updatePriority,
    updateTags: updateTagsHandler,
    addReaction,
    removeReaction,
    pinMessage,
    unpinMessage,
    editMessage,
    actionsError: localError,
  };
}
