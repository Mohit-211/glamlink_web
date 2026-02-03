import { 
  MapPin, 
  Star, 
  ShoppingCart, 
  Share2, 
  Crown, 
  BookOpen, 
  Sparkles, 
  BarChart3,
  MessageSquare,
  Calendar,
  CreditCard,
  Users
} from 'lucide-react';

const capabilities = [
  {
    icon: MapPin,
    title: 'Geo-Discovery',
    description: 'Clients find you based on location. Appear in local searches and nearby recommendations automatically.',
    highlight: false,
  },
  {
    icon: Star,
    title: 'Reviews That Convert',
    description: 'Showcase verified reviews and ratings that build trust and drive bookings.',
    highlight: false,
  },
  {
    icon: ShoppingCart,
    title: 'Built-In E-Commerce',
    description: 'Sell products directly through your profile. No third-party stores needed.',
    highlight: true,
  },
  {
    icon: Share2,
    title: 'Social That Converts',
    description: 'Create clips, galleries, and before/afters that link directly to booking and shopping.',
    highlight: false,
  },
  {
    icon: Crown,
    title: 'Founder Badge Prestige',
    description: 'Early adopters get a permanent badge signaling credibility and commitment.',
    highlight: true,
  },
  {
    icon: BookOpen,
    title: 'Editorial Exposure',
    description: 'Get featured in Glamlink\'s magazine-style editorial for maximum visibility.',
    highlight: false,
  },
  {
    icon: Sparkles,
    title: 'AI Discovery Assistant',
    description: 'Our AI helps match you with the right clients based on expertise and style.',
    comingSoon: true,
    highlight: false,
  },
  {
    icon: BarChart3,
    title: 'Business Growth Tools',
    description: 'Analytics, insights, and recommendations to help you grow smarter.',
    highlight: false,
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Integrated booking system synced with your calendar for seamless appointments.',
    highlight: false,
  },
  {
    icon: MessageSquare,
    title: 'Client Messaging',
    description: 'Built-in chat for consultations, follow-ups, and building relationships.',
    highlight: false,
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Accept payments, deposits, and tips with our secure payment processing.',
    highlight: false,
  },
  {
    icon: Users,
    title: 'Community Access',
    description: 'Connect with other pros, share tips, and grow together in our community.',
    highlight: false,
  },
];

const CapabilitiesGrid = () => {
  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container-glamlink">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Complete Toolkit
          </span>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4">
            Everything You Need To{' '}
            <span className="gradient-text">Create, Build & Dominate</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            One unified ecosystem designed to replace all your fragmented tools. 
            Everything works together seamlessly.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {capabilities.map((cap, index) => (
            <div 
              key={index} 
              className={`relative bg-card rounded-2xl p-6 border transition-all hover:-translate-y-1 group ${
                cap.highlight 
                  ? 'border-primary/30 bg-gradient-to-br from-primary/5 to-transparent' 
                  : 'border-border hover:border-primary/30'
              }`}
            >
              {cap.comingSoon && (
                <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  Coming Soon
                </span>
              )}
              
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                cap.highlight ? 'bg-primary text-primary-foreground' : 'bg-primary/10'
              }`}>
                <cap.icon className={`w-6 h-6 ${cap.highlight ? '' : 'text-primary'}`} />
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">{cap.title}</h3>
              <p className="text-sm text-muted-foreground">{cap.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom message */}
        <div className="text-center mt-12 p-8 bg-card rounded-2xl border border-border">
          <p className="text-lg text-muted-foreground">
            <span className="text-foreground font-semibold">Stop paying for 10 different tools.</span>{' '}
            Glamlink gives you everything in one place — designed specifically for beauty professionals.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesGrid;
