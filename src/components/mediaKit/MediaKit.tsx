"use client"

import { issues2025, issues2026 } from "@/data/issues";
import { Metadata } from "next";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useState } from "react";
import FeatureFormModal from "./FeatureFormModal";
/* ── Static Metadata ───────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Media Kit | The Glamlink Edit",
  description:
    "Advertise, get featured, or partner with The Glamlink Edit — the modern beauty & wellness publication powered by Glamlink.",
  alternates: { canonical: "https://glamlink.com/media-kit" },
  openGraph: {
    title: "Media Kit | The Glamlink Edit",
    description:
      "Advertise, get featured, or partner with The Glamlink Edit.",
    url: "https://glamlink.com/media-kit",
    type: "website",
    images: [{ url: "https://glamlink.com/default-blog.jpg", width: 1200, height: 630 }],
  },
};
/* ── Types ─────────────────────────────────────────────────────── */
interface FeatureCardProps {
  price: string;
  priceNote?: string;
  title: string;
  description: string;
  items: string[];
  badge?: string;
  featured?: boolean;
}
/* ── Sub-components ─────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] tracking-[.15em] uppercase text-gray-400 mb-2">
      {children}
    </p>
  );
}
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-3xl text-gray-900 mb-6 leading-snug">
      {children}
    </h2>
  );
}
function Divider() {
  return <div className="border-t border-gray-100 my-12" />;
}
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase text-[#23AEB8] px-3 py-1.5 rounded-full"
      style={{
        background: "rgba(35,174,184,0.08)",
        border: "1px solid rgba(35,174,184,0.25)",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#23AEB8]" />
      {children}
    </span>
  );
}
function PlatformRow({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[rgba(35,174,184,0.08)] text-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-[13px] font-light text-gray-400 leading-relaxed mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
}
function FeatureCard({
  price,
  priceNote,
  title,
  description,
  items,
  badge,
  featured,
}: FeatureCardProps) {
  return (
    <div
      className={`relative rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${featured
        ? "border-[#23AEB8] bg-[rgba(35,174,184,0.04)]"
        : "border-gray-100 bg-white"
        }`}
    >
      {badge && (
        <span className="absolute -top-px right-5 rounded-b-lg bg-[#23AEB8] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
          {badge}
        </span>
      )}
      <p className="font-serif text-3xl font-semibold text-[#1a9aaa] mb-0.5">
        {price}
      </p>
      {priceNote && (
        <p className="text-[11px] text-gray-400 mb-3">{priceNote}</p>
      )}
      <h3 className="text-[15px] font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-[13px] font-light text-gray-400 mb-4">{description}</p>
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-[13px] font-light text-gray-500"
          >
            <span className="mt-0.5 shrink-0 text-[#23AEB8]">→</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
/* ── Page ───────────────────────────────────────────────────────── */
export default function MediaKitPage() {
   const [showForm, setShowForm] = useState(false);
    const router = useRouter();
  
  const platforms = [
    {
      icon: "📖",
      title: "Digital Magazine",
      description: "Interactive flipbook with shareable, clickable content",
    },
    {
      icon: "🖨️",
      title: "Print Edition",
      description:
        "Professionally printed, distributed locally and at select industry touchpoints",
    },
    {
      icon: "🌐",
      title: "Web Editorial / Journal",
      description:
        "Searchable articles designed for long-term visibility and discovery (rolling out)",
    },
    {
      icon: "📱",
      title: "Social Media Promotion",
      description:
        "Featured across Glamlink platforms to expand reach and engagement",
    },
  ];
  const whoList = [
    { icon: "💆", label: "Beauty & Wellness Professionals" },
    { icon: "🏥", label: "Medical Spas & Clinics" },
    { icon: "✨", label: "Skincare & Aesthetic Brands" },
    { icon: "🔍", label: "Clients Actively Seeking Treatments & Providers" },
  ];
  const featureCards: FeatureCardProps[] = [
    {
      price: "$100",
      title: "Pro Spotlight Feature",
      description: "Highlight your work, expertise, and services.",
      items: [
        "1-page feature in print + digital",
        "Inclusion in web editorial (journal)",
        "Professional exposure to new clients",
        "Social media visibility opportunities",
      ],
    },
    {
      price: "$250",
      title: "Interview + Feature",
      description: "Position yourself as a trusted authority.",
      items: [
        "Full 25-min Beauty Vault Podcast interview",
        "Web article with direct links",
        "Professional storytelling & brand positioning",
        "Visibility on YouTube, Spotify & Apple Podcasts",
      ],
      badge: "Popular",
      featured: true,
    },
    {
      price: "from $550",
      priceNote: "Approval required · Non-local (no interview): from $350",
      title: "Cover Feature",
      description: "Premium placement for standout professionals and brands.",
      items: [
        "Cover placement in The Glamlink Edit",
        "Full editorial feature + podcast included",
        "Highlighted across digital & social channels",
        "Positioned as a leading voice in the industry",
      ],
    },
    {
      price: "$1,500",
      title: "Med Spa / Business Feature",
      description: "Full business spotlight for your location and brand.",
      items: [
        "Multi-page feature",
        "Interview and/or brand story",
        "Visual highlights of your space & offerings",
        "Strong positioning for client trust & discovery",
      ],
    },
  ];
  const whyList = [
    "Built for discovery — not just aesthetics",
    "Connects content directly to professionals",
    "Designed to support real business growth",
    "Multi-platform: print, digital, web, podcast & social",
  ];
  /* ── Structured Data ── */
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Media Kit | The Glamlink Edit",
    description:
      "Advertising and feature opportunities in The Glamlink Edit beauty & wellness publication.",
    url: "https://glamlink.com/media-kit",
    publisher: {
      "@type": "Organization",
      name: "Glamlink",
      logo: {
        "@type": "ImageObject",
        url: "https://glamlink.com/favicon.png",
      },
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://glamlink.com" },
      { "@type": "ListItem", position: 2, name: "Magazine", item: "https://glamlink.com/magazine" },
      { "@type": "ListItem", position: 3, name: "Media Kit", item: "https://glamlink.com/media-kit" },
    ],
  };
  const handleDigitalEdition = (slug: string) => {
  router.push(`/magazine/${slug}/digital`);
};
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Structured Data */}
      <Script
        id="mediakit-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="flex-1">
        <article className="max-w-[1200px] mx-auto px-5 pb-20 pt-20">
          {/* ── HERO ── */}
          <section className="w-full px-6 md:px-14 py-16">
            {/* Top label */}
            <p className="text-[11px] tracking-[0.25em] text-[#23AEB8] uppercase mb-6">
              Media Kit 2025
            </p>
            <div>
              <h1 className="font-serif text-[clamp(48px,6vw,72px)] leading-[1.05] text-gray-900 mb-4">
                The Glamlink Edit
              </h1>
              <p className="text-[12px] tracking-[0.3em] uppercase text-gray-400 mb-6">
                Powered by Glamlink
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-[17px] leading-[1.8] text-gray-600 max-w-xl mb-8">
                  A modern beauty and wellness publication built for discovery,
                  credibility, and real connection between professionals and the
                  clients they serve.
                </p>
                <button className="border border-[#23AEB8] text-[#23AEB8] px-7 py-2 rounded-full text-sm font-medium hover:bg-[#23AEB8] hover:text-white transition">
                  GET FEATURED
                </button>
              </div>
              {/* LEFT CONTENT */}
              {/* RIGHT SIDE — NO OVERLAY */}
              <div className="flex gap-6 justify-center md:justify-end items-end">

  {/* CARD 1 */}
  <div
    onClick={() => handleDigitalEdition(issues2026[0].slug)}
    className="relative w-[180px] h-[220px] shadow-lg flex flex-col justify-end overflow-hidden cursor-pointer group"
  >
    <img
      src={issues2026[0].cover}
      alt={issues2026[0].title}
      className="absolute w-full h-full object-cover group-hover:scale-105 transition"
    />
    <div className="relative p-3 border-t border-yellow-400 bg-black/60">
      <p className="text-[10px] text-yellow-400">ISSUE NO.10</p>
      <p className="text-yellow-400 text-sm font-serif">
        {issues2026[0].title}
      </p>
    </div>
  </div>

  {/* CARD 2 */}
  <div
    onClick={() => handleDigitalEdition(issues2026[1].slug)}
    className="relative w-[160px] h-[240px] shadow-lg flex flex-col justify-end overflow-hidden cursor-pointer group"
  >
    <img
      src={issues2026[1].cover}
      alt={issues2026[1].title}
      className="absolute w-full h-full object-cover group-hover:scale-105 transition"
    />
    <div className="relative p-3 border-t-4 border-[#23AEB8] bg-black/40">
      <p className="text-[10px] text-[#23AEB8]">ISSUE NO.11</p>
      <p className="text-[#23AEB8] text-sm font-serif">
        {issues2026[1].title}
      </p>
    </div>
  </div>

  {/* CARD 3 */}
  <div
    onClick={() => handleDigitalEdition(issues2025[5].slug)}
    className="relative w-[180px] h-[220px] shadow-lg flex flex-col justify-end overflow-hidden cursor-pointer group"
  >
    <img
      src={issues2025[5].cover}
      alt={issues2025[5].title}
      className="absolute w-full h-full object-cover group-hover:scale-105 transition"
    />
    <div className="relative p-3 border-t border-white/40 bg-black/50">
      <p className="text-[10px] text-white/80">ISSUE NO.12</p>
      <p className="text-white text-sm font-serif">
        {issues2025[5].title}
      </p>
    </div>
  </div>

