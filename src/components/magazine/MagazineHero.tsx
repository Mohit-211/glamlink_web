"use client";

import { Mail } from "lucide-react";
import PageHero from "@/components/common/PageHero";
import NewsletterPopup from "../NewsletterPopup/NewsletterPopup";
import heroPhoto from "../../../public/home-hero/magazine-hero.png";

/** A reader with the latest issue, the wall behind her lined with Glamlink covers. */
const MagazineHero = () => {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    window.open("https://mailchi.mp/glamlink/subscribe", "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <NewsletterPopup openDelay={3000} />

      <PageHero
        id="magazine-hero"
        title={
          <>
            The Glamlink Edit
          </>
        }
        subtitle="The Glamlink Edit is your inside look at beauty and wellness. Where top professionals, top treatments and evolving innovation are spotlighted. Stories go deeper and insight actually mean something. Watch, shop beauty products and connect with professionals behind the stories."
        image={heroPhoto}
      >
        <form onSubmit={handleSubscribe} className="flex max-w-xl flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <label htmlFor="magazine-email" className="sr-only">
              Email address
            </label>
            <Mail
              className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="magazine-email"
              type="email"
              autoComplete="email"
              placeholder="Your email address"
              className="input-glamlink h-14 rounded-full pl-13 pr-6 shadow-soft"
            />
          </div>
          <button type="submit" className="btn-primary btn-lg">
            Subscribe
          </button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">Join beauty enthusiasts • Unsubscribe anytime</p>
      </PageHero>
    </>
  );
};

export default MagazineHero;
