"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { FeaturedProfile } from "@/lib/directory";
import FeaturedProfileCard from "./FeaturedProfileCard";

interface FeaturedProfilesProps {
  profiles?: FeaturedProfile[];
  /** "Professionals on Glamlink" before a search; "Glamlink professionals near …" after one. */
  title?: string;
  subtitle?: string;
  badge?: string;
}

/** A row of Glamlink professionals, the first part of the directory's Explore Professionals; each card opens their page. */
export default function FeaturedProfiles({
  profiles = [],
  title = "Professionals on Glamlink",
  subtitle = "Featured professionals first, each with their own Glamlink page.",
  badge = "On Glamlink",
}: FeaturedProfilesProps) {

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
    <div role="group" aria-labelledby="featured-on-glamlink">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
        <div className="max-w-2xl">
          <span className="badge-soft text-xs">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            {badge}
          </span>
          <h3 id="featured-on-glamlink" className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h3>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={!canPrev}
            aria-label="Previous professionals"
            aria-controls="featured-track"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border bg-card text-foreground shadow-soft transition hover:border-secondary/50 hover:text-secondary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={!canNext}
            aria-label="Next professionals"
            aria-controls="featured-track"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border bg-card text-foreground shadow-soft transition hover:border-secondary/50 hover:text-secondary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
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
        aria-label="Glamlink professionals"
        tabIndex={0}
        className="-mx-5 px-5 sm:mx-0 sm:px-0 scroll-px-5 sm:scroll-px-0 flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory overscroll-x-contain pb-4 outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:ring-2 focus-visible:ring-secondary/40 rounded-3xl"
      >
        {profiles.map((profile) => (
          <FeaturedProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  );
}
