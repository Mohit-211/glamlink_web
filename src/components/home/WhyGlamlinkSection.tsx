"use client";

import {
  ShieldCheck,
  Package,
  Sparkles,
  Heart,
  Search,
  Calendar,
  CalendarCheck,
  Wrench,
  BarChart2,
  TrendingUp,
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
    icon: CalendarCheck,
    title: "In-App Booking",
    description: "Flexible scheduling built for you",
  },
  {
    icon: Wrench,
    title: "Grow Your Business",
    description:
      "Customize your profile with services menu, content, reviews and your shop",
  },
  {
    icon: BarChart2,
    title: "Smart Tools",
    description: "Helpful features to support your visibility and growth",
  },
  {
    icon: TrendingUp,
    title: "Built to Grow With You",
    description: "A platform evolving alongside modern professionals",
  },
];

const WhyGlamlinkSection = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/50">
      <div className="container-glamlink px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Clients Column */}
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#22bccb]/10 text-[#22bccb] text-sm font-semibold uppercase tracking-wide">
                For Clients
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
                Why choose <span className="text-[#22bccb]">Glamlink</span>?
              </h2>
              <p className="text-lg text-gray-600 max-w-xl">
                Discover trusted beauty professionals and everything you need —
                all in one beautiful place.
              </p>
            </div>

            <div className="space-y-8">
              {clientBenefits.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group flex items-start gap-5 hover:bg-[#22bccb]/5 rounded-xl p-4 -mx-4 transition-all duration-300"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-[#22bccb]/10 flex items-center justify-center text-[#22bccb] transition-transform group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1.5 group-hover:text-[#22bccb] transition-colors">
                      {title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professionals Column */}
          <div className="space-y-10 lg:border-l lg:border-gray-100 lg:pl-16 xl:pl-20">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#22bccb]/10 text-[#22bccb] text-sm font-semibold uppercase tracking-wide">
                For Professionals
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
                Grow your <span className="text-[#22bccb]">Beauty Brand</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-xl">
                Get found, book easily, customize freely, and scale smarter —
                built for today’s beauty creators.
              </p>
            </div>

            <div className="space-y-8">
              {proBenefits.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group flex items-start gap-5 hover:bg-[#22bccb]/5 rounded-xl p-4 -mx-4 transition-all duration-300"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-[#22bccb]/10 flex items-center justify-center text-[#22bccb] transition-transform group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1.5 group-hover:text-[#22bccb] transition-colors">
                      {title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {description}
                    </p>
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
