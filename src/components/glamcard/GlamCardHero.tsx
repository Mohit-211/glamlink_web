"use client";

import React, { useEffect, useRef } from "react";
import PageHero from "@/components/common/PageHero";

/* The phone-shaped clip (Nov 4): 540×960 at about 1 Mbps, no sound, 3.7 MB, where the original was 38 MB and held
   back the form's first load. Its poster shows at once; the clip loads after the page has, and not at all for
   visitors who ask for less motion or less data. */
const CLIP = "/access/access-hero.mp4";
const POSTER = "/access/access-hero-poster.jpg";

/** Starts the clip once the page has loaded, unless the visitor asked for reduced motion or to save data. */
function useDeferredClip() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = () => {
      video.src = CLIP;
      video.play().catch(() => {});
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);
  return ref;
}

interface GlamCardHeroProps {
  /** The id of the profile form's section: the hero's button scrolls to it. */
  formId: string;
}

const GlamCardHero: React.FC<GlamCardHeroProps> = ({ formId }) => {
  const clipRef = useDeferredClip();
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
          <video ref={clipRef} className="h-full w-full object-cover" poster={POSTER} muted loop playsInline preload="none" aria-hidden="true" />
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
