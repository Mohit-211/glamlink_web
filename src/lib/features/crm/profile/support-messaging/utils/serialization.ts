import type {
  Conversation,
  ConversationWithMessages,
  Message,
  MessageReaction,
  ConversationStatus,
  ConversationPriority,
  ConversationTag,
  ConversationMetrics,
} from '../types';
import { toSerializableAttachment, fromSerializableAttachment, SerializableAttachment } from '../types/attachment';

// Serializable versions for Redux (timestamps as strings)
export interface SerializableMessageReaction {
  emoji: string;
  userId: string;
  userName: string;
  createdAt: string; // ISO string
}

export interface SerializableMessage {
  id: string;
  senderId: string;
  senderEmail: string;
  senderName: string;
  content: string;
  timestamp: string; // ISO string
  readAt?: string; // ISO string
  readBy?: string[]; // Array of user IDs who have read this message
  reactions?: SerializableMessageReaction[];
  attachments?: SerializableAttachment[];
}

export interface SerializableConversation {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  adminId: string;
  status: ConversationStatus;
  priority: ConversationPriority;
  subject: string;
  unreadByUser: number;
  unreadByAdmin: number;
  lastMessage: {
    content: string;
    senderId: string;
    timestamp: string; // ISO string
  } | null;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  lastReadAt?: string; // ISO string
  tags?: ConversationTag[];
  metrics?: ConversationMetrics;
}

export interface SerializableConversationWithMessages extends SerializableConversation {
  messages: SerializableMessage[];
}

// Helper to convert Conversation to serializable format
export const toSerializableConversation = (conv: Conversation): SerializableConversation => ({
  id: conv.id,
  userId: conv.userId,
  userEmail: conv.userEmail,
  userName: conv.userName,
  adminId: conv.adminId,
  status: conv.status,
  priority: conv.priority || 'normal',
  subject: conv.subject,
  unreadByUser: conv.unreadByUser,
  unreadByAdmin: conv.unreadByAdmin,
  lastMessage: conv.lastMessage
    ? {
        content: conv.lastMessage.content,
        senderId: conv.lastMessage.senderId,
        timestamp: conv.lastMessage.timestamp instanceof Date
          ? conv.lastMessage.timestamp.toISOString()
          : conv.lastMessage.timestamp,
      }
    : null,
  createdAt: conv.createdAt instanceof Date ? conv.createdAt.toISOString() : conv.createdAt,
  updatedAt: conv.updatedAt instanceof Date ? conv.updatedAt.toISOString() : conv.updatedAt,
  lastReadAt: conv.lastReadAt
    ? (conv.lastReadAt instanceof Date ? conv.lastReadAt.toISOString() : conv.lastReadAt)
    : undefined,
  tags: conv.tags,
  metrics: conv.metrics,
});

// Helper to convert back to Conversation with Date objects
export const fromSerializableConversation = (conv: SerializableConversation): Conversation => ({
  id: conv.id,
  userId: conv.userId,
  userEmail: conv.userEmail,
  userName: conv.userName,
  adminId: conv.adminId,
  status: conv.status,
  priority: conv.priority || 'normal',
  subject: conv.subject,
  unreadByUser: conv.unreadByUser,
  unreadByAdmin: conv.unreadByAdmin,
  lastMessage: conv.lastMessage
    ? {
        content: conv.lastMessage.content,
        senderId: conv.lastMessage.senderId,
        timestamp: new Date(conv.lastMessage.timestamp),
      }
    : null,
  createdAt: new Date(conv.createdAt),
  updatedAt: new Date(conv.updatedAt),
  lastReadAt: conv.lastReadAt ? new Date(conv.lastReadAt) : undefined,
  tags: conv.tags,
  metrics: conv.metrics,
});

// Helper to convert MessageReaction to serializable format
export const toSerializableReaction = (reaction: MessageReaction): SerializableMessageReaction => ({
  emoji: reaction.emoji,
  userId: reaction.userId,
  userName: reaction.userName,
  createdAt: reaction.createdAt instanceof Date ? reaction.createdAt.toISOString() : reaction.createdAt,
});

// Helper to convert back to MessageReaction with Date objects
export const fromSerializableReaction = (reaction: SerializableMessageReaction): MessageReaction => ({
  emoji: reaction.emoji,
  userId: reaction.userId,
  userName: reaction.userName,
  createdAt: new Date(reaction.createdAt),
});

// Helper to convert Message to serializable format
export const toSerializableMessage = (msg: Message): SerializableMessage => ({
  id: msg.id,
  senderId: msg.senderId,
  senderEmail: msg.senderEmail,
  senderName: msg.senderName,
  content: msg.content,
  timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp,
  readAt: msg.readAt
    ? (msg.readAt instanceof Date ? msg.readAt.toISOString() : msg.readAt)
    : undefined,
  readBy: msg.readBy,
  reactions: msg.reactions?.map(toSerializableReaction),
  attachments: msg.attachments?.map(toSerializableAttachment),
});

// Helper to convert back to Message with Date objects
export const fromSerializableMessage = (msg: SerializableMessage): Message => ({
  id: msg.id,
  senderId: msg.senderId,
  senderEmail: msg.senderEmail,
  senderName: msg.senderName,
  content: msg.content,
  timestamp: new Date(msg.timestamp),
  readAt: msg.readAt ? new Date(msg.readAt) : undefined,
  readBy: msg.readBy,
  reactions: msg.reactions?.map(fromSerializableReaction),
  attachments: msg.attachments?.map(fromSerializableAttachment),
});

// Helper for ConversationWithMessages
export const toSerializableConversationWithMessages = (
  conv: ConversationWithMessages
): SerializableConversationWithMessages => ({
  ...toSerializableConversation(conv),
  messages: conv.messages.map(toSerializableMessage),
});

export const fromSerializableConversationWithMessages = (
  conv: SerializableConversationWithMessages
): ConversationWithMessages => ({
  ...fromSerializableConversation(conv),
  messages: conv.messages.map(fromSerializableMessage),
});
