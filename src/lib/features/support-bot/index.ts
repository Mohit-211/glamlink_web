// Support Bot Feature - Public Exports

// Types
export type {
  ChatMessage,
  FAQ,
  FAQCategory,
  ChatSession,
  SendMessageRequest,
  SendMessageResponse,
  ChatSessionResponse,
  FAQsResponse,
  UseSupportChatReturn,
  UseChatSessionReturn,
} from './types';

// Config
export {
  MEMORY_LIMIT,
  FAQ_CATEGORIES,
  DEFAULT_FAQS,
  SYSTEM_PROMPT,
  STORAGE_KEYS,
  FALLBACK_RESPONSES,
} from './config';

// Hooks
export { useSupportChat } from './hooks/useSupportChat';
export { useChatSession } from './hooks/useChatSession';

// Components
export { SupportChatPage } from './components/SupportChatPage';
export { ChatMessage as ChatMessageComponent } from './components/ChatMessage';
export { FAQQuickActions } from './components/FAQQuickActions';
export { ChatInput } from './components/ChatInput';

// Store
export {
  supportBotReducer,
  setSession,
  setMessages,
  addMessage,
  clearChat,
  setLoading,
  setError,
  initializeSession,
  toSerializableMessage,
  fromSerializableMessage,
} from './store';
export type { SerializableChatMessage } from './store';
