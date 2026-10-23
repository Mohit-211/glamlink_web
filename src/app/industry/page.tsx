import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { Building2, Search } from "lucide-react";
import EmptyState from "@/components/content/EmptyState";
import PageLinks from "@/components/content/PageLinks";
import ProfileTile from "@/components/content/ProfileTile";
import SectionHeading from "@/components/content/SectionHeading";
import { getProfiles } from "@/lib/api/public";
import { SITE_URL } from "@/lib/config";
import { listHref, pageCountFor, pageParam, param, type SearchParams } from "@/lib/searchParams";

const PER_PAGE = 20;

const description =
  "Find a brand: the companies shaping beauty + wellness, from skincare and devices to the tools professionals use every day.";

export const metadata: Metadata = {
  title: "Inside the Industry: Find a Brand",
  description,
  alternates: { canonical: "/industry" },
  openGraph: { title: "Inside the Industry | Glamlink", description, url: `${SITE_URL}/industry` },
};

export default async function IndustryPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = pageParam(params.page);
  const search = param(params.search);
  const browsing = !search && page === 1;

  const [featured, brands] = await Promise.all([
    browsing ? getProfiles({ type: "brand", featured: true, limit: 5 }) : null,
    getProfiles({ type: "brand", search, page, limit: PER_PAGE }),
  ]);
  const pageCount = pageCountFor(brands.count, PER_PAGE);

  return (
    <div className="pb-20">
      <section aria-labelledby="industry-heading" className="hero-glamlink pb-10 md:pb-14">
        <div className="container-glamlink max-w-3xl text-center">
          <p className="eyebrow">Inside the Industry</p>
          <h1 id="industry-heading" className="hero-title mt-4">
            Find a Brand
          </h1>
          <p className="hero-subtitle mt-5">Innovative brands. Advanced technology. Education. Opportunities.</p>

          <Form action="/industry" role="search" className="relative mx-auto mt-8 max-w-xl">
            <label htmlFor="industry-search" className="sr-only">
              Search brands
            </label>
            <input
              id="industry-search"
              name="search"
              type="search"
              defaultValue={search}
              maxLength={100}
              placeholder="Search brands by name or what they make"
              className="input-glamlink h-14 rounded-full pl-6 pr-16 shadow-soft"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-secondary"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
          </Form>
        </div>
      </section>

      <div className="container-glamlink space-y-14 md:space-y-20">
        {featured && featured.rows.length > 0 && (
          <section aria-labelledby="featured-brands-heading">
            <SectionHeading id="featured-brands-heading" title="Featured brands" />
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5">
              {featured.rows.map((brand) => (
                <li key={brand.id}>
                  <ProfileTile profile={brand} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="all-brands-heading">
          <SectionHeading
            id="all-brands-heading"
            title={search ? `Brands matching “${search}”` : "All brands"}
            subtitle={brands.count === 1 ? "1 brand" : `${brands.count} brands`}
          />
          {brands.rows.length === 0 ? (
            <EmptyState
              icon={Building2}
              title={search ? "No brands match" : "Brands are on their way"}
              action={
                search ? (
                  <Link href="/industry" className="btn-outline">
                    See all brands
                  </Link>
                ) : undefined
              }
            >
              {search ? "Try another name or product." : "The industry directory opens soon. Please check back."}
            </EmptyState>
          ) : (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5">
              {brands.rows.map((brand) => (
                <li key={brand.id}>
                  <ProfileTile profile={brand} />
                </li>
              ))}
            </ul>
          )}
          <PageLinks
            className="mt-12"
            page={page}
            pageCount={pageCount}
            hrefFor={(p) => listHref("/industry", { search, page: p })}
          />
        </section>
      </div>
    </div>
  );
}
