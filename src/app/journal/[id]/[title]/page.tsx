import { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";

import { getBlogsById } from "@/api/Api";
import ArticleContent from "@/components/blogs/ArticleContent";
import ArticleHeader from "@/components/blogs/ArticleHeader";
import RelatedArticles from "@/components/blogs/RelatedArticles";

interface BlogData {
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
  params: { id: string; title: string };
}): Promise<Metadata> {
  const response = await getBlogsById(params.id);
  const article: BlogData = response?.data;

  if (!article) {
    return {
      title: "Article Not Found | Glamlink",
    };
  }

  const articleUrl = `https://glamlink.com/journal/${params.id}/${params.title}`;

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
          url: article.cover_image,
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
      images: [article.cover_image],
    },
  };
}

/* --------------------------------
   Page
-------------------------------- */

export default async function Article({
  params,
}: {
  params: { id: string; title: string };
}) {
  const response = await getBlogsById(params.id);
  const article: BlogData = response?.data;

  if (!article) {
    return <div className="text-center py-20">Article not found.</div>;
  }

  const articleUrl = `https://glamlink.com/journal/${params.id}/${params.title}`;

  /* --------------------------------
     Structured Data
  -------------------------------- */

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.short_description,
    image: article.cover_image,
    author: {
      "@type": "Person",
      name: "Glamlink Editorial",
    },
    publisher: {
      "@type": "Organization",
      name: "Glamlink",
      logo: {
        "@type": "ImageObject",
        url: "https://glamlink.com/favicon.png",
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
        item: "https://glamlink.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Journal",
        item: "https://glamlink.com/journal",
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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Article Schema */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      {/* Breadcrumb Schema */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <main className="flex-1">
        <article className="py-12 md:py-30">
          <ArticleHeader
            category="Blog"
            title={article.title}
            subtitle={article.short_description}
            author="Admin"
            date={new Date(article.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            readTime="5 min read"
          />

          <div className="container mx-auto px-6 mb-12 md:mb-16">
            <div className="max-w-4xl mx-auto relative aspect-[16/9]">
              <Image
                unoptimized={process.env.NODE_ENV === "development"}
                src={article.cover_image}
                alt={article.title}
                fill
                className="object-cover rounded-xl"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          </div>

          <ArticleContent content={article.content} />

          <RelatedArticles category_id={article?.category_id} />
        </article>
      </main>
    </div>
  );
}
