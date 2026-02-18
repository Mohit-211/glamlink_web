/**
 * Apply Featured Page - Server Component
 *
 * Featured application page with CMS-controlled content
 * Fetches both form configurations and CMS page content
 */

import { getServerPageContent } from '@/lib/features/display-cms/utils/dataFetching.server';
import { getPageMetadata } from "@/lib/data/metadata";
import { getFormConfigs } from '@/lib/pages/apply/shared/services/formConfigService';
import { FeaturedPageWrapper } from './FeaturedPageWrapper';

export const metadata = getPageMetadata("apply-featured");

// ISR with 60-second revalidation for all environments
export const revalidate = 60;

export default async function ApplyFeaturedPage() {
  // Fetch both form configs and CMS content server-side
  const [configs, pageConfig] = await Promise.all([
    getFormConfigs(),
    getServerPageContent('apply-featured')
  ]);

  // Handle case when no configs exist
  if (!configs || configs.formTypes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Forms Unavailable
          </h1>
          <p className="text-gray-600 mb-6">
            Feature forms are currently being configured. Please check back soon.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <FeaturedPageWrapper
      pageType="apply-featured"
      initialData={pageConfig}
      configs={configs}
    />
  );
}
