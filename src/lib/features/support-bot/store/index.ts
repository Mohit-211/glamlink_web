// Support Bot store exports
export {
  default as supportBotReducer,
  setSession,
  setMessages,
  addMessage,
  clearChat,
  setLoading,
  setError,
  initializeSession,
  toSerializableMessage,
  fromSerializableMessage,
} from './supportBotSlice';

export type { SerializableChatMessage } from './supportBotSlice';
