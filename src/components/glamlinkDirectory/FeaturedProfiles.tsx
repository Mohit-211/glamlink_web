"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { FeaturedProfile } from "@/lib/directory";
import FeaturedProfileCard from "./FeaturedProfileCard";
import { getBusinessProfile } from "@/api/Api";

/* Maps a public card (`businessCard/getAllProfiles`: accepted cards only) to the featured card shape. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toFeaturedProfile = (card: any): FeaturedProfile => {
  const location =
    card?.locations?.find((loc: { is_primary?: boolean }) => loc?.is_primary) ??
    card?.locations?.[0] ??
    {};
  return {
    id: String(card?.id ?? card?._id ?? ""),
    name: card?.name || card?.business_name || "",
    title: card?.professional_title || card?.primary_specialty || "",
    city: location?.city ?? card?.city ?? "",
    state: location?.state || card?.state || "",
    address: location?.address || card?.address || "",
    imageUrl: card?.profile_image || "",
    featuredIn: card?.featured_in || "Editorial",
    href: card?.business_card_link || undefined,
  };
};

export default function FeaturedProfiles({
  profiles: fallbackProfiles = [],
}: {
  profiles?: FeaturedProfile[];
}) {
  const [apiProfiles, setApiProfiles] = useState<FeaturedProfile[]>([]);
  const profiles = apiProfiles.length ? apiProfiles : fallbackProfiles;

  useEffect(() => {
    let active = true;
    getBusinessProfile()
      .then((res: any) => {
        if (active) setApiProfiles((res?.data || []).map(toFeaturedProfile));
      })
      .catch((error) => console.log("API error:", error));
    return () => {
      active = false;
    };
  }, []);

  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateControls();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);
    return () => {
      track.removeEventListener("scroll", updateControls);
      window.removeEventListener("resize", updateControls);
    };
  }, [updateControls, profiles.length]);

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
  };

  if (!profiles.length) return null;

  return (
    <section
      aria-labelledby="featured-on-glamlink"
      className="relative py-16 md:py-24 bg-background"
    >
      <div className="container-glamlink">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8 md:mb-10">
          <div className="max-w-2xl">
            <span className="badge-soft text-xs">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              Curated by Glamlink
            </span>
            <h2 id="featured-on-glamlink" className="section-title mt-4">
              Featured on Glamlink
            </h2>
            <p className="section-subtitle">
              Meet professionals and businesses featured across our editorial, The Beauty Vault
              and Expert Takes.
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollByPage(-1)}
              disabled={!canPrev}
              aria-label="Previous featured profiles"
              aria-controls="featured-track"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border bg-card text-foreground shadow-soft transition hover:border-primary/50 hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollByPage(1)}
              disabled={!canNext}
              aria-label="Next featured profiles"
              aria-controls="featured-track"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border bg-card text-foreground shadow-soft transition hover:border-primary/50 hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          id="featured-track"
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured Glamlink profiles"
          tabIndex={0}
          className="-mx-5 px-5 sm:mx-0 sm:px-0 scroll-px-5 sm:scroll-px-0 flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory overscroll-x-contain pb-4 outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-[1.75rem]"
        >
          {profiles.map((profile) => (
            <FeaturedProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </div>
    </section>
  );
}
