'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useConversation } from '../../hooks/useConversation';
import { useTypingIndicator } from '../../hooks/useTypingIndicator';
import { useAriaAnnouncer, useKeyboardNavigation, useRateLimit, useNotificationSound } from '@/lib/shared/hooks';
import { useConnectionState } from '../../hooks/useConnectionState';
import { useFileUpload } from '../../hooks/useFileUpload';
import { useAuth } from '@/lib/features/auth/useAuth';
import { isAdminEmail, MESSAGE_CONFIG, NOTIFICATION_CONFIG, RATE_LIMITS } from '../../config';
import { useDraftPersistence } from './useDraftPersistence';
import { useMessageInput } from './useMessageInput';
import type { ConversationStatus, ConversationPriority, ConversationTag, PendingMessage, Attachment } from '../../types';

interface UseConversationViewOptions {
  conversationId: string;
  isAdmin?: boolean;
}

export function useConversationView({ conversationId, isAdmin = false }: UseConversationViewOptions) {
  const { user } = useAuth();
  const {
    conversation,
    isLoading,
    error,
    sendMessage,
    retryMessage,
    markAsRead,
    updateStatus,
    updatePriority,
    updateTags,
    addReaction,
    removeReaction,
    pinMessage,
    unpinMessage,
    editMessage,
    hasMoreMessages,
    loadMoreMessages,
    isLoadingMore: isLoadingMoreMessages,
  } = useConversation(conversationId);
  const { typingUsers, setTyping } = useTypingIndicator(conversationId);
  const { play: playSound } = useNotificationSound({
    src: NOTIFICATION_CONFIG.sound.path,
    volume: NOTIFICATION_CONFIG.sound.volume,
    enabled: NOTIFICATION_CONFIG.sound.enabled,
  });
  const { announcement, priority: announcePriority, announce } = useAriaAnnouncer();

  // Connection state for offline support
  const handleFlushPendingMessages = useCallback(async (messages: PendingMessage[]) => {
    for (const msg of messages) {
      try {
        await sendMessage(msg.content);
      } catch (err) {
        console.error('Failed to send queued message:', err);
        throw err;
      }
    }
  }, [sendMessage]);

  const { isOnline, pendingMessages, queueMessage, removePendingMessage } = useConnectionState(handleFlushPendingMessages);

  // File upload state
  const { uploadFile, cancelUpload, uploads, isUploading, clearCompletedUploads } = useFileUpload();
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);

  // Rate limiting
  const { isLimited, remainingActions, recordAction } = useRateLimit({
    limit: RATE_LIMITS.messagesPerMinute,
    windowMs: RATE_LIMITS.windowMs,
  });

  const [isSending, setIsSending] = useState(false);
  const isSendingRef = useRef(false); // Ref to prevent double-sends from rapid Enter presses
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef<number>(0);
  const lastMessageIdRef = useRef<string | null>(null);
  const typingDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialScrolledRef = useRef<string | null>(null); // Track which conversation we've scrolled for

  const backPath = isAdmin ? '/admin/messages' : '/profile/support';
  const currentUserId = user?.uid;
  const userIsAdmin = isAdminEmail(user?.email || '');

  // Draft persistence hook
  const { message: newMessage, setMessage: setNewMessage, clearDraft } = useDraftPersistence({ conversationId });

  // Handle typing indicator with debounce
  const handleTypingChange = useCallback((text: string) => {
    if (typingDebounceRef.current) {
      clearTimeout(typingDebounceRef.current);
    }

    if (text.trim()) {
      setTyping(true);
      typingDebounceRef.current = setTimeout(() => {
        setTyping(false);
      }, 2000);
    } else {
      setTyping(false);
    }
  }, [setTyping]);

  // Message input hook
  const {
    inputRef,
    handleInputChange,
    charCount,
    isNearLimit,
    isOverLimit,
    charsRemaining,
  } = useMessageInput({
    message: newMessage,
    setMessage: setNewMessage,
    onTypingChange: handleTypingChange,
    messagesContainerRef,
  });

  // Keyboard navigation
  const messageCount = conversation?.messages?.length || 0;
  const handleNavigateEscape = useCallback(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown: handleKeyboardNav,
    itemRefs: messageRefs,
    isNavigating,
  } = useKeyboardNavigation({
    itemCount: messageCount,
    onEscape: handleNavigateEscape,
    enabled: true,
  });

  // Get typing indicator text
  const typingIndicatorText = typingUsers.length > 0
    ? `${typingUsers[0].userName} is typing...`
    : null;

  // Auto-scroll chat container to bottom ONLY when NEW messages arrive (not when loading older messages)
  useEffect(() => {
    const currentMessageCount = conversation?.messages?.length || 0;
    const container = messagesContainerRef.current;
    const messages = conversation?.messages || [];
    const latestMessage = messages[messages.length - 1];

    // Only scroll if message count increased AND the latest message changed
    // This prevents scrolling when loading older messages (which adds to the beginning)
    const isNewMessageAtBottom =
      currentMessageCount > prevMessageCountRef.current &&
      latestMessage &&
      latestMessage.id !== lastMessageIdRef.current;

    if (isNewMessageAtBottom && container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });

      if (
        latestMessage.senderId !== currentUserId &&
        !latestMessage.id.startsWith('temp_')
      ) {
        playSound();
        const senderName = latestMessage.senderName || 'Support';
        const preview = latestMessage.content.slice(0, 50);
        announce(`New message from ${senderName}: ${preview}${latestMessage.content.length > 50 ? '...' : ''}`, 'assertive');
      }
    }

    if (latestMessage) {
      lastMessageIdRef.current = latestMessage.id;
    }
    prevMessageCountRef.current = currentMessageCount;
  }, [conversation?.messages?.length, conversation?.messages, currentUserId, playSound, announce]);

  // Scroll chat container to bottom on initial load
  useEffect(() => {
    const container = messagesContainerRef.current;
    const convId = conversation?.id;
    const hasMessages = conversation?.messages?.length && conversation.messages.length > 0;

    // Only scroll if: we have a container, messages exist, and we haven't scrolled for this conversation yet
    if (container && convId && hasMessages && hasInitialScrolledRef.current !== convId) {
      hasInitialScrolledRef.current = convId;
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  }, [conversation?.id, conversation?.messages?.length]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  // Mark as read when viewing
  useEffect(() => {
    if (conversation) {
      markAsRead();
    }
  }, [conversation, markAsRead]);

  // Clean up typing debounce on unmount
  useEffect(() => {
    return () => {
      if (typingDebounceRef.current) {
        clearTimeout(typingDebounceRef.current);
      }
    };
  }, []);

  const handleSend = useCallback(async () => {
    // Use ref to prevent race conditions from rapid Enter presses
    // (state check can have stale closure values)
    if (!newMessage.trim() || isSendingRef.current || isLimited) return;
    if (newMessage.length > MESSAGE_CONFIG.maxLength) return;

    // Set ref immediately to block subsequent calls
    isSendingRef.current = true;
    setIsSending(true);

    setTyping(false);
    if (typingDebounceRef.current) {
      clearTimeout(typingDebounceRef.current);
      typingDebounceRef.current = null;
    }

    const messageContent = newMessage.trim();
    const attachmentsToSend = pendingAttachments.length > 0 ? [...pendingAttachments] : undefined;

    if (!isOnline) {
      queueMessage(messageContent);
      setNewMessage('');
      clearDraft();
      setPendingAttachments([]);
      announce('Message queued. Will be sent when you reconnect.', 'polite');
      isSendingRef.current = false;
      setIsSending(false);
      return;
    }

    // Record the action for rate limiting
    recordAction();

    try {
      await sendMessage(messageContent, attachmentsToSend);
      setNewMessage('');
      clearDraft();
      setPendingAttachments([]);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } catch (err) {
      console.error('Error sending message:', err);
      announce('Failed to send message. Please try again.', 'assertive');
    } finally {
      isSendingRef.current = false;
      setIsSending(false);
    }
  }, [newMessage, isLimited, setTyping, sendMessage, isOnline, queueMessage, announce, setNewMessage, clearDraft, inputRef, recordAction, pendingAttachments]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleStatusChange = useCallback(async (status: ConversationStatus) => {
    try {
      await updateStatus(status);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  }, [updateStatus]);

  const handlePriorityChange = useCallback(async (priority: ConversationPriority) => {
    try {
      await updatePriority(priority);
    } catch (err) {
      console.error('Error updating priority:', err);
    }
  }, [updatePriority]);

  const handleTagsChange = useCallback(async (tags: ConversationTag[]) => {
    try {
      await updateTags(tags);
    } catch (err) {
      console.error('Error updating tags:', err);
    }
  }, [updateTags]);

  const handleAddReaction = useCallback(async (messageId: string, emoji: string) => {
    try {
      await addReaction(messageId, emoji);
    } catch (err) {
      console.error('Error adding reaction:', err);
    }
  }, [addReaction]);

  const handleRemoveReaction = useCallback(async (messageId: string, emoji: string) => {
    try {
      await removeReaction(messageId, emoji);
    } catch (err) {
      console.error('Error removing reaction:', err);
    }
  }, [removeReaction]);

  // Pin/unpin handlers
  const handlePinMessage = useCallback(async (messageId: string) => {
    try {
      await pinMessage(messageId);
      announce('Message pinned', 'polite');
    } catch (err) {
      console.error('Error pinning message:', err);
      announce('Failed to pin message', 'assertive');
    }
  }, [pinMessage, announce]);

  const handleUnpinMessage = useCallback(async (messageId: string) => {
    try {
      await unpinMessage(messageId);
      announce('Message unpinned', 'polite');
    } catch (err) {
      console.error('Error unpinning message:', err);
      announce('Failed to unpin message', 'assertive');
    }
  }, [unpinMessage, announce]);

  // Edit message handler
  const handleEditMessage = useCallback(async (messageId: string, newContent: string) => {
    try {
      await editMessage(messageId, newContent);
      announce('Message edited', 'polite');
    } catch (err) {
      console.error('Error editing message:', err);
      announce('Failed to edit message', 'assertive');
      throw err;
    }
  }, [editMessage, announce]);

  // Scroll to a specific message
  const scrollToMessage = useCallback((messageId: string) => {
    const messages = conversation?.messages || [];
    const index = messages.findIndex((m) => m.id === messageId);
    if (index !== -1 && messageRefs.current[index]) {
      messageRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setFocusedIndex(index);
    }
  }, [conversation?.messages, setFocusedIndex]);

  // File upload handlers
  const handleFilesSelected = useCallback(async (files: File[]) => {
    for (const file of files) {
      const attachment = await uploadFile(file, conversationId);
      if (attachment) {
        setPendingAttachments((prev) => [...prev, attachment]);
      }
    }
    clearCompletedUploads();
  }, [conversationId, uploadFile, clearCompletedUploads]);

  const handleCancelUpload = useCallback((uploadId: string) => {
    cancelUpload(uploadId);
  }, [cancelUpload]);

  const handleRemoveAttachment = useCallback((attachmentId: string) => {
    setPendingAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  }, []);

  return {
    // State
    conversation,
    isLoading,
    error,
    newMessage,
    isSending,

    // Refs
    messagesContainerRef,
    inputRef,
    messageRefs,

    // Derived values
    backPath,
    currentUserId,
    userIsAdmin,
    typingIndicatorText,
    charCount,
    isNearLimit,
    isOverLimit,
    charsRemaining,

    // Connection state
    isOnline,
    pendingMessages,

    // Rate limiting
    isLimited,
    remainingActions,

    // Pinned messages
    pinnedMessages: (conversation?.messages || []).filter((m) => m.isPinned),

    // Accessibility
    announcement,
    announcePriority,
    focusedIndex,
    isNavigating,

    // Handlers
    handleInputChange,
    handleSend,
    handleKeyDown,
    handleKeyboardNav,
    handleStatusChange,
    handlePriorityChange,
    handleTagsChange,
    handleAddReaction,
    handleRemoveReaction,
    handlePinMessage,
    handleUnpinMessage,
    handleEditMessage,
    scrollToMessage,
    retryMessage,
    setFocusedIndex,

    // Lazy loading
    hasMoreMessages,
    loadMoreMessages,
    isLoadingMoreMessages,

    // File uploads
    pendingAttachments,
    uploads,
    isUploading,
    handleFilesSelected,
    handleCancelUpload,
    handleRemoveAttachment,
  };
}
