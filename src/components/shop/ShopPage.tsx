import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import NewsletterPopup from "@/components/NewsletterPopup/NewsletterPopup";
import CookieSettingsButton from "@/components/common/CookieSettingsButton";
import EmptyState from "@/components/content/EmptyState";
import ListFilters from "@/components/content/ListFilters";
import { ListNavigation, ListResults } from "@/components/content/ListNavigation";
import PageLinks from "@/components/content/PageLinks";
import ProductTile from "@/components/content/ProductTile";
import { listHref, pageCountFor } from "@/lib/searchParams";
import type { Paged, ProductCard, ShopFilters } from "@/lib/api/types";
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
 * category, brand and price filters and sorting (the owner, Nov 3–4). The hero stays on every view and a change
 * loads in place, dimming the results until the new ones arrive: it used to vanish with a filter and come back
 * without one, so the page jumped.
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
      <ShopHero />
      <div className="container-glamlink pb-16 lg:pb-24">
        <ListNavigation>
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

              <nav aria-label="All or saved products">
                <ul className="flex gap-2">
                  <li>
                    <Link
                      href={hrefWith({ saved: "", sort: "", page: 1 })}
                      scroll={false}
                      aria-current={!saved ? "page" : undefined}
                      className="chip inline-flex rounded-full px-4 py-2 text-sm"
                    >
                      All products
                    </Link>
                  </li>
                  <li>
                    <SavedChip href={hrefWith({ saved: "1", sort: "", page: 1 })} current={saved} />
                  </li>
                </ul>
              </nav>

              <ListFilters
                key={JSON.stringify(state)}
                action="/shop"
                keep={{ search, saved: state.saved }}
                fields={[
                  {
                    // All of them, products or not yet: admins are giving the products their categories (Nov 4)
                    name: "category",
                    label: "Category",
                    allLabel: "All categories",
                    value: category,
                    options: categories.map((c) => ({ value: c.slug, label: c.name, count: c.count })),
                  },
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

            <ListResults className="mt-8">
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
                      <ProductTile product={product} priority={i < 4} shopButton />
                    </li>
                  ))}
                </ul>
              )}
            </ListResults>

            <PageLinks
              className="mt-12"
              page={page}
              pageCount={pageCount}
              hrefFor={(p) => `${hrefWith({ page: p })}#${SHOP_PRODUCTS_ID}`}
            />
          </section>
        </ListNavigation>
      </div>
    </>
  );
}
