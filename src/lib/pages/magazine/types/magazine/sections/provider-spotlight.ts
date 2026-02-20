import { BaseSectionStyling } from "../fields/typography";
import { MagazineProvider } from "../core";

export interface ProviderSpotlightContent extends BaseSectionStyling {
  type: "provider-spotlight";
  providers: MagazineProvider[];
  focusArea?: string; // e.g., "Rising Stars", "Master Technicians"
}
