// Types for Support Bot Feature

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface FAQ {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
  keywords: string[];
  order: number;
  isActive: boolean;
}

export type FAQCategory = 'booking' | 'magazine' | 'digital-card' | 'account' | 'general';

export interface ChatSession {
  sessionId: string;
  userId?: string;
  startedAt: Date;
  messages: ChatMessage[];
  updatedAt: Date;
}

// API Request/Response types
export interface SendMessageRequest {
  sessionId: string;
  message: string;
}

export interface SendMessageResponse {
  success: boolean;
  message?: ChatMessage;
  error?: string;
}

export interface ChatSessionResponse {
  success: boolean;
  session?: ChatSession;
  error?: string;
}

export interface FAQsResponse {
  success: boolean;
  faqs?: FAQ[];
  error?: string;
}

// Hook return types
export interface UseSupportChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  sessionId: string | null;
}

export interface UseChatSessionReturn {
  session: ChatSession | null;
  isLoading: boolean;
  error: string | null;
  createSession: () => Promise<string | null>;
  loadSession: (sessionId: string) => Promise<void>;
  clearSession: () => Promise<void>;
}
