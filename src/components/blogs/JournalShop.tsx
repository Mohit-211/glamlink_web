"use client";
import Image from "next/image";
import { Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
  { id: 1, name: "Hydrating Vitamin C Serum", brand: "Lumière Skin", price: 38, rating: 4.8, reviews: 214, image: "https://picsum.photos/seed/vitamincserum/500/500", tag: "Bestseller" },
  { id: 2, name: "Silk Repair Hair Mask", brand: "Verdant Hair Co.", price: 26, rating: 4.6, reviews: 132, image: "https://picsum.photos/seed/hairmask/500/500", tag: "New" },
  { id: 3, name: "Matte Finish Foundation", brand: "Glow Studio", price: 32, rating: 4.7, reviews: 301, image: "https://picsum.photos/seed/foundation/500/500", tag: null },
  { id: 4, name: "Nourishing Cuticle Oil", brand: "Bare Nails", price: 14, rating: 4.9, reviews: 98, image: "https://picsum.photos/seed/cuticleoil/500/500", tag: "Bestseller" },
  { id: 5, name: "SPF 50 Daily Sunscreen", brand: "Lumière Skin", price: 24, rating: 4.5, reviews: 176, image: "https://picsum.photos/seed/sunscreen/500/500", tag: null },
  { id: 6, name: "Volumizing Lash Mascara", brand: "Glow Studio", price: 19, rating: 4.4, reviews: 87, image: "https://picsum.photos/seed/mascara/500/500", tag: "New" },
];

const JournalShop = () => {
  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-[11px] uppercase tracking-widest text-[#24bbcb] font-semibold">
          Curated Picks
        </p>
        <h1 className="font-display text-2xl md:text-3xl tracking-tight">
          Shop The Journal
        </h1>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Products featured in our articles, handpicked by the Glamlink
          editorial team.
        </p>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group border border-border/40 rounded-xl overflow-hidden bg-background
              hover:border-[#24bbcb]/50 hover:shadow-sm transition-all duration-200"
          >
            <div className="relative aspect-square bg-muted/30 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.tag && (
                <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wide bg-white/90 text-foreground px-2 py-1 rounded">
                  {product.tag}
                </span>
              )}
            </div>
            <div className="p-4 space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {product.brand}
              </p>
              <h3 className="font-display text-sm md:text-base leading-snug group-hover:text-[#24bbcb] transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="font-medium text-foreground">{product.rating}</span>
                <span>({product.reviews})</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="font-display text-base font-semibold">
                  ${product.price}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full text-xs border-[#24bbcb]/40 hover:border-[#24bbcb] hover:text-[#24bbcb] hover:bg-[#24bbcb]/5"
                >
                  <ShoppingBag className="h-3 w-3 mr-1.5" />
                  Shop
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default JournalShop;