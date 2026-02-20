import { BaseSectionStyling } from "../fields/typography";
import { MagazineProduct } from "../core";

export interface ProductShowcaseContent extends BaseSectionStyling {
  type: "product-showcase";
  products: MagazineProduct[];
  theme?: string; // e.g., "Summer Essentials", "Anti-Aging Heroes"
}
