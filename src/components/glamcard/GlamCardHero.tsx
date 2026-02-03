import { Play, MapPin, Calendar, Star, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GlamCardHero = () => {
  return (
    <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-glamlink relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">The Future of Beauty Business</span>
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 leading-tight">
              The Link in Bio,{' '}
              <span className="gradient-text">Evolved.</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              The Glam Card is your high-conversion digital storefront — designed to turn followers 
              into clients instantly. Go beyond static links with personal video greetings, space tours, 
              promotional visuals, integrated mapping, and one-touch booking.
            </p>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Bridge the gap between discovery and confirmed appointments with a single, powerful link.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Play, text: 'Video Greetings' },
                { icon: MapPin, text: 'Integrated Maps' },
                { icon: Calendar, text: 'One-Touch Booking' },
                { icon: Star, text: 'Verified Reviews' },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            <Button className="btn-primary px-8 py-6 text-lg gap-2">
              Apply for Your Glam Card
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Right: Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Glow effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
            </div>

            {/* Phone frame */}
            <div className="relative w-[320px] lg:w-[360px] bg-card rounded-[3rem] p-3 shadow-2xl border border-border">
              <div className="bg-background rounded-[2.5rem] overflow-hidden">
                {/* Status bar */}
                <div className="h-8 bg-foreground/5 flex items-center justify-center">
                  <div className="w-20 h-5 bg-foreground/20 rounded-full" />
                </div>

                {/* Card content */}
                <div className="p-6">
                  {/* Profile header */}
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary">M</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Maya Rodriguez</h3>
                    <p className="text-muted-foreground">Hair Stylist & Colorist</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span className="text-sm font-medium text-foreground">4.9</span>
                      <span className="text-sm text-muted-foreground">(127 reviews)</span>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {['Book', 'Message', 'Shop'].map((action) => (
                      <button
                        key={action}
                        className="py-3 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                      >
                        {action}
                      </button>
                    ))}
                  </div>

                  {/* Gallery preview */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-square rounded-xl bg-secondary" />
                    ))}
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Brooklyn, NY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-primary text-primary-foreground rounded-full shadow-lg font-medium text-sm">
              ACCESS by Glamlink
            </div>
          </div>
        </div>

        {/* Ecosystem section */}
        <div className="mt-20 lg:mt-28 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
            Powered by Glamlink.{' '}
            <span className="text-muted-foreground">Built for the Beauty + Wellness Pro.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Glamlink centralizes your service menus, direct booking, clips, photo albums, 
            verified reviews, and future integrated shop into one professional destination. 
            The Glam Card is the front door — Glamlink is the engine behind your scalable growth.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GlamCardHero;
