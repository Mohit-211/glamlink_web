import {
  Store,
  Eye,
  Share2,
  Palette,
  Crown,
  Star,
  Zap,
  Gift,
  ArrowRight,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ProfileCards = () => {
  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container-glamlink">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Lock-in Card */}
          <div className="bg-card rounded-3xl p-8 lg:p-10 border border-border hover:border-primary/30 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Store className="w-7 h-7 text-primary" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-warning/10 text-warning text-sm font-medium mb-4">
              Pre-Launch Access
            </span>

            <h3 className="text-2xl lg:text-3xl  text-foreground mb-4">
              Lock In Your Profile Before We Go Live
            </h3>

            <p className="text-muted-foreground mb-6">
              Be ready when the doors open. Create your professional presence
              now and own your space before the public launch.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                { icon: Eye, text: "Create instant visibility" },
                { icon: Store, text: "Own your digital storefront" },
                { icon: Share2, text: "Share services & products" },
                { icon: Palette, text: "Control your brand presence" },
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>

            <Button className="btn-primary w-full gap-2">
              Create Your Profile
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Founding Member Card */}
          <div className="bg-gradient-to-br from-primary/5 via-card to-primary/10 rounded-3xl p-8 lg:p-10 border border-primary/20 relative overflow-hidden group">
            {/* Decorative badge */}
            <div className="absolute top-6 right-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Crown className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 text-primary-foreground" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium mb-4">
              <Star className="w-3.5 h-3.5 fill-current" />
              First 100 Only
            </span>

            <h3 className="text-2xl lg:text-3xl  text-foreground mb-4">
              Become a Founding Professional
            </h3>

            <p className="text-muted-foreground mb-6">
              Join an elite group of early adopters and unlock exclusive perks
              that will never be offered again.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                { icon: Zap, text: "Priority placement in search" },
                { icon: Crown, text: "Permanent founder recognition" },
                { icon: Gift, text: "Early access to new features" },
                { icon: Star, text: "Reduced platform fees for life" },
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>

            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg gap-2">
              <Crown className="w-5 h-5" />
              Claim Founder Status
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Only <span className="text-primary font-semibold">23 spots</span>{" "}
              remaining
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileCards;
