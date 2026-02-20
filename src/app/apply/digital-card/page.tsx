// /**
//  * Apply Digital Card Page - Server Component
//  *
//  * Digital business card application page with CMS-controlled content
//  */

// import { getServerPageContent } from '@/lib/features/display-cms/utils/dataFetching.server';
// import { getPageMetadata } from "@/lib/data/metadata";
// import { DigitalCardPageWrapper } from './DigitalCardPageWrapper';

// export const metadata = getPageMetadata("apply-digital-card");

// // ISR with 60-second revalidation for all environments
// export const revalidate = 60;

// export default async function ApplyDigitalCardPage() {
//   // Fetch CMS page content server-side
//   const pageConfig = await getServerPageContent('apply-digital-card');
//   console.log("hello")
//   return (
//     <DigitalCardPageWrapper
//       pageType="apply-digital-card"
//     initialData={pageConfig}
//     />
//   );
// }
"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { DigitalCardFormWithPreview } from "@/lib/pages/apply/get-digital-card";

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

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 lg:pt-20">
        <section className="pb-20">
          <GlamCardHero onApplyClick={scrollToApply} />
        </section>

        <section
          ref={applyRef}
          className="bg-muted/30 py-20 scroll-mt-24"
        >
            <GlamCardApplication />
          {/* <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          </div> */}
        </section>
      </main>
    </div>
  );
}
