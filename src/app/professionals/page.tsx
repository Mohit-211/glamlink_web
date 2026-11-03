import type { Metadata } from "next";
import Link from "next/link";
import { Search, UsersRound } from "lucide-react";
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
import professionalsPhoto from "../../../public/home-hero/professionals-home.png";

/* Every Glamlink professional with a page (the owner, Nov 3: the directory's "Explore all professionals"), with
   their specialty, place and an order to pick. Brands have their own page (/brands). */

const PER_PAGE = 24;
const LIST_ID = "professionals-list";
const description =
  "Browse beauty and wellness professionals on Glamlink: estheticians, injectors, stylists and more, each with their own page.";

const SORTS: FilterOption[] = [
  { value: "recommended", label: "Recommended" },
  { value: "nearest", label: "Nearest to me" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name (A–Z)" },
];

export const metadata: Metadata = {
  title: "Beauty + Wellness Professionals",
  description,
  alternates: { canonical: "/professionals" },
  openGraph: {
    title: "Beauty + Wellness Professionals on Glamlink",
    description,
    url: `${SITE_URL}/professionals`,
  },
};

/** The visitor's point from the URL (sort=nearest), when it is one. */
function pointFrom(params: SearchParams) {
  const lat = Number(param(params.lat));
  const lng = Number(param(params.lng));
  if (!param(params.lat) || !param(params.lng) || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { lat, lng };
}

export default async function ProfessionalsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = pageParam(params.page);
  const search = param(params.search);
  const specialty = param(params.specialty);
  const state = param(params.state);
  const city = state ? param(params.city) : "";
  const point = pointFrom(params);
  const asked = param(params.sort);
  // Nearest needs the visitor's point; without it (no JavaScript, an old link) the list keeps its usual order
  const sort = (SORTS.some((s) => s.value === asked) && (asked !== "nearest" || point) ? asked : "recommended") as ProfileSort;
  const near = sort === "nearest" && point ? point : null;

  const [professionals, filters] = await Promise.all([
    getProfiles({
      type: "individual",
      page,
      limit: PER_PAGE,
      search: search || undefined,
      specialty: specialty || undefined,
      state: state || undefined,
      city: city || undefined,
      sort,
      ...(near ?? {}),
    }),
    getDirectoryFilters("individual"),
  ]);

  const kept = {
    search,
    specialty,
    state,
    city,
    sort: sort === "recommended" ? "" : sort,
    lat: near ? String(near.lat) : "",
    lng: near ? String(near.lng) : "",
  };
  const hrefFor = (n: number) => `${listHref("/professionals", { ...kept, page: n })}#${LIST_ID}`;
  const filtered = Boolean(search || specialty || state);
  const pageCount = pageCountFor(professionals.count, PER_PAGE);

  const states = filters?.states ?? [];
  // The state as the URL has it: its code or its name
  const stateEntry = state
    ? states.find((s) => s.code?.toLowerCase() === state.toLowerCase() || s.name.toLowerCase() === state.toLowerCase())
    : undefined;
  const placeLabel = city ? `${city}, ${stateEntry?.code ?? state}` : (stateEntry?.name ?? state);
  const summary = [
    professionals.count === 1 ? "1 professional" : `${professionals.count} professionals`,
    specialty,
    placeLabel && `in ${placeLabel}`,
    search && `matching “${search}”`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <PageHero
        id="professionals-hero"
        eyebrow="Trusted experts. Real results."
        title="Beauty + Wellness Professionals"
        subtitle={description}
        image={professionalsPhoto}
        imageAlt=""
      >
        <form action="/professionals" role="search" className="max-w-xl">
          {Object.entries(kept).map(([name, value]) =>
            name !== "search" && value ? <input key={name} type="hidden" name={name} value={value} /> : null
          )}
          <label htmlFor="professionals-search" className="sr-only">
            Search professionals
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="professionals-search"
              name="search"
              type="search"
              defaultValue={search}
              maxLength={100}
              placeholder="Search by name, specialty or city"
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
        aria-labelledby="professionals-list-heading"
        className="container-glamlink scroll-mt-24 py-12 md:py-16"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <p className="eyebrow">Explore</p>
            <h2 id="professionals-list-heading" className="mt-2 text-2xl tracking-tight md:text-3xl">
              {filtered ? "Professionals" : "All professionals"}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {summary}
            {filtered && (
              <>
                {" · "}
                <Link href="/professionals" className="link-glamlink">
                  Clear all
                </Link>
              </>
            )}
          </p>
        </div>

        <ListFilters
          key={JSON.stringify(kept)}
          action="/professionals"
          keep={{ search }}
          point={near ? { lat: String(near.lat), lng: String(near.lng) } : null}
          fields={[
            {
              name: "specialty",
              label: "Specialty",
              allLabel: "All specialties",
              value: specialty,
              options: (filters?.specialties ?? []).map((s) => ({ value: s.name, label: s.name, count: s.count })),
            },
            {
              name: "state",
              label: "State",
              allLabel: "All states",
              value: stateEntry ? (stateEntry.code ?? stateEntry.name) : state,
              options: states.map((s) => ({ value: s.code ?? s.name, label: s.name, count: s.count })),
            },
            {
              name: "city",
              label: "City",
              allLabel: state ? "All cities" : "Pick a state first",
              value: city,
              options: [],
              dependsOn: {
                name: "state",
                options: Object.fromEntries(
                  states.map((s) => [
                    s.code ?? s.name,
                    s.cities.map((c) => ({ value: c.name, label: c.name, count: c.count })),
                  ])
                ),
              },
            },
          ]}
          sort={{ value: sort, options: SORTS }}
        />

        <div className="mt-8">
          {professionals.rows.length > 0 ? (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {professionals.rows.map((professional) => (
                <li key={professional.id}>
                  <ProfileTile
                    profile={professional}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={UsersRound}
              title={filtered ? "No professionals match" : "Professionals are joining Glamlink now"}
              action={
                filtered ? (
                  <Link href="/professionals" className="btn-outline">
                    Clear filters
                  </Link>
                ) : undefined
              }
            >
              {filtered ? "Try another specialty, place or search." : "Please check back soon."}
            </EmptyState>
          )}
        </div>

        <PageLinks page={page} pageCount={pageCount} hrefFor={hrefFor} className="mt-12" />
      </section>

      <section aria-labelledby="professionals-cta-heading" className="bg-accent py-16 md:py-20">
        <div className="container-glamlink max-w-2xl text-center">
          <h2 id="professionals-cta-heading" className="section-title">
            Are you a beauty or wellness professional?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Create your free Access profile to get your own Glamlink page, show your work and be found by clients
            near you.
          </p>
          <Link href={CREATE_PROFILE_HREF} className="btn-primary mt-8 inline-flex">
            Create Your Free Profile
          </Link>
        </div>
      </section>
    </>
  );
}
