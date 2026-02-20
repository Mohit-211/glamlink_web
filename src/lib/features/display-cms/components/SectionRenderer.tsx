"use client";

import type { DigitalCardFormData } from "@/lib/pages/apply/get-digital-card/types";
import { DigitalCardFormSection } from "./sections";

interface SectionRendererProps {
  section: any;
  onDigitalCardSubmit?: (data: DigitalCardFormData) => Promise<void>;
  isDigitalCardLoading?: boolean;
}

export function SectionRenderer({
  section,
  onDigitalCardSubmit,
  isDigitalCardLoading,
}: SectionRendererProps) {

  // Only render Digital Card Form Section
  if (section?.type !== "digital-card-form") {
    return null;
  }

  return (
    <DigitalCardFormSection
      section={section}
      onSubmit={onDigitalCardSubmit}
      isLoading={isDigitalCardLoading}
    />
  );
}