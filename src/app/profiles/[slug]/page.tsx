import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import ApiImage from "@/components/common/ApiImage";
import JsonLd from "@/components/content/JsonLd";
import ProductTile from "@/components/content/ProductTile";
import HomeCarousel from "@/components/home/HomeCarousel";
import EducationTile from "@/components/profiles/EducationTile";
import MediaGallery from "@/components/profiles/MediaGallery";
import ProfileHero from "@/components/profiles/ProfileHero";
import ProfileIdentity from "@/components/profiles/ProfileIdentity";
import ProfilePanel, { viewAll } from "@/components/profiles/ProfilePanel";
import ProfileSidebar from "@/components/profiles/ProfileSidebar";
import ProfileTracker from "@/components/profiles/ProfileTracker";
import RichText from "@/components/profiles/RichText";
import { clip, profileView } from "@/components/profiles/profileData";
import { trackAs } from "@/components/profiles/profileEvents";
import { profileSectionHref } from "@/components/profiles/profileSections";
import { getProfile } from "@/lib/api/public";
import { SITE_URL } from "@/lib/config";
import { profileHref, topicHref } from "@/lib/routes";
import { htmlToText } from "@/lib/safeHtml";
import { cn } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

/** The gallery's and the education list's first rows on the page. */
const MEDIA_SHOWN = 5;
const EDUCATION_SHOWN = 3;

/** Products in the carousel: 2 on phones, 3 on tablets, 4 then 5 across the column. */
const PRODUCT_SLIDE = "w-[45%] shrink-0 snap-start sm:w-[30%] lg:w-[calc((100%-3rem)/4)] xl:w-[calc((100%-4rem)/5)]";

/* ── Metadata ────────────────────────────────────────────────── */

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfile(slug);
  if (!profile) return { title: "Page not found" };

  const url = `${SITE_URL}${profileHref(profile.slug)}`;
  const description = clip(
    profile.intro?.trim() || profile.tagline || htmlToText(profile.about) || `${profile.name} on Glamlink.`
  );
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

/* ── Page ────────────────────────────────────────────────────── */

