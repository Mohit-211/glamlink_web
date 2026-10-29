"use client";

import React from "react";
import PageHero from "@/components/common/PageHero";

interface GlamCardHeroProps {
  /** The id of the profile form's section: the hero's button scrolls to it. */
  formId: string;
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

const GlamCardHero: React.FC<GlamCardHeroProps> = ({ formId }) => {
  const scrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const form = document.getElementById(formId);
    if (!form) return;
    e.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    form.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    // Keyboard and screen reader users continue from the form
    form.focus({ preventScroll: true });
    history.replaceState(null, "", `#${formId}`);
  };

  return (
    <>
      <PageHero
        id="access-hero"
        title={
          <>
            Your Business <span className="whitespace-nowrap text-primary">All-in-One Profile</span>
          </>
        }
        subtitle="Create your free professional profile to showcase your work, share your services, connect with clients, and make booking easier."
        media={
          // The phone-shaped clip, sized to the hero's height
          <div className="aspect-9/16 w-60 overflow-hidden rounded-3xl border border-border bg-card shadow-large sm:w-64 xl:w-72">
            <video className="h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata">
              <source src="/magazine/6641.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        }
      >
        <a href={`#${formId}`} onClick={scrollToForm} className="btn-primary btn-lg">
          CREATE YOUR FREE PROFILE
        </a>
      </PageHero>

      {/* Features */}
      <section className="container-glamlink py-20 md:py-28">
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

            <p className="mt-8 text-3xl uppercase tracking-[0.2em] text-foreground">
              ACCESS BY <span className="text-primary">GLAMLINK</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default GlamCardHero;
