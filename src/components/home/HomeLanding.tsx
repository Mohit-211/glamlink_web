import type { ReactNode } from "react";
import Form from "next/form";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight, Search, Share2, Sparkles, TrendingUp, Users, type LucideIcon } from "lucide-react";
import PageHero, { HeroPhoto } from "@/components/common/PageHero";
import ArticleTile from "@/components/content/ArticleTile";
import ProductTile from "@/components/content/ProductTile";
import ProfileTile from "@/components/content/ProfileTile";
import TopicTile from "@/components/content/TopicTile";
import VideoTile from "@/components/content/VideoTile";
import HomeCarousel from "@/components/home/HomeCarousel";
import {
  getArticles,
  getFeaturedTopics,
  getHomeSettings,
  getProducts,
  getProfiles,
  getVideos,
} from "@/lib/api/public";
import type { Paged } from "@/lib/api/types";
import { searchHref } from "@/lib/routes";
import { cn } from "@/lib/utils";
import accessWordmark from "../../../public/assets/ACCESS-3.png";
import brandsPhoto from "../../../public/home-hero/brands-home.png";
import heroPhoto from "../../../public/home-hero/homepage-hero.png";
import professionalsPhoto from "../../../public/home-hero/professionals-home.png";

/*
 * Home page (Oct 2026 mockup, with Find a Brand and Brands where the mockup has
 * Inside the Industry). Every row reads the API: topic tiles, products, brands
 * and videos (the featured ones, else the first few), the newest articles, and
 * the images and popular searches admins set in the home settings. A row with
 * nothing to show is left out; until admins set an image, the site's own photo
 * shows.
 */

const DEFAULT_POPULAR_SEARCHES = ["Botox", "Skin Rejuvenation", "Weight Loss", "Facials", "Plastic Surgery"];

const ACCESS_POINTS: { icon: LucideIcon; label: string }[] = [
  { icon: Users, label: "For Beauty + Wellness Professionals" },
  { icon: Share2, label: "Share Your Expertise" },
  { icon: TrendingUp, label: "Grow Your Presence" },
  { icon: Sparkles, label: "Be Part of What's Next" },
];

/* ── Building blocks ─────────────────────────────────────────── */

type SectionLink = { label: string; href: string };

/** A section's "Explore all …" link, in small capitals as in the mockup. */
function MoreLink({ label, href }: SectionLink) {
  return (
    <Link href={href} className="eyebrow inline-flex shrink-0 items-center gap-1.5 transition-colors hover:text-secondary">
      {label}
      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
    </Link>
  );
}

/** A section with its title row above the content. `band` sets it on the grey band. */
function HomeSection({
  id,
  title,
  subtitle,
  action,
  band = false,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  action?: SectionLink;
  band?: boolean;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className={cn("py-10 md:py-14", band && "bg-muted/60")}>
      <div className="container-glamlink">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:mb-8">
          <div className="min-w-0">
            <h2 id={`${id}-heading`} className="section-title">
              {title}
            </h2>
            {subtitle && <p className="mt-2 text-sm text-muted-foreground md:text-base">{subtitle}</p>}
          </div>
          {action && <MoreLink {...action} />}
        </div>
        {children}
      </div>
    </section>
  );
}

