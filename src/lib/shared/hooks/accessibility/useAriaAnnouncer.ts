'use client';

import { useState, useCallback, useRef } from 'react';

export type AriaLivePriority = 'polite' | 'assertive';

export interface UseAriaAnnouncerReturn {
  announcement: string;
  priority: AriaLivePriority;
  announce: (message: string, priority?: AriaLivePriority) => void;
  clearAnnouncement: () => void;
}

/**
 * Hook for managing ARIA live region announcements for screen readers.
 *
 * Usage:
 * 1. Call `announce()` with a message to announce to screen readers
 * 2. The announcement is automatically cleared after a short delay
 * 3. Use 'assertive' priority for urgent announcements (new messages from others)
 * 4. Use 'polite' priority for non-urgent announcements (typing indicators, status changes)
 *
 * @example
 * ```tsx
 * function NotificationBanner() {
 *   const { announcement, priority, announce } = useAriaAnnouncer();
 *
 *   const showNotification = (message: string) => {
 *     announce(message, 'assertive');
 *   };
 *
 *   return (
 *     <>
 *       <AriaAnnouncer message={announcement} priority={priority} />
 *       <button onClick={() => showNotification('Success!')}>Notify</button>
 *     </>
 *   );
 * }
 * ```
 */
export function useAriaAnnouncer(): UseAriaAnnouncerReturn {
  const [announcement, setAnnouncement] = useState('');
  const [priority, setPriority] = useState<AriaLivePriority>('polite');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearAnnouncement = useCallback(() => {
    setAnnouncement('');
  }, []);

  const announce = useCallback((message: string, announcePriority: AriaLivePriority = 'polite') => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set the announcement and priority
    setPriority(announcePriority);
    setAnnouncement(message);

    // Clear the announcement after a delay to allow screen readers to read it
    // and to reset for the next announcement
    timeoutRef.current = setTimeout(() => {
      setAnnouncement('');
    }, 1000);
  }, []);

  return { announcement, priority, announce, clearAnnouncement };
}
