import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import NewsletterPopup from "@/components/NewsletterPopup/NewsletterPopup";
import EmptyState from "@/components/content/EmptyState";
import PageLinks from "@/components/content/PageLinks";
import ProductTile from "@/components/content/ProductTile";
import { listHref, pageCountFor } from "@/lib/searchParams";
import type { Paged, ProductCard, ShopFilters } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import ShopHero from "./ShopHero";
import { SHOP_PRODUCTS_ID } from "./shopIds";
import ShopToolbar from "./ShopToolbar";

export const PRODUCTS_PER_PAGE = 12;

interface ShopPageProps {
  products: Paged<ProductCard>;
  filters: ShopFilters | null;
  page: number;
  search: string;
  category: string;
  brand: string;
}

/** The Shop page (/shop): hero, then the catalogue with its search, brand and category filters. */
export default function ShopPage({ products, filters, page, search, category, brand }: ShopPageProps) {
  const filtered = Boolean(search || category || brand);
  const pageCount = pageCountFor(products.count, PRODUCTS_PER_PAGE);
  const categories = filters?.categories ?? [];
  const brandName = filters?.brands.find((b) => b.slug === brand)?.name ?? brand;
  const categoryName = categories.find((c) => c.slug === category)?.name ?? category;

  const hrefWith = (changes: Partial<Record<"search" | "category" | "brand" | "page", string | number>>) =>
    listHref("/shop", { search, category, brand, ...changes });

  // The hero is for arriving at the shop, not for paging through it
  const showHero = !filtered && page === 1;

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
              <p className="eyebrow">Curated Picks</p>
              <h2 id="shop-products-heading" className="mt-2 text-2xl tracking-tight md:text-3xl">
                {filtered ? "Products" : "All Products"}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {products.count === 1 ? "1 product" : `${products.count} products`}
              {brand && ` from ${brandName}`}
              {category && ` in ${categoryName}`}
              {search && ` matching “${search}”`}
            </p>
          </div>

          <div className="space-y-4">
            <ShopToolbar
              key={`${search}|${brand}|${category}`}
              search={search}
              brand={brand}
              category={category}
              brands={filters?.brands ?? []}
            />

            {categories.length > 0 && (
              <nav aria-label="Categories" className="no-scrollbar -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
                <ul className="flex gap-2 pb-1 sm:flex-wrap">
                  <li className="shrink-0">
                    <Link
                      href={hrefWith({ category: "", page: 1 })}
                      aria-current={!category ? "page" : undefined}
                      className="chip inline-flex rounded-full px-4 py-2 text-sm"
                    >
                      All
                    </Link>
                  </li>
                  {categories.map((option) => (
                    <li key={option.slug} className="shrink-0">
                      <Link
                        href={hrefWith({ category: option.slug, page: 1 })}
                        aria-current={category === option.slug ? "page" : undefined}
                        className="chip inline-flex rounded-full px-4 py-2 text-sm"
                      >
                        {option.name}
                        <span className="ml-1.5 opacity-70">{option.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>

          <div className="mt-8">
            {products.rows.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title={filtered ? "No products match" : "No products yet"}
                action={
                  filtered ? (
                    <Link href="/shop" className="btn-outline">
                      Clear filters
                    </Link>
                  ) : undefined
                }
              >
                {filtered
                  ? "Try another search, brand or category."
                  : "New products are on their way. Please check back soon."}
              </EmptyState>
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
