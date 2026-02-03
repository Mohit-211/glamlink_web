import { Sparkles, ArrowRight, Crown, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProfessionalsCTA = () => {
  return (
    <section className="py-20 lg:py-28 bg-primary relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="container-glamlink relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Limited Availability</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6">
            Your Future in Beauty{' '}
            <span className="text-white/80">Starts Here</span>
          </h2>

          {/* Description */}
          <p className="text-lg lg:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join the next generation of beauty professionals who are building thriving businesses 
            on Glamlink. The platform is launching soon — secure your spot now.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white">2,847</div>
              <div className="text-sm text-white/70">Professionals Joined</div>
            </div>
            <div className="w-px h-12 bg-white/20 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white">23</div>
              <div className="text-sm text-white/70">Founder Spots Left</div>
            </div>
            <div className="w-px h-12 bg-white/20 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white">50%</div>
              <div className="text-sm text-white/70">Fee Discount</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-semibold gap-2 shadow-lg">
              <Crown className="w-5 h-5" />
              Join as Founding Member
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg gap-2"
            >
              Access E-Commerce Panel
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Trust line */}
          <div className="flex items-center justify-center gap-2 mt-8 text-white/60">
            <Users className="w-4 h-4" />
            <span className="text-sm">Join 2,847 professionals already growing with Glamlink</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalsCTA;
