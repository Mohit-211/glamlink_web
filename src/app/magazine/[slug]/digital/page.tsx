"use client";

import Script from "next/script";
import { useParams } from "next/navigation";
import { allIssues } from "@/data/issues";

export default function IssuePage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const issue = allIssues.find((i) => i.slug === slug);

  if (!issue) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl">Issue not found</h1>
        <p className="text-muted-foreground mt-2">
          The requested magazine issue does not exist.
        </p>
      </div>
    );
  }

  const { accountId, flipbookId } = issue.publuu;
  const flipbookUrl = `https://publuu.com/flip-book/${accountId}/${flipbookId}/page/1?embed`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: issue.title,
    url: `https://glamlink.com/magazine/${issue.slug}/digital`,
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "Glamlink Magazine",
      url: "https://glamlink.com/magazine",
    },
    publisher: {
      "@type": "Organization",
      name: "Glamlink",
    },
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Script
        id="magazine-digital-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <h1 className="text-3xl mb-6">{issue.title}</h1>

      <iframe
        src={flipbookUrl}
        width="100%"
        height="700"
        scrolling="no"
        frameBorder={0}
        allow="clipboard-write; autoplay; fullscreen"
        allowFullScreen
        className="rounded-lg shadow-lg"
      />
    </div>
  );
}
