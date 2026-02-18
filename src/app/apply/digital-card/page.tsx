/**
 * Apply Digital Card Page - Server Component
 *
 * Digital business card application page with CMS-controlled content
 */

import { getServerPageContent } from '@/lib/features/display-cms/utils/dataFetching.server';
import { getPageMetadata } from "@/lib/data/metadata";
import { DigitalCardPageWrapper } from './DigitalCardPageWrapper';

export const metadata = getPageMetadata("apply-digital-card");

// ISR with 60-second revalidation for all environments
export const revalidate = 60;

export default async function ApplyDigitalCardPage() {
  // Fetch CMS page content server-side
  const pageConfig = await getServerPageContent('apply-digital-card');

  return (
    <DigitalCardPageWrapper
      pageType="apply-digital-card"
      initialData={pageConfig}
    />
  );
}
