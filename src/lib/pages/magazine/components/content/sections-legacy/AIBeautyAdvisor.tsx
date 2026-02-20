'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AIBeautyAdvisorProps {
  isLoading?: boolean;
  backgroundColor?: string | { main?: string; features?: string; demo?: string; recommendations?: string; cta?: string; };
}

interface AIFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface AIRecommendation {
  category: string;
  suggestions: string[];
}

export default function AIBeautyAdvisor({ isLoading, backgroundColor }: AIBeautyAdvisorProps) {
  const [selectedSkinType, setSelectedSkinType] = useState<string>('');
  const [showRecommendations, setShowRecommendations] = useState(false);
  
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
  const featuresBgProps = getBackgroundProps(backgrounds?.features);
  const demoBgProps = getBackgroundProps(backgrounds?.demo);
  const recommendationsBgProps = getBackgroundProps(backgrounds?.recommendations);
  const ctaBgProps = getBackgroundProps(backgrounds?.cta);

  const features: AIFeature[] = [
    {
      id: 'analysis',
      title: 'Skin Analysis',
      description: 'Upload a selfie for instant AI-powered skin assessment',
      icon: '🤳',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      id: 'personalize',
      title: 'Personalized Routines',
      description: 'Get customized morning and evening skincare routines',
      icon: '✨',
      color: 'from-purple-400 to-pink-400'
    },
    {
      id: 'match',
      title: 'Product Matching',
      description: 'Find products that work for your specific skin concerns',
      icon: '🎯',
      color: 'from-green-400 to-emerald-400'
    },
    {
      id: 'track',
      title: 'Progress Tracking',
      description: 'Monitor your skin improvements over time with AI',
      icon: '📊',
      color: 'from-orange-400 to-red-400'
    }
  ];

  const skinTypes = ['Dry', 'Oily', 'Combination', 'Sensitive', 'Normal'];

  const getRecommendations = (skinType: string): AIRecommendation[] => {
    const baseRecommendations: { [key: string]: AIRecommendation[] } = {
      Dry: [
        { category: 'Cleanser', suggestions: ['Gentle cream cleanser', 'Oil-based cleanser', 'Micellar water'] },
        { category: 'Moisturizer', suggestions: ['Heavy cream', 'Hyaluronic acid serum', 'Face oil'] },
        { category: 'Treatment', suggestions: ['Hydrating mask', 'Ceramide treatment', 'Overnight sleeping mask'] }
      ],
      Oily: [
        { category: 'Cleanser', suggestions: ['Foaming cleanser', 'Salicylic acid wash', 'Clay cleanser'] },
        { category: 'Moisturizer', suggestions: ['Gel moisturizer', 'Oil-free lotion', 'Water-based cream'] },
        { category: 'Treatment', suggestions: ['BHA toner', 'Niacinamide serum', 'Clay mask'] }
      ],
      Combination: [
        { category: 'Cleanser', suggestions: ['Balanced gel cleanser', 'Gentle foam wash', 'pH-balanced cleanser'] },
        { category: 'Moisturizer', suggestions: ['Lightweight lotion', 'Gel-cream hybrid', 'Zone-specific products'] },
        { category: 'Treatment', suggestions: ['T-zone treatment', 'Balancing serum', 'Multi-masking'] }
      ],
      Sensitive: [
        { category: 'Cleanser', suggestions: ['Fragrance-free cleanser', 'Cream cleanser', 'Thermal water spray'] },
        { category: 'Moisturizer', suggestions: ['Calming cream', 'Centella asiatica cream', 'Barrier repair lotion'] },
        { category: 'Treatment', suggestions: ['Soothing mask', 'Anti-redness serum', 'Probiotic treatment'] }
      ],
      Normal: [
        { category: 'Cleanser', suggestions: ['Any gentle cleanser', 'Enzyme cleanser', 'Cleansing balm'] },
        { category: 'Moisturizer', suggestions: ['Daily moisturizer', 'Antioxidant cream', 'SPF moisturizer'] },
        { category: 'Treatment', suggestions: ['Vitamin C serum', 'Retinol treatment', 'Weekly exfoliant'] }
      ]
    };

    return baseRecommendations[skinType] || [];
  };

  const handleAnalyze = () => {
    if (selectedSkinType) {
      setShowRecommendations(true);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-96 mb-12"></div>
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-40"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={mainBgProps.className || ''} style={mainBgProps.style}>
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          AI Beauty Advisor
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get personalized beauty recommendations powered by artificial intelligence
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={`rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow ${featuresBgProps.className || 'bg-white'}`}
            style={featuresBgProps.style}
          >
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} mb-4`}>
              <span className="text-2xl">{feature.icon}</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Interactive Demo */}
      <div className={`rounded-2xl p-8 ${demoBgProps.className || 'bg-gradient-to-r from-purple-50 to-pink-50'}`} style={demoBgProps.style}>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Try Our AI Beauty Advisor
        </h3>

        {!showRecommendations ? (
          <div className="max-w-2xl mx-auto">
            {/* Skin Type Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">
                Select your skin type:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {skinTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedSkinType(type)}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      selectedSkinType === type
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : `border-gray-200 text-gray-700 hover:border-gray-300 ${featuresBgProps.className || 'bg-white'}`
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Analyze Button */}
            <div className="text-center">
              <button
                onClick={handleAnalyze}
                disabled={!selectedSkinType}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  selectedSkinType
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Get AI Recommendations
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {/* Recommendations */}
            <div className={`rounded-lg p-6 mb-6 ${recommendationsBgProps.className || 'bg-white'}`} style={recommendationsBgProps.style}>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                AI Recommendations for {selectedSkinType} Skin
              </h4>
              <div className="space-y-6">
                {getRecommendations(selectedSkinType).map((rec) => (
                  <div key={rec.category}>
                    <h5 className="font-medium text-gray-900 mb-2">{rec.category}:</h5>
                    <div className="flex flex-wrap gap-2">
                      {rec.suggestions.map((suggestion, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          {suggestion}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setShowRecommendations(false);
                  setSelectedSkinType('');
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/image-analysis"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors text-center"
              >
                Try Full AI Analysis
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <div className={`rounded-lg shadow-sm p-8 max-w-2xl mx-auto ${ctaBgProps.className || 'bg-white'}`} style={ctaBgProps.style}>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Want a Complete AI Beauty Analysis?
          </h3>
          <p className="text-gray-600 mb-6">
            Upload your photo and get personalized product recommendations, 
            skin analysis, and custom routines tailored just for you.
          </p>
          <Link
            href="/image-analysis"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
          >
            Start Full Analysis →
          </Link>
        </div>
      </div>
    </div>
  );
}