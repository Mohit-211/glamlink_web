"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SHOP_PRODUCTS_ID = "shop-products";

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
      className="bg-[#fafafa] rounded-2xl overflow-hidden"
    >
      <div className="grid md:grid-cols-[1fr_1.1fr] items-center">
        {/* IMAGE (top on mobile, right on desktop) */}
        <div className="relative aspect-[16/9] md:aspect-auto md:h-full md:min-h-[360px] md:order-2">
          <Image
            src="/assets/shop-hero.jpg"
            alt="Flat lay of assorted skincare bottles, makeup brushes and beauty accessories arranged on a white marble surface"
            fill
            priority
            sizes="(min-width: 768px) 460px, 100vw"
            className="object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="px-6 py-7 md:px-10 md:py-12 space-y-4 md:space-y-5">
          <p className="flex items-center gap-2 text-[10px] md:text-[11px] uppercase tracking-widest text-[#137f8a] font-semibold">
            <span aria-hidden="true" className="h-px w-6 bg-[#24bbcb]" />
            The Glamlink Shop
          </p>
          <h1
            id="shop-hero-heading"
            className="font-display text-2xl md:text-3xl leading-tight tracking-tight text-foreground text-balance"
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
              className="w-full sm:w-auto rounded-full bg-[#137f8a] hover:bg-[#0f6b74] text-white text-sm px-7 focus-visible:ring-2 focus-visible:ring-[#24bbcb] focus-visible:ring-offset-2"
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
