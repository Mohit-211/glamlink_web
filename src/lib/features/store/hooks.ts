// Typed hooks for features Redux state
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from 'store/store';

// Typed hooks for the features slice
export const useFeaturesDispatch = () => useDispatch<AppDispatch>();
export const useFeaturesSelector: TypedUseSelectorHook<RootState> = useSelector;

// Selector helpers for support bot state
export const selectSupportBot = (state: RootState) => state.features.supportBot;
export const selectSupportBotMessages = (state: RootState) => state.features.supportBot.messages;
export const selectSupportBotSessionId = (state: RootState) => state.features.supportBot.sessionId;
export const selectSupportBotIsLoading = (state: RootState) => state.features.supportBot.isLoading;
export const selectSupportBotError = (state: RootState) => state.features.supportBot.error;

// Selector helpers for support messaging state
export const selectSupportMessaging = (state: RootState) => state.features.supportMessaging;
export const selectConversations = (state: RootState) => state.features.supportMessaging.conversations;
export const selectCurrentConversation = (state: RootState) => state.features.supportMessaging.currentConversation;
export const selectMessages = (state: RootState) => state.features.supportMessaging.messages;
export const selectAdminUnreadCount = (state: RootState) => state.features.supportMessaging.adminUnreadCount;
export const selectMessagingIsLoading = (state: RootState) => state.features.supportMessaging.isLoading;
export const selectMessagingError = (state: RootState) => state.features.supportMessaging.error;
