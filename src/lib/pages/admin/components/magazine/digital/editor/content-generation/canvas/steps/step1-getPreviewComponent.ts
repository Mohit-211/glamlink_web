/**
 * Step 1: Get Preview Component
 *
 * Get the React preview component for a given page type.
 */

import type { DigitalPageType } from '../../../types';
import { getDigitalPreviewComponent } from '@/lib/pages/admin/config/digitalPreviewComponents';

/**
 * Get the preview component for a page type
 * @throws Error if page type is unknown
 */
export function getPreviewComponent(pageType: DigitalPageType) {
  const previewConfig = getDigitalPreviewComponent(pageType);
  if (!previewConfig) {
    throw new Error(`Unknown page type: ${pageType}`);
  }
  return previewConfig.component;
}
