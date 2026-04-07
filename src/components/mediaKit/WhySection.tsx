"use client";

import SectionLabel from "./shared/SectionLabel";
import SectionHeading from "./shared/SectionHeading";

export default function WhySection() {
  const points = [
    {
      title: "Discovery-first approach",
      desc: "Designed to place you in front of people actively looking — not just scrolling.",
    },
    {
      title: "Direct connection",
      desc: "Bridges the gap between professionals, brands, and clients in one ecosystem.",
    },
    {
      title: "Real business impact",
      desc: "Focused on visibility that translates into inquiries, trust, and growth.",
    },
    {
      title: "Multi-platform presence",
      desc: "Your feature lives across magazine, web, and social — not just one place.",
    },
  ];

  return (
    <section className="section-glamlink container-glamlink">
      {/* HEADER */}
      <div className="max-w-xl mb-12">
        <SectionLabel>Why Glamlink</SectionLabel>

        <SectionHeading>
          Built for business.
          <br />
          Designed for discovery.
        </SectionHeading>

        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
          Glamlink isn’t just exposure — it’s structured visibility built to
          connect, position, and grow.
        </p>
      </div>

      {/* GRID */}
      <div className="grid sm:grid-cols-2 gap-6">
        {points.map((p, i) => (
          <div key={i} className="card-glamlink p-6 relative group">
            {/* NUMBER */}
            <span className="text-primary/70 text-xs font-medium mb-3 block">
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* TITLE */}
            <h3 className="text-base font-semibold mb-2">{p.title}</h3>

            {/* DESC */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {p.desc}
            </p>

            {/* HOVER ACCENT */}
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
