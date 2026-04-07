"use client";

import SectionLabel from "./shared/SectionLabel";
import SectionHeading from "./shared/SectionHeading";

export default function DistributionSection() {
  const platforms = [
    {
      icon: "📖",
      title: "Digital Magazine",
      description: "Interactive flipbook with clickable, immersive content",
    },
    {
      icon: "🖨️",
      title: "Print Edition",
      description: "Placed at premium local touchpoints and industry hubs",
    },
    {
      icon: "🌐",
      title: "Web Editorial",
      description: "Searchable articles designed for long-term discovery",
    },
    {
      icon: "📱",
      title: "Social Media",
      description: "Amplified reach across curated audience channels",
    },
  ];

  return (
    <section className="section-glamlink container-glamlink">
      <div className="grid md:grid-cols-2 gap-16 items-start">
        {/* LEFT */}
        <div className="max-w-lg">
          <SectionLabel>Distribution</SectionLabel>

          <SectionHeading>Where you’ll be seen</SectionHeading>

          <p className="text-base text-muted-foreground mt-6 leading-relaxed">
            Glamlink doesn’t just publish — it places you across channels where
            attention already exists. Every feature is distributed with intent,
            ensuring visibility that translates into recognition and real
            discovery.
          </p>
        </div>

        {/* RIGHT — BEAUTIFUL ROWS */}
        <div className="space-y-6">
          {platforms.map((p, i) => (
            <div key={p.title} className="flex items-start gap-4 group">
              {/* ICON */}
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-xl">
                {p.icon}
              </div>

              {/* CONTENT */}
              <div className="flex-1 border-b border-border pb-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base md:text-lg font-medium">
                    {p.title}
                  </h3>

                  {/* NUMBER */}
                  <span className="text-xs text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
