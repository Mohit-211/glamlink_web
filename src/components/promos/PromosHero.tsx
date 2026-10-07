import { Sparkles, MapPin } from "lucide-react";

const PromosHero = () => {
  return (
    <section className="hero-glamlink bg-background">
      <div className="container-glamlink">
        <div className="max-w-2xl mx-auto text-center">
          {/* Badge */}
          <span className="badge-soft text-xs sm:text-sm">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Exclusive Offers
          </span>

          {/* Headline */}
          <h1 className="hero-title mt-6">
            Glamlink <span className="gradient-text">Launch Perks</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle mt-6 max-w-xl mx-auto">
            This space will feature exclusive deals, giveaways, and special
            promotions tied to curated launches — including our upcoming Vegas
            launch event.
          </p>

          {/* Launch hint */}
          <div className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-full border border-border bg-card">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">Vegas Launch</span>{" "}
              — Coming Soon
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromosHero;
