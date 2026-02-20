"use client";

import Image from "next/image";
import Link from "next/link";

export default function ShopCuratedPicks() {
  const products = [
    {
      name: "Rejuvenating Face Serum",
      price: "$78",
      image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop",
      alt: "Face serum bottle"
    },
    {
      name: "Hydrating Night Cream",
      price: "$65",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
      alt: "Night cream jar"
    },
    {
      name: "Essential Oil Set",
      price: "$120",
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
      alt: "Essential oil bottles"
    },
    {
      name: "Luxury Face Mask",
      price: "$45",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
      alt: "Face mask product"
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Shop Curated Picks
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Link 
              key={index} 
              href={`/shop/${product.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group"
            >
              <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-100 mb-3">
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-gray-900 font-medium mb-1 group-hover:text-glamlink-teal transition-colors">
                {product.name}
              </h3>
              <p className="text-gray-600 font-semibold">{product.price}</p>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            href="/shop"
            className="inline-flex items-center text-glamlink-teal font-medium hover:text-glamlink-teal-dark transition-colors"
          >
            View All Products
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}