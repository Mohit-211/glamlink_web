'use client';

import { useState, useEffect } from 'react';
import { SectionRenderer } from './components/SectionRenderer';
import { fetchPageContent } from './utils/dataFetching';
import type { PageConfig } from './types';
import type { MagazineIssueCard } from '@/lib/pages/magazine/types';
import type { PromoItem } from '@/lib/features/promos/config';
import type { DigitalCardFormData } from '@/lib/pages/apply/get-digital-card/types';
import type { GetFeaturedFormData } from '@/lib/pages/apply/featured/types';
import type { FormConfigsData } from '@/lib/pages/apply/shared/services/formConfigService';

/**
 * Props for the unified ClientWrapper component
 */
interface ClientWrapperProps {
  /**
   * Page identifier (e.g., 'for-clients', 'home', 'magazine')
   */
  pageType: string;

  /**
   * Pre-rendered data for SSG/ISR pages
   * If provided, no client-side fetch is performed
   */
  initialData?: PageConfig | null;

  // ==================== Magazine Props ====================
  /**
   * Magazine issues for magazine-listing section
   */
  issues?: MagazineIssueCard[];

  /**
   * Magazine issues grouped by year
   */
  issuesByYear?: Record<number, MagazineIssueCard[]>;

  // ==================== Promos Props ====================
  /**
   * Promos for promos-listing section
   */
  promos?: PromoItem[];

  /**
   * Featured promos
   */
  featuredPromos?: PromoItem[];

  /**
   * Selected promo for modal display
   */
  selectedPromo?: PromoItem | null;

  /**
   * Whether the promo modal is open
   */
  isPromoModalOpen?: boolean;

  /**
   * Handler for promo card click
   */
  onPromoClick?: (promo: PromoItem) => void;

  /**
   * Handler for closing promo modal
   */
  onPromoModalClose?: () => void;

  /**
   * Handler for promo CTA click
   */
  onPromoCta?: (promo: PromoItem) => void;

  // ==================== Digital Card Form Props ====================
  /**
   * Handler for digital card form submission
   */
  onDigitalCardSubmit?: (data: DigitalCardFormData) => Promise<void>;

  /**
   * Whether digital card form is loading
   */
  isDigitalCardLoading?: boolean;

  // ==================== Featured Form Props ====================
  /**
   * Handler for featured application form submission
   */
  onFeaturedSubmit?: (data: GetFeaturedFormData) => Promise<void>;

  /**
   * Whether featured form is loading
   */
  isFeaturedLoading?: boolean;

  /**
   * Form configurations for featured application
   */
  featuredConfigs?: FormConfigsData;

  /**
   * Whether featured form submission was successful
   */
  isFeaturedSuccess?: boolean;

  /**
   * Error from featured form submission
   */
  featuredError?: string | null;

  // ==================== Common Props ====================
  /**
   * Handler for CTA button clicks (e.g., download dialogs)
   */
  onCtaClick?: () => void;

  /**
   * Custom class name for wrapper div
   * @default 'min-h-screen bg-white'
   */
  className?: string;

  /**
   * Children to render alongside sections (e.g., dialogs, modals)
   */
  children?: React.ReactNode;
}

/**
 * ClientWrapper Component
 *
 * Unified display wrapper for CMS-managed pages. Handles:
 * - SSG/ISR pre-rendered data
 * - Dynamic client-side data fetching
 * - Loading and error states
 * - Banner rendering
 * - Section rendering with visibility and ordering
 *
 * Supports all page types: home, for-clients, for-professionals,
 * magazine, promos, apply-featured, apply-digital-card
 *
 * Usage:
 * ```tsx
 * // SSG/ISR (server-rendered with data)
 * <ClientWrapper pageType="for-clients" initialData={pageConfig} />
 *
 * // Dynamic (client-side fetch)
 * <ClientWrapper pageType="for-clients" />
 *
 * // With page-specific data (magazine)
 * <ClientWrapper
 *   pageType="magazine"
 *   initialData={pageConfig}
 *   issues={issues}
 *   issuesByYear={issuesByYear}
 * />
 * ```
 */
