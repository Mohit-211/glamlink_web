"use client";

import { ArrowDown } from "lucide-react";
import PageHero from "@/components/common/PageHero";
import heroPhoto from "../../../public/home-hero/shop-hero.png";

import { SHOP_PRODUCTS_ID } from "./shopIds";

/** Three women with glowing skin in a sunlit studio, one applying makeup with a brush. */
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
    <PageHero
      id="shop-hero"
      eyebrow="The Glamlink Shop"
      title={
        <>
          Professional Beauty + Wellness Products
        </>
      }
      subtitle="Discover professional brands and products across beauty + wellness, from trusted names to the products experts are talking about."
      image={heroPhoto}
      imagePosition="object-top"
    >
      <a href={`#${SHOP_PRODUCTS_ID}`} onClick={scrollToProducts} className="btn-primary btn-lg">
        Shop Now
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </a>
    </PageHero>
  );
};

export default ShopHero;
