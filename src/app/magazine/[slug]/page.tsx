import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import ApiImage from "@/components/common/ApiImage";
import JsonLd from "@/components/content/JsonLd";
import type { MagazineRole } from "@/lib/api/types";
import { SITE_URL } from "@/lib/config";
import { formatDate } from "@/lib/format";
import { getMagazineIssue } from "@/lib/magazine";
import { flipbookEmbedUrl } from "@/lib/magazineFormat";
import { issueHref, profileHref } from "@/lib/routes";

type Params = Promise<{ slug: string }>;

const ROLE_LABEL: Record<MagazineRole, string> = {
  cover: "On the cover",
  featured: "Featured",
  mentioned: "Mentioned",
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const issue = await getMagazineIssue(slug);
  if (!issue) return { title: "Magazine issue not found" };

  const url = `${SITE_URL}${issueHref(issue.slug)}`;
  const description =
    issue.short_description ||
    `Explore ${issue.title} of Glamlink Magazine: beauty industry insights, professionals and trends.`;

  return {
    title: `${issue.title} | Glamlink Magazine`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: issue.title,
      description,
      url,
      images: issue.cover_image ? [{ url: issue.cover_image, alt: issue.title }] : undefined,
    },
  };
}

export default async function IssuePage({ params }: { params: Params }) {
  const { slug } = await params;
  const issue = await getMagazineIssue(slug);
  if (!issue) notFound();

  const url = `${SITE_URL}${issueHref(issue.slug)}`;
  const date = formatDate(issue.publish_date);
  const hasFlipbook = Boolean(flipbookEmbedUrl(issue));

  return (
    <div className="container-glamlink pb-20 pt-24 md:pt-28">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "PublicationIssue",
          name: issue.title,
          url,
          image: issue.cover_image ?? undefined,
          issueNumber: issue.issue_number ?? undefined,
          datePublished: issue.publish_date ?? undefined,
          isPartOf: { "@type": "CreativeWorkSeries", name: "Glamlink Magazine", url: `${SITE_URL}/magazine` },
          publisher: { "@type": "Organization", name: "Glamlink", url: SITE_URL },
        }}
      />

      <Link
        href="/magazine"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-secondary"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        All issues
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
        <div className="relative aspect-3/4 overflow-hidden rounded-2xl border border-border bg-muted shadow-medium">
          <ApiImage
            src={issue.cover_image}
            alt={`Cover of ${issue.title}`}
            fill
            priority
            sizes="(min-width: 768px) 360px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col">
          <p className="eyebrow">Glamlink Magazine</p>
          <h1 className="mt-3 text-3xl md:text-4xl">{issue.title}</h1>
          {date && <p className="mt-2 text-sm text-muted-foreground">{date}</p>}
          {issue.short_description && (
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">{issue.short_description}</p>
          )}

          {hasFlipbook && (
            <div className="mt-8">
              <Link href={`${issueHref(issue.slug)}/digital`} className="btn-primary">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Read the digital edition
              </Link>
            </div>
          )}

          {issue.features.length > 0 && (
            <section aria-labelledby="in-this-issue-heading" className="mt-10 border-t border-border pt-8">
              <h2 id="in-this-issue-heading" className="text-xl">
                In this issue
              </h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {issue.features.map((person) => (
                  <li key={`${person.id}-${person.role}`}>
                    <Link
                      href={profileHref(person.slug)}
                      className="chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                    >
                      <span className="font-semibold">{person.name}</span>
                      <span className="text-xs opacity-70">
                        {ROLE_LABEL[person.role]}
                        {person.page_number ? `, page ${person.page_number}` : ""}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
