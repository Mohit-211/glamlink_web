import { Zap, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PromoBanner = () => {
  return (
    <section className="py-0">
      <div className="bg-gradient-to-r from-primary via-primary to-primary/90 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

        <div className="container-glamlink py-12 lg:py-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
                <Clock className="w-4 h-4" />
                Limited Time Offer
              </div>
              
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4">
                Join Now, Pay Less
              </h2>
              
              <p className="text-lg text-white/80 max-w-xl">
                Lock in our introductory platform fees before they increase. 
                Early members get <span className="text-white font-semibold">50% off</span> for life.
              </p>

              {/* Urgency indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-6">
                <div className="flex items-center gap-2 text-white/90">
                  <Zap className="w-5 h-5" />
                  <span className="font-medium">Only 2.5% platform fee</span>
                </div>
                <div className="w-px h-6 bg-white/30 hidden sm:block" />
                <div className="text-white/90">
                  <span className="font-medium">vs 5% after launch</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center gap-4">
              <Button className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-semibold gap-2 shadow-lg">
                Start Selling Today
                <ArrowRight className="w-5 h-5" />
              </Button>
              <p className="text-white/70 text-sm">No credit card required</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
