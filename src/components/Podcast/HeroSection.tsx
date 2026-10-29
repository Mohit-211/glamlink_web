"use client";

import Image from "next/image";
import heroPhoto from "../../../public/home-hero/podcast-hero.png";

interface HeroSectionProps {
  onGuestClick: () => void;
}

/** On phones the text comes first and the photo under it; from lg the photo fills the band behind the text. */
export default function HeroSection({ onGuestClick }: HeroSectionProps) {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    window.open("https://mailchi.mp/glamlink/subscribe", "_blank");
  };

  return (
    <section aria-labelledby="podcast-hero-heading" className="border-b border-border bg-background pt-16 md:pt-20">
      <div className="grid lg:min-h-136">
        <div className="container-glamlink relative z-10 py-10 md:py-14 lg:col-start-1 lg:row-start-1 lg:self-center lg:py-16">
          <div className="max-w-xl animate-fade-up">
            {/* Eyebrow */}
            <span className="badge-soft text-xs sm:text-sm">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary animate-pulse" aria-hidden="true" />
              New Episode Every Week
            </span>

            {/* Title */}
            <h1 id="podcast-hero-heading" className="hero-title mt-6">
              The Beauty <span className="text-primary">Vault</span>
            </h1>

            {/* Description */}
            <p className="hero-subtitle mt-6 max-w-lg">
              Unfiltered conversations with the professionals, founders, and
              innovators actively shaping the future of beauty and wellness.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap gap-4">
              <button type="button" onClick={onGuestClick} className="btn-primary btn-lg">
                Apply to be a guest
              </button>
              <button type="button" onClick={handleSubscribe} className="btn-outline btn-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* The studio: microphone, headphones and the show's books on a marble table */}
        <div className="relative mx-5 mb-10 aspect-video overflow-hidden rounded-3xl sm:mx-6 lg:col-start-1 lg:row-start-1 lg:m-0 lg:aspect-auto lg:rounded-none">
          <Image
            src={heroPhoto}
            alt=""
            fill
            preload
            placeholder="blur"
            sizes="100vw"
            className="object-cover object-right"
          />
          <div className="absolute inset-0 hidden bg-linear-to-r from-background via-background/85 via-35% to-transparent to-70% lg:block" />
        </div>
      </div>
    </section>
  );
}
