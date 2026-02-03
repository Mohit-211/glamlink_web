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
    icon: Search,
    title: "Get Discovered",
    description: "Clients find you based on location & specialty",
  },
  {
    icon: Calendar,
    title: "Easy Booking",
    description: "Streamlined scheduling that works for you",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "Tools and insights to scale your brand",
  },
  {
    icon: Wrench,
    title: "Smart Tools",
    description: "Analytics, messaging, and management",
  },
  {
    icon: CreditCard,
    title: "Seamless Payments",
    description: "Get paid quickly and securely",
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
                Why <span className="gradient-text">Glamlink</span>?
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
                Grow Your <span className="gradient-text">Beauty Brand</span>
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
