"use client";

import React from "react";
import CommonHero from "@/components/common/CommonHero";
import { unsplash } from "@/lib/directory/mockData";

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
    <>
    <CommonHero
      title="Everything your clients need to know—"
      titleHighlight="in one tap."
      description="One profile. One QR code. One link for your services, booking, photos, videos, social media, business hours, location, and more."
      primaryAction={{ label: "CREATE YOUR ACCESS CARD", onClick: onApplyClick }}
      footnote={<span className="italic">NFC keychain included.</span>}
      collage={{
        main: { src: "/magazine/6641.mp4", alt: "Access by Glamlink profile preview", video: true, label: "Access Card" },
        top: { src: unsplash("1595079676339-1534801ad6cf", 600), alt: "Phone showing a QR code", label: "Scan + Connect" },
        bottom: { src: unsplash("1570172619644-dfd03ed5d881", 600), alt: "Skin treatment by a beauty professional", label: "Your Services" },
        accent: { src: unsplash("1607779097040-26e80aa78e66", 300), alt: "Manicured nails" },
      }}
    >
      <div className="flex items-center gap-4 text-xl font-semibold text-foreground">
        <span>$39.99 SETUP</span>
        <span className="text-primary">•</span>
        <span>$4.99/MONTH</span>
      </div>
    </CommonHero>

    <section className="bg-background pb-16 md:pb-24">
      <div className="container-glamlink">
        {/* Features */}
        <div className="mx-auto max-w-3xl">
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
    </>
  );
};

export default GlamCardHero;