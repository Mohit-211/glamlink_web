"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import AccessPricingSection from "@/components/AccessPricingSection/AccessPricingSection";

const GlamCardHero = dynamic(
  () => import("@/components/glamcard/GlamCardHero"),
  { ssr: false }
);

const GlamCardApplication = dynamic(
  () => import("@/components/glamcard/GlamCardForm/GlamCardApplication"),
  { ssr: false }
);

export default function DigitalApplyPage() {
  const applyRef = useRef<HTMLDivElement | null>(null);

  const scrollToApply = () => {
    applyRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Glamlink Digital Access Card",
    description:
      "A digital business card for beauty and wellness professionals to showcase their services, profile, and connect with clients.",
    provider: {
      "@type": "Organization",
      name: "Glamlink",
      url: "https://glamlink.net",
    },
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Script
        id="digital-card-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <main className="pt-16 lg:pt-20">
        <section className="pb-20">
          <GlamCardHero onApplyClick={scrollToApply} />
        </section>
        {/* <section className="pb-20">
          <AccessPricingSection />
        </section> */}
        <section ref={applyRef} className="bg-muted/30 py-20 scroll-mt-24">
          <div className="px-4 sm:px-6 lg:px-8">
            <GlamCardApplication />
          </div>
        </section>
      </main>
    </div>
  );
}

// "use client";

// export default function DigitalApplyPage() {
//   return (
//     <div className="relative min-h-screen overflow-hidden bg-white flex items-center justify-center px-6">
//       {/* Animated Background */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl animate-pulse" />
//         <div
//           className="absolute bottom-20 right-20 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl animate-pulse"
//           style={{ animationDelay: "1s" }}
//         />
//         <div
//           className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-100/40 blur-3xl animate-pulse"
//           style={{ animationDelay: "2s" }}
//         />
//       </div>

//       {/* Content */}
//       <div className="relative z-10 text-center max-w-3xl">
//         {/* Floating Icon */}
//         {/* <div className="mb-8 flex justify-center">
//           <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl animate-bounce">
//             <span className="text-5xl">🚀</span>
//           </div>
//         </div> */}

//         {/* Heading */}
//         <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
//           <span className="bg-gradient-to-r from-cyan-500 via-teal-500 to-sky-500 bg-clip-text text-transparent animate-pulse">
//             Coming Soon
//           </span>
//         </h1>

//         {/* Description */}
//         <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed">
//           We're putting the finishing touches on something exciting.
//           <br />
//           The Glamlink Digital Access Card experience will be available soon.
//         </p>

//         {/* Animated Loader */}
//         <div className="mt-10 flex justify-center gap-2">
//           <span className="h-3 w-3 rounded-full bg-cyan-500 animate-bounce" />
//           <span
//             className="h-3 w-3 rounded-full bg-teal-500 animate-bounce"
//             style={{ animationDelay: "0.15s" }}
//           />
//           <span
//             className="h-3 w-3 rounded-full bg-sky-500 animate-bounce"
//             style={{ animationDelay: "0.3s" }}
//           />
//         </div>

//         {/* Badge */}
//         <div className="mt-10">
//           <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-6 py-3 text-sm font-semibold text-cyan-700 shadow-sm">
//             ✨ Launching Soon
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }