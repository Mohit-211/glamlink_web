"use client";

import React from "react";
import PageHero from "@/components/common/PageHero";

interface GlamCardHeroProps {
  /** The id of the profile form's section: the hero's button scrolls to it. */
  formId: string;
}

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
    <PageHero
      id="access-hero"
      title={
        <>
          Your Business <span className="whitespace-nowrap">All-in-One Profile</span>
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
  );
};

export default GlamCardHero;