</div>
            </div>
          </section>
          <section className="w-full px-6 md:px-14 py-20">
            {/* Small Label */}
            <p className="text-[11px] tracking-[0.25em] text-[#23AEB8] uppercase mb-6">
              The Publication
            </p>
            <div className="grid md:grid-cols-2 gap-12">
              {/* LEFT CONTENT */}
              <div>
                {/* Heading */}
                <h2 className="font-serif text-[clamp(36px,5vw,56px)] leading-[1.1] text-gray-900 mb-8">
                  More than a magazine.<br />
                  <span className="italic">A platform for discovery.</span>
                </h2>
                {/* Paragraphs */}
                <div className="space-y-6 text-[15.5px] leading-[1.9] text-gray-700 font-light">
                  <p>
                    The Glamlink Edit is a modern beauty and wellness publication designed
                    to connect professionals with real visibility, credibility and client discovery.
                  </p>
                  <p>
                    More than a traditional magazine, it serves as a bridge between content
                    and connection—highlighting the professionals, treatments and innovations
                    shaping the future of the industry.
                  </p>
                  <p>
                    Each issue features a curated mix of professional spotlights,
                    in-depth interviews, treatment-focused education, and industry insights.
                    Created to inform, inspire and guide real decision-making.
                  </p>
                  <p>
                    Distributed across digital, print, and web platforms, powered by Glamlink—
                    a platform built to elevate beauty and wellness professionals through
                    visibility, discovery and opportunity.
                  </p>
                </div>
              </div>
              {/* RIGHT QUOTE BLOCK */}
              <div className="flex flex-col justify-center">
                {/* Top line */}
                <div className="border-t border-[#23AEB8] w-full mb-6"></div>
                {/* Quote */}
                <p className="font-serif italic text-[20px] leading-[1.8] text-gray-800 mb-10">
                  "Built to elevate beauty and wellness professionals through
                  visibility, discovery and real opportunity."
                </p>
                {/* Bottom line */}
                <div className="border-t border-[#23AEB8] w-full mb-4"></div>
                {/* Footer */}
                <p className="text-[11px] tracking-[0.2em] uppercase text-[#23AEB8]">
                  The Glamlink Edit · Powered by Glamlink
                </p>
              </div>
            </div>
          </section>
          <Divider />
          {/* ── WHERE YOU'LL BE SEEN ── */}
          <section>
            <div className="text-center mb-8">
              <SectionLabel>Distribution</SectionLabel>
              <SectionHeading>Where you'll be seen</SectionHeading>
            </div>
            <div className="grid md:grid-cols-2 gap-x-12">
              {platforms.map((p) => (
                <PlatformRow key={p.title} {...p} />
              ))}
            </div>
          </section>
          <Divider />
          {/* ── WHO IT'S FOR ── */}
          <section>
            <div className="text-center mb-8">
              <SectionLabel>Audience</SectionLabel>
              <SectionHeading>Who it's for</SectionHeading>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {whoList.map(({ icon, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-gray-100 bg-white p-5 text-center hover:border-[#23AEB8]/30 hover:shadow-sm transition-all"
                >
                  <div className="text-2xl mb-2">{icon}</div>
                  <p className="text-[12px] font-medium text-gray-700 leading-snug">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <Divider />
          {/* ── FEATURE OPPORTUNITIES ── */}
          <section>
            <div className="text-center mb-2">
              <SectionLabel>Feature Opportunities</SectionLabel>
              <SectionHeading>Get your story told.</SectionHeading>
            </div>
            <p className="text-center text-[14px] font-light text-gray-400 mb-8 max-w-md mx-auto">
              Limited placements per issue. Each feature is crafted to position you with purpose.
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              {featureCards.map((c) => (
                <FeatureCard key={c.title} {...c} />
              ))}
            </div>
          </section>
          <Divider />
          {/* ── ADVERTISING ── */}
          <section>
            <div className="text-center mb-8">
              <SectionLabel>Advertising</SectionLabel>
              <SectionHeading>Make your brand visible.</SectionHeading>
            </div>
            {/* Styled like an editorial blockquote panel */}
            <div
              className="rounded-2xl pl-8 pr-6 py-8 border-l-[3px] border-[#23AEB8]"
              style={{ background: "rgba(35,174,184,0.06)" }}
            >
              <p className="font-serif text-[42px] font-semibold text-[#1a9aaa] leading-none mb-1">
                $50{" "}
                <span className="text-base font-normal text-gray-400">/ issue</span>
              </p>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-3">
                Full Page Ad — Introductory Rate
              </h3>
              <p className="text-[14px] font-light text-gray-500 leading-relaxed mb-4">
                Designed for visibility and awareness. Print + digital placement. Clean, editorial-style layout. Ideal for promotions, services, or brand awareness.
              </p>
              <ul className="flex flex-col gap-2 mb-5">
                {[
                  "Print + digital placement",
                  "Clean, editorial-style layout",
                  "Ideal for promotions, services or brand awareness",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-[13px] font-light text-gray-500"
                  >
                    <span className="text-[#23AEB8] mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-[#23AEB8] font-medium uppercase tracking-widest">
                ✦ Recommended: 3-month minimum for best results
              </p>
            </div>
          </section>
          <Divider />
          {/* ── COMMUNITY ── */}
          <section>
            <div className="text-center mb-8">
              <SectionLabel>Community & Editorial</SectionLabel>
              <SectionHeading>Currently free opportunities.</SectionHeading>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                {
                  title: "Stories Submission",
                  desc: "Share your journey, client transformations, or industry insights for potential features.",
                },
                {
                  title: "Feature Your Treatment",
                  desc: "Be included in treatment-based editorial pages connecting readers with real providers.",
                },
              ].map(({ title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-gray-100 bg-white p-6"
                >
                  <span className="mb-3 inline-block rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-green-600">
                    Free
                  </span>
                  <h4 className="text-[15px] font-medium text-gray-900 mb-2">
                    {title}
                  </h4>
                  <p className="text-[13px] font-light text-gray-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <Divider />
          {/* ── WHY THE GLAMLINK EDIT ── */}
          <section>
            <div className="text-center mb-8">
              <SectionLabel>Why The Glamlink Edit</SectionLabel>
              <SectionHeading>Built for business. Designed for discovery.</SectionHeading>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {whyList.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 px-5 py-4 text-[14px] font-light text-gray-600"
                >
                  <span className="text-[#23AEB8] font-medium mt-0.5 shrink-0">
                    0{i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <Divider />
       <section>
              <div className="text-center mb-8">
                <SectionLabel>Get Featured</SectionLabel>
                <h2 className="font-serif text-3xl text-gray-900">Get Featured</h2>
                <p className="text-[14px] font-light text-gray-400 mt-3 max-w-md mx-auto">
                  Apply to be featured or advertise through our submission form.
                  Limited placements available per issue.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full sm:w-auto rounded-full bg-[#23AEB8] px-8 py-3.5 text-[12px] font-bold uppercase tracking-widest text-white transition-all hover:bg-[#1a9aaa] hover:-translate-y-0.5 active:scale-95"
                >
                  Get Featured Form →
                </button>
                
              </div>
            </section>
             {showForm && (
        <FeatureFormModal onClose={() => setShowForm(false)} />
      )}
        </article>
      </main>
    </div>
  );
}