"use client";

import { SustainableProduct } from "../../../types";
import Image from "next/image";
import Link from "next/link";

interface SustainableBeautyProps {
  products?: SustainableProduct[];
  isLoading?: boolean;
}

export default function SustainableBeauty({ products, isLoading }: SustainableBeautyProps) {
  // Mock data for when no products are provided
  const mockProducts: SustainableProduct[] = [
    {
      id: "eco-1",
      name: "Refillable Vitamin C Serum",
      description: "Brightening serum in eco-friendly refillable glass bottle",
      price: 45.0,
      category: "skincare",
      image: "/images/placeholder.png",
      ingredients: ["Vitamin C", "Hyaluronic Acid", "Ferulic Acid"],
      benefits: ["Brightening", "Anti-aging", "Environmental protection"],
      brandName: "EcoGlow",
      brandId: "brand-eco-1",
      sustainabilityScore: 95,
      ecoFeatures: ["Refillable packaging", "Carbon neutral shipping", "Vegan formula"],
      carbonFootprint: "75% less than traditional packaging",
      refillable: true,
      packaging: "Recycled glass with bamboo cap",
      certifications: ["Leaping Bunny", "Carbon Neutral", "B Corp"],
      inStock: true,
      isSpotlight: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "eco-2",
      name: "Zero-Waste Shampoo Bar",
      description: "Solid shampoo bar with compostable packaging",
      price: 12.99,
      category: "haircare",
      image: "/images/placeholder.png",
      ingredients: ["Coconut Oil", "Shea Butter", "Essential Oils"],
      benefits: ["Cleansing", "Moisturizing", "Travel-friendly"],
      brandName: "PureNature",
      brandId: "brand-eco-2",
      sustainabilityScore: 98,
      ecoFeatures: ["Zero plastic", "Biodegradable", "Waterless formula"],
      carbonFootprint: "90% reduction in transport emissions",
      refillable: false,
      packaging: "Compostable paper wrap",
      certifications: ["Plastic Free", "Rainforest Alliance", "USDA Organic"],
      inStock: true,
      isSpotlight: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "eco-3",
      name: "Bamboo Fiber Face Masks",
      description: "Biodegradable sheet masks made from bamboo",
      price: 24.99,
      category: "skincare",
      image: "/images/placeholder.png",
      ingredients: ["Bamboo Extract", "Green Tea", "Aloe Vera"],
      benefits: ["Hydrating", "Soothing", "Eco-friendly"],
      brandName: "GreenBeauty",
      brandId: "brand-eco-3",
      sustainabilityScore: 88,
      ecoFeatures: ["Biodegradable material", "Sustainable sourcing", "Minimal packaging"],
      carbonFootprint: "60% less than synthetic masks",
      refillable: false,
      packaging: "FSC-certified paper box",
      certifications: ["FSC Certified", "Cruelty Free", "EWG Verified"],
      inStock: true,
      isSpotlight: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "eco-4",
      name: "Reef-Safe Mineral Sunscreen",
      description: "Ocean-friendly SPF 50 with recyclable aluminum tube",
      price: 28.0,
      category: "skincare",
      image: "/images/placeholder.png",
      ingredients: ["Zinc Oxide", "Titanium Dioxide", "Coconut Oil"],
      benefits: ["Sun protection", "Moisturizing", "Reef-safe"],
      brandName: "OceanGuard",
      brandId: "brand-eco-4",
      sustainabilityScore: 92,
      ecoFeatures: ["Reef-safe formula", "Recyclable packaging", "Ocean cleanup contribution"],
      carbonFootprint: "Carbon negative through ocean cleanup",
      refillable: false,
      packaging: "Recyclable aluminum tube",
      certifications: ["Reef Safe", "1% for the Planet", "EcoVadis Gold"],
      inStock: true,
      isSpotlight: false,
      createdAt: new Date().toISOString(),
    },
  ];

  const displayProducts = products && products.length > 0 ? products : mockProducts;

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-96 mb-12"></div>
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
          ))}
        </div>
      </div>
    );
  }

  const getSustainabilityColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sustainable Beauty</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Eco-conscious products that are good for you and the planet</p>
      </div>

      {/* Sustainability Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">67.7%</div>
          <div className="text-sm text-gray-600">Value Sustainability</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">56.2%</div>
          <div className="text-sm text-gray-600">Pay Premium for Eco</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-1">82%</div>
          <div className="text-sm text-gray-600">Want Refillables</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-1">91%</div>
          <div className="text-sm text-gray-600">Prefer Cruelty-Free</div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {displayProducts.map((product) => {
          const scoreColor = getSustainabilityColor(product.sustainabilityScore);

          return (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex">
                {/* Product Image */}
                <div className="relative w-48 h-48 bg-gray-100 flex-shrink-0">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                  {product.refillable && <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">♻️ Refillable</div>}
                </div>

                <div className="flex-1 p-6">
                  {/* Sustainability Score */}
                  <div className="mb-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${scoreColor}`}>🌿 {product.sustainabilityScore}% Eco Score</span>
                  </div>

                  {/* Product Info */}
                  <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <Link href={`/brand/${product.brandId}`} className="text-sm text-gray-600 hover:text-blue-600">
                    by {product.brandName}
                  </Link>

                  {/* Price */}
                  <div className="text-2xl font-bold text-gray-900 mt-2">${product.price}</div>

                  {/* Eco Features */}
                  <div className="mt-3 space-y-1">
                    {product.ecoFeatures.slice(0, 3).map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Carbon Footprint */}
                  <div className="mt-3 text-xs text-gray-500">🌍 {product.carbonFootprint}</div>
                </div>
              </div>

              {/* Certifications */}
              <div className="px-6 pb-4 border-t border-gray-100">
                <div className="flex items-center pt-3">
                  <span className="text-xs text-gray-500 mr-2">Certified:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.certifications.map((cert: string, idx: number) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sustainability Guide */}
      <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 sm:p-6 md:p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Understanding Sustainability Labels</h3>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl mb-3">♻️</div>
            <h4 className="font-semibold text-gray-900 mb-2">Refillable</h4>
            <p className="text-sm text-gray-600">Products with refill options to reduce packaging waste</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🌱</div>
            <h4 className="font-semibold text-gray-900 mb-2">Biodegradable</h4>
            <p className="text-sm text-gray-600">Naturally breaks down without harming the environment</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🐰</div>
            <h4 className="font-semibold text-gray-900 mb-2">Cruelty-Free</h4>
            <p className="text-sm text-gray-600">No animal testing at any stage of production</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">Join the sustainable beauty movement</p>
        <Link href="/brand" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-colors">
          Shop All Eco-Friendly Products
        </Link>
      </div>
    </div>
  );
}
