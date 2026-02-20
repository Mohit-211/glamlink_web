"use client";

import CardWithIconAnimated from "@/lib/components/CardWithIconAnimated";

export default function EverythingYouNeedSection() {
  const features = [
    {
      title: "Geo-Discovery",
      description: "Be discovered by new clients near you with our powerful location-based search",
      icon: "/icons/geo_discovery_4_transparent.png",
      animation: "animate-pulse-radar"
    },
    {
      title: "Reviews That Sell",
      description: "Collect verified reviews that build instant trust and turn browsers into bookings",
      icon: "/icons/reviews_3_transparent.png",
      animation: "animate-star-burst"
    },
    {
      title: "E-Commerce",
      description: "Sell professional-grade products directly from your profile",
      icon: "/icons/e-commerce_4_transparent.png",
      animation: "animate-bounce-cart"
    },
    {
      title: "Social Media That Converts",
      description: "Post content, share clips, build photo albums, and connect with clients—all without fighting algorithms",
      icon: "/icons/social_media_3_transparent.png",
      animation: "animate-spin-social"
    },
    {
      title: "Founders Badge",
      description: "Available only for our early professionals. Get featured, gain priority visibility, and exclusive perks",
      icon: "/icons/founder_badge_3_transparent.png",
      animation: "animate-shine"
    },
    {
      title: "The Glamlink Edit",
      description: "Get insider access to new features, learn the latest beauty trends and unlock opportunities to be featured",
      icon: "/icons/glamlink_edit_1_transparent.png",
      animation: "animate-page-flip",
      isComingSoon: false
    },
    {
      title: "AI Discovery",
      description: "When our AI launches, it will recommend YOU and your products directly to clients based on their needs",
      icon: "/icons/ai_discovery_1_transparent.png",
      animation: "animate-glitch"
    },
    {
      title: "Business Growth Tools",
      description: "Access analytics, AI-powered brainstorming, and business insights to scale your success",
      icon: "/icons/business_growth_1_transparent.png",
      animation: "animate-chart-rise"
    }
  ];

  return (
    <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Everything You Need To Create, Build & Dominate
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto">
              Stop juggling multiple platforms. Start dominating one. Glamlink is the only platform 
              built for beauty and wellness professionals that is social media, booking, e-commerce. 
              It's an all-in-one ecosystem designed to put you in control.
            </p>
          </div>

          {/* Feature Cards Grid using CardWithIconAnimated */}
          <div className="grid lg:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <CardWithIconAnimated
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                animation={feature.animation}
                isComingSoon={feature.isComingSoon}
              />
            ))}
          </div>

          {/* Additional Cards for odd numbers */}
          {features.length % 2 !== 0 && (
            <div className="grid lg:grid-cols-3 gap-6 mt-6">
              {/* Add any additional single-width cards here if needed */}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}