/** Shop Products and Brands: from lg up, the title sits beside the row, with the link above the row. */
function ShelfSection({
  id,
  title,
  subtitle,
  action,
  band = false,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  action: SectionLink;
  band?: boolean;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className={cn("py-10 md:py-14", band && "bg-muted/60")}>
      <div className="container-glamlink grid gap-x-12 gap-y-4 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)]">
        <div className="lg:pt-10">
          <h2 id={`${id}-heading`} className="section-title">
            {title}
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground md:text-base">{subtitle}</p>
        </div>
        <div className="min-w-0">
          <div className="mb-4 flex justify-end">
            <MoreLink {...action} />
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

/** Card widths in a carousel: the next card peeks in on phones; five or four side by side from lg up. */
const SLIDE = {
  5: "w-[45%] shrink-0 snap-start sm:w-[30%] lg:w-[calc((100%-4rem)/5)]",
  4: "w-[75%] shrink-0 snap-start sm:w-[45%] lg:w-[calc((100%-3rem)/4)]",
};

/* ── Sections ────────────────────────────────────────────────── */

function Hero({ image, popularSearches }: { image: string | StaticImageData; popularSearches: string[] }) {
  return (
    <PageHero
      id="home-hero"
      eyebrow="Discover. Learn. Shop. Connect."
      title={
        <>
          Beauty Lives <span className="text-primary">Here</span>
        </>
      }
      subtitle="Real people. Real expertise. A more beautiful you."
      image={image}
    >
      <Form action="/search" role="search" className="relative max-w-xl">
        <label htmlFor="home-search" className="sr-only">
          Search Glamlink
        </label>
        <input
          id="home-search"
          name="q"
          type="search"
          required
          minLength={2}
          maxLength={100}
          placeholder="Search treatments, professionals, products and more..."
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

      {popularSearches.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-semibold">Popular Searches:</span>
          {popularSearches.map((term) => (
            <Link key={term} href={searchHref(term)} className="chip rounded-full px-3.5 py-1.5 text-xs">
              {term}
            </Link>
          ))}
        </div>
      )}
    </PageHero>
  );
}

/**
 * Find a Professional and Find a Brand: the hero's look for a section, its photo
 * filling the band behind the text from lg up. On phones the text comes first and
 * the photo under it.
 */
function FeatureBand({
  id,
  image,
  eyebrow,
  title,
  text,
  action,
}: {
  id: string;
  image: string | StaticImageData;
  eyebrow: string;
  title: string;
  text: string;
  action: SectionLink;
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className="bg-tint">
      <div className="grid">
        <div className="container-glamlink relative z-10 pb-6 pt-10 md:pt-14 lg:col-start-1 lg:row-start-1 lg:self-center lg:py-16">
          <div className="max-w-md">
            <p className="hero-eyebrow">{eyebrow}</p>
            <h2 id={`${id}-heading`} className="section-title mt-4">
              {title}
            </h2>
            <p className="mt-3 text-muted-foreground md:text-lg">{text}</p>
            <Link href={action.href} className="btn-primary mt-6">
              {action.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="relative mx-5 mb-10 aspect-video overflow-hidden rounded-3xl sm:mx-6 md:mb-14 lg:col-start-1 lg:row-start-1 lg:m-0 lg:aspect-5/2 lg:max-h-144 lg:rounded-none">
          <HeroPhoto src={image} position="object-[right_top]" />
        </div>
      </div>
    </section>
  );
}

function AccessBand() {
  return (
    <section aria-labelledby="access-heading" className="bg-muted/60 py-10 md:py-14">
      <div className="container-glamlink grid items-center gap-8 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12">
        <h2 id="access-heading">
          <Image src={accessWordmark} alt="Access by Glamlink" className="h-auto w-48 md:w-60" />
        </h2>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em]">A smarter way to connect</p>
          <p className="mt-2 text-muted-foreground">Digital profiles. Instant sharing. Lasting impressions.</p>
          <Link href="/access" className="btn-primary mt-6">
            Learn more
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 md:col-span-2 lg:col-span-1 lg:grid-cols-1 lg:border-l lg:border-border lg:pl-12">
          {ACCESS_POINTS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3">
              <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Page ────────────────────────────────────────────────────── */

/** The rows admins featured, in their order; while they have featured none, the first ones anyway. */
async function featuredOr<T>(featured: Promise<Paged<T>>, others: () => Promise<Paged<T>>) {
  const rows = await featured;
  return rows.rows.length > 0 ? rows : others();
}

export default async function HomeLanding() {
  const [settings, topics, products, brands, articles, videos] = await Promise.all([
    getHomeSettings(),
    getFeaturedTopics(),
    featuredOr(getProducts({ featured: true, limit: 10 }), () => getProducts({ limit: 10 })),
    featuredOr(getProfiles({ type: "brand", featured: true, limit: 10 }), () => getProfiles({ type: "brand", limit: 10 })),
    getArticles({ limit: 3 }),
    featuredOr(getVideos({ featured: true, limit: 8 }), () => getVideos({ limit: 8 })),
  ]);

  const popularSearches = settings?.popular_searches?.length ? settings.popular_searches : DEFAULT_POPULAR_SEARCHES;
  const tiles = topics.slice(0, 6);

  return (
    <div>
      <Hero image={settings?.hero_image || heroPhoto} popularSearches={popularSearches} />

      {tiles.length > 0 && (
        <HomeSection
          id="explore"
          title="Explore Beauty + Wellness"
          action={{ label: "Explore all categories", href: "/topics" }}
        >
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {tiles.map((topic, i) => (
              <li key={topic.id}>
                <TopicTile topic={topic} priority={i < 3} />
              </li>
            ))}
          </ul>
        </HomeSection>
      )}

      <FeatureBand
        id="find-pro"
        image={settings?.find_professional_image || professionalsPhoto}
        eyebrow="Real experts. Real results."
        title="Find a Professional"
        text="Search trusted beauty + wellness professionals across the U.S."
        action={{ label: "Search Directory", href: "/directory" }}
      />

      {products.rows.length > 0 && (
        <ShelfSection
          id="shop"
          title="Shop Products"
          subtitle="Discover professional skincare, wellness and beauty products from brands you trust."
          action={{ label: "Shop all products", href: "/shop" }}
        >
          <HomeCarousel label="Products">
            {products.rows.map((product) => (
              <li key={product.id} className={SLIDE[5]}>
                <ProductTile product={product} sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 45vw" />
              </li>
            ))}
          </HomeCarousel>
        </ShelfSection>
      )}

      <FeatureBand
        id="find-brand"
        image={brandsPhoto}
        eyebrow="Innovative brands. Advanced technology."
        title="Find a Brand"
        text="Discover the brands shaping beauty + wellness, from professional skincare to the devices experts trust."
        action={{ label: "Browse Brands", href: "/directory" }}
      />

      {brands.rows.length > 0 && (
        <ShelfSection
          id="brands"
          title="Featured Brands"
          subtitle="Innovative brands. Advanced technology. Education. Opportunities."
          action={{ label: "View all brands", href: "/directory" }}
        >
          <HomeCarousel label="Brands">
            {brands.rows.map((brand) => (
              <li key={brand.id} className={SLIDE[5]}>
                <ProfileTile profile={brand} sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 45vw" />
              </li>
            ))}
          </HomeCarousel>
        </ShelfSection>
      )}

      {articles.rows.length > 0 && (
        <HomeSection
          id="latest"
          title="Latest from Glamlink"
          subtitle="Expert insights. Real stories. The latest in beauty + wellness."
          action={{ label: "Explore the journal", href: "/journal" }}
        >
          <ul className="grid gap-5 md:grid-cols-3">
            {articles.rows.map((article) => (
              <li key={article.id}>
                <ArticleTile article={article} layout="row" />
              </li>
            ))}
          </ul>
        </HomeSection>
      )}

      {videos.rows.length > 0 && (
        <HomeSection
          id="watch"
          title="Watch + Learn"
          subtitle="Podcasts. Expert Takes. Educational content."
          action={{ label: "Explore all episodes", href: "/podcast" }}
        >
          <HomeCarousel label="Videos">
            {videos.rows.map((video) => (
              <li key={video.id} className={SLIDE[4]}>
                <VideoTile video={video} layout="overlay" />
              </li>
            ))}
          </HomeCarousel>
        </HomeSection>
      )}

      <AccessBand />
    </div>
  );
}
