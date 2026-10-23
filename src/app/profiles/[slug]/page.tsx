import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { CalendarCheck, CreditCard, Globe, Mail, MapPin, Phone } from "lucide-react";
import ApiImage from "@/components/common/ApiImage";
import ArticleTile from "@/components/content/ArticleTile";
import IssueTile from "@/components/content/IssueTile";
import JsonLd from "@/components/content/JsonLd";
import ProductTile from "@/components/content/ProductTile";
import SectionHeading from "@/components/content/SectionHeading";
import VideoTile from "@/components/content/VideoTile";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "@/components/icons/BrandIcons";
import ProfileTracker from "@/components/profiles/ProfileTracker";
import { trackAs } from "@/components/profiles/profileEvents";
import { PROFILE_SECTIONS, profileSectionHref, type ProfileSection } from "@/components/profiles/profileSections";
import { getProfile } from "@/lib/api/public";
import type { ProfileDetail, SocialLink } from "@/lib/api/types";
import { SITE_URL } from "@/lib/config";
import { formatPlace } from "@/lib/format";
import { profileHref, topicHref } from "@/lib/routes";
import { htmlToText, stripUnsafeHtml } from "@/lib/safeHtml";
import { cn } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

/* ── Helpers ─────────────────────────────────────────────────── */

/** Styles for the short rich text of a page's "about" (the bio editor's formatting). */
const RICH_TEXT =
  "space-y-3 [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-secondary " +
  "[&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic " +
  "[&_h3]:pt-2 [&_h3]:text-lg [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5";

const SOCIAL_ICONS = [
  { match: /instagram\.com/i, name: "instagram", icon: Instagram },
  { match: /facebook\.com|fb\.com/i, name: "facebook", icon: Facebook },
  { match: /linkedin\.com/i, name: "linkedin", icon: Linkedin },
  { match: /youtube\.com|youtu\.be/i, name: "youtube", icon: Youtube },
  { match: /twitter\.com|x\.com/i, name: "x", icon: Twitter },
];

function socialPlatform(link: SocialLink) {
  const known = SOCIAL_ICONS.find((s) => s.match.test(link.url));
  const name = known?.name ?? (link.title || "link").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return { name, icon: known?.icon ?? Globe, label: link.title || known?.name || "Link" };
}

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

const placeOf = (profile: ProfileDetail) =>
  formatPlace(profile.location?.city ?? profile.city, profile.location?.state ?? profile.state);

/** The Access card stays on this site's own address (the API's link names the live host). */
const accessCardHref = (profile: ProfileDetail) =>
  profile.access_card ? `/access/${encodeURIComponent(profile.access_card.slug)}` : null;

/* ── Metadata ────────────────────────────────────────────────── */

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfile(slug);
  if (!profile) return { title: "Page not found" };

  const url = `${SITE_URL}${profileHref(profile.slug)}`;
  const description =
    profile.tagline || htmlToText(profile.about).slice(0, 160) || `${profile.name} on Glamlink.`;
  const image = profile.cover_image || profile.image;

  return {
    title: profile.type === "brand" ? profile.name : [profile.name, profile.specialty].filter(Boolean).join(", "),
    description,
    alternates: { canonical: url },
    openGraph: {
      title: profile.name,
      description,
      url,
      type: "profile",
      images: image ? [{ url: image }] : undefined,
    },
  };
}

/* ── Page parts ──────────────────────────────────────────────── */

