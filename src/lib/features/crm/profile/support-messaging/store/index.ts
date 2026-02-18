// Support Messaging store exports
export {
  default as supportMessagingReducer,
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
  toSerializableConversation,
  fromSerializableConversation,
  toSerializableMessage,
  fromSerializableMessage,
  toSerializableConversationWithMessages,
  fromSerializableConversationWithMessages,
} from './supportMessagingSlice';

export type {
  SerializableMessage,
  SerializableConversation,
  SerializableConversationWithMessages,
} from './supportMessagingSlice';
