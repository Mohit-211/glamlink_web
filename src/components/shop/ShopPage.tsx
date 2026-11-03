import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import NewsletterPopup from "@/components/NewsletterPopup/NewsletterPopup";
import CookieSettingsButton from "@/components/common/CookieSettingsButton";
import EmptyState from "@/components/content/EmptyState";
import ListFilters from "@/components/content/ListFilters";
import PageLinks from "@/components/content/PageLinks";
import ProductTile from "@/components/content/ProductTile";
import { listHref, pageCountFor } from "@/lib/searchParams";
import type { Paged, ProductCard, ShopFilters } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import SavedChip from "./SavedChip";
import ShopHero from "./ShopHero";
import { SHOP_PRODUCTS_ID } from "./shopIds";
import { bandsFor, priceBand, SAVED_SORTS, SHOP_SORTS } from "./shopOptions";
import ShopToolbar from "./ShopToolbar";

export const PRODUCTS_PER_PAGE = 12;

interface ShopPageProps {
  products: Paged<ProductCard>;
  filters: ShopFilters | null;
  page: number;
  search: string;
  category: string;
  brand: string;
  /** A price band's value (shopOptions.ts). */
  price: string;
  sort: string;
  /** The visitor's Saved list (?saved=1). */
  saved: boolean;
}

/**
 * The Shop page (/shop): hero, then the catalogue with its search, categories, the visitor's Saved list, and the
 * brand and price filters and sorting (the owner, Nov 3).
 */
export default function ShopPage({ products, filters, page, search, category, brand, price, sort, saved }: ShopPageProps) {
  const filtered = Boolean(search || category || brand || price);
  const pageCount = pageCountFor(products.count, PRODUCTS_PER_PAGE);
  const categories = filters?.categories ?? [];
  const sorts = saved ? SAVED_SORTS : SHOP_SORTS;
  const band = priceBand(price);
  const brandName = filters?.brands.find((b) => b.slug === brand)?.name ?? brand;
  const categoryName = categories.find((c) => c.slug === category)?.name ?? category;

  const state = { search, category, brand, price, sort: sort === sorts[0].value ? "" : sort, saved: saved ? "1" : "" };
  const hrefWith = (changes: Partial<Record<keyof typeof state | "page", string | number>>) => listHref("/shop", { ...state, ...changes });

  // The hero is for arriving at the shop, not for paging through it
  const showHero = !filtered && !saved && page === 1;
  const summary = [
    products.count === 1 ? "1 product" : `${products.count} products`,
    brand && `from ${brandName}`,
    category && `in ${categoryName}`,
    band && band.label.toLowerCase(),
    search && `matching “${search}”`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <NewsletterPopup openDelay={3000} />
      {showHero && <ShopHero />}
      <div className={cn("container-glamlink pb-16 lg:pb-24", !showHero && "pt-24 md:pt-28")}>
        <section
          id={SHOP_PRODUCTS_ID}
          tabIndex={-1}
          aria-labelledby="shop-products-heading"
          className="scroll-mt-28 pt-10 focus:outline-none md:pt-14"
        >
          <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div>
              <p className="eyebrow">{saved ? "Your picks" : "Curated Picks"}</p>
              <h2 id="shop-products-heading" className="mt-2 text-2xl tracking-tight md:text-3xl">
                {saved ? "Saved Products" : filtered ? "Products" : "All Products"}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {summary}
              {(filtered || saved) && (
                <>
                  {" · "}
                  <Link href="/shop" className="link-glamlink">
                    {saved ? "All products" : "Clear all"}
                  </Link>
                </>
              )}
            </p>
          </div>

          <div className="space-y-4">
            <ShopToolbar key={search} search={search} keep={{ ...state, search: "" }} />

            <nav aria-label="Categories and saved products" className="no-scrollbar -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
              <ul className="flex gap-2 pb-1 sm:flex-wrap">
                <li className="shrink-0">
                  <Link
                    href={hrefWith({ category: "", saved: "", sort: "", page: 1 })}
                    aria-current={!category && !saved ? "page" : undefined}
                    className="chip inline-flex rounded-full px-4 py-2 text-sm"
                  >
                    All
                  </Link>
                </li>
                {categories.map((option) => (
                  <li key={option.slug} className="shrink-0">
                    <Link
                      href={hrefWith({ category: option.slug, saved: "", sort: "", page: 1 })}
                      aria-current={!saved && category === option.slug ? "page" : undefined}
                      className="chip inline-flex rounded-full px-4 py-2 text-sm"
                    >
                      {option.name}
                      <span className="ml-1.5 opacity-70">{option.count}</span>
                    </Link>
                  </li>
                ))}
                <li className="shrink-0">
                  <SavedChip href={`/shop?saved=1#${SHOP_PRODUCTS_ID}`} current={saved} />
                </li>
              </ul>
            </nav>

            <ListFilters
              key={JSON.stringify(state)}
              action="/shop"
              keep={{ search, category, saved: state.saved }}
              fields={[
                {
                  name: "brand",
                  label: "Brand",
                  allLabel: "All brands",
                  value: brand,
                  options: (filters?.brands ?? []).map((b) => ({ value: b.slug, label: b.name, count: b.count })),
                },
                {
                  name: "price",
                  label: "Price",
                  allLabel: "Any price",
                  value: price,
                  options: bandsFor(filters?.price).map((b) => ({ value: b.value, label: b.label })),
                },
              ]}
              sort={{ value: sort, options: sorts }}
            />
          </div>

          <div className="mt-8">
            {products.rows.length === 0 ? (
              saved && !filtered ? (
                <EmptyState
                  icon={Heart}
                  title="Nothing saved yet"
                  action={
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <Link href="/shop" className="btn-outline">
                        Browse products
                      </Link>
                      <CookieSettingsButton className="link-glamlink text-sm" />
                    </div>
                  }
                >
                  Tap the heart on a product to keep it here. Saving uses a cookie, so it needs your OK in the cookie
                  settings.
                </EmptyState>
              ) : (
                <EmptyState
                  icon={ShoppingBag}
                  title={filtered ? "No products match" : "No products yet"}
                  action={
                    filtered ? (
                      <Link href={saved ? "/shop?saved=1" : "/shop"} className="btn-outline">
                        Clear filters
                      </Link>
                    ) : undefined
                  }
                >
                  {filtered
                    ? "Try another search, brand, category or price."
                    : "New products are on their way. Please check back soon."}
                </EmptyState>
              )
            ) : (
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
                {products.rows.map((product, i) => (
                  <li key={product.id}>
                    <ProductTile product={product} priority={i < 4} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <PageLinks
            className="mt-12"
            page={page}
            pageCount={pageCount}
            hrefFor={(p) => `${hrefWith({ page: p })}#${SHOP_PRODUCTS_ID}`}
          />
        </section>
      </div>
    </>
  );
}
