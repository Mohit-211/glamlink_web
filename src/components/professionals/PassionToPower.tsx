import { Sparkles, Rocket, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const PassionToPower = () => {
  return (
    <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-glamlink relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">
              The Future of Beauty Business
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl lg:text-5xl xl:text-6xl  text-foreground mb-6">
            Turn Your Passion Into <span className="gradient-text">Power</span>
          </h2>

          {/* Description */}
          <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Glamlink blends viral content, e-commerce, and AI-driven discovery
            to help you claim your space, get discovered by thousands, and
            thrive like never before.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium">Viral Content</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Rocket className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium">E-Commerce Ready</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium">AI Discovery</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="btn-primary px-8 py-6 text-lg gap-2">
              <Sparkles className="w-5 h-5" />
              Become a Founding Pro
            </Button>
            <Button
              variant="outline"
              className="px-8 py-6 text-lg border-2 hover:bg-secondary"
            >
              Access E-Commerce Panel
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PassionToPower;
