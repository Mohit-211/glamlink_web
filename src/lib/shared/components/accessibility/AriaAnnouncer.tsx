'use client';

import type { AriaLivePriority } from '../../hooks/accessibility/useAriaAnnouncer';

interface AriaAnnouncerProps {
  message: string;
  priority?: AriaLivePriority;
}

/**
 * Component that provides ARIA live region announcements for screen readers.
 *
 * Uses role="status" and aria-live to announce dynamic content changes.
 * The content is visually hidden but announced by screen readers.
 *
 * @example
 * ```tsx
 * function NotificationArea() {
 *   const { announcement, priority, announce } = useAriaAnnouncer();
 *
 *   return (
 *     <>
 *       <AriaAnnouncer message={announcement} priority={priority} />
 *       <button onClick={() => announce('Item saved successfully')}>
 *         Save
 *       </button>
 *     </>
 *   );
 * }
 * ```
 */
export function AriaAnnouncer({ message, priority = 'polite' }: AriaAnnouncerProps) {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}
