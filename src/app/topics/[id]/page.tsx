import { SITE_URL } from "@/lib/config";
import { Metadata } from "next";
import { Fragment } from "react";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import slugify from "slugify";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Users,
  ShoppingBag,
  Quote,
  Sparkles,
  PlayCircle,
  Store,
  type LucideIcon,
} from "lucide-react";

import {
  resolveTopic,
  getEnrichedJournals,
  getTopicExperts,
  getTopicBrands,
  getTopicVideos,
  getTopicProducts,
  getTopicPodcastGuests,
  getTopicParagraphsList,
  getParagraphText,
  getParagraphJournalHref,
  getTopicImage,
  getTopicImageUrl,
  getTopicSummary,
} from "@/lib/topics";
import BlogCard from "@/components/blogs/BlogCard";
import ArticleContent from "@/components/blogs/ArticleContent";
import JournalShopCard from "@/components/blogs/JournalShopCard";
import ExpertCard from "@/components/topics/ExpertCard";
import PodcastGuestCard from "@/components/topics/PodcastGuestCard";
import ProfileTile from "@/components/content/ProfileTile";
import VideoTile from "@/components/content/VideoTile";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Revalidate periodically rather than refetching on every request (the API's
// `topics` refresh comes sooner when an admin changes what a topic gathers).
export const revalidate = 3600;

/* --------------------------------
   Small layout helpers (page-local)
-------------------------------- */

/** Alternates a subtly-tinted full-bleed background behind a section so long pages read in distinct bands, without breaking the shared max-width container. */
function Band({
  tint = false,
  children,
}: {
  tint?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={tint ? "bg-muted" : "bg-card"}>
      <div className="max-w-[1100px] mx-auto px-5 sm:px-6 py-14 md:py-16">
        {children}
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  action,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-3.5 w-3.5 text-primary" />
          <p className="eyebrow text-secondary">{eyebrow}</p>
        </div>
        <h2 className="text-3xl text-foreground">{title}</h2>
      </div>
      {action && (
        <Link
          href={action.href}
          className="link-glamlink hidden sm:inline-flex items-center gap-1 text-xs flex-shrink-0 mb-1"
        >
          {action.label}
          <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

/* --------------------------------
   Dynamic Metadata
-------------------------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const topic = await resolveTopic(id);

  if (!topic) {
    return { title: "Topic Not Found | Glamlink" };
  }

  const topicUrl = `${SITE_URL}/topics/${topic.slug || topic.id}`;
  const imageUrl = getTopicImageUrl(topic);
  const description = getTopicSummary(topic);

  return {
    title: topic.name,
    description,
    alternates: {
      canonical: topicUrl,
    },
    openGraph: {
      title: `${topic.name} | Glamlink Topics`,
      description,
      url: topicUrl,
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: topic.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${topic.name} | Glamlink Topics`,
      description,
      images: [imageUrl],
    },
  };
}

/* --------------------------------
   Page
-------------------------------- */

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const topic = await resolveTopic(id);

  if (!topic) {
    notFound();
  }

  // Only what the topic itself gathers: admins fill topics by hand or with the
  // AI (Nov 24), and a section with nothing in it isn't shown.
  const [journals, paragraphs] = await Promise.all([
    getEnrichedJournals(topic),
    getTopicParagraphsList(topic.id),
  ]);
  const videos = getTopicVideos(topic);
  const experts = getTopicExperts(topic);
  const brands = getTopicBrands(topic);
  const products = getTopicProducts(topic);
  const podcastGuests = getTopicPodcastGuests(topic);

  const topicUrl = `${SITE_URL}/topics/${topic.slug || topic.id}`;

  // Real, derived tags: the distinct article categories actually tied to this topic
  const relatedCategories = Array.from(
    new Set(
      journals
        .map((j) => j.journal_category?.title?.trim())
        .filter((title): title is string => !!title)
    )
  ).slice(0, 6);

  const addedDate = topic.created_at
    ? new Date(topic.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : null;

  // What the page gathers, for the overview's counts (each only when there is some).
  const counts = [
    { count: journals.length, one: "article", many: "articles" },
    { count: videos.length, one: "video", many: "videos" },
    { count: experts.length, one: "professional", many: "professionals" },
    { count: brands.length, one: "brand", many: "brands" },
    { count: products.length, one: "product", many: "products" },
  ].filter(({ count }) => count > 0);

  // The sections after the overview, in order; their backgrounds alternate.
  const sections = [
    journals.length > 0 && {
      key: "journal",
      body: (
        <>
          <SectionHeader
            icon={BookOpen}
            eyebrow="Journal"
            title={`Explore ${topic.name} Content`}
            action={{ label: "Browse the Journal", href: "/journal" }}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {journals.slice(0, 6).map((article) => {
              const slug =
                article.slug ||
                slugify(article.title || "", { lower: true, strict: true });
              const formattedDate = article.publish_date
                ? new Date(article.publish_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "";
              return (
                <Link
                  key={article.id}
                  href={`/journal/${article.id}/${slug}`}
                  className="block h-full"
                >
                  <BlogCard
                    image={article.cover_image}
                    category={article.journal_category?.title}
                    title={article.title}
                    excerpt={article.short_description}
                    author={article.journal_author?.name}
                    authorImage={article.journal_author?.profile_image}
                    date={formattedDate}
                  />
                </Link>
              );
            })}
          </div>
        </>
      ),
    },
    videos.length > 0 && {
      key: "videos",
      body: (
        <>
          <SectionHeader
            icon={PlayCircle}
            eyebrow="Watch"
            title={`${topic.name} Videos & Episodes`}
            action={{ label: "See all videos", href: "/watch" }}
          />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.slice(0, 6).map((video) => (
              <li key={video.id}>
                <VideoTile video={video} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
              </li>
            ))}
          </ul>
        </>
      ),
    },
    podcastGuests.length > 0 && {
      key: "guests",
      body: (
        <>
          <SectionHeader
            icon={Sparkles}
            eyebrow="Hear From Experts"
            title="Expert Insights"
            action={{ label: "See all episodes", href: "/podcast" }}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {podcastGuests.slice(0, 4).map((guest, index) => (
              <PodcastGuestCard
                key={guest.id}
                name={guest.name}
                role={guest.short_description}
                date={guest.schedule_date}
                index={index}
              />
            ))}
          </div>
        </>
      ),
    },
    experts.length > 0 && {
      key: "professionals",
      body: (
        <>
          <SectionHeader
            icon={Users}
            eyebrow="Professionals"
            title="Find an Expert"
            action={{ label: "View all professionals", href: "/professionals" }}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {experts.slice(0, 9).map((expert) => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </div>
        </>
      ),
    },
    brands.length > 0 && {
      key: "brands",
      body: (
        <>
          <SectionHeader
            icon={Store}
            eyebrow="Brands"
            title={`${topic.name} Brands`}
            action={{ label: "See all brands", href: "/brands" }}
          />
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {brands.slice(0, 8).map((brand) => (
              <li key={brand.id}>
                <ProfileTile profile={brand} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" />
              </li>
            ))}
          </ul>
        </>
      ),
    },
    products.length > 0 && {
      key: "shop",
      body: (
        <>
          <SectionHeader
            icon={ShoppingBag}
            eyebrow="Shop"
            title={`Shop ${topic.name}-Recommended Products`}
            action={{ label: "Shop the Journal", href: "/shop" }}
          />
          <JournalShopCard shop={products} heading="no" />
        </>
      ),
    },
    paragraphs.length > 0 && {
      key: "paragraphs",
      body: (
        <>
          <SectionHeader
            icon={Quote}
            eyebrow="From Our Authors"
            title="Author Insights"
          />
          <div className="max-w-[720px] space-y-5">
            {paragraphs.map((paragraph) => {
              const text = getParagraphText(paragraph);
              const href = getParagraphJournalHref(paragraph);
              const textEl = (
                <>
                  <Quote className="h-4 w-4 text-primary/40 mb-3" />
                  <p
                    className="rich-text text-base leading-relaxed text-muted-foreground font-normal"
                    dangerouslySetInnerHTML={{ __html: text }}
                  />
                </>
              );
              return (
                <div
                  key={paragraph.id}
                  className="group rounded-2xl border border-border bg-card p-6 shadow-soft hover:border-secondary/40 hover:shadow-medium transition-all duration-300"
                >
                  {href ? (
                    <Link href={href} className="block hover:text-secondary transition-colors">
                      {textEl}
                      <span className="flex items-center gap-1 text-xs font-medium text-primary mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Read the full article
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </Link>
                  ) : (
                    textEl
                  )}
                </div>
              );
            })}
          </div>
        </>
      ),
    },
  ].filter((section): section is { key: string; body: React.ReactElement } => Boolean(section));
  // The overview is tinted and the sections alternate after it: the closing call
  // to action needs room above it when the band before it is tinted.
  const endsTinted = sections.length % 2 === 0;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Topics", item: `${SITE_URL}/topics` },
      { "@type": "ListItem", position: 3, name: topic.name, item: topicUrl },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-card">
      <Script
        id="topic-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="flex-1">
        {/* ── BREADCRUMB + HERO (white band) ── */}
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6 pt-28 pb-14 md:pb-16">
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/topics">Topics</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{topic.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* ── HERO: the name and image; the description is the overview's alone ── */}
          <section className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 eyebrow text-secondary mb-5 bg-primary/8 px-3.5 py-1.5 rounded-full">
                <Sparkles className="h-3 w-3" />
                Glamlink Topic
              </div>
              <h1 className="text-[clamp(32px,5vw,48px)] leading-tight tracking-tight text-foreground">
                {topic.name}
              </h1>

              {relatedCategories.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-6">
                  {relatedCategories.map((category) => (
                    <span
                      key={category}
                      className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground px-3 py-1.5 rounded-full border border-border bg-card"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary" />
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="relative rounded-3xl overflow-hidden aspect-[16/9] w-full shadow-primary">
              <Image
                unoptimized={process.env.NODE_ENV === "development"}
                src={getTopicImage(topic)}
                alt={topic.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-overlay/35 via-transparent to-transparent" />
            </div>
          </section>
        </div>

        {/* ── OVERVIEW (tinted band) ── */}
        <Band tint>
          <div className="max-w-[720px]">
            <SectionHeader icon={Sparkles} eyebrow="Overview" title={`Understanding ${topic.name}`} />

            {topic.description ? (
              <div className="-mx-6">
                <ArticleContent content={topic.description} />
              </div>
            ) : (
              <p className="text-base leading-relaxed text-muted-foreground font-normal">
                {topic.name} is one of the beauty and wellness topics Glamlink
                follows across its journal, videos and professional network.
              </p>
            )}

            {(counts.length > 0 || addedDate) && (
              <div className="mt-7 flex flex-wrap gap-3">
                {counts.map(({ count, one, many }) => (
                  <div
                    key={many}
                    className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground"
                  >
                    <span className="text-base text-foreground">{count}</span>
                    {count === 1 ? one : many}
                  </div>
                ))}
                {addedDate && (
                  <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
                    Tracked since{" "}
                    <span className="font-medium text-foreground">{addedDate}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </Band>

        {sections.map((section, index) => (
          <Fragment key={section.key}>
            <Band tint={index % 2 === 1}>{section.body}</Band>
          </Fragment>
        ))}

        {/* ── CTA ── */}
        <div className={`max-w-[1100px] mx-auto px-5 sm:px-6 pb-20 ${endsTinted ? "pt-14 md:pt-16" : ""}`}>
          <section
            className="relative overflow-hidden rounded-3xl bg-accent px-6 py-12 md:px-14 md:py-16 text-center"
          >
            <p className="eyebrow text-secondary mb-3">
              Glamlink
            </p>
            <h2 className="text-2xl md:text-4xl text-foreground">
              Continue Exploring Glamlink
            </h2>
            <p className="text-sm text-muted-foreground font-normal mt-3 max-w-md mx-auto">
              More topics, professionals, and stories are waiting for you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <Link
                href="/topics"
                className="btn-primary"
              >
                Explore Topics
              </Link>
              <Link
                href="/professionals"
                className="btn-outline"
              >
                Discover Professionals
              </Link>
              <Link
                href="/journal"
                className="btn-outline"
              >
                Explore Journal
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
