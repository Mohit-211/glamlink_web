"use client";

export default function PublicationSection() {
  return (
    <section className="section-glamlink container-glamlink relative">
      {/* SUBTLE DIVIDER */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* LEFT — STORY */}
        <div className="max-w-xl">
          <h2 className="font-display text-2xl md:text-3xl leading-tight mb-6">
            More than a magazine.
            <br />
            <span className="italic text-primary/90">
              A platform for discovery.
            </span>
          </h2>

          <div className="space-y-5 text-muted-foreground text-sm leading-relaxed">
            <p>
              The Glamlink Edit is built for professionals who don’t just want
              presence — they want recognition.
            </p>

            <p>
              It connects visibility with credibility, placing professionals,
              treatments, and brands in front of audiences actively looking to
              discover, choose, and engage.
            </p>

            <p>
              Every issue is curated with intent — designed to highlight what
              truly matters in a space crowded with noise.
            </p>
          </div>
        </div>

        {/* RIGHT — AUTHORITY BLOCK */}
        <div className="relative">
          {/* SOFT CARD */}
          <div className="card-glamlink p-8 md:p-10">
            {/* TOP LINE */}
            <div className="w-10 h-[2px] bg-primary mb-6" />

            {/* QUOTE */}
            <p className="italic text-base md:text-lg leading-relaxed mb-8 text-foreground">
              Built to elevate professionals through visibility, discovery, and
              real opportunity.
            </p>

            {/* BOTTOM META */}
            <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
              <span>Editorial Platform</span>
              <span className="text-primary font-medium">Glamlink Edit</span>
            </div>
          </div>

          {/* BACKGROUND ACCENT */}
          <div className="absolute -z-10 top-6 left-6 w-full h-full rounded-2xl bg-primary/5" />
        </div>
      </div>
    </section>
  );
}
