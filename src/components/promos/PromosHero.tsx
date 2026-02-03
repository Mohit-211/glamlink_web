import { Sparkles, MapPin } from 'lucide-react';

const PromosHero = () => {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="container-glamlink">
        <div className="max-w-2xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Exclusive Offers</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4">
            Glamlink{' '}
            <span className="gradient-text">Launch Perks</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            This space will feature exclusive deals, giveaways, and special promotions 
            tied to curated launches — including our upcoming Vegas launch event.
          </p>

          {/* Launch hint */}
          <div className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-full border border-border bg-card">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">Vegas Launch</span> — Coming Soon
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromosHero;
