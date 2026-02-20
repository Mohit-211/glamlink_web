import { useMemo } from 'react';
import { getAllDefaultForClientsSections } from './sections/for-clients/defaultSectionContent';
import { getAllDefaultHomeSections } from './sections/home/defaultSectionContent';
import { getAllDefaultForProfessionalsSections } from './sections/for-professionals/defaultSectionContent';
import { getAllDefaultMagazineSections } from './sections/magazine/defaultSectionContent';
import { getAllDefaultPromosSections } from './sections/promos/defaultSectionContent';
import { getAllDefaultDigitalCardSections } from './sections/digital-card/defaultSectionContent';
import { getAllDefaultFeaturedSections } from './sections/featured/defaultSectionContent';

export interface PageOption {
  value: string;
  label: string;
}

export interface PageEditorConfig {
  pageType: string;
  pageLabel: string;
  contentKey: string;
  getDefaultSections: () => any[];
}

export const availablePages: PageOption[] = [
  { value: 'for-clients', label: 'For Clients Page' },
  { value: 'home', label: 'Home Page' },
  { value: 'for-professionals', label: 'For Professionals Page' },
  { value: 'magazine', label: 'Magazine Page' },
  { value: 'promos', label: 'Promos Page' },
  { value: 'apply-digital-card', label: 'Digital Card Application' },
  { value: 'apply-featured', label: 'Featured Application' },
];

const pageConfigs: Record<string, PageEditorConfig> = {
  'for-clients': {
    pageType: 'for-clients',
    pageLabel: 'For Clients Page',
    contentKey: 'for-clients',
    getDefaultSections: getAllDefaultForClientsSections,
  },
  'home': {
    pageType: 'home',
    pageLabel: 'Home Page',
    contentKey: 'home',
    getDefaultSections: getAllDefaultHomeSections,
  },
  'for-professionals': {
    pageType: 'for-professionals',
    pageLabel: 'For Professionals Page',
    contentKey: 'for-professionals',
    getDefaultSections: getAllDefaultForProfessionalsSections,
  },
  'magazine': {
    pageType: 'magazine',
    pageLabel: 'Magazine Page',
    contentKey: 'magazine',
    getDefaultSections: getAllDefaultMagazineSections,
  },
  'promos': {
    pageType: 'promos',
    pageLabel: 'Promos Page',
    contentKey: 'promos',
    getDefaultSections: getAllDefaultPromosSections,
  },
  'apply-digital-card': {
    pageType: 'apply-digital-card',
    pageLabel: 'Digital Card Application',
    contentKey: 'apply-digital-card',
    getDefaultSections: getAllDefaultDigitalCardSections,
  },
  'apply-featured': {
    pageType: 'apply-featured',
    pageLabel: 'Featured Application',
    contentKey: 'apply-featured',
    getDefaultSections: getAllDefaultFeaturedSections,
  },
};

interface UseContentSectionProps {
  selectedPage: string;
}

interface UseContentSectionReturn {
  availablePages: PageOption[];
  currentPageConfig: PageEditorConfig | null;
}

export function useContentSection({ selectedPage }: UseContentSectionProps): UseContentSectionReturn {
  const currentPageConfig = useMemo(() => {
    return pageConfigs[selectedPage] || null;
  }, [selectedPage]);

  return {
    availablePages,
    currentPageConfig,
  };
}
