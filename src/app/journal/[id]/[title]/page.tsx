import { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";

import { getBlogsById } from "@/api/Api";
import ArticleContent from "@/components/blogs/ArticleContent";
import RelatedArticles from "@/components/blogs/RelatedArticles";

interface BlogData {
  journal_category: any;
  journal_author: any;
  category_id: any;
  id: number;
  title: string;
  short_description: string;
  content: string;
  cover_image: string;
  created_at: string;
  slug?: string;
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

  const articleUrl = `https://glamlink.net/journal/${id}/${title}`;
  const imageUrl =
    article.cover_image || "https://glamlink.net/default-blog.jpg";

  return {
    title: article.title,
    description: article.short_description,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: article.title,
      description: article.short_description,
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
      title: article.title,
      description: article.short_description,
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

  const articleUrl = `https://glamlink.net/journal/${id}/${title}`;
  const imageUrl = article.cover_image || "/assets/fallback-blog.jpg";

  const formattedDate = article.created_at
    ? new Date(article.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

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
        url: "https://glamlink.net/favicon.png",
      },
    },
    datePublished: article.created_at,
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
        item: "https://glamlink.net",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Journal",
        item: "https://glamlink.net/journal",
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
    <div className="min-h-screen flex flex-col bg-white">
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

      <main className="flex-1">
        <article className="max-w-[900px] mx-auto px-5 pb-20 pt-20">

          {/* ── HERO ── */}
        {/* ── HERO ── */}
<section>

  {/* Category pill */}
  <div className="mb-6 mt-6">
    <span
      className="inline-flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase text-[#23AEB8] px-3 py-1.5 rounded-full"
      style={{ background: "rgba(35,174,184,0.08)", border: "1px solid rgba(35,174,184,0.25)" }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#23AEB8]" />
      {article?.journal_category?.title ?? "From the Treatment Room"}
    </span>
  </div>

  {/* TOP ROW — Title | Image */}
  <div className="grid md:grid-cols-2 gap-8 items-center mb-7">

    {/* Title only */}
    <h1 className="font-serif text-[clamp(30px,4vw,44px)] leading-[1.08] tracking-tight text-gray-900">
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
          className="absolute bottom-0 left-0 right-0 px-4 py-3"
          style={{ background: "rgba(0,0,0,0.48)" }}
        >
         
          <p className="text-[13px] text-white font-medium">
            {article?.journal_category?.title ?? "Glamlink Journal"}
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* BOTTOM — Description + Author */}
  <div className="flex flex-col md:flex-row md:items-start gap-6 pt-6 border-t border-gray-100">

    {/* Description */}
    <p className="flex-1 text-[15px] leading-[1.75] text-gray-500 font-light">
      {article.short_description}
    </p>

    {/* Author */}
    <div className="flex items-center gap-3 md:pl-6 md:border-l md:border-gray-100 flex-shrink-0">
      <div className="w-9 h-9 rounded-full bg-[#23AEB8] text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
        {article?.journal_author?.name?.charAt(0) ?? "A"}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
          {article?.journal_author?.name}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{formattedDate}</p>
      </div>
    </div>

  </div>
</section>

          {/* ── DIVIDER ── */}
          <div className="border-t border-gray-100 my-12" />

          {/* ── BODY CONTENT ── */}
          <section className="mx-auto">
            <div
              className="
                prose prose-lg max-w-none
                prose-p:text-gray-500 prose-p:font-light prose-p:leading-[1.8]
                prose-headings:font-serif prose-headings:text-gray-900
                prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                prose-a:text-[#23AEB8] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-800 prose-strong:font-medium
                prose-img:rounded-xl prose-img:shadow-md
                prose-ul:text-gray-500 prose-ol:text-gray-500
                prose-li:leading-[1.8]
                prose-blockquote:not-italic
                prose-blockquote:border-l-[3px] prose-blockquote:border-[#23AEB8]
                prose-blockquote:rounded-r-xl
                prose-blockquote:pl-8 prose-blockquote:pr-6
                prose-blockquote:py-6 prose-blockquote:my-10
                [&_blockquote]:bg-[rgba(35,174,184,0.08)]
                [&_blockquote_p]:font-serif [&_blockquote_p]:italic
                [&_blockquote_p]:text-gray-800 [&_blockquote_p]:text-xl
                [&_blockquote_p]:leading-snug
                [&_p:first-of-type::first-letter]:float-left
                [&_p:first-of-type::first-letter]:font-serif
                [&_p:first-of-type::first-letter]:text-[72px]
                [&_p:first-of-type::first-letter]:leading-[0.85]
                [&_p:first-of-type::first-letter]:mr-3
                [&_p:first-of-type::first-letter]:mt-1.5
                [&_p:first-of-type::first-letter]:text-[#23AEB8]
              "
            >
              <ArticleContent content={article.content ?? ""} />
            </div>
          </section>

          {/* ── DIVIDER ── */}
          <div className="border-t border-gray-100 my-14 mx-auto" />

          {/* ── RELATED ARTICLES ── */}
          <section>
            <div className="text-center mb-8">
              <p className="text-[10px] tracking-[.15em] uppercase text-gray-400 mb-2">
                Continue reading
              </p>
              <h2 className="font-serif text-3xl text-gray-900">
                Related articles
              </h2>
            </div>
            <RelatedArticles category_id={article?.category_id} />
          </section>

        </article>
      </main>
    </div>
  );
}