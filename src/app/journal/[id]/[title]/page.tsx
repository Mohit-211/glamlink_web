import { SITE_URL } from "@/lib/config";
import { Metadata } from "next";
import Script from "next/script";
import AdSenseScript from "@/ads/AdSenseScript";
import Image from "next/image";

import { getBlogsById } from "@/api/Api";
import ArticleContent from "@/components/blogs/ArticleContent";
import RelatedArticles from "@/components/blogs/RelatedArticles";
import DownloadButton from "@/components/Downloadbutton";
import JournalShopCard from "@/components/blogs/JournalShopCard";
import ArticleAdSlot from "@/ads/ArticleAdSlot";
import ShareProductButton from "@/components/blogs/ShareProductButton";

interface DownloadItem {
  id: number;
  title: string;
  description: string;
  file_name: string;
  button_text: string;
  sort_order?: number;
}

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  JournalFaqMapping?: { sort_order?: number };
}

interface TopicItem {
  id: number;
  name: string;
  slug: string;
  JournalTopicMapping?: { sort_order?: number };
}

interface BlogData {
  shops: any[] | undefined;
  journal_category: any;
  journal_author: any;
  category_id: any;
  id: number;
  title: string;
  short_description: string;
  content: string;
  cover_image: string;
  publish_date: string;
  slug?: string;
  downloads?: DownloadItem[];
  shop?: any[];
  seo_title?: string;
  meta_description?: string;
  faqs?: FaqItem[];
  topics?: TopicItem[];
}

/* --------------------------------
   Helpers
-------------------------------- */

function getFileExt(url: string) {
  const clean = url.split("?")[0];
  const ext = clean.split(".").pop();
  return ext ? ext.toUpperCase() : "";
}

/* --------------------------------
   Dynamic Metadata
-------------------------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; title: string }>;
}): Promise<Metadata> {
  const { id, title } = await params;

  const response = await getBlogsById(id);
  const article: BlogData = response?.data;

  if (!article) {
    return { title: "Article Not Found | Glamlink" };
  }

  const articleUrl = `${SITE_URL}/journal/${id}/${title}`;
  const imageUrl =
    article.cover_image || `${SITE_URL}/default-blog.jpg`;

  const seoTitle = article.seo_title || article.title;
  const seoDescription = article.meta_description || article.short_description;

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: articleUrl,
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [imageUrl],
    },
  };
}

/* --------------------------------
   Page
-------------------------------- */

