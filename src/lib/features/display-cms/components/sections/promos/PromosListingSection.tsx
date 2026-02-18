"use client";

import type { PromosSection } from '@/lib/pages/admin/components/content-settings/content/sections/promos/types';
import { isPromosListingSection } from '@/lib/pages/admin/components/content-settings/content/sections/promos/types';
import PromosPage from "@/lib/features/promos/components/PromosPage";
import type { PromoItem, PromosPageProps } from "@/lib/features/promos/config";

interface PromosListingSectionProps {
  section: PromosSection;
  promos?: PromoItem[];
  featuredPromos?: PromoItem[];
  selectedPromo?: PromoItem | null;
  isModalOpen?: boolean;
  onPromoClick?: (promo: PromoItem) => void;
  onModalClose?: () => void;
  onCtaClick?: (promo: PromoItem) => void;
}

export function PromosListingSection({
  section,
  promos = [],
  featuredPromos = [],
  selectedPromo = null,
  isModalOpen = false,
  onPromoClick,
  onModalClose,
  onCtaClick
}: PromosListingSectionProps) {
  if (!isPromosListingSection(section)) return null;

  const promosPageProps: PromosPageProps = {
    state: {
      promos,
      featuredPromos,
      isLoading: false,
      error: null,
      selectedPromo,
      isModalOpen
    },
    handlers: {
      onPromoClick,
      onModalClose,
      onCtaClick
    }
  };

  return <PromosPage props={promosPageProps} />;
}
