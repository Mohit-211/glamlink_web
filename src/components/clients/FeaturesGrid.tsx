import { 
  ShieldCheck, 
  ImageIcon, 
  PlayCircle, 
  ShoppingBag, 
  CalendarCheck,
  Sparkles
} from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Certified Professionals',
    description: 'Discover verified beauty experts through real reviews, ratings, and proven expertise. Every pro is vetted for quality.',
  },
  {
    icon: ImageIcon,
    title: 'Before & After Galleries',
    description: 'Browse authentic transformation galleries to see real results before you book. No filters, no surprises.',
  },
  {
    icon: PlayCircle,
    title: 'Expert Beauty Clips',
    description: 'Watch short-form videos from top professionals for tips, tutorials, and inspiration to elevate your look.',
  },
  {
    icon: ShoppingBag,
    title: 'Shop Pro-Approved Products',
    description: 'Access curated products recommended by the professionals you trust—delivered straight to your door.',
  },
  {
    icon: CalendarCheck,
    title: 'Easy Appointment Booking',
    description: 'Request and confirm appointments in seconds. View availability, select services, and book with one tap.',
  },
  {
    icon: Sparkles,
    title: 'AI Beauty Companion',
    description: 'Get personalized recommendations, style suggestions, and beauty guidance powered by AI—tailored just for you.',
    comingSoon: true,
  },
];

const FeaturesGrid = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-glamlink">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="section-heading text-3xl lg:text-4xl mb-4">
            Your Link To <span className="gradient-text">Everything Beauty</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            One platform connecting you to professionals, products, and personalized experiences that transform the way you discover beauty.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card-glamlink group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Coming Soon Badge */}
              {feature.comingSoon && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    Coming Soon
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className="feature-icon mb-5 transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
