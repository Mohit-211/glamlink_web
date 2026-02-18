"use client";

import type { ForClientsSection } from "@/lib/pages/admin/components/content-settings/content/sections/for-clients/types";
import { isHTMLContentSection } from "@/lib/pages/admin/components/content-settings/content/sections/for-clients/types";

interface HTMLContentSectionProps {
  section: ForClientsSection;
}

/**
 * HTML Content Section Renderer
 *
 * Renders custom HTML content with optional container classes.
 * This allows for maximum flexibility in adding custom sections
 * to any page (For Clients, For Professionals, Homepage, etc.)
 *
 * SECURITY: The HTML is rendered using dangerouslySetInnerHTML.
 * Only trusted admin users should be able to edit HTML content.
 */
export function HTMLContentSection({ section }: HTMLContentSectionProps) {
  if (!isHTMLContentSection(section)) return null;
  const { content } = section;

  // Default container class if not specified
  const containerClass = content.containerClass || 'py-16';

  return (
    <section className={containerClass}>
      <div
        dangerouslySetInnerHTML={{ __html: content.html }}
        className="w-full"
      />
    </section>
  );
}
