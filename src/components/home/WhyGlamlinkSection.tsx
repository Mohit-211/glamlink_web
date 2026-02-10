import {
  ShieldCheck,
  Package,
  Sparkles,
  Heart,
  Search,
  Calendar,
  TrendingUp,
  Wrench,
  CreditCard,
  CalendarCheck,
  BarChart2,
} from "lucide-react";

const clientBenefits = [
  {
    icon: ShieldCheck,
    title: "Verified Professionals",
    description: "Every pro is vetted and verified for quality",
  },
  {
    icon: Package,
    title: "Shop-Approved Products",
    description: "Access trusted beauty products and tools",
  },
  {
    icon: Sparkles,
    title: "One-Stop Beauty Hub",
    description: "Find everything beauty in one place",
  },
  {
    icon: Heart,
    title: "Support Small Business",
    description: "Empower independent beauty entrepreneurs",
  },
];

const proBenefits = [
  {
    icon: Search,                  // Perfect: magnifying glass = "Get Discovered" / clients find you
    title: "Get Discovered",
    description: "Clients find you based on location & specialty",
  },
  {
    icon: Calendar,                // Good: calendar = scheduling / booking
    title: "Easy Booking",
    description: "Streamlined scheduling that works for you",
  },
  {
    icon: CalendarCheck,           // Suggestion: better than plain Calendar — implies confirmed / in-app bookings
    // Alternative: CalendarPlus (if it's about adding bookings)
    title: "In-App Booking",
    description: "Flexible scheduling built for you",
  },
  {
    icon: Wrench,                  // Reasonable: tools / customize = wrench (settings / build)
    // Suggestion: Settings or Sliders (more UI/customization feel), or Brush (if creative profile styling)
    title: "Grow Your Business",
    description: "Customize your profile with services menu, content, reviews and your shop",
  },
  {
    icon: BarChart2,               // Suggestion: better than CreditCard — growth, visibility & stats
    // Alternative: TrendingUp (already used elsewhere, but fits "visibility and growth")
    title: "Smart Tools",
    description: "Helpful features to support your visibility and growth",
  },
  {
    icon: TrendingUp,              // Excellent fit: growth, evolving platform, upward progress
    // (You already have TrendingUp earlier — this re-uses it nicely for the final point)
    title: "Built to Grow With You",
    description: "A platform evolving alongside modern professionals",
  },
];

const WhyGlamlinkSection = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-glamlink">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* For Clients */}
          <div id="clients">
            <div className="mb-8">
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                For Clients
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2">
                <span className="gradient-text">Why Glamlink ?</span>
              </h2>
            </div>

            <div className="space-y-6">
              {clientBenefits.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4 group">
                  <div className="feature-icon shrink-0 transition-transform group-hover:scale-110">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {title}
                    </h3>
                    <p className="text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Professionals */}
          <div className="lg:border-l lg:border-border lg:pl-16">
            <div className="mb-8">
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                For Professionals
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2">
               <span className="gradient-text"> Grow Your Beauty Brand</span>
              </h2>
            </div>

            <div className="space-y-6">
              {proBenefits.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4 group">
                  <div className="feature-icon shrink-0 transition-transform group-hover:scale-110">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {title}
                    </h3>
                    <p className="text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyGlamlinkSection;
