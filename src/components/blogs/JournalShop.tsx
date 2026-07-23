"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTypeBlogs } from "@/api/Api";

const JournalShop = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getTypeBlogs("shop");
        console.log(res,"res")
        setProducts(res?.data?.rows || res || []);
      } catch (error) {
        console.error("Failed to fetch shop products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-10">
        <div className="text-center text-muted-foreground">
          Loading products...
        </div>
      </section>
    );
  }

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
        {products.length > 0 ? (
          products.map((product: any) => (
            <div
              key={product.id}
              className="group border border-border/40 rounded-xl overflow-hidden bg-background hover:border-[#24bbcb]/50 hover:shadow-sm transition-all duration-200"
            >
              <div className="relative aspect-square bg-muted/30 overflow-hidden">
              <img
                  src={product.cover_image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />

                {product.category && (
                  <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wide bg-white/90 text-foreground px-2 py-1 rounded">
                    {product.category}
                  </span>
                )}
              </div>

              <div className="p-4 space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {product.brand}
                </p>

                <h3 className="font-display text-sm md:text-base leading-snug group-hover:text-[#24bbcb] transition-colors">
                  {product.title || product.name}
                </h3>

                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-foreground">
                    {product.rating || "5.0"}
                  </span>
                  <span>({product.reviews || 0})</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-base font-semibold">
                    {product.price ? `$${product.price}` : "View Product"}
                  </span>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      product.link &&
                      window.open(product.link, "_blank")
                    }
                    className="rounded-full text-xs border-[#24bbcb]/40 hover:border-[#24bbcb] hover:text-[#24bbcb] hover:bg-[#24bbcb]/5 cursor-pointer"
                  >
                    <ShoppingBag className="h-3 w-3 mr-1.5" />
                    Shop
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-muted-foreground">
            No products found.
          </div>
        )}
      </div>
    </section>
  );
};

export default JournalShop;