function Header({ profile }: { profile: ProfileDetail }) {
  const brand = profile.type === "brand";
  const place = placeOf(profile);
  const cardHref = accessCardHref(profile);

  return (
    <section aria-labelledby="profile-name">
      <div className="relative h-40 overflow-hidden rounded-3xl bg-accent sm:h-56 md:h-72">
        {profile.cover_image && (
          <ApiImage src={profile.cover_image} alt="" fill priority sizes="100vw" className="object-cover" />
        )}
      </div>

      {/* Only the picture overlaps the cover; the words sit below it */}
      <div className="relative flex flex-col gap-5 px-2 sm:px-6 md:flex-row md:items-start md:gap-8 md:px-8">
        <div className="relative -mt-14 h-28 w-28 shrink-0 overflow-hidden rounded-3xl border-4 border-background bg-card shadow-medium md:-mt-16 md:h-36 md:w-36">
          <ApiImage
            src={profile.image}
            alt={profile.name}
            fill
            priority
            sizes="144px"
            className={brand ? "object-contain p-3" : "object-cover"}
          />
        </div>

        <div className="min-w-0 flex-1 md:pt-5">
          <p className="eyebrow">{brand ? "Brand" : "Professional"}</p>
          <h1 id="profile-name" className="mt-1 text-3xl leading-tight md:text-4xl">
            {profile.name}
          </h1>
          {profile.tagline && <p className="mt-2 max-w-2xl text-muted-foreground md:text-lg">{profile.tagline}</p>}
          {(place || (!brand && profile.specialty)) && (
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {place && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {place}
                </span>
              )}
              {!brand && profile.specialty && <span>{profile.specialty}</span>}
            </p>
          )}
        </div>

        {(cardHref || profile.booking_link) && (
          <div className="flex flex-wrap gap-3 md:pt-6">
            {cardHref && (
              <Link href={cardHref} className="btn-primary" {...trackAs("ACCESS_CARD_CLICK")}>
                <CreditCard className="h-4 w-4" aria-hidden="true" />
                View Access card
              </Link>
            )}
            {profile.booking_link && (
              <a
                href={profile.booking_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                {...trackAs("BOOKING_CLICK")}
              >
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                Book now
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Details({ profile }: { profile: ProfileDetail }) {
  const rows: { key: string; icon: typeof Globe; content: ReactNode }[] = [];
  if (profile.website) {
    rows.push({
      key: "website",
      icon: Globe,
      content: (
        <a
          href={profile.website}
          target="_blank"
          rel="noopener noreferrer"
          className="link-glamlink break-all"
          {...trackAs("WEBSITE_CLICK", profile.website)}
        >
          {hostOf(profile.website)}
        </a>
      ),
    });
  }
  if (profile.email) {
    rows.push({
      key: "email",
      icon: Mail,
      content: (
        <a href={`mailto:${profile.email}`} className="link-glamlink break-all" {...trackAs("EMAIL_CLICK")}>
          {profile.email}
        </a>
      ),
    });
  }
  if (profile.phone) {
    rows.push({
      key: "phone",
      icon: Phone,
      content: (
        <a href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`} className="link-glamlink" {...trackAs("PHONE_CLICK")}>
          {profile.phone}
        </a>
      ),
    });
  }

  const social = profile.social?.filter((link) => link.url) ?? [];
  if (rows.length === 0 && social.length === 0 && profile.specialties.length === 0 && profile.topics.length === 0) {
    return null;
  }

  return (
    <aside aria-label="Details" className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
      {rows.length > 0 && (
        <ul className="space-y-3 text-sm">
          {rows.map(({ key, icon: Icon, content }) => (
            <li key={key} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="min-w-0">{content}</span>
            </li>
          ))}
        </ul>
      )}

      {social.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Social links">
          {social.map((link) => {
            const { name, icon: Icon, label } = socialPlatform(link);
            return (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-secondary hover:text-secondary"
                  {...trackAs("SOCIAL_CLICK", name)}
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            );
          })}
        </ul>
      )}

      {profile.specialties.length > 0 && (
        <div>
          <h2 className="eyebrow">Specialties</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {profile.specialties.map((specialty) => (
              <li key={specialty} className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-secondary">
                {specialty}
              </li>
            ))}
          </ul>
        </div>
      )}

      {profile.topics.length > 0 && (
        <div>
          <h2 className="eyebrow">Topics</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {profile.topics.map((topic) => (
              <li key={topic.id}>
                <Link href={topicHref(topic)} className="chip inline-flex rounded-full px-3 py-1 text-xs">
                  {topic.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}

function ListSection({
  profile,
  section,
  count,
  shown,
  children,
}: {
  profile: ProfileDetail;
  section: ProfileSection;
  count: number;
  shown: number;
  children: ReactNode;
}) {
  if (shown === 0) return null;
  const id = `profile-${section}-heading`;
  return (
    <section aria-labelledby={id} className="mt-14 md:mt-20">
      <SectionHeading
        id={id}
        title={PROFILE_SECTIONS[section].title}
        action={count > shown ? { label: `See all ${count}`, href: profileSectionHref(profile.slug, section) } : undefined}
      />
      {children}
    </section>
  );
}

/* ── Page ────────────────────────────────────────────────────── */

export default async function ProfilePage({ params }: { params: Params }) {
  const { slug } = await params;
  const profile = await getProfile(slug);
  if (!profile) notFound();
  // Found by a card handle: link (and index) the page by its own slug
  if (profile.slug && profile.slug !== decodeURIComponent(slug)) permanentRedirect(profileHref(profile.slug));

  const brand = profile.type === "brand";
  const about = stripUnsafeHtml(profile.about);
  const url = `${SITE_URL}${profileHref(profile.slug)}`;
  const place = placeOf(profile);
  const sameAs = [profile.website, ...(profile.social ?? []).map((s) => s.url)].filter(Boolean);

  return (
    <ProfileTracker slug={profile.slug}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": brand ? "Organization" : "Person",
          name: profile.name,
          url,
          ...(brand ? { logo: profile.image ?? undefined } : { image: profile.image ?? undefined }),
          description: profile.tagline ?? undefined,
          ...(!brand && profile.specialty ? { jobTitle: profile.specialty } : {}),
          ...(place
            ? {
                address: {
                  "@type": "PostalAddress",
                  addressLocality: profile.location?.city ?? profile.city ?? undefined,
                  addressRegion: profile.location?.state ?? profile.state ?? undefined,
                  addressCountry: "US",
                },
              }
            : {}),
          sameAs: sameAs.length > 0 ? sameAs : undefined,
        }}
      />

      <div className="container-glamlink pb-20 pt-24 md:pt-28">
        <Header profile={profile} />

        <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[1fr_340px] lg:gap-12">
          <div className="min-w-0">
            <h2 className="section-title text-2xl md:text-3xl">About</h2>
            {about ? (
              <div className={cn("mt-4 max-w-3xl text-[15px] leading-relaxed text-foreground/90", RICH_TEXT)} dangerouslySetInnerHTML={{ __html: about }} />
            ) : (
              <p className="mt-4 text-muted-foreground">
                {brand
                  ? `${profile.name} is part of the Glamlink industry directory.`
                  : `${profile.name} is a beauty + wellness professional on Glamlink.`}
              </p>
            )}
          </div>
          <Details profile={profile} />
        </div>

        <ListSection
          profile={profile}
          section="products"
          count={profile.products.count}
          shown={profile.products.rows.length}
        >
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
            {profile.products.rows.map((product) => (
              <li key={product.id}>
                <ProductTile product={product} linkData={trackAs("PRODUCT_CLICK", product.id)} />
              </li>
            ))}
          </ul>
        </ListSection>

        <ListSection profile={profile} section="articles" count={profile.journal.count} shown={profile.journal.rows.length}>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {profile.journal.rows.map((article) => (
              <li key={article.id}>
                <ArticleTile article={article} />
              </li>
            ))}
          </ul>
        </ListSection>

        <ListSection profile={profile} section="videos" count={profile.videos.count} shown={profile.videos.rows.length}>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {profile.videos.rows.map((video) => (
              <li key={video.id}>
                <VideoTile video={video} />
              </li>
            ))}
          </ul>
        </ListSection>

        <ListSection
          profile={profile}
          section="magazine"
          count={profile.magazine.count}
          shown={profile.magazine.rows.length}
        >
          <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {profile.magazine.rows.map((issue) => (
              <li key={issue.id}>
                <IssueTile issue={issue} role={issue.role} pageNumber={issue.page_number} />
              </li>
            ))}
          </ul>
        </ListSection>
      </div>
    </ProfileTracker>
  );
}