export default async function Article({
  params,
}: {
  params: Promise<{ id: string; title: string }>;
}) {
  const { id, title } = await params;

  const response = await getBlogsById(id);
  const article: BlogData = response?.data;

  if (!article) {
    return <div className="text-center py-20">Article not found.</div>;
  }

  const articleUrl = `${SITE_URL}/journal/${id}/${title}`;
  const imageUrl = article.cover_image || "/assets/fallback-blog.jpg";

const formattedDate = article?.publish_date
  ? new Date(article.publish_date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
     
    })
  : "";

  const downloads = Array.isArray(article?.downloads)
    ? [...article.downloads].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
      )
    : [];

  const topics = Array.isArray(article?.topics)
    ? [...article.topics].sort(
        (a, b) =>
          (a.JournalTopicMapping?.sort_order ?? 0) -
          (b.JournalTopicMapping?.sort_order ?? 0)
      )
    : [];

  const faqs = Array.isArray(article?.faqs)
    ? [...article.faqs].sort(
        (a, b) =>
          (a.JournalFaqMapping?.sort_order ?? 0) -
          (b.JournalFaqMapping?.sort_order ?? 0)
      )
    : [];

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.short_description,
    image: imageUrl,
    author: {
      "@type": "Person",
      name: article?.journal_author?.name || "Glamlink Editorial",
    },
    publisher: {
      "@type": "Organization",
      name: "Glamlink",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.png`,
      },
    },
    datePublished: article?.publish_date,
    mainEntityOfPage: articleUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Journal",
        item: `${SITE_URL}/journal`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-card">
      {/* Structured Data */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <AdSenseScript />

      <main className="flex-1">
        {/* ── Left/right rail ads — fixed to the viewport edges, only shown
             once the screen is wide enough to have real blank space beside
             the article ── */}
        <div className=" min-[1600px]:block fixed left-6 top-1/2 -translate-y-1/2 z-10">
          <ArticleAdSlot slotId="journal-sidebar-left" />
        </div>
        <div className=" min-[1600px]:flex flex-col gap-6 fixed right-6 top-1/2 -translate-y-1/2 z-10">
          <ArticleAdSlot slotId="journal-sidebar-right" />
          <ArticleAdSlot slotId="journal-article-mid-square" />
        </div>

        <article className="max-w-[900px] mx-auto px-5 pb-20 pt-20">

          {/* ── HERO ── */}
          <section>

            {/* Category pill */}
            <div className="mb-6 mt-6">
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-primary"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {article?.journal_category?.title ?? "From the Treatment Room"}
              </span>
            </div>

            {/* TOP ROW — Title | Image */}
            <div className="grid md:grid-cols-2 gap-8 items-center mb-7">

              {/* Title only */}
              <h1 className="text-[clamp(30px,4vw,44px)] leading-[1.08] tracking-tight text-foreground">
                {article.title}
              </h1>

              {/* Image 16:9 */}
              <div className="relative rounded-2xl overflow-hidden w-full">
                <div className="relative w-full aspect-video">
                  <Image
                    unoptimized={process.env.NODE_ENV === "development"}
                    src={imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover hover:scale-[1.03] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-3"
                  >

                    <p className="text-[13px] text-white font-medium">
                      {article?.journal_category?.title ?? "Glamlink Journal"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM — Description + Author */}
            <div className="flex flex-col md:flex-row md:items-start gap-6 pt-6 border-t border-border">

              {/* Description */}
              <p className="flex-1 text-[15px] leading-[1.75] text-muted-foreground font-normal">
                {article.short_description}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 md:pl-6 md:border-l md:border-border flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
                  {article?.journal_author?.name?.charAt(0) ?? "A"}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground whitespace-nowrap">
                    {article?.journal_author?.name}
                  </p>
                  <p className="text-xs text-muted-foreground/80 mt-0.5">{formattedDate}</p>
                </div>
              </div>

              {/* Share */}
              <div className="flex items-center md:pl-6 md:border-l md:border-border flex-shrink-0">
                <ShareProductButton url={articleUrl} title={article.title} />
              </div>

            </div>

            {/* Topics */}
            {topics.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-6">
                {topics.map((topic) => (
                  <span
                    key={topic.id}
                    className="text-xs font-medium text-muted-foreground px-3 py-1 rounded-full border border-border hover:border-primary/40 hover:text-primary transition-colors duration-200"
                  >
                    {topic.name}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* ── DIVIDER ── */}
          <div className="border-t border-border my-12" />

          {/* ── IN-ARTICLE AD (top of body) ── */}
          <ArticleAdSlot slotId="journal-article-top" />

          {/* ── BODY CONTENT ── */}
          <section className="mx-auto">
            <div>
              <ArticleContent content={article.content ?? ""} />

            </div>
          </section>

          {/* ── IN-ARTICLE AD (mid-content rectangle) ── */}
          <ArticleAdSlot slotId="journal-article-mid-rectangle" />

          {/* ── SHOP THE JOURNAL ── */}
          <div className="border-t border-border my-14" />

          <section>
            <JournalShopCard shop={article.shops} heading="no" />
          </section>

          {/* ── DOWNLOADS ── */}
          {downloads.length > 0 && (
            <>
              <div className="border-t border-border my-14" />

              <section>
                <div className="mb-8">
                  <p className="text-[10px] tracking-[.15em] uppercase text-muted-foreground/80 mb-2">
                    Resources
                  </p>
                  <h2 className="text-3xl text-foreground">
                    Downloads
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {downloads.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-soft"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-lg text-foreground leading-snug">
                            {item.title}
                          </h3>
                          {getFileExt(item.file_name) && (
                            <span
                              className="shrink-0 rounded-md border border-primary/25 bg-primary/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-primary"
                            >
                              {getFileExt(item.file_name)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground font-normal leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <DownloadButton
                        fileUrl={item.file_name}
                        label={item.button_text || "Download"}
                        className="mt-5 inline-flex items-center justify-center gap-2 text-sm font-medium text-white px-4 py-2.5 rounded-full bg-primary hover:bg-primary transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* ── FAQ ── */}
          {faqs.length > 0 && (
            <>
              <div className="border-t border-border my-14" />

              <section>
                <div className="mb-8">
                  <p className="text-[10px] tracking-[.15em] uppercase text-muted-foreground/80 mb-2">
                    Questions
                  </p>
                  <h2 className="text-3xl text-foreground">
                    Frequently asked questions
                  </h2>
                </div>

                <div className="flex flex-col gap-3">
                  {faqs.map((faq) => (
                    <details
                      key={faq.id}
                      className="group rounded-2xl border border-border bg-card px-6 py-5 open:border-primary/40"
                    >
                      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-lg text-foreground">
                        {faq.question}
                        <span className="flex-shrink-0 text-primary text-xl leading-none transition-transform duration-200 group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-3 text-sm text-muted-foreground font-normal leading-relaxed">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* ── DIVIDER ── */}
          <div className="border-t border-border my-14 mx-auto" />

          {/* ── IN-ARTICLE AD (before related articles) ── */}
          <ArticleAdSlot slotId="journal-article-bottom" />

          {/* ── RELATED ARTICLES ── */}
          <section style={{ justifyItems: "center" }}>
            <div className="text-center mb-8 mx-auto max-w-2xl">
              <p className="text-[10px] tracking-[.15em] uppercase text-muted-foreground/80 mb-2">
                Continue reading
              </p>
              <h2 className="text-3xl text-foreground">
                Related articles
              </h2>
            </div>

            <RelatedArticles category_id={article?.category_id} />
          </section>

        </article>

        {/* ── Mobile-only fixed bottom ad bar ── */}
        <div className="lg:hidden">
          <ArticleAdSlot slotId="journal-mobile-bottom" />
        </div>
      </main>
    </div>
  );
}