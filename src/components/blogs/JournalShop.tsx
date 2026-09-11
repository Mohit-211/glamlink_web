"use client";

import { useEffect, useState } from "react";
import { getTypeBlogs } from "@/api/Api";
import JournalShopCard from "./JournalShopCard";

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

  if (loading) {
    return (
      <section className="py-10">
        <div className="text-center text-muted-foreground">
          Loading products...
        </div>
      </section>
    );
  }

  return <JournalShopCard shop={products} heading="yes" />;
};

export default JournalShop;
