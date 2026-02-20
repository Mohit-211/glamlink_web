"use client";

import { MapPin, Star, ShoppingBag, Share2, Award, BookOpen, Brain, TrendingUp, Sparkles } from "lucide-react";

export default function EverythingYouNeedSection() {
  const features = [
    {
      icon: Brain,
      title: "AI Discovery",
      description: "When our AI launches, it will recommend YOU and your products directly to clients based on their needs",
      isPremium: true,
      gradient: "from-purple-600 to-pink-600",
      size: "large"
    },
    {
      icon: Award,
      title: "Founders Badge",
      description: "Available only for our first 100 professionals. Get featured, gain priority visibility, and exclusive perks",
      isPremium: true,
      gradient: "from-glamlink-teal to-cyan-500",
      hasGlow: true
    },
    {
      icon: MapPin,
      title: "Geo-Discovery",
      description: "Be discovered by new clients near you with our powerful location-based search"
    },
    {
      icon: Star,
      title: "Reviews That Sell",
      description: "Collect verified reviews that build instant trust and turn browsers into bookings"
    },
    {
      icon: ShoppingBag,
      title: "E-Commerce",
      description: "Sell professional-grade products directly from your profile"
    },
    {
      icon: Share2,
      title: "Social Media That Converts",
      description: "Post content, share clips, build photo albums, and connect with clients—all without fighting algorithms",
      size: "medium"
    },
    {
      icon: BookOpen,
      title: "The Glamlink Edit",
      description: "Get insider access to new features, latest beauty trends and unlock opportunities to be featured",
      isComingSoon: false,
    },
    {
      icon: TrendingUp,
      title: "Business Growth Tools",
      description: "Access analytics, AI-powered brainstorming, and business insights to scale your success"
    }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-glamlink-teal/20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full filter blur-3xl" />
      </div>

      {/* Dot pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-glamlink-teal/10 backdrop-blur-sm rounded-full text-glamlink-teal text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              All-In-One Platform
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Everything You Need To
              <span className="block mt-2 bg-gradient-to-r from-glamlink-teal to-cyan-400 bg-clip-text text-transparent">
                Create, Build & Dominate
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Stop juggling multiple platforms. Start dominating one. Glamlink is the only platform 
              built for beauty and wellness professionals that combines social media, booking, and e-commerce 
              in one powerful ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isLarge = feature.size === "large";
              const isMedium = feature.size === "medium";
              
              return (
                <div
                  key={index}
                  className={`
                    relative group
                    ${isLarge ? 'lg:col-span-2 lg:row-span-2' : ''}
                    ${isMedium ? 'lg:col-span-2' : ''}
                  `}
                >
                  <div className={`
                    relative h-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 
                    border border-gray-700/50 overflow-hidden
                    transition-all duration-500 ease-out
                    hover:transform hover:scale-[1.02] hover:border-glamlink-teal/50
                    ${feature.hasGlow ? 'shadow-lg shadow-glamlink-teal/20' : ''}
                    ${feature.isPremium ? 'bg-gradient-to-br from-gray-800/70 to-gray-900/70' : ''}
                  `}>
                    {/* Premium gradient border */}
                    {feature.isPremium && (
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                    )}

                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-glamlink-teal/0 to-cyan-500/0 group-hover:from-glamlink-teal/10 group-hover:to-cyan-500/10 transition-all duration-500" />

                    <div className="relative z-10">
                      <div className={`
                        inline-flex items-center justify-center mb-6
                        ${isLarge ? 'w-20 h-20' : 'w-14 h-14'}
                        ${feature.gradient ? `bg-gradient-to-br ${feature.gradient}` : 'bg-gray-700/50'}
                        rounded-xl shadow-lg
                        group-hover:shadow-xl group-hover:shadow-glamlink-teal/20
                        transition-all duration-300
                      `}>
                        <Icon className={`${isLarge ? 'w-10 h-10' : 'w-7 h-7'} text-white`} />
                      </div>

                      <h3 className={`
                        font-bold text-white mb-4
                        ${isLarge ? 'text-2xl md:text-3xl' : 'text-xl'}
                      `}>
                        {feature.title}
                        {feature.isComingSoon && (
                          <span className="ml-3 text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-3 py-1 rounded-full font-semibold">
                            Coming Soon
                          </span>
                        )}
                      </h3>

                      <p className={`
                        text-gray-300 leading-relaxed
                        ${isLarge ? 'text-lg' : 'text-base'}
                      `}>
                        {feature.description}
                      </p>

                      {feature.isPremium && (
                        <div className="mt-6">
                          <div className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                            <Sparkles className="w-4 h-4 text-glamlink-teal" />
                            Premium Feature
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Corner accent */}
                    {feature.isPremium && (
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-10 blur-2xl`} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <p className="text-gray-400 text-lg">
              Join the platform that's revolutionizing beauty commerce
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}