import type { Metadata } from "next";
import Link from "next/link";
import { Search, Store } from "lucide-react";
import { SITE_URL } from "@/lib/config";
import PageHero from "@/components/common/PageHero";
import ProfileTile from "@/components/content/ProfileTile";
import PageLinks from "@/components/content/PageLinks";
import EmptyState from "@/components/content/EmptyState";
import ListFilters, { type FilterOption } from "@/components/content/ListFilters";
import { CREATE_PROFILE_HREF } from "@/components/glamlinkDirectory/DirectoryCTA";
import { getDirectoryFilters, getProfiles } from "@/lib/api/public";
import type { ProfileSort } from "@/lib/api/types";
import { listHref, pageCountFor, pageParam, param, type SearchParams } from "@/lib/searchParams";
import brandsPhoto from "../../../public/home-hero/brands-home.png";

/* Brands on Glamlink: brand accounts with a live Access card or a brand page. Find a Brand and the directory's
   "Explore all brands" lead here, with the brands' categories, how they ship and an order to pick (Nov 3). */

const BRANDS_PER_PAGE = 24;
const LIST_ID = "brands-list";
const description =
  "Discover the brands shaping beauty + wellness, from professional skincare to the devices experts trust.";

const SORTS: FilterOption[] = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name (A–Z)" },
];

export const metadata: Metadata = {
  title: "Beauty + Wellness Brands",
  description,
  alternates: { canonical: "/brands" },
  openGraph: {
    title: "Beauty + Wellness Brands on Glamlink",
    description,
    url: `${SITE_URL}/brands`,
  },
};

export default async function BrandsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = pageParam(params.page);
  const search = param(params.search);
  const category = param(params.category);
  const shipping = param(params.shipping);
  const asked = param(params.sort);
  const sort = (SORTS.some((s) => s.value === asked) ? asked : "recommended") as ProfileSort;

  const [brands, filters] = await Promise.all([
    getProfiles({
      type: "brand",
      page,
      limit: BRANDS_PER_PAGE,
      search: search || undefined,
      category: category || undefined,
      shipping: shipping || undefined,
      sort,
    }),
    getDirectoryFilters("brand"),
  ]);

  const kept = { search, category, shipping, sort: sort === "recommended" ? "" : sort };
  const hrefWith = (changes: Partial<Record<keyof typeof kept | "page", string | number>>) =>
    listHref("/brands", { ...kept, ...changes });
  const filtered = Boolean(search || category || shipping);
  const pageCount = pageCountFor(brands.count, BRANDS_PER_PAGE);

  // Only the choices some brand has (and the one chosen), so no chip or option leads to an empty list
  const categories = (filters?.categories ?? []).filter((c) => c.count > 0 || c.key === category);
  const shippingOptions = (filters?.shipping ?? []).filter((s) => s.count > 0 || s.key === shipping);
  const categoryLabel = filters?.categories.find((c) => c.key === category)?.label ?? category;
  const shippingLabel = filters?.shipping.find((s) => s.key === shipping)?.label ?? shipping;
  const summary = [
    brands.count === 1 ? "1 brand" : `${brands.count} brands`,
    category && categoryLabel,
    shipping && shippingLabel.toLowerCase(),
    search && `matching “${search}”`,
  ]
    .filter(Boolean)
    .join(" · ");

  // The layout's <main> holds the page
  return (
    <>
      <PageHero
        id="brands-hero"
        eyebrow="Innovative brands. Advanced technology."
        title="Beauty + Wellness Brands"
        subtitle={description}
        image={brandsPhoto}
        imageAlt=""
      >
        <form action="/brands" role="search" className="max-w-xl">
          {Object.entries(kept).map(([name, value]) =>
            name !== "search" && value ? <input key={name} type="hidden" name={name} value={value} /> : null
          )}
          <label htmlFor="brands-search" className="sr-only">
            Search brands
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="brands-search"
              name="search"
              type="search"
              defaultValue={search}
              maxLength={100}
              placeholder="Search brands"
              className="input-glamlink h-14 rounded-full pl-13 pr-32 shadow-soft"
            />
            <button type="submit" className="btn-primary absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5">
              Search
            </button>
          </div>
        </form>
      </PageHero>

      <section
        id={LIST_ID}
        aria-labelledby="brands-list-heading"
        className="container-glamlink scroll-mt-24 py-12 md:py-16"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <p className="eyebrow">Explore</p>
            <h2 id="brands-list-heading" className="mt-2 text-2xl tracking-tight md:text-3xl">
              {filtered ? "Brands" : "All brands"}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {summary}
            {filtered && (
              <>
                {" · "}
                <Link href="/brands" className="link-glamlink">
                  Clear all
                </Link>
              </>
            )}
          </p>
        </div>

        <div className="space-y-5">
          {categories.length > 0 && (
            <nav aria-label="Categories" className="no-scrollbar -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
              <ul className="flex gap-2 pb-1 sm:flex-wrap">
                <li className="shrink-0">
                  <Link
                    href={`${hrefWith({ category: "", page: 1 })}#${LIST_ID}`}
                    aria-current={!category ? "page" : undefined}
                    className="chip inline-flex rounded-full px-4 py-2 text-sm"
                  >
                    All
                  </Link>
                </li>
                {categories.map((option) => (
                  <li key={option.key} className="shrink-0">
                    <Link
                      href={`${hrefWith({ category: option.key, page: 1 })}#${LIST_ID}`}
                      aria-current={category === option.key ? "page" : undefined}
                      className="chip inline-flex rounded-full px-4 py-2 text-sm"
                    >
                      {option.label}
                      <span className="ml-1.5 opacity-70">{option.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <ListFilters
            key={JSON.stringify(kept)}
            action="/brands"
            keep={{ search, category }}
            fields={[
              {
                name: "shipping",
                label: "Shipping",
                allLabel: "Any shipping",
                value: shipping,
                options: shippingOptions.map((s) => ({ value: s.key, label: s.label, count: s.count })),
              },
            ]}
            sort={{ value: sort, options: SORTS }}
          />
        </div>

        <div className="mt-8">
          {brands.rows.length > 0 ? (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {brands.rows.map((brand) => (
                <li key={brand.id}>
                  <ProfileTile profile={brand} sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Store}
              title={filtered ? "No brands match" : "Brands are on their way"}
              action={
                filtered ? (
                  <Link href="/brands" className="btn-outline">
                    Clear filters
                  </Link>
                ) : undefined
              }
            >
              {filtered ? "Try another category, shipping choice or name." : "The first brands are joining Glamlink now."}
            </EmptyState>
          )}
        </div>

        <PageLinks page={page} pageCount={pageCount} hrefFor={(n) => `${hrefWith({ page: n })}#${LIST_ID}`} className="mt-12" />
      </section>

      <section aria-labelledby="brands-cta-heading" className="bg-accent py-16 md:py-20">
        <div className="container-glamlink max-w-2xl text-center">
          <h2 id="brands-cta-heading" className="section-title">
            Are you a brand?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Create your free Access profile to show your products, connect with professionals, and be found by
            clients across Glamlink.
          </p>
          <Link href={CREATE_PROFILE_HREF} className="btn-primary mt-8 inline-flex">
            Create Your Free Profile
          </Link>
        </div>
      </section>
    </>
  );
}
