"use client";

import { useEffect, useState } from "react";
import { getTypeBlogs } from "@/api/Api";
import JournalShopCard from "./JournalShopCard";
import ShopHero, { SHOP_PRODUCTS_ID } from "./ShopHero";

const JournalShop = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getTypeBlogs("shop");
        const fetched = res?.data?.rows || res || [];
        setProducts(fetched);
      } catch (error) {
        console.error("Failed to fetch shop products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <ShopHero />

      {/* Shop Now target — scroll-mt offsets the fixed site header */}
      <section
        id={SHOP_PRODUCTS_ID}
        tabIndex={-1}
        aria-label="Shop products"
        className="scroll-mt-[120px] pt-4 md:pt-6 focus:outline-none"
      >
        {loading ? (
          <section className="py-10">
            <div className="text-center text-muted-foreground">
              Loading products...
            </div>
          </section>
        ) : (
          <JournalShopCard shop={products} heading="yes" compact />
        )}
      </section>
    </>
  );
};

export default JournalShop;
