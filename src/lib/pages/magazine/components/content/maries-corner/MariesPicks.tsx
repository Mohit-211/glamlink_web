"use client";

import Image from "next/image";
import MagazineLink from "../../shared/MagazineLink";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";

interface Product {
  name: string;
  category: string;
  image: any;
  link?: any;
}

interface MariesPicksProps {
  products?: Product[] | { products?: Product[]; title?: string };
  title?: string;
  className?: string;
}

export default function MariesPicks({ 
  products, 
  title,
  className = "" 
}: MariesPicksProps) {
  // Handle different formats
  let productArray: Product[] = [];
  let picksTitle = title;
  
  if (products) {
    if (Array.isArray(products)) {
      productArray = products;
    } else if (typeof products === 'object') {
      productArray = products.products || [];
      picksTitle = title || products.title || "MARIE'S PICKS";
    }
  }

  if (!productArray || productArray.length === 0) return null;

  return (
    <div className={`rounded-lg p-6 bg-gradient-to-br from-glamlink-purple/5 to-glamlink-teal/5 ${className}`}>
      <h3 className="text-lg font-bold mb-4 text-center">{picksTitle || "MARIE'S PICKS"}</h3>
      <div className="space-y-3">
        {productArray.map((product, index) => (
          <div key={index}>
            {product.link ? (
              <MagazineLink 
                field={product.link} 
                className="flex items-center gap-3 p-3 rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
              >
                <ProductCard product={product} />
              </MagazineLink>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white">
                <ProductCard product={product} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <>
      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={getImageUrl(product.image) || "/images/placeholder.png"}
          alt={product.name}
          fill
          className={getImageObjectFit(product.image) === "cover" ? "object-cover" : "object-contain"}
          style={{
            objectPosition: getImageObjectPosition(product.image),
          }}
        />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-sm text-gray-900">{product.name}</h4>
        <p className="text-xs text-gray-600">{product.category}</p>
      </div>
    </>
  );
}