"use client";

import Image from "next/image";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";

interface Product {
  name?: string;
  brand?: string;
  price?: string;
  image?: string | { url: string; objectFit?: string; objectPositionX?: number; objectPositionY?: number };
  link?: string;
}

interface SimilarProductsProps {
  products?: Product[];
  title?: string;
  className?: string;
}

export default function SimilarProducts({ 
  products, 
  title = "Similar Products",
  className = "" 
}: SimilarProductsProps) {
  if (!products || products.length === 0) return null;
  
  return (
    <div className={`${className}`}>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, index) => {
          const imageUrl = product.image ? getImageUrl(product.image) : null;
          const objectFit = product.image ? getImageObjectFit(product.image as any) : 'cover';
          const objectPosition = product.image ? getImageObjectPosition(product.image as any) : 'center';
          
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              {imageUrl && (
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={imageUrl}
                    alt={product.name || "Product"}
                    fill
                    className="object-center"
                    style={{ 
                      objectFit: objectFit as any,
                      objectPosition
                    }}
                  />
                </div>
              )}
              
              <div className="p-3">
                {product.brand && (
                  <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                    {product.brand}
                  </p>
                )}
                {product.name && (
                  <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                    {product.name}
                  </h4>
                )}
                {product.price && (
                  <p className="text-sm font-bold text-glamlink-purple">{product.price}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}