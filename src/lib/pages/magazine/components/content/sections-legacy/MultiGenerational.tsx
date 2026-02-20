'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Base Product type for this section
interface BaseProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  ingredients?: string[];
  benefits?: string[];
  inStock?: boolean;
  isSpotlight?: boolean;
  createdAt?: string;
}

interface MultiGenerationalProps {
  products?: BaseProduct[];
  isLoading?: boolean;
  backgroundColor?: string | { main?: string; ageGroups?: string; products?: string; tips?: string; stats?: string; };
}

interface AgeGroup {
  id: string;
  name: string;
  ageRange: string;
  emoji: string;
  concerns: string[];
  recommendedCategories: string[];
}

interface FamilyProduct extends BaseProduct {
  ageGroups: string[];
  familyFriendly: boolean;
  safetyRating?: string;
  brandName: string;
  brandId: string;
}

export default function MultiGenerational({ products, isLoading, backgroundColor }: MultiGenerationalProps) {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');

  const ageGroups: AgeGroup[] = [
    {
      id: 'kids',
      name: 'Kids',
      ageRange: '3-12',
      emoji: '👧',
      concerns: ['Gentle formulas', 'Fun packaging', 'Bath time', 'Sun protection'],
      recommendedCategories: ['sunscreen', 'bath', 'gentle cleansers']
    },
    {
      id: 'teens',
      name: 'Teens',
      ageRange: '13-19',
      emoji: '👩‍🎓',
      concerns: ['Acne', 'First makeup', 'Oil control', 'Self-expression'],
      recommendedCategories: ['acne treatment', 'makeup', 'cleansers']
    },
    {
      id: 'young-adults',
      name: 'Young Adults',
      ageRange: '20-35',
      emoji: '👩‍💼',
      concerns: ['Prevention', 'Glow', 'Multi-tasking', 'Stress'],
      recommendedCategories: ['serums', 'moisturizers', 'treatments']
    },
    {
      id: 'adults',
      name: 'Adults',
      ageRange: '36-55',
      emoji: '👩',
      concerns: ['Anti-aging', 'Firmness', 'Dark spots', 'Hydration'],
      recommendedCategories: ['anti-aging', 'treatments', 'masks']
    },
    {
      id: 'mature',
      name: 'Mature',
      ageRange: '55+',
      emoji: '👵',
      concerns: ['Deep hydration', 'Gentle actives', 'Comfort', 'Radiance'],
      recommendedCategories: ['rich creams', 'gentle treatments', 'nourishing']
    }
  ];

  // Mock family-friendly products
  const mockFamilyProducts: FamilyProduct[] = [
    {
      id: 'fam-1',
      name: 'Gentle Daily Sunscreen SPF 50',
      description: 'Mineral sunscreen safe for the whole family',
      price: 24.99,
      category: 'sunscreen',
      image: '/images/placeholder.png',
      ingredients: ['Zinc Oxide', 'Titanium Dioxide', 'Aloe Vera'],
      benefits: ['Broad spectrum protection', 'Water resistant', 'Non-irritating'],
      brandName: 'FamilyCare',
      brandId: 'brand-fam-1',
      ageGroups: ['kids', 'teens', 'young-adults', 'adults', 'mature'],
      familyFriendly: true,
      safetyRating: 'Pediatrician tested',
      inStock: true,
      isSpotlight: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'fam-2',
      name: 'Teen Clear Acne Kit',
      description: 'Complete acne solution for teenage skin',
      price: 39.99,
      category: 'acne treatment',
      image: '/images/placeholder.png',
      ingredients: ['Salicylic Acid 0.5%', 'Tea Tree Oil', 'Niacinamide'],
      benefits: ['Clears acne', 'Prevents breakouts', 'Gentle formula'],
      brandName: 'TeenGlow',
      brandId: 'brand-fam-2',
      ageGroups: ['teens', 'young-adults'],
      familyFriendly: true,
      inStock: true,
      isSpotlight: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'fam-3',
      name: 'Kids Bubble Bath Fun',
      description: 'Tear-free bubble bath with natural ingredients',
      price: 12.99,
      category: 'bath',
      image: '/images/placeholder.png',
      ingredients: ['Coconut Oil', 'Calendula', 'Chamomile'],
      benefits: ['Tear-free', 'Moisturizing', 'Calming'],
      brandName: 'BabyPure',
      brandId: 'brand-fam-3',
      ageGroups: ['kids'],
      familyFriendly: true,
      safetyRating: 'Dermatologist approved',
      inStock: true,
      isSpotlight: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'fam-4',
      name: 'Age-Defying Family Set',
      description: 'Customizable skincare for every age',
      price: 89.99,
      category: 'skincare set',
      image: '/images/placeholder.png',
      ingredients: ['Various actives', 'Peptides', 'Antioxidants'],
      benefits: ['Customizable', 'Full routine', 'Value pack'],
      brandName: 'GenerationBeauty',
      brandId: 'brand-fam-4',
      ageGroups: ['young-adults', 'adults', 'mature'],
      familyFriendly: true,
      inStock: true,
      isSpotlight: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'fam-5',
      name: 'Mature Skin Comfort Cream',
      description: 'Rich, nourishing cream for mature skin',
      price: 68.00,
      category: 'moisturizer',
      image: '/images/placeholder.png',
      ingredients: ['Ceramides', 'Squalane', 'Vitamin E'],
      benefits: ['Deep hydration', 'Barrier repair', 'Soothing'],
      brandName: 'AgelessBeauty',
      brandId: 'brand-fam-5',
      ageGroups: ['adults', 'mature'],
      familyFriendly: true,
      inStock: true,
      isSpotlight: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'fam-6',
      name: 'First Makeup Kit',
      description: 'Safe, gentle makeup for beginners',
      price: 29.99,
      category: 'makeup',
      image: '/images/placeholder.png',
      ingredients: ['Mineral pigments', 'Vitamin E', 'Jojoba Oil'],
      benefits: ['Non-comedogenic', 'Easy to apply', 'Natural look'],
      brandName: 'TeenBeauty',
      brandId: 'brand-fam-6',
      ageGroups: ['teens', 'young-adults'],
      familyFriendly: true,
      inStock: true,
      isSpotlight: false,
      createdAt: new Date().toISOString()
    }
  ];

  const displayProducts = selectedAgeGroup === 'all' 
    ? mockFamilyProducts 
    : mockFamilyProducts.filter(p => p.ageGroups.includes(selectedAgeGroup));

  // Parse background colors
  const backgrounds = typeof backgroundColor === 'object' 
    ? backgroundColor 
    : { main: backgroundColor };
  
  // Check if a value is a Tailwind class
  const isTailwindClass = (value?: string) => {
    return value && (value.startsWith('bg-') || value.includes(' bg-') || value.includes('from-') || value.includes('to-'));
  };
  
  // Apply background style or class
  const getBackgroundProps = (bgValue?: string) => {
    if (!bgValue || bgValue === 'transparent') return {};
    if (isTailwindClass(bgValue)) {
      return { className: bgValue };
    }
    return { style: { background: bgValue } };
  };
  
  const mainBgProps = getBackgroundProps(backgrounds?.main);
  const ageGroupsBgProps = getBackgroundProps(backgrounds?.ageGroups);
  const productsBgProps = getBackgroundProps(backgrounds?.products);
  const tipsBgProps = getBackgroundProps(backgrounds?.tips);
  const statsBgProps = getBackgroundProps(backgrounds?.stats);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-96 mb-12"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div {...mainBgProps} className={mainBgProps?.className || ''}>
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Beauty for Every Generation
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Safe, effective products for the whole family - from kids to grandparents
        </p>
      </div>

      {/* Age Group Selector */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Select Age Group:
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setSelectedAgeGroup('all')}
            className={`px-6 py-4 rounded-xl transition-all ${
              selectedAgeGroup === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : `${ageGroupsBgProps?.className || 'bg-white'} text-gray-700 hover:shadow-md`
            }`}
          >
            <div className="text-2xl mb-1">👨‍👩‍👧‍👦</div>
            <div className="font-medium">All Ages</div>
          </button>
          {ageGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setSelectedAgeGroup(group.id)}
              className={`px-6 py-4 rounded-xl transition-all ${
                selectedAgeGroup === group.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : `${ageGroupsBgProps?.className || 'bg-white'} text-gray-700 hover:shadow-md`
              }`}
            >
              <div className="text-2xl mb-1">{group.emoji}</div>
              <div className="font-medium">{group.name}</div>
              <div className="text-xs opacity-80">Ages {group.ageRange}</div>
            </button>
          ))}
        </div>

        {/* Age Group Concerns */}
        {selectedAgeGroup !== 'all' && (
          <div className="mt-8 max-w-2xl mx-auto">
            {(() => {
              const group = ageGroups.find(g => g.id === selectedAgeGroup);
              return group ? (
                <div className="bg-purple-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Common Concerns for {group.name}:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {group.concerns.map((concern, idx) => (
                      <span key={idx} className={`px-3 py-1 text-purple-700 rounded-full text-sm ${ageGroupsBgProps?.className || 'bg-white'}`} {...(ageGroupsBgProps?.style && { style: ageGroupsBgProps.style })}>
                        {concern}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProducts.map((product) => (
          <div key={product.id} className={`rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${productsBgProps?.className || 'bg-white'}`} {...(productsBgProps?.style && { style: productsBgProps.style })}>
            {/* Product Image */}
            <div className="relative h-48 bg-gray-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.safetyRating && (
                <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  ✓ {product.safetyRating}
                </div>
              )}
            </div>

            <div className="p-6">
              {/* Age Groups */}
              <div className="mb-3 flex flex-wrap gap-2">
                {product.ageGroups.map((ageId) => {
                  const group = ageGroups.find(g => g.id === ageId);
                  return group ? (
                    <span key={ageId} className="text-lg" title={group.name}>
                      {group.emoji}
                    </span>
                  ) : null;
                })}
              </div>

              {/* Product Info */}
              <h3 className="font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {product.description}
              </p>

              {/* Brand */}
              <Link
                href={`/brand/${product.brandId}`}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                by {product.brandName}
              </Link>

              {/* Price */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.familyFriendly && (
                  <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    Family Pack Available
                  </span>
                )}
              </div>

              {/* Benefits */}
              <div className="mt-4 space-y-1">
                {product.benefits?.slice(0, 2).map((benefit, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Family Shopping Tips */}
      <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Smart Family Beauty Shopping
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-3">🏷️</div>
            <h4 className="font-semibold text-gray-900 mb-2">Bundle & Save</h4>
            <p className="text-sm text-gray-600">
              Family packs save up to 30% per person
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🔬</div>
            <h4 className="font-semibold text-gray-900 mb-2">Check Ingredients</h4>
            <p className="text-sm text-gray-600">
              Age-appropriate formulations matter
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">♻️</div>
            <h4 className="font-semibold text-gray-900 mb-2">Share Basics</h4>
            <p className="text-sm text-gray-600">
              Sunscreen and cleansers can be shared
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">📚</div>
            <h4 className="font-semibold text-gray-900 mb-2">Educate Early</h4>
            <p className="text-sm text-gray-600">
              Teach good skincare habits young
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-12 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          The Multi-Gen Beauty Market
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className={`rounded-lg p-4 ${statsBgProps?.className || 'bg-white'}`} {...(statsBgProps?.style && { style: statsBgProps.style })}>
            <div className="text-3xl font-bold text-purple-600">73%</div>
            <div className="text-sm text-gray-600">Families shop together</div>
          </div>
          <div className={`rounded-lg p-4 ${statsBgProps?.className || 'bg-white'}`} {...(statsBgProps?.style && { style: statsBgProps.style })}>
            <div className="text-3xl font-bold text-pink-600">2.5x</div>
            <div className="text-sm text-gray-600">Higher basket value</div>
          </div>
          <div className={`rounded-lg p-4 ${statsBgProps?.className || 'bg-white'}`} {...(statsBgProps?.style && { style: statsBgProps.style })}>
            <div className="text-3xl font-bold text-blue-600">89%</div>
            <div className="text-sm text-gray-600">Want age-specific advice</div>
          </div>
          <div className={`rounded-lg p-4 ${statsBgProps?.className || 'bg-white'}`} {...(statsBgProps?.style && { style: statsBgProps.style })}>
            <div className="text-3xl font-bold text-green-600">$450B</div>
            <div className="text-sm text-gray-600">Family beauty market</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          Find the perfect products for everyone in your family
        </p>
        <Link
          href="/brand"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
        >
          Shop Family-Friendly Brands
        </Link>
      </div>
    </div>
  );
}