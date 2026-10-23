"use client";

interface HeroSectionProps {
  onGuestClick: () => void;
}

export default function HeroSection({ onGuestClick }: HeroSectionProps) {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    window.open("https://mailchi.mp/glamlink/subscribe", "_blank");
  };

  return (
    <section className="hero-glamlink bg-background border-b border-border">
      <div className="container-glamlink">
        <div className="max-w-2xl animate-fade-up">
          {/* Eyebrow */}
          <span className="badge-soft text-xs sm:text-sm">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            New Episode Every Week
          </span>

          {/* Title */}
          <h1 className="hero-title mt-6">
            The Beauty <span className="text-primary">Vault</span>
          </h1>

          {/* Description */}
          <p className="hero-subtitle mt-6 max-w-xl">
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
    </section>
  );
}
