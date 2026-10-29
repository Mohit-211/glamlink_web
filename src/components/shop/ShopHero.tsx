"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroPhoto from "../../../public/home-hero/shop-hero.png";

import { SHOP_PRODUCTS_ID } from "./shopIds";

/** On phones the photo comes first and the text under it; from md the photo fills the card behind the text. */
const ShopHero = () => {
  const scrollToProducts = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(SHOP_PRODUCTS_ID);
    if (!target) return;
    e.preventDefault();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    // Move focus to the products section for keyboard / screen reader users
    target.focus({ preventScroll: true });
    history.replaceState(null, "", `#${SHOP_PRODUCTS_ID}`);
  };

  return (
    <section
      aria-labelledby="shop-hero-heading"
      className="overflow-hidden rounded-3xl bg-muted"
    >
      <div className="grid">
        <div className="relative aspect-video md:col-start-1 md:row-start-1 md:aspect-auto md:min-h-104 lg:min-h-120">
          <Image
            src={heroPhoto}
            alt="Three women with glowing skin in a sunlit studio, one applying makeup with a brush"
            fill
            preload
            placeholder="blur"
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 hidden bg-linear-to-r from-background via-background/60 via-20% to-transparent to-45% md:block" />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 space-y-4 px-6 py-7 md:col-start-1 md:row-start-1 md:max-w-md md:self-center md:space-y-5 md:px-10 md:py-12 lg:max-w-lg lg:px-14">
          <p className="eyebrow text-secondary flex items-center gap-2">
            <span aria-hidden="true" className="h-px w-6 bg-primary" />
            The Glamlink Shop
          </p>
          <h1
            id="shop-hero-heading"
            className="text-3xl md:text-4xl leading-tight tracking-tight text-foreground text-balance"
          >
            Professional Beauty + Wellness Products
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            Discover professional brands and products across beauty + wellness,
            from trusted names to the products experts are talking about.
          </p>
          <div className="pt-1">
            <Button
              asChild
              className="w-full sm:w-auto rounded-full text-sm px-7"
            >
              <a href={`#${SHOP_PRODUCTS_ID}`} onClick={scrollToProducts}>
                Shop Now
                <ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopHero;
