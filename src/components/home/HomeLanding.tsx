import type { ReactNode } from "react";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, Share2, Sparkles, TrendingUp, Users, type LucideIcon } from "lucide-react";
import ApiImage from "@/components/common/ApiImage";
import ArticleTile from "@/components/content/ArticleTile";
import ProductTile from "@/components/content/ProductTile";
import ProfileTile from "@/components/content/ProfileTile";
import SectionHeading from "@/components/content/SectionHeading";
import TopicTile from "@/components/content/TopicTile";
import VideoTile from "@/components/content/VideoTile";
import {
  getArticles,
  getFeaturedTopics,
  getHomeSettings,
  getProducts,
  getProfiles,
  getVideos,
} from "@/lib/api/public";
import { searchHref } from "@/lib/routes";
import { cn } from "@/lib/utils";
import accessWordmark from "../../../public/assets/ACCESS-3.png";

/*
 * Home page (Oct 2026 mockup). Every row reads the API: topic tiles, featured
 * products, brands and videos, the newest articles, and the images and popular
 * searches admins set in the home settings. A row with nothing to show is left
 * out; an image admins have not set yet shows a quiet panel instead.
 */

const DEFAULT_POPULAR_SEARCHES = ["Botox", "Skin Rejuvenation", "Weight Loss", "Facials", "Plastic Surgery"];

const ACCESS_POINTS: { icon: LucideIcon; label: string }[] = [
  { icon: Users, label: "For Beauty + Wellness Professionals" },
  { icon: Share2, label: "Share Your Expertise" },
  { icon: TrendingUp, label: "Grow Your Presence" },
  { icon: Sparkles, label: "Be Part of What's Next" },
];

/* ── Building blocks ─────────────────────────────────────────── */

function HomeSection({
  id,
  title,
  subtitle,
  action,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className="py-10 md:py-14">
      <div className="container-glamlink">
        <SectionHeading id={`${id}-heading`} title={title} subtitle={subtitle} action={action} />
        {children}
      </div>
    </section>
  );
}

/** Swipeable row on phones and tablets, a plain grid from lg up. */
function CardRow({ label, columns, children }: { label: string; columns: 4 | 5; children: ReactNode }) {
  return (
    <ul
      aria-label={label}
      className={cn(
        // Bleeds to the screen edge; scroll-padding keeps the first card on the page gutter
        "no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2",
        "sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:overflow-visible lg:px-0 lg:pb-0",
        columns === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"
      )}
    >
      {children}
    </ul>
  );
}

const ROW_ITEM = "w-[45%] shrink-0 snap-start sm:w-[30%] lg:w-auto";

