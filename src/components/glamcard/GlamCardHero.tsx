"use client";

import React from "react";

interface GlamCardHeroProps {
  onApplyClick: () => void;
}

const features = [
  {
    title: "YOUR BUSINESS. ALL IN ONE PLACE.",
    description:
      "Share your services, booking, photos, videos, social media, hours, location, and everything clients need to connect with you.",
  },
  {
    title: "SHARE IT ANYWHERE.",
    description:
      "Add your Access link to Instagram, send in a text, email it to clients, or display your QR code. It's always with you.",
  },
  {
    title: "TAP. SCAN. CONNECT.",
    description:
      "Your NFC keychain makes it easy for clients to instantly access your profile with a tap or scan.",
  },
  {
    title: "ALWAYS UP TO DATE.",
    description:
      "Update your information anytime. No reprinting business cards or sending outdated links.",
  },
  {
    title: "BE FOUND.",
    description:
      "Your Access profile is listed in the Glamlink Directory, making it easier for new clients to discover you.",
  },
];

const GlamCardHero: React.FC<GlamCardHeroProps> = ({ onApplyClick }) => {
  return (
    <section className="section-glamlink page-soft">
      <div className="container-glamlink">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="max-w-2xl animate-fade-up">
            <h1 className="font-display text-5xl md:text-6xl xl:text-7xl leading-tight text-foreground">
              Everything your clients
              <br />
              need to know—
              <br />
              <span className="text-primary">in one tap.</span>
            </h1>

            <p className="mt-8 text-lg leading-8 text-muted-foreground">
              One profile. One QR code. One link for your services, booking,
              photos, videos, social media, business hours, location, and more.
            </p>

            <div className="mt-8 flex items-center gap-4 text-xl font-semibold text-foreground">
              <span>$39.99 SETUP</span>
              <span className="text-primary">•</span>
              <span>$4.99/MONTH</span>
            </div>

            <button
              onClick={onApplyClick}
              className="mt-10 inline-flex items-center justify-center rounded-md bg-[#23AEB8] px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#1d98a2]"
            >
              CREATE YOUR ACCESS CARD
            </button>

            <p className="mt-4 text-sm italic text-muted-foreground">
              NFC keychain included.
            </p>
          </div>

          {/* Right */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-large)]">
              <video
                className="aspect-[9/16] w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src="/magazine/6641.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mx-auto mt-28 max-w-3xl">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="border-t border-border py-10 text-center"
            >
              <h2 className="text-2xl font-semibold uppercase tracking-[0.15em] text-foreground">
                {feature.title}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}

          {/* Footer */}
          <div className="border-t border-border pt-12 text-center">
            <p className="text-lg font-medium uppercase tracking-[0.18em] text-primary">
              ONE TAP CAN OPEN THE DOOR TO NEW CONNECTIONS.
            </p>

            <p className="mt-8 font-display text-3xl uppercase tracking-[0.2em] text-foreground">
              ACCESS BY <span className="text-primary">GLAMLINK</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlamCardHero;