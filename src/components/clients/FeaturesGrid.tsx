"use client";

import {
  ShieldCheck,
  Image as ImageIcon,
  PlayCircle,
  ShoppingBag,
  CalendarCheck,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Certified Professionals",
    description:
      "Discover verified beauty experts through real reviews, ratings, and proven expertise. Every pro is vetted for quality.",
  },
  {
    icon: ImageIcon,
    title: "Before & After Galleries",
    description:
      "Browse authentic transformation galleries to see real results before you book. No filters, no surprises.",
  },
  {
    icon: PlayCircle,
    title: "Expert Beauty Clips",
    description:
      "Watch short-form videos from top professionals for tips, tutorials, and inspiration to elevate your look.",
  },
  {
    icon: ShoppingBag,
    title: "Shop Pro-Approved Products",
    description:
      "Access curated products recommended by the professionals you trust — delivered straight to your door.",
  },
  {
    icon: CalendarCheck,
    title: "Easy Appointment Booking",
    description:
      "Request and confirm appointments in seconds. View availability, select services, and book with one tap.",
  },
  {
    icon: Sparkles,
    title: "AI Beauty Companion",
    description:
      "Get personalized recommendations, style suggestions, and beauty guidance powered by AI — tailored just for you.",
    comingSoon: true,
  },
];

const FeaturesGrid = () => {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-white via-gray-50/70 to-white overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#24bbcb]/5 rounded-full blur-3xl -translate-y-1/3 -translate-x-1/3" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#24bbcb]/5 rounded-full blur-3xl translate-y-1/3 translate-x-1/3" />
      </div>

      <div className="container-glamlink px-5 md:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl  tracking-tight text-gray-900 mb-5">
            Your Link To
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#24bbcb] via-[#1ea8b5] to-[#24bbcb] bg-clip-text text-transparent">
              Everything Beauty
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            One platform connecting you to professionals, products, and
            personalized experiences that transform the way you discover beauty.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`
                group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm
                transition-all duration-500 hover:shadow-xl hover:shadow-[#24bbcb]/15
                hover:-translate-y-2 animate-fade-up
              `}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Coming Soon Badge */}
              {feature.comingSoon && (
                <div className="absolute top-5 right-5 z-10">
                  <span className="px-4 py-1.5 rounded-full bg-[#24bbcb]/10 text-[#24bbcb] text-xs font-semibold tracking-wide uppercase">
                    Coming Soon
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#24bbcb]/10 text-[#24bbcb] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <feature.icon className="h-7 w-7" />
              </div>

              {/* Title & Description */}
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 group-hover:text-[#24bbcb] transition-colors">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed text-base">
                {feature.description}
              </p>

              {/* Subtle bottom accent line on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#24bbcb]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
