import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ClientsCTA = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-glamlink">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-8 lg:p-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <defs>
                <pattern id="cta-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cta-pattern)" />
            </svg>
          </div>

          {/* Glow Effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/5 rounded-full blur-2xl" />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
              Meet The Pros, Shop Their Secrets,{' '}
              <span className="opacity-90">Elevate Your Best Self</span>
            </h2>

            <p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto">
              Join thousands of beauty lovers discovering trusted professionals and curated products that transform their routines.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full px-8 py-6 text-base font-semibold gap-2 shadow-large transition-all duration-300 hover:scale-105">
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Button>
              <span className="text-sm text-primary-foreground/70">
                No credit card required
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsCTA;
