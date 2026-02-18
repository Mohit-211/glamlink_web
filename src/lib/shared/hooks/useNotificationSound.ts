'use client';

import { useRef, useEffect, useCallback, useState } from 'react';

interface UseNotificationSoundConfig {
  /** Path to the audio file */
  src: string;
  /** Volume level (0.0 - 1.0) */
  volume?: number;
  /** Whether sound is enabled */
  enabled?: boolean;
  /** Play when tab is visible (default: only play when hidden) */
  playWhenVisible?: boolean;
}

interface UseNotificationSoundReturn {
  /** Play the notification sound */
  play: () => void;
  /** Stop the current sound */
  stop: () => void;
  /** Enable or disable sounds */
  setEnabled: (enabled: boolean) => void;
  /** Current enabled state */
  isEnabled: boolean;
}

/**
 * Hook for playing notification sounds.
 *
 * Features:
 * - Configurable audio source and volume
 * - Enable/disable toggle
 * - Only plays when tab is hidden by default
 * - Gracefully handles autoplay restrictions
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const { play, setEnabled, isEnabled } = useNotificationSound({
 *     src: '/sounds/notification.mp3',
 *     volume: 0.5,
 *   });
 *
 *   useEffect(() => {
 *     if (hasNewMessage) {
 *       play();
 *     }
 *   }, [hasNewMessage, play]);
 *
 *   return (
 *     <button onClick={() => setEnabled(!isEnabled)}>
 *       {isEnabled ? 'Mute' : 'Unmute'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useNotificationSound({
  src,
  volume = 0.5,
  enabled = true,
  playWhenVisible = false,
}: UseNotificationSoundConfig): UseNotificationSoundReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isEnabled, setIsEnabled] = useState(enabled);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(src);
      audioRef.current.volume = volume;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [src, volume]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = useCallback(() => {
    // Only play sound if:
    // - Sound is enabled
    // - Tab is not visible (or playWhenVisible is true)
    // - Audio element exists
    const shouldPlay =
      isEnabled &&
      audioRef.current &&
      (playWhenVisible || (typeof document !== 'undefined' && document.hidden));

    if (shouldPlay && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Ignore autoplay errors - browsers may block audio until user interaction
      });
    }
  }, [isEnabled, playWhenVisible]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const setEnabled = useCallback((value: boolean) => {
    setIsEnabled(value);
  }, []);

  return {
    play,
    stop,
    setEnabled,
    isEnabled,
  };
}
