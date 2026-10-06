"use client";

import CommonHero from "@/components/common/CommonHero";
import { unsplash } from "@/lib/directory/mockData";

interface HeroSectionProps {
  onGuestClick: () => void;
}

export default function HeroSection({ onGuestClick }: HeroSectionProps) {
  const handleSubscribe = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open("https://mailchi.mp/glamlink/subscribe", "_blank");
  };

  return (
    <CommonHero
      className="border-b border-border"
      eyebrow={
        <>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary animate-pulse" aria-hidden="true" />
          New Episode Every Week
        </>
      }
      title="The Beauty"
      titleHighlight="Vault"
      description="Unfiltered conversations with the professionals, founders, and innovators actively shaping the future of beauty and wellness."
      primaryAction={{ label: "Apply to be a guest", onClick: onGuestClick }}
      secondaryAction={{ label: "Subscribe", onClick: handleSubscribe }}
      collage={{
        main: { src: unsplash("1581368135153-a506cf13b1e1", 700), alt: "Podcast host recording an episode", label: "Conversations", priority: true },
        top: { src: "/podcastcover.png", alt: "The Beauty Vault podcast cover", fit: "contain" },
        bottom: { src: unsplash("1589903308904-1010c2294adc", 600), alt: "Podcast studio microphone and headphones", label: "Weekly Episodes" },
        accent: { src: unsplash("1590602847861-f357a9332bbc", 300), alt: "Studio microphone" },
      }}
    />
  );
}
