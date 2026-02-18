'use client';

import { useState, useEffect, useRef } from 'react';

interface UseDraftPersistenceConfig {
  /** Unique key to identify this draft (e.g., conversation ID) */
  key: string;
  /** Storage key prefix (default: 'draft') */
  prefix?: string;
  /** Debounce delay in ms (default: 500) */
  debounceMs?: number;
}

interface UseDraftPersistenceReturn {
  /** Current draft value */
  value: string;
  /** Set the draft value */
  setValue: React.Dispatch<React.SetStateAction<string>>;
  /** Clear the draft from storage */
  clearDraft: () => void;
  /** Whether a draft was loaded from storage */
  hadStoredDraft: boolean;
}

/**
 * Hook for persisting draft content to localStorage.
 *
 * Features:
 * - Automatically saves drafts with debouncing
 * - Loads existing drafts on mount
 * - Clears drafts from storage when cleared
 * - Configurable storage key and debounce timing
 *
 * @example
 * ```tsx
 * function MessageInput({ conversationId }) {
 *   const { value, setValue, clearDraft, hadStoredDraft } = useDraftPersistence({
 *     key: conversationId,
 *     prefix: 'message-draft',
 *   });
 *
 *   const handleSend = () => {
 *     sendMessage(value);
 *     clearDraft();
 *     setValue('');
 *   };
 *
 *   return (
 *     <div>
 *       {hadStoredDraft && <span>Draft restored</span>}
 *       <textarea value={value} onChange={(e) => setValue(e.target.value)} />
 *       <button onClick={handleSend}>Send</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useDraftPersistence({
  key,
  prefix = 'draft',
  debounceMs = 500,
}: UseDraftPersistenceConfig): UseDraftPersistenceReturn {
  const [value, setValue] = useState('');
  const [hadStoredDraft, setHadStoredDraft] = useState(false);
  const draftSaveRef = useRef<NodeJS.Timeout | null>(null);

  const storageKey = `${prefix}_${key}`;

  // Load draft on mount/key change
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setValue(saved);
        setHadStoredDraft(true);
      } else {
        setValue('');
        setHadStoredDraft(false);
      }
    } catch {
      // Ignore storage errors
      setValue('');
      setHadStoredDraft(false);
    }
  }, [storageKey]);

  // Save draft with debounce
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (draftSaveRef.current) {
      clearTimeout(draftSaveRef.current);
    }

    draftSaveRef.current = setTimeout(() => {
      try {
        if (value.trim()) {
          localStorage.setItem(storageKey, value);
        } else {
          localStorage.removeItem(storageKey);
        }
      } catch {
        // Ignore storage errors
      }
    }, debounceMs);

    return () => {
      if (draftSaveRef.current) {
        clearTimeout(draftSaveRef.current);
      }
    };
  }, [value, storageKey, debounceMs]);

  const clearDraft = () => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore storage errors
    }
  };

  return {
    value,
    setValue,
    clearDraft,
    hadStoredDraft,
  };
}
