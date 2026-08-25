"use client";

import { useEffect, useState } from "react";
import { getTypeBlogs } from "@/api/Api";
import JournalShopCard from "./JournalShopCard";

const DUMMY_PRODUCTS = [
  {
    id: "dummy-1",
    title: "Hydra-Glow Vitamin C Serum",
    brand: "Lumière Skin",
    category: "Skincare",
    cover_image: "https://picsum.photos/seed/shop-serum/600/600",
    rating: "4.8",
    reviews: 214,
    price: 38,
    link: "#",
  },
  {
    id: "dummy-2",
    title: "Silk Press Heatless Curling Set",
    brand: "Curl Theory",
    category: "Haircare",
    cover_image: "https://picsum.photos/seed/shop-curls/600/600",
    rating: "4.6",
    reviews: 98,
    price: 24,
    link: "#",
  },
  {
    id: "dummy-3",
    title: "Matte Velvet Lip Duo",
    brand: "Bloom Cosmetics",
    category: "Makeup",
    cover_image: "https://picsum.photos/seed/shop-lip/600/600",
    rating: "4.9",
    reviews: 312,
    price: 22,
    link: "#",
  },
  {
    id: "dummy-4",
    title: "Rose Quartz Gua Sha Tool",
    brand: "Studio Glow",
    category: "Tools",
    cover_image: "https://picsum.photos/seed/shop-guasha/600/600",
    rating: "4.7",
    reviews: 156,
    price: 18,
    link: "#",
  },
  {
    id: "dummy-5",
    title: "Overnight Repair Hair Mask",
    brand: "Curl Theory",
    category: "Haircare",
    cover_image: "https://picsum.photos/seed/shop-mask/600/600",
    rating: "4.5",
    reviews: 87,
    price: 29,
    link: "#",
  },
  {
    id: "dummy-6",
    title: "SPF 50 Weightless Sunscreen",
    brand: "Lumière Skin",
    category: "Skincare",
    cover_image: "https://picsum.photos/seed/shop-spf/600/600",
    rating: "4.9",
    reviews: 401,
    price: 32,
    link: "#",
  },
];

const JournalShop = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getTypeBlogs("shop");
        const fetched = res?.data?.rows || res || [];
        setProducts(fetched.length > 0 ? fetched : DUMMY_PRODUCTS);
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
