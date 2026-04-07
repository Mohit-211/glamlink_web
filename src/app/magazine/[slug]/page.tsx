import type { Metadata } from "next";
import Script from "next/script";
import { issues2025, issues2026 } from "@/data/issues";

interface Issue {
  slug: string;
  title: string;
  cover: string;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const issue = [...issues2026, ...issues2025].find(
    (i) => i.slug === params.slug
  );

  if (!issue) {
    return {
      title: "Magazine Issue Not Found | Glamlink",
    };
  }

  const url = `https://glamlink.com/magazine/${issue.slug}`;

  return {
    title: issue.title,
    description: `Explore the ${issue.title} issue of Glamlink Magazine featuring beauty industry insights, professionals, and trends.`,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: issue.title,
      description: `Read the ${issue.title} issue of Glamlink Magazine.`,
      url,
      images: [
        {
          url: issue.cover ?? "",
          width: 1200,
          height: 630,
          alt: issue.title,
        },
      ],
    },
  };
}

export default function IssuePage({ params }: { params: { slug: string } }) {
  const issue = [...issues2026, ...issues2025].find(
    (i) => i.slug === params.slug
  );

  if (!issue) {
    return <div className="p-10">Issue not found</div>;
  }

  const url = `https://glamlink.com/magazine/${issue.slug}`;

  const publicationSchema = {
    "@context": "https://schema.org",
    "@type": "PublicationIssue",
    name: issue.title,
    url,
    image: issue.cover,
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "Glamlink Magazine",
      url: "https://glamlink.com/magazine",
    },
    publisher: {
      "@type": "Organization",
      name: "Glamlink",
      url: "https://glamlink.com",
    },
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
        name: "Magazine",
        item: "https://glamlink.com/magazine",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: issue.title,
        item: url,
      },
    ],
  };

  return (
    <section className="py-16">
      <Script
        id="publication-issue-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(publicationSchema),
        }}
      />

      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div className="container-glamlink max-w-4xl">
        <h1 className="text-3xl font-serif mb-2">{issue.title}</h1>

        <p className="text-muted-foreground mb-8"></p>

        <img src={issue.cover} alt={issue.title} className="rounded-xl mb-10" />
      </div>
      
    </section>
  );
}