export function ClientWrapper({
  pageType,
  initialData,
  // Magazine props
  issues,
  issuesByYear,
  // Promos props
  promos,
  featuredPromos,
  selectedPromo,
  isPromoModalOpen,
  onPromoClick,
  onPromoModalClose,
  onPromoCta,
  // Digital card props
  onDigitalCardSubmit,
  isDigitalCardLoading,
  // Featured props
  onFeaturedSubmit,
  isFeaturedLoading,
  featuredConfigs,
  isFeaturedSuccess,
  featuredError,
  // Common props
  onCtaClick,
  className = 'min-h-screen bg-white',
  children
}: ClientWrapperProps) {
  const [config, setConfig] = useState<PageConfig | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  // Fetch data dynamically if not pre-rendered
  useEffect(() => {
    // Skip if we already have initial data
    if (initialData) {
      return;
    }

    const loadContent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchPageContent(pageType);
        setConfig(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load content';
        setError(errorMessage);
        console.error(`Error loading content for ${pageType}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [pageType, initialData]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-glamlink-teal mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <svg
            className="h-12 w-12 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Content</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-glamlink-teal text-white rounded-md hover:bg-glamlink-teal-dark transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!config) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <svg
            className="h-12 w-12 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Content Available</h2>
          <p className="text-gray-600">
            This page hasn't been configured yet. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  // Get visible sections sorted by order
  const visibleSections = (config.sections || [])
    .filter((section: any) => section.visible !== false)
    .sort((a: any, b: any) => a.order - b.order);

  return (
    <>
      <div className={className}>
        {/* Render banner if enabled */}
        {config.banner?.enabled && (
          <div
            className="py-3 px-4 text-center text-sm font-medium"
            style={{
              backgroundColor: config.banner.backgroundColor || '#24bbcb',
              color: config.banner.textColor || '#ffffff'
            }}
          >
            {config.banner.link ? (
              <a
                href={config.banner.link}
                className="hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {config.banner.message}
              </a>
            ) : (
              <span>{config.banner.message}</span>
            )}
          </div>
        )}

        {/* Render visible sections */}
        {visibleSections.length > 0 ? (
          visibleSections.map((section: any) => (
            <SectionRenderer
              key={section.id}
              section={section}
              pageType={pageType}
              // Common props
              onCtaClick={onCtaClick}
              // Magazine props - only pass to magazine-listing sections
              issues={section.type === 'magazine-listing' ? issues : undefined}
              issuesByYear={section.type === 'magazine-listing' ? issuesByYear : undefined}
              // Promos props - only pass to promos-listing sections
              promos={section.type === 'promos-listing' ? promos : undefined}
              featuredPromos={section.type === 'promos-listing' ? featuredPromos : undefined}
              selectedPromo={section.type === 'promos-listing' ? selectedPromo : undefined}
              isModalOpen={section.type === 'promos-listing' ? isPromoModalOpen : undefined}
              onPromoClick={section.type === 'promos-listing' ? onPromoClick : undefined}
              onModalClose={section.type === 'promos-listing' ? onPromoModalClose : undefined}
              onPromoCta={section.type === 'promos-listing' ? onPromoCta : undefined}
              // Digital card props - only pass to digital-card-form sections
              onDigitalCardSubmit={section.type === 'digital-card-form' ? onDigitalCardSubmit : undefined}
              isDigitalCardLoading={section.type === 'digital-card-form' ? isDigitalCardLoading : undefined}
              // Featured props - only pass to featured-form sections
              onFeaturedSubmit={section.type === 'featured-form' ? onFeaturedSubmit : undefined}
              isFeaturedLoading={section.type === 'featured-form' ? isFeaturedLoading : undefined}
              featuredConfigs={section.type === 'featured-form' ? featuredConfigs : undefined}
              isFeaturedSuccess={section.type === 'featured-form' ? isFeaturedSuccess : undefined}
              featuredError={section.type === 'featured-form' ? featuredError : undefined}
            />
          ))
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
              <p className="text-gray-600">No visible sections configured for this page.</p>
            </div>
          </div>
        )}
      </div>

      {/* Render additional children (dialogs, modals, etc.) */}
      {children}
    </>
  );
}

// Default export for backward compatibility with ClientDisplay imports
export default ClientWrapper;
