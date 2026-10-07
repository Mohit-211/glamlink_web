"use client";

import CommonHero from "@/components/common/CommonHero";
import { unsplash } from "@/lib/directory/mockData";
import { ArrowDown } from "lucide-react";
import {
  APPLE_PODCASTS_URL,
  HOST_NAME,
  SHOW_NAME,
  SPOTIFY_URL,
  YOUTUBE_PLAYLIST_URL,
} from "./episodes";

interface HeroSectionProps {
  onGuestClick: () => void;
}

const PLATFORMS = [
  { label: "YouTube", href: YOUTUBE_PLAYLIST_URL },
  { label: "Spotify", href: SPOTIFY_URL },
  { label: "Apple Podcasts", href: APPLE_PODCASTS_URL },
];

export default function HeroSection({ onGuestClick }: HeroSectionProps) {
  return (
    <section className="hero-glamlink bg-background border-b border-border">
      <div className="container-glamlink grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-7 animate-fade-up">
          <span className="badge-soft text-xs sm:text-sm">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            {SHOW_NAME} · New episode every week
          </span>

          <h1 className="hero-title mt-6">
            Glamlink <span className="text-primary">Podcast</span>
          </h1>

          <p className="hero-subtitle mt-6 max-w-xl">
            Honest conversations with the professionals, founders and innovators
            shaping beauty and wellness, covering business, trends and the
            stories behind the industry. Hosted by {HOST_NAME}.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#episodes" className="btn-primary btn-lg">
              Explore Episodes
              <ArrowDown className="w-4 h-4" aria-hidden="true" />
            </a>
            <button type="button" onClick={onGuestClick} className="btn-outline btn-lg">
              Apply to be a guest
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="text-muted-foreground">Listen on</span>
            {PLATFORMS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <img
            src="/podcastcover.png"
            alt={`${SHOW_NAME} podcast with ${HOST_NAME}, powered by Glamlink`}
            className="mx-auto w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[420px] aspect-square rounded-2xl object-cover shadow-large"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}
