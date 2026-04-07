import {
  Play,
  ShoppingBag,
  Video,
  Layers,
  Wrench,
  TrendingUp,
  Users,
  DollarSign,
  Globe,
} from "lucide-react";

const benefits = [
  {
    icon: Globe,
    title: "Run Your Shop Everywhere",
    description:
      "Your products appear across all Glamlink surfaces — discovery, profiles, content, and more.",
    metric: "10x",
    metricLabel: "More visibility",
  },
  {
    icon: Video,
    title: "Sell Through Content",
    description:
      "Link products directly to your clips, galleries, and posts. Content that converts.",
    metric: "47%",
    metricLabel: "Higher conversion",
  },
  {
    icon: Layers,
    title: "Integrated Ecosystem",
    description:
      "Booking, products, payments, and messaging — all in one seamless platform.",
    metric: "1",
    metricLabel: "Platform for all",
  },
  {
    icon: Wrench,
    title: "Tools Built For You",
    description:
      "Analytics, inventory, promotions, and customer insights designed for beauty pros.",
    metric: "24/7",
    metricLabel: "Support & insights",
  },
];

const SalesSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container-glamlink">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <DollarSign className="w-4 h-4" />
            Revenue Engine
          </span>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl  text-foreground mb-4">
            Turn Your Expertise Into{" "}
            <span className="gradient-text">Unstoppable Sales</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Glamlink isn't just a directory — it's a complete business platform
            designed to maximize your income.
          </p>
        </div>

        {/* Video Placeholder */}
        <div className="relative max-w-4xl mx-auto mb-16">
          <div className="aspect-video rounded-3xl bg-gradient-to-br from-secondary via-secondary/50 to-primary/10 border border-border overflow-hidden relative group cursor-pointer">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/30">
                <Play className="w-8 h-8 lg:w-10 lg:h-10 text-primary-foreground ml-1" />
              </div>
            </div>

            {/* Coming soon badge */}
            <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl">
              {/* Gradient Background */}
              <div className="bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 px-8 py-42 text-center text-white">
                {/* Floating Badge */}
                <div className="absolute top-6 left-6">
                  <span
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
        bg-white/15 backdrop-blur-md 
        text-white text-sm font-medium 
        border border-white/30 shadow-lg"
                  >
                    <Video className="w-4 h-4 text-white" />
                    Pro Education Series — Coming Soon
                  </span>
                </div>

                {/* Play Icon */}
                <div className="flex justify-center mb-6">
                  <div
                    className="w-16 h-16 flex items-center justify-center rounded-full 
        bg-white/20 backdrop-blur-md"
                  >
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>

                {/* Heading */}
                <h2 className="text-3xl md:text-4xl  mb-4">
                  Professional Video Coming Soon
                </h2>

                {/* Subtitle */}
                <p className="text-white/90 max-w-xl mx-auto">
                  Stay tuned for exclusive content showing how pros maximize
                  their earnings
                </p>
              </div>
            </div>

            {/* Decorative thumbnails */}
            <div className="absolute bottom-6 right-6 flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-16 h-12 rounded-lg bg-background/20 backdrop-blur-sm border border-white/10"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all group hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {benefit.description}
              </p>

              {/* Metric indicator */}
              <div className="pt-4 border-t border-border">
                <span className="text-2xl  text-primary">{benefit.metric}</span>
                <p className="text-xs text-muted-foreground">
                  {benefit.metricLabel}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-8 border-t border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-medium">2,847 Professionals</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <span className="font-medium">15,000+ Products</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="font-medium">$2.3M+ in Sales</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesSection;
