import { Metadata } from "next";
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
  Layers,
  type LucideIcon,
} from "lucide-react";

import {
  resolveTopic,
  getEnrichedJournals,
  getTopicExperts,
  getTopicParagraphsList,
  getParagraphText,
  getParagraphJournalHref,
  getTopicImage,
  getTopicImageUrl,
  getTopicSummary,
} from "@/lib/topics";
import {
  FALLBACK_JOURNAL_ARTICLES,
  FALLBACK_PRODUCTS,
  FALLBACK_PODCAST_GUESTS,
  FALLBACK_PROFESSIONALS,
  FALLBACK_TREATMENT_OPTIONS,
  FallbackProduct,
  FallbackPodcastGuest,
} from "@/data/topicFallbackContent";
import BlogCard from "@/components/blogs/BlogCard";
import ArticleContent from "@/components/blogs/ArticleContent";
import JournalShopCard from "@/components/blogs/JournalShopCard";
import ExpertCard from "@/components/topics/ExpertCard";
import PodcastGuestCard from "@/components/topics/PodcastGuestCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Revalidate periodically rather than refetching on every request.
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
    <div className={tint ? "bg-[#fafafa]" : "bg-white"}>
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
          <Icon className="h-3.5 w-3.5 text-[#23AEB8]" />
          <p className="text-[10px] tracking-[.15em] uppercase text-gray-400">
            {eyebrow}
          </p>
        </div>
        <h2 className="font-serif text-3xl text-gray-900">{title}</h2>
      </div>
      {action && (
        <Link
          href={action.href}
          className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-[#23AEB8] hover:underline flex-shrink-0 mb-1"
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

  const topicUrl = `https://glamlink.net/topics/${topic.slug || topic.id}`;
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

  const [realJournals, paragraphs] = await Promise.all([
    getEnrichedJournals(topic),
    getTopicParagraphsList(topic.id),
  ]);
  console.log(topic,"topic")
  const realExperts = getTopicExperts(topic);
console.log(realExperts,"realExperts")
  // Each section prefers the topic's own real relation and only falls back
  // to a fixed set of genuine Glamlink content when that relation is empty
  // (the Topics feature is new, so most topics aren't curated yet).
  const journals = realJournals.length > 0 ? realJournals : FALLBACK_JOURNAL_ARTICLES;
  const usingFallbackJournals = realJournals.length === 0;

  const experts = realExperts.length > 0 ? realExperts : FALLBACK_PROFESSIONALS;

  const shopProducts: FallbackProduct[] =
    Array.isArray(topic.shops) && topic.shops.length > 0
      ? (topic.shops as FallbackProduct[])
      : FALLBACK_PRODUCTS;

  const podcastGuests: FallbackPodcastGuest[] =
    Array.isArray(topic.podcasts) && topic.podcasts.length > 0
      ? (topic.podcasts as FallbackPodcastGuest[])
      : FALLBACK_PODCAST_GUESTS;

  const topicUrl = `https://glamlink.net/topics/${topic.slug || topic.id}`;

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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://glamlink.net" },
      { "@type": "ListItem", position: 2, name: "Topics", item: "https://glamlink.net/topics" },
      { "@type": "ListItem", position: 3, name: topic.name, item: topicUrl },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
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

          {/* ── HERO ── */}
          <section className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] tracking-[.2em] uppercase text-[#23AEB8] font-medium mb-5 bg-[#23AEB8]/8 px-3.5 py-1.5 rounded-full">
                <Sparkles className="h-3 w-3" />
                Glamlink Topic
              </div>
              <h1 className="font-serif text-[clamp(32px,5vw,48px)] leading-[1.08] tracking-tight text-gray-900">
                {topic.name}
              </h1>
              <p className="mt-5 text-[15px] leading-relaxed text-gray-500 font-light max-w-md">
                {getTopicSummary(topic)}
              </p>

              {relatedCategories.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-6">
                  {relatedCategories.map((category) => (
                    <span
                      key={category}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-600 px-3 py-1.5 rounded-full border border-gray-200 bg-white"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#23AEB8]" />
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="relative rounded-[1.75rem] overflow-hidden aspect-[16/9] w-full shadow-[0_20px_50px_-20px_rgba(35,174,184,0.4)]">
              <Image
                unoptimized={process.env.NODE_ENV === "development"}
                src={getTopicImage(topic)}
                alt={topic.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
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
              <p className="text-[15px] leading-[1.8] text-gray-500 font-light">
                {topic.name} is one of the beauty and wellness topics Glamlink
                tracks across our journal and professional network. Explore
                the articles and specialists below to learn more, or search
                our directory to find someone who can help in person.
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-[13px] text-gray-600">
                <span className="font-serif text-base text-gray-900">
                  {journals.length}
                </span>
                related {journals.length === 1 ? "article" : "articles"}
              </div>
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-[13px] text-gray-600">
                <span className="font-serif text-base text-gray-900">
                  {experts.length}
                </span>
                {experts.length === 1 ? "professional" : "professionals"} found
              </div>
              {addedDate && (
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-[13px] text-gray-600">
                  Tracked since{" "}
                  <span className="font-medium text-gray-900">{addedDate}</span>
                </div>
              )}
            </div>
          </div>
        </Band>

        {/* ── EXPERT INSIGHTS (podcast guests, white band) ── */}
        {podcastGuests.length > 0 && (
          <Band>
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
          </Band>
        )}

        {/* ── RELATED CONTENT (tinted band) ── */}
        <Band tint>
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
                    date={formattedDate}
                  />
                </Link>
              );
            })}
          </div>
          {usingFallbackJournals && (
            <p className="text-xs text-gray-400 mt-6">
              We&apos;re still curating articles tagged specifically to{" "}
              {topic.name} — here are some related reads in the meantime.
            </p>
          )}
        </Band>

        {/* ── EXPLORE TREATMENT OPTIONS (white band) ── */}
        <Band>
          <SectionHeader
            icon={Layers}
            eyebrow="Treatment Options"
            title={`Explore ${topic.name} Treatment Options`}
          />
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-5">
            {FALLBACK_TREATMENT_OPTIONS.map((option) => (
              <div key={option.id} className="flex flex-col items-center gap-2.5 text-center">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src={option.image}
                    alt={option.label}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-[12px] font-medium text-gray-700 leading-snug">
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        </Band>

        {/* ── FIND AN EXPERT (professionals, tinted band) ── */}
        {experts.length > 0 && (
          <Band tint>
            <SectionHeader
              icon={Users}
              eyebrow="Professionals"
              title="Find an Expert"
              action={{ label: "View all professionals", href: "/journal/directory" }}
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {experts.map((expert) => (
                <ExpertCard key={expert.id} expert={expert} />
              ))}
            </div>
          </Band>
        )}

        {/* ── SHOP RECOMMENDED PRODUCTS (white band) ── */}
        {shopProducts.length > 0 && (
          <Band>
            <SectionHeader
              icon={ShoppingBag}
              eyebrow="Shop"
              title={`Shop ${topic.name}-Recommended Products`}
              action={{ label: "Shop the Journal", href: "/journal/shop" }}
            />
            <JournalShopCard shop={shopProducts} heading="no" />
          </Band>
        )}

        {/* ── AUTHOR INSIGHTS (paragraphs, tinted band) ── */}
        {paragraphs.length > 0 && (
          <Band tint>
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
                    <Quote className="h-4 w-4 text-[#23AEB8]/40 mb-3" />
                    <p
                      className="text-[15px] leading-[1.8] text-gray-600 font-light"
                      dangerouslySetInnerHTML={{ __html: text }}
                    />
                  </>
                );
                return (
                  <div
                    key={paragraph.id}
                    className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:border-[#23AEB8]/40 hover:shadow-md transition-all duration-300"
                  >
                    {href ? (
                      <Link href={href} className="block hover:text-[#23AEB8] transition-colors">
                        {textEl}
                        <span className="flex items-center gap-1 text-[11px] font-medium text-[#23AEB8] mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
          </Band>
        )}

        {/* ── CTA ── */}
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6 pb-20">
          <section
            className="relative overflow-hidden rounded-[1.75rem] px-6 py-12 md:px-14 md:py-16 text-center"
            style={{
              background:
                "radial-gradient(circle at 15% 20%, rgba(35,174,184,0.16), transparent 55%), radial-gradient(circle at 85% 80%, rgba(35,174,184,0.12), transparent 55%), #0b1416",
            }}
          >
            <p className="text-[10px] tracking-[.2em] uppercase text-[#4fd7e0] font-medium mb-3">
              Glamlink
            </p>
            <h2 className="font-serif text-2xl md:text-4xl text-white">
              Continue Exploring Glamlink
            </h2>
            <p className="text-sm text-white/60 font-light mt-3 max-w-md mx-auto">
              More topics, professionals, and stories are waiting for you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <Link
                href="/topics"
                className="inline-flex items-center justify-center rounded-full bg-[#23AEB8] text-white text-sm font-medium px-6 py-2.5 hover:bg-[#1d9aa3] transition-colors duration-200"
              >
                Explore Topics
              </Link>
              <Link
                href="/journal/directory"
                className="inline-flex items-center justify-center rounded-full border border-white/20 text-white text-sm font-medium px-6 py-2.5 hover:border-white/40 hover:bg-white/5 transition-colors duration-200"
              >
                Discover Professionals
              </Link>
              <Link
                href="/journal"
                className="inline-flex items-center justify-center rounded-full border border-white/20 text-white text-sm font-medium px-6 py-2.5 hover:border-white/40 hover:bg-white/5 transition-colors duration-200"
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
