import { Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MagazineHero = () => {
  return (
    <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="container-glamlink relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Elegant badge */}
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-px bg-border" />
            <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
              Est. 2025
            </span>
            <div className="w-12 h-px bg-border" />
          </div>

          {/* Title */}
          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-serif font-light text-foreground mb-6 tracking-tight">
            The Glamlink{' '}
            <span className="italic font-normal">Edit</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            Your weekly source for industry leaders and rising stars. 
            Discover top professional treatments, curated products, and insider insights 
            from the world of beauty and wellness.
          </p>

          {/* Newsletter CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="relative flex-1 max-w-md w-full">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-4 rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <Button className="btn-primary px-8 py-4 rounded-full gap-2">
              <Sparkles className="w-4 h-4" />
              Subscribe to Newsletter
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Join 12,000+ beauty enthusiasts. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MagazineHero;