/** A photo with a short line over it, or a tinted panel with the line while there is no photo. */
function PhotoPanel({
  src,
  tagline,
  sizes,
  priority = false,
  className,
}: {
  src: string | null | undefined;
  tagline: ReactNode;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) {
    return (
      <div className={cn("flex items-end justify-end bg-accent p-6 md:p-8", className)}>
        <p className="text-right text-sm font-semibold uppercase leading-relaxed tracking-[0.2em] text-secondary md:text-base">
          {tagline}
        </p>
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <ApiImage src={src} alt="" fill priority={priority} sizes={sizes} className="object-cover" />
      <div className="absolute inset-0 bg-linear-to-t from-overlay/50 via-overlay/5 to-transparent" />
      <p className="absolute bottom-6 right-6 text-right text-xs font-semibold uppercase leading-relaxed tracking-[0.2em] text-overlay-foreground md:bottom-8 md:right-8 md:text-sm">
        {tagline}
      </p>
    </div>
  );
}

/* ── Sections ────────────────────────────────────────────────── */

function Hero({ image, popularSearches }: { image: string | null | undefined; popularSearches: string[] }) {
  return (
    <section aria-labelledby="home-hero-heading" className="pt-20 md:pt-24">
      <div className="container-glamlink grid items-center gap-8 py-8 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:py-12">
        <div>
          <h1 id="home-hero-heading" className="hero-title">
            Beauty Lives Here
          </h1>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground md:text-base">
            Discover. Learn. Shop. Connect.
          </p>

          <Form action="/search" role="search" className="relative mt-8 max-w-xl">
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
        </div>

        <PhotoPanel
          src={image}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="aspect-4/3 rounded-3xl lg:aspect-auto lg:h-130"
          tagline={
            <>
              Real people.
              <br />
              Real expertise.
              <br />A more beautiful you.
            </>
          }
        />
      </div>
    </section>
  );
}

function FindProfessional({ image }: { image: string | null | undefined }) {
  return (
    <section aria-labelledby="find-pro-heading" className="py-10 md:py-14">
      <div className="container-glamlink">
        <div className="grid overflow-hidden rounded-3xl border border-border bg-card lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col items-start justify-center gap-4 p-8 md:p-12">
            <h2 id="find-pro-heading" className="section-title">
              Find a Professional
            </h2>
            <p className="max-w-sm text-muted-foreground">
              Search trusted beauty + wellness professionals across the U.S.
            </p>
            <Link href="/directory" className="btn-primary mt-2">
              Search Directory
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <PhotoPanel
            src={image}
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="min-h-60 lg:min-h-80"
            tagline={
              <>
                Real experts.
                <br />
                Real results.
              </>
            }
          />
        </div>
      </div>
    </section>
  );
}

function AccessBand() {
  return (
    <section aria-labelledby="access-heading" className="py-10 md:py-14">
      <div className="container-glamlink">
        <div className="grid items-center gap-10 rounded-3xl border border-border bg-accent/60 p-8 md:p-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 id="access-heading">
              <Image src={accessWordmark} alt="Access by Glamlink" className="h-auto w-48 md:w-60" />
            </h2>
            <p className="mt-6 text-xl font-semibold md:text-2xl">A smarter way to connect</p>
            <p className="mt-2 text-muted-foreground">Digital profiles. Instant sharing. Lasting impressions.</p>
            <Link href="/access" className="btn-primary mt-8">
              Learn more
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {ACCESS_POINTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-soft">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-secondary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold md:text-base">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ── Page ────────────────────────────────────────────────────── */

async function getWatchRow() {
  const featured = await getVideos({ featured: true, limit: 4 });
  return featured.rows.length > 0 ? featured : getVideos({ limit: 4 });
}

export default async function HomeLanding() {
  const [settings, topics, products, brands, articles, videos] = await Promise.all([
    getHomeSettings(),
    getFeaturedTopics(),
    getProducts({ featured: true, limit: 5 }),
    getProfiles({ type: "brand", featured: true, limit: 5 }),
    getArticles({ limit: 3 }),
    getWatchRow(),
  ]);

  const popularSearches = settings?.popular_searches?.length ? settings.popular_searches : DEFAULT_POPULAR_SEARCHES;
  const tiles = topics.slice(0, 6);

  return (
    <div className="pb-8">
      <Hero image={settings?.hero_image} popularSearches={popularSearches} />

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

      <FindProfessional image={settings?.find_professional_image} />

      {products.rows.length > 0 && (
        <HomeSection
          id="shop"
          title="Shop Products"
          subtitle="Discover professional skincare, wellness and beauty products from brands you trust."
          action={{ label: "Shop all products", href: "/shop" }}
        >
          <CardRow label="Featured products" columns={5}>
            {products.rows.map((product) => (
              <li key={product.id} className={ROW_ITEM}>
                <ProductTile product={product} sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 45vw" />
              </li>
            ))}
          </CardRow>
        </HomeSection>
      )}

      {brands.rows.length > 0 && (
        <HomeSection
          id="industry"
          title="Inside the Industry"
          subtitle="Innovative brands. Advanced technology. Education. Opportunities."
          action={{ label: "View all companies", href: "/industry" }}
        >
          <CardRow label="Featured brands" columns={5}>
            {brands.rows.map((brand) => (
              <li key={brand.id} className={ROW_ITEM}>
                <ProfileTile profile={brand} />
              </li>
            ))}
          </CardRow>
        </HomeSection>
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
          subtitle="Podcasts, Expert Takes, Educational content."
          action={{ label: "Explore all episodes", href: "/watch" }}
        >
          <CardRow label="Videos" columns={4}>
            {videos.rows.map((video) => (
              <li key={video.id} className={cn(ROW_ITEM, "w-[70%] sm:w-[45%]")}>
                <VideoTile video={video} />
              </li>
            ))}
          </CardRow>
        </HomeSection>
      )}

      <AccessBand />
    </div>
  );
}
