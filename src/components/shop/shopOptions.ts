import type { FilterOption } from "@/components/content/ListFilters";
import type { ShopFilters } from "@/lib/api/types";

/* The Shop's sorting and price filter (the owner, Nov 3), and the product categories (Nov 4). */

/** The categories a product is filed under (the API keeps the label): picked in the dashboard and the admin panel. */
export const PRODUCT_CATEGORIES = [
  "Skincare",
  "Haircare",
  "Makeup",
  "Nails",
  "Body & Bath",
  "Fragrance",
  "Wellness & Supplements",
  "Devices & Tools",
] as const;

export const SHOP_SORTS: FilterOption[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "name", label: "Name (A–Z)" },
];

/** The Saved list opens in the order the visitor saved them, most recent first. */
export const SAVED_SORTS: FilterOption[] = [
  { value: "saved", label: "Recently saved" },
  ...SHOP_SORTS.filter((s) => s.value.startsWith("price") || s.value === "name"),
];

interface PriceBand {
  value: string;
  label: string;
  /** Inclusive. */
  min?: number;
  /** Exclusive. */
  max?: number;
}

export const PRICE_BANDS: PriceBand[] = [
  { value: "under-50", label: "Under $50", max: 50 },
  { value: "50-100", label: "$50 to $100", min: 50, max: 100 },
  { value: "100-150", label: "$100 to $150", min: 100, max: 150 },
  { value: "150-plus", label: "$150 and up", min: 150 },
];

export const priceBand = (value: string) => PRICE_BANDS.find((band) => band.value === value);

/** The bands some product's price falls in (all of them while the API doesn't say its range). */
export function bandsFor(range: ShopFilters["price"]): PriceBand[] {
  if (!range) return range === null ? [] : PRICE_BANDS;
  return PRICE_BANDS.filter((band) => (band.min ?? 0) <= range.max && (band.max ?? Infinity) > range.min);
}
