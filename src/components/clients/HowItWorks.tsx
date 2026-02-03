import { Search, Play, ShoppingCart, Star } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: Search,
    title: 'Search Smart',
    description: 'Find the perfect beauty professional or product by specialty, location, ratings, or style. Our smart filters make discovery effortless.',
  },
  {
    number: 2,
    icon: Play,
    title: 'See Beauty in Action',
    description: 'Watch clips, browse before-and-after galleries, and explore portfolios to find pros whose work speaks to your vision.',
  },
  {
    number: 3,
    icon: ShoppingCart,
    title: 'Book or Shop',
    description: 'Request appointments directly or shop expert-curated products. One platform for services and the products to maintain your look.',
  },
  {
    number: 4,
    icon: Star,
    title: 'Glow & Grow',
    description: 'Share your experience with reviews, save your favorites, and build your beauty circle with professionals you trust.',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container-glamlink">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="section-heading text-3xl lg:text-4xl mb-4">
            How Glamlink Works <span className="gradient-text">For You</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From discovery to glow-up, we make every step simple and enjoyable.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-16 bg-gradient-to-b from-primary/30 to-primary/10 hidden sm:block" />
              )}

              <div className="flex gap-6 mb-8 lg:mb-12 group">
                {/* Number Badge */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-primary transition-transform duration-300 group-hover:scale-110">
                    <span className="text-primary-foreground font-bold text-lg">{step.number}</span>
                  </div>
                </div>

                {/* Content Card */}
                <div className="flex-1 card-glamlink flex flex-col sm:flex-row items-start gap-4">
                  <div className="feature-icon shrink-0">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
