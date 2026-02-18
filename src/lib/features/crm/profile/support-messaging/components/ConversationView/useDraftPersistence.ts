'use client';

import { useState, useEffect, useRef } from 'react';

const getDraftKey = (conversationId: string) => `messaging_draft_${conversationId}`;

interface UseDraftPersistenceProps {
  conversationId: string;
}

interface UseDraftPersistenceReturn {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  clearDraft: () => void;
}

export function useDraftPersistence({ conversationId }: UseDraftPersistenceProps): UseDraftPersistenceReturn {
  const [message, setMessage] = useState('');
  const draftSaveRef = useRef<NodeJS.Timeout | null>(null);

  // Load draft on mount/conversation change
  useEffect(() => {
    if (conversationId) {
      const saved = localStorage.getItem(getDraftKey(conversationId));
      if (saved) {
        setMessage(saved);
      }
    }
  }, [conversationId]);

  // Save draft with debounce
  useEffect(() => {
    if (draftSaveRef.current) {
      clearTimeout(draftSaveRef.current);
    }

    draftSaveRef.current = setTimeout(() => {
      const key = getDraftKey(conversationId);
      if (message.trim()) {
        localStorage.setItem(key, message);
      } else {
        localStorage.removeItem(key);
      }
    }, 500);

    return () => {
      if (draftSaveRef.current) {
        clearTimeout(draftSaveRef.current);
      }
    };
  }, [message, conversationId]);

  const clearDraft = () => {
    localStorage.removeItem(getDraftKey(conversationId));
  };

  return {
    message,
    setMessage,
    clearDraft,
  };
}
