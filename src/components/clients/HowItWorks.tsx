"use client";

import { Search, Play, ShoppingCart, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: 1,
    icon: Search,
    title: "Search Smart",
    description:
      "Find the perfect beauty professional or product by specialty, location, ratings, or style. Our smart filters make discovery effortless.",
  },
  {
    number: 2,
    icon: Play,
    title: "See Beauty in Action",
    description:
      "Watch clips, browse before-and-after galleries, and explore portfolios to find pros whose work speaks to your vision.",
  },
  {
    number: 3,
    icon: ShoppingCart,
    title: "Book or Shop",
    description:
      "Request appointments directly or shop expert-curated products. One platform for services and the products to maintain your look.",
  },
  {
    number: 4,
    icon: Star,
    title: "Glow & Grow",
    description:
      "Share your experience with reviews, save your favorites, and build your beauty circle with professionals you trust.",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-gray-50/70 via-white to-gray-50/70 overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#22bccb]/5 rounded-full blur-3xl -translate-y-1/3 -translate-x-1/3 animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#22bccb]/5 rounded-full blur-3xl translate-y-1/3 translate-x-1/3 animate-pulse-slow delay-1000" />
      </div>

      <div className="container-glamlink px-5 md:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-5">
            How Glamlink
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#22bccb] via-[#1ea8b5] to-[#22bccb] bg-clip-text text-transparent">
              Works For You
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From discovery to glow-up, we make every step simple, enjoyable, and
            beautiful.
          </p>
        </div>

        {/* Steps – vertical timeline with connecting lines */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical line (hidden on mobile, shown on md+) */}
          <div className="absolute left-8 md:left-10 top-12 bottom-12 w-0.5 bg-gradient-to-b from-[#22bccb]/20 via-[#22bccb]/10 to-[#22bccb]/20 hidden md:block" />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`
                relative flex flex-col md:flex-row md:items-start gap-6 md:gap-10 mb-12 md:mb-16 last:mb-0
                animate-fade-up group
              `}
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              {/* Step Number + Icon Circle */}
              <div className="relative z-10 shrink-0 flex items-center justify-center">
                {/* Circle with number & icon */}
                <div
                  className={`
                    w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border-4 border-[#22bccb]/30
                    flex flex-col items-center justify-center shadow-md shadow-[#22bccb]/15
                    transition-all duration-500 group-hover:border-[#22bccb]/60 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[#22bccb]/25
                  `}
                >
                  <span className="text-xl md:text-2xl font-bold text-[#22bccb] mb-1">
                    {step.number}
                  </span>
                  <step.icon className="w-5 h-5 md:w-6 md:h-6 text-[#22bccb]" />
                </div>

                {/* Connecting dot on line (mobile only) */}
                <div className="md:hidden absolute top-20 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#22bccb]/40 rounded-full" />
              </div>

              {/* Content Card */}
              <div
                className={`
                  flex-1 rounded-2xl bg-white border border-gray-100 p-6 md:p-8 shadow-sm
                  transition-all duration-500 group-hover:shadow-xl group-hover:shadow-[#22bccb]/15 group-hover:-translate-y-1
                `}
              >
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 group-hover:text-[#22bccb] transition-colors">
                  {step.title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-base">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center mt-12 md:mt-20">
          <Button
            size="lg"
            className="group px-8 md:px-10 py-6 md:py-7 bg-[#22bccb] hover:bg-[#1ea8b5] text-white font-semibold text-base md:text-lg rounded-full shadow-xl shadow-[#22bccb]/25 hover:shadow-2xl hover:shadow-[#22bccb]/35 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-3 mx-auto"
          >
            Start Your Glow-Up Today
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>

          <p className="mt-4 text-sm text-gray-500">
            Join thousands already transforming their beauty routines.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
