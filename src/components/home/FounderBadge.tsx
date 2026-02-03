import { Crown, Star, Zap, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

const perks = [
  "Exclusive Founder Badge on profile",
  "Priority feature access",
  "Founding member recognition",
  "Early access to new tools",
];

const FounderBadge = () => {
  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container-glamlink">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge Visual */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-warning/20 blur-3xl rounded-full scale-150" />
            <div className="relative">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-warning via-warning to-amber-600 flex items-center justify-center shadow-large animate-float">
                <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-full bg-background flex items-center justify-center border-4 border-warning/30">
                  <Crown className="w-12 h-12 lg:w-16 lg:h-16 text-warning" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 badge-founder">
                <Star className="w-4 h-4 fill-current" />
              </div>
            </div>
          </div>

          {/* Content */}
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Limited to First 100 Members
          </span>

          <h2 className="section-heading text-3xl lg:text-4xl mb-4">
            Claim Your <span className="text-warning">Founder Badge</span>
          </h2>

          <p className="section-subheading mx-auto mb-10">
            Be among the first 100 beauty professionals to join Glamlink and
            receive exclusive Founder status—a permanent mark of recognition on
            your profile.
          </p>

          {/* Perks Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {perks.map((perk) => (
              <div
                key={perk}
                className="card-glamlink py-4 flex items-center gap-3"
              >
                <Gift className="w-5 h-5 text-warning shrink-0" />
                <span className="text-sm font-medium text-foreground text-left">
                  {perk}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="btn-hero bg-warning hover:bg-warning/90 shadow-none hover:shadow-lg">
              Claim Founder Badge
            </Button>
            <span className="text-sm text-muted-foreground">
              Only 23 spots remaining
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderBadge;
