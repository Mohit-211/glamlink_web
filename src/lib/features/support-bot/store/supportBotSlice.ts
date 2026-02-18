import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ChatMessage } from '../types';

// Serializable version of ChatMessage for Redux (timestamp as string)
export interface SerializableChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO string for Redux compatibility
}

interface SupportBotState {
  messages: SerializableChatMessage[];
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SupportBotState = {
  messages: [],
  sessionId: null,
  isLoading: false,
  error: null,
};

// Helper to convert ChatMessage to serializable format
export const toSerializableMessage = (msg: ChatMessage): SerializableChatMessage => ({
  id: msg.id,
  role: msg.role,
  content: msg.content,
  timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp,
});

// Helper to convert back to ChatMessage with Date object
export const fromSerializableMessage = (msg: SerializableChatMessage): ChatMessage => ({
  id: msg.id,
  role: msg.role,
  content: msg.content,
  timestamp: new Date(msg.timestamp),
});

const supportBotSlice = createSlice({
  name: 'supportBot',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<string | null>) => {
      state.sessionId = action.payload;
    },
    setMessages: (state, action: PayloadAction<SerializableChatMessage[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<SerializableChatMessage>) => {
      state.messages.push(action.payload);
    },
    clearChat: (state) => {
      state.messages = [];
      state.sessionId = null;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // Combined action for initializing session with messages
    initializeSession: (state, action: PayloadAction<{ sessionId: string; messages: SerializableChatMessage[] }>) => {
      state.sessionId = action.payload.sessionId;
      state.messages = action.payload.messages;
      state.error = null;
    },
  },
});

export const {
  setSession,
  setMessages,
  addMessage,
  clearChat,
  setLoading,
  setError,
  initializeSession,
} = supportBotSlice.actions;

export default supportBotSlice.reducer;
