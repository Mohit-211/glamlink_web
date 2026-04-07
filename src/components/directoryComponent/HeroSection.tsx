"use client";

import Image from "next/image";

interface Props {
  service: string;
  description: string;
}

export default function HeroSection({ service, description }: Props) {
  return (
    <section className="grid md:grid-cols-2 gap-14 items-center mb-20">
      {/* LEFT CONTENT */}
      <div className="max-w-xl">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
          {service}
        </h1>

        {description && (
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            {description}
          </p>
        )}

        <button className="btn-primary">Explore The Glamlink Edit</button>
      </div>

      {/* RIGHT IMAGE */}
      <div className="relative w-full h-[320px] md:h-[380px] rounded-2xl overflow-hidden shadow-[var(--shadow-medium)]">
        <Image
          src="/assets/microneedling.png"
          alt={`${service} treatment`}
          fill
          priority
          className="object-cover"
        />
      </div>
    </section>
  );
}
