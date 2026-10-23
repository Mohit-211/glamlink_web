import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import JsonLd from "@/components/content/JsonLd";
import { SITE_URL } from "@/lib/config";
import { getMagazineIssue } from "@/lib/magazine";
import { flipbookEmbedUrl } from "@/lib/magazineFormat";
import { issueHref } from "@/lib/routes";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const issue = await getMagazineIssue(slug);
  if (!issue) return { title: "Magazine issue not found" };
  return {
    title: `${issue.title}, digital edition | Glamlink Magazine`,
    alternates: { canonical: `${SITE_URL}${issueHref(issue.slug)}/digital` },
  };
}

/** The issue's flipbook, full width. */
export default async function DigitalIssuePage({ params }: { params: Params }) {
  const { slug } = await params;
  const issue = await getMagazineIssue(slug);
  if (!issue) notFound();

  const embed = flipbookEmbedUrl(issue);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 md:pt-28">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: issue.title,
          url: `${SITE_URL}${issueHref(issue.slug)}/digital`,
          isPartOf: { "@type": "CreativeWorkSeries", name: "Glamlink Magazine", url: `${SITE_URL}/magazine` },
          publisher: { "@type": "Organization", name: "Glamlink" },
        }}
      />

      <Link
        href={issueHref(issue.slug)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-secondary"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        {issue.title}
      </Link>
      <h1 className="mb-6 mt-3 text-3xl">{issue.title}</h1>

      {embed ? (
        <iframe
          src={embed}
          title={`${issue.title}, digital edition`}
          scrolling="no"
          allow="clipboard-write; autoplay; fullscreen"
          allowFullScreen
          className="h-[75vh] min-h-120 w-full rounded-lg border-0 shadow-lg"
        />
      ) : (
        <p className="text-muted-foreground">The digital edition of this issue is not available yet.</p>
      )}
    </div>
  );
}
