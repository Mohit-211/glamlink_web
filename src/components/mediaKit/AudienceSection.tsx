"use client";

import SectionLabel from "./shared/SectionLabel";
import SectionHeading from "./shared/SectionHeading";

export default function AudienceSection() {
  const audience = [
    {
      title: "Professionals",
      desc: "Beauty, wellness & aesthetic experts building authority",
      icon: "💼",
    },
    {
      title: "Clinics",
      desc: "Medical spas and treatment-led businesses",
      icon: "🏥",
    },
    {
      title: "Brands",
      desc: "Skincare and aesthetic brands seeking visibility",
      icon: "🧴",
    },
    {
      title: "Clients",
      desc: "People actively exploring treatments and providers",
      icon: "✨",
    },
  ];

  return (
    <section className="section-glamlink container-glamlink">
      {/* HEADER */}
      <div className="max-w-xl mb-12">
        <SectionLabel>Audience</SectionLabel>

        <SectionHeading>
          Built for the people who shape the industry
        </SectionHeading>

        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
          Glamlink connects the full ecosystem — from professionals and brands
          to the clients actively seeking them.
        </p>
      </div>

      {/* CARDS */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {audience.map((item) => (
          <div key={item.title} className="card-glamlink p-6 text-left group">
            {/* ICON */}
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-lg mb-4">
              {item.icon}
            </div>

            {/* TITLE */}
            <h3 className="text-base font-medium mb-1">{item.title}</h3>

            {/* DESC */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