export default async function ProfilePage({ params }: { params: Params }) {
  const { slug } = await params;
  const profile = await getProfile(slug);
  if (!profile) notFound();
  // Found by a card handle: link (and index) the page by its own slug
  if (profile.slug && profile.slug !== decodeURIComponent(slug)) permanentRedirect(profileHref(profile.slug));

  const view = profileView(profile);
  const { brand, media, products, education } = view;
  const url = `${SITE_URL}${profileHref(profile.slug)}`;

  // About: the owner's words unless the hero's intro already says them all. The column always keeps
  // something, so a page with nothing else still says who this is.
  const mainHasOther = media.rows.length > 0 || products.rows.length > 0 || education.rows.length > 0;
  const aboutHtml = view.about && (!view.aboutRepeatsIntro || !mainHasOther) ? view.about : null;
  const aboutFallback =
    !aboutHtml && !mainHasOther
      ? brand
        ? `${profile.name} is part of the Glamlink industry directory.`
        : `${profile.name} is a beauty + wellness professional on Glamlink.`
      : null;
  const showAbout = Boolean(aboutHtml || aboutFallback || view.specialties.length > 0 || view.topics.length > 0);
  const aboutImage = showAbout ? view.aboutImage : null;

  const sameAs = [view.website, ...view.social.map((link) => link.url)].filter(Boolean);

  return (
    <ProfileTracker slug={profile.slug}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": brand ? "Organization" : "Person",
          name: profile.name,
          url,
          ...(brand ? { logo: profile.image ?? undefined } : { image: profile.image ?? undefined }),
          description: view.intro || profile.tagline || clip(view.aboutText, 300) || undefined,
          ...(!brand && profile.specialty ? { jobTitle: profile.specialty } : {}),
          ...(view.place
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

      <ProfileHero
        name={profile.name}
        tagline={profile.tagline}
        intro={view.intro}
        website={view.website}
        cover={profile.cover_image}
      />

      <ProfileIdentity
        name={profile.name}
        brand={brand}
        image={profile.image}
        subtitle={view.subtitle}
        website={view.website}
        social={view.social}
        place={view.place}
        shareUrl={url}
      />

      <div className="container-glamlink pb-20 md:pb-24">
        <div className="mt-8 grid gap-12 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
          <div className="min-w-0 space-y-12 sm:space-y-6">
            {media.rows.length > 0 && (
              <ProfilePanel
                id="profile-media"
                title="Media & Images"
                action={viewAll(media.count, Math.min(media.rows.length, MEDIA_SHOWN), profileSectionHref(profile.slug, "media"))}
              >
                <MediaGallery items={media.rows.slice(0, MEDIA_SHOWN)} label={`Photos and videos of ${profile.name}`} />
              </ProfilePanel>
            )}

            {showAbout && (
              <ProfilePanel id="profile-about" title={`About ${profile.name}`}>
                <div
                  className={cn(
                    "grid gap-6",
                    aboutImage && "md:grid-cols-[minmax(0,1fr)_240px] lg:grid-cols-[minmax(0,1fr)_200px] xl:grid-cols-[minmax(0,1fr)_240px]"
                  )}
                >
                  <div className="min-w-0 text-base leading-relaxed text-foreground/90">
                    {aboutHtml ? (
                      <RichText html={aboutHtml} fold />
                    ) : (
                      aboutFallback && <p className="text-muted-foreground">{aboutFallback}</p>
                    )}

                    {view.specialties.length > 0 && (
                      <div className={cn((aboutHtml || aboutFallback) && "mt-6")}>
                        <h3 className="eyebrow">Specialties</h3>
                        <ul className="mt-2.5 flex flex-wrap gap-2">
                          {view.specialties.map((specialty) => (
                            <li key={specialty} className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-secondary">
                              {specialty}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {view.topics.length > 0 && (
                      <div className={cn((aboutHtml || aboutFallback || view.specialties.length > 0) && "mt-5")}>
                        <h3 className="eyebrow">Topics</h3>
                        <ul className="mt-2.5 flex flex-wrap gap-2">
                          {view.topics.map((topic) => (
                            <li key={topic.id}>
                              <Link href={topicHref(topic)} className="chip inline-flex rounded-full px-3 py-1 text-xs">
                                {topic.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {aboutImage && (
                    <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted md:self-start">
                      <ApiImage
                        src={aboutImage}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 240px, (min-width: 1024px) 200px, (min-width: 768px) 240px, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </ProfilePanel>
            )}

            {products.rows.length > 0 && (
              <ProfilePanel
                id="profile-products"
                title="Featured Products"
                action={viewAll(products.count, products.rows.length, profileSectionHref(profile.slug, "products"))}
              >
                <HomeCarousel label={`Products from ${profile.name}`}>
                  {products.rows.map((product) => (
                    <li key={product.id} className={PRODUCT_SLIDE}>
                      <ProductTile
                        product={product}
                        sizes="(min-width: 1280px) 160px, (min-width: 1024px) 150px, (min-width: 640px) 30vw, 45vw"
                        linkData={trackAs("PRODUCT_CLICK", product.id)}
                      />
                    </li>
                  ))}
                </HomeCarousel>
              </ProfilePanel>
            )}

            {education.rows.length > 0 && (
              <ProfilePanel
                id="profile-education"
                title="Education"
                action={viewAll(
                  education.count,
                  Math.min(education.rows.length, EDUCATION_SHOWN),
                  profileSectionHref(profile.slug, "education")
                )}
              >
                <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
                  {education.rows.slice(0, EDUCATION_SHOWN).map((item) => (
                    <li key={item.id} className="w-[80%] shrink-0 snap-start sm:w-auto">
                      <EducationTile
                        slug={profile.slug}
                        item={item}
                        sizes="(min-width: 1280px) 260px, (min-width: 1024px) 20vw, (min-width: 640px) 30vw, 80vw"
                      />
                    </li>
                  ))}
                </ul>
              </ProfilePanel>
            )}
          </div>

          <ProfileSidebar profile={profile} view={view} />
        </div>
      </div>
    </ProfileTracker>
  );
}
