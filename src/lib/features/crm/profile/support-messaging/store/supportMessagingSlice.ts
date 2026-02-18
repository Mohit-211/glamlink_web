import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ConversationStatus, ConversationPriority, ConversationTag } from '../types';

// Import serialization utilities from the new location
import {
  SerializableConversation,
  SerializableConversationWithMessages,
  SerializableMessage,
  SerializableMessageReaction,
  toSerializableConversation,
  fromSerializableConversation,
  toSerializableMessage,
  fromSerializableMessage,
  toSerializableReaction,
  fromSerializableReaction,
  toSerializableConversationWithMessages,
  fromSerializableConversationWithMessages,
} from '../utils/serialization';

// Re-export serialization utilities for backward compatibility
export type {
  SerializableConversation,
  SerializableConversationWithMessages,
  SerializableMessage,
  SerializableMessageReaction,
} from '../utils/serialization';

export {
  toSerializableConversation,
  fromSerializableConversation,
  toSerializableMessage,
  fromSerializableMessage,
  toSerializableReaction,
  fromSerializableReaction,
  toSerializableConversationWithMessages,
  fromSerializableConversationWithMessages,
} from '../utils/serialization';

interface SupportMessagingState {
  conversations: SerializableConversation[];
  currentConversation: SerializableConversationWithMessages | null;
  messages: SerializableMessage[];
  adminUnreadCount: number;
  isLoading: boolean;
  conversationsLoading: boolean;
  messagesLoading: boolean;
  error: string | null;
}

const initialState: SupportMessagingState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  adminUnreadCount: 0,
  isLoading: false,
  conversationsLoading: false,
  messagesLoading: false,
  error: null,
};

const supportMessagingSlice = createSlice({
  name: 'supportMessaging',
  initialState,
  reducers: {
    // Conversations
    setConversations: (state, action: PayloadAction<SerializableConversation[]>) => {
      state.conversations = action.payload;
      state.conversationsLoading = false;
    },
    setConversationsLoading: (state, action: PayloadAction<boolean>) => {
      state.conversationsLoading = action.payload;
    },

    // Current conversation
    setCurrentConversation: (state, action: PayloadAction<SerializableConversationWithMessages | null>) => {
      // Only set messages if they're provided and non-empty, otherwise keep existing
      // This prevents the conversation listener from clearing messages
      if (action.payload?.messages && action.payload.messages.length > 0) {
        state.messages = action.payload.messages;
      }
      // Set conversation but ensure messages array uses state.messages to stay in sync
      if (action.payload) {
        state.currentConversation = {
          ...action.payload,
          messages: state.messages,
        };
      } else {
        state.currentConversation = null;
      }
    },
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
      state.messages = [];
    },

    // Messages
    setMessages: (state, action: PayloadAction<SerializableMessage[]>) => {
      state.messages = action.payload;
      if (state.currentConversation) {
        state.currentConversation.messages = action.payload;
      }
      state.messagesLoading = false;
    },
    setMessagesLoading: (state, action: PayloadAction<boolean>) => {
      state.messagesLoading = action.payload;
    },
    addMessage: (state, action: PayloadAction<SerializableMessage>) => {
      state.messages.push(action.payload);
      if (state.currentConversation) {
        state.currentConversation.messages.push(action.payload);
      }
    },

    // Admin unread count
    setAdminUnreadCount: (state, action: PayloadAction<number>) => {
      state.adminUnreadCount = action.payload;
    },

    // Conversation status
    updateConversationStatus: (state, action: PayloadAction<{ id: string; status: ConversationStatus }>) => {
      const conv = state.conversations.find(c => c.id === action.payload.id);
      if (conv) {
        conv.status = action.payload.status;
        conv.updatedAt = new Date().toISOString();
      }
      if (state.currentConversation?.id === action.payload.id) {
        state.currentConversation.status = action.payload.status;
        state.currentConversation.updatedAt = new Date().toISOString();
      }
    },

    // Conversation priority
    updateConversationPriority: (state, action: PayloadAction<{ id: string; priority: ConversationPriority }>) => {
      const conv = state.conversations.find(c => c.id === action.payload.id);
      if (conv) {
        conv.priority = action.payload.priority;
        conv.updatedAt = new Date().toISOString();
      }
      if (state.currentConversation?.id === action.payload.id) {
        state.currentConversation.priority = action.payload.priority;
        state.currentConversation.updatedAt = new Date().toISOString();
      }
    },

    // Conversation tags
    updateConversationTags: (state, action: PayloadAction<{ id: string; tags: ConversationTag[] }>) => {
      const conv = state.conversations.find(c => c.id === action.payload.id);
      if (conv) {
        conv.tags = action.payload.tags;
        conv.updatedAt = new Date().toISOString();
      }
      if (state.currentConversation?.id === action.payload.id) {
        state.currentConversation.tags = action.payload.tags;
        state.currentConversation.updatedAt = new Date().toISOString();
      }
    },

    // Unread counts
    updateConversationUnread: (
      state,
      action: PayloadAction<{ id: string; unreadByUser?: number; unreadByAdmin?: number }>
    ) => {
      const conv = state.conversations.find(c => c.id === action.payload.id);
      if (conv) {
        if (action.payload.unreadByUser !== undefined) {
          conv.unreadByUser = action.payload.unreadByUser;
        }
        if (action.payload.unreadByAdmin !== undefined) {
          conv.unreadByAdmin = action.payload.unreadByAdmin;
        }
      }
      if (state.currentConversation?.id === action.payload.id) {
        if (action.payload.unreadByUser !== undefined) {
          state.currentConversation.unreadByUser = action.payload.unreadByUser;
        }
        if (action.payload.unreadByAdmin !== undefined) {
          state.currentConversation.unreadByAdmin = action.payload.unreadByAdmin;
        }
      }
    },

    // Loading and error states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Reset state
    resetSupportMessaging: () => initialState,
  },
});

export const {
  setConversations,
  setConversationsLoading,
  setCurrentConversation,
  clearCurrentConversation,
  setMessages,
  setMessagesLoading,
  addMessage,
  setAdminUnreadCount,
  updateConversationStatus,
  updateConversationPriority,
  updateConversationTags,
  updateConversationUnread,
  setLoading,
  setError,
  resetSupportMessaging,
} = supportMessagingSlice.actions;

export default supportMessagingSlice.reducer;
