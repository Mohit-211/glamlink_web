'use client';

import { useState, useEffect } from 'react';
import { SectionRenderer } from './components/SectionRenderer';
import { fetchPageContent } from './utils/dataFetching';
import type { PageConfig } from './types';
import type { DigitalCardFormData } from '@/lib/pages/apply/get-digital-card/types';

interface ClientWrapperProps {
  pageType: string;
  initialData?: PageConfig | null;

  // Digital Card Props Only
  onDigitalCardSubmit?: (data: DigitalCardFormData) => Promise<void>;
  isDigitalCardLoading?: boolean;

  className?: string;
}

export function ClientWrapper({
  pageType,
  initialData,
  onDigitalCardSubmit,
  isDigitalCardLoading,
  className = 'min-h-screen bg-white'
}: ClientWrapperProps) {

  const [config, setConfig] = useState<PageConfig | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) return;

    const loadContent = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPageContent(pageType);
        setConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [pageType, initialData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{error || 'No content available'}</p>
      </div>
    );
  }

  const visibleSections = (config.sections || [])
    .filter((section: any) => section.visible !== false)
    .sort((a: any, b: any) => a.order - b.order);

  return (
    <div className={className}>
      {visibleSections.map((section: any) => (
        <SectionRenderer
          key={section.id}
          section={section}
          onDigitalCardSubmit={onDigitalCardSubmit}
          isDigitalCardLoading={isDigitalCardLoading}
        />
      ))}
    </div>
  );
}

export default ClientWrapper;