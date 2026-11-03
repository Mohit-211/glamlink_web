"use client";

import PageHero from "@/components/common/PageHero";
import heroPhoto from "../../../public/home-hero/podcast-hero.png";

interface HeroSectionProps {
  onGuestClick: () => void;
}

/** The studio photo: microphone, headphones and the show's books on a marble table. */
export default function HeroSection({ onGuestClick }: HeroSectionProps) {
  return (
    <PageHero
      id="podcast-hero"
      eyebrow="New Episode Every Week"
      title={
        <>
          The Beauty Vault
        </>
      }
      subtitle="Unfiltered conversations with the professionals, founders, and innovators actively shaping the future of beauty and wellness."
      image={heroPhoto}
    >
      <div className="flex flex-wrap gap-4">
        <button type="button" onClick={onGuestClick} className="btn-primary btn-lg">
          Apply to be a guest
        </button>
        <a
          href="https://mailchi.mp/glamlink/subscribe"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline btn-lg"
        >
          Subscribe
        </a>
      </div>
    </PageHero>
  );
}
