import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GlamCardCTA = () => {
  return (
    <section className="py-20 lg:py-28 bg-primary relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="container-glamlink relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Join the Network</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4">
            Ready to Get Your Digital Card?
          </h2>

          {/* Description */}
          <p className="text-lg lg:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join the Glamlink network and be discovered by clients looking for exactly what you offer. 
            Your professional presence starts here.
          </p>

          {/* Perks */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
            {[
              'Free Digital Business Card',
              'Quick Approval',
              'Professional Presence',
            ].map((perk, idx) => (
              <div key={idx} className="flex items-center gap-2 text-white/90">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{perk}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-semibold gap-2 shadow-lg">
              Apply for Digital Card
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg gap-2"
            >
              Access E-Commerce Panel
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlamCardCTA;
