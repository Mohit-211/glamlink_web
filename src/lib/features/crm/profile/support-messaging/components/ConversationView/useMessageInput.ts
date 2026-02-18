'use client';

import { useCallback, useRef } from 'react';
import { MESSAGE_CONFIG } from '../../config';

interface UseMessageInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  onTypingChange: (text: string) => void;
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
}

interface UseMessageInputReturn {
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  charCount: number;
  isNearLimit: boolean;
  isOverLimit: boolean;
  charsRemaining: number;
}

export function useMessageInput({
  message,
  setMessage,
  onTypingChange,
  messagesContainerRef,
}: UseMessageInputProps): UseMessageInputReturn {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    onTypingChange(value);

    // Auto-resize the textarea
    const textarea = e.target;
    const messagesContainer = messagesContainerRef.current;
    const scrollTop = messagesContainer?.scrollTop || 0;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;

    if (messagesContainer) {
      messagesContainer.scrollTop = scrollTop;
    }
  }, [setMessage, onTypingChange, messagesContainerRef]);

  const charCount = message.length;
  const isNearLimit = charCount >= MESSAGE_CONFIG.maxLength * MESSAGE_CONFIG.warningThreshold;
  const isOverLimit = charCount > MESSAGE_CONFIG.maxLength;
  const charsRemaining = MESSAGE_CONFIG.maxLength - charCount;

  return {
    inputRef,
    handleInputChange,
    charCount,
    isNearLimit,
    isOverLimit,
    charsRemaining,
  };
}
