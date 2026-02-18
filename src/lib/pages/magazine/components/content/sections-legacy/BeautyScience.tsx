'use client';

import { useState } from 'react';
import Link from 'next/link';

interface BeautyScienceProps {
  isLoading?: boolean;
}

interface ScienceTopic {
  id: string;
  title: string;
  category: string;
  readTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  keyPoints: string[];
  myth?: string;
  fact?: string;
}

interface Ingredient {
  name: string;
  benefits: string[];
  scientificName?: string;
  concentrationRange?: string;
  compatibleWith: string[];
  notCompatibleWith: string[];
}

export default function BeautyScience({ isLoading }: BeautyScienceProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const categories = ['all', 'ingredients', 'formulations', 'myths', 'research'];

  const scienceTopics: ScienceTopic[] = [
    {
      id: 'retinol-science',
      title: 'The Science Behind Retinol: How It Actually Works',
      category: 'ingredients',
      readTime: '5 min',
      difficulty: 'intermediate',
      keyPoints: [
        'Increases cell turnover rate by 3-4x',
        'Stimulates collagen production in dermis',
        'Requires 12 weeks for visible results',
        'Converts to retinoic acid in skin cells'
      ],
      myth: 'Retinol thins the skin',
      fact: 'Retinol actually thickens the dermis by boosting collagen production'
    },
    {
      id: 'vitamin-c-stability',
      title: 'Why Vitamin C Turns Orange: Oxidation Explained',
      category: 'formulations',
      readTime: '4 min',
      difficulty: 'beginner',
      keyPoints: [
        'L-ascorbic acid is unstable in water',
        'pH must be below 3.5 for stability',
        'Ferulic acid doubles photoprotection',
        'Vitamin E increases stability by 90%'
      ]
    },
    {
      id: 'peptides-truth',
      title: 'Do Peptides Really Work? A Scientific Review',
      category: 'research',
      readTime: '6 min',
      difficulty: 'advanced',
      keyPoints: [
        'Signal peptides trigger collagen synthesis',
        'Carrier peptides deliver trace elements',
        'Neurotransmitter peptides reduce wrinkles',
        'Molecular size affects penetration'
      ]
    },
    {
      id: 'hyaluronic-myth',
      title: 'Hyaluronic Acid Myths: Size Matters',
      category: 'myths',
      readTime: '3 min',
      difficulty: 'beginner',
      keyPoints: [
        'Can hold 1000x its weight in water',
        'Different molecular weights have different functions',
        'Low MW (<50kDa) penetrates deeper',
        'High MW (>1000kDa) forms protective film'
      ],
      myth: 'All hyaluronic acid is the same',
      fact: 'Molecular weight determines penetration and function'
    },
    {
      id: 'niacinamide-guide',
      title: 'Niacinamide: The Multi-Tasking Molecule',
      category: 'ingredients',
      readTime: '4 min',
      difficulty: 'intermediate',
      keyPoints: [
        'Reduces sebum production by 23%',
        'Improves barrier function in 4 weeks',
        'Safe to mix with most actives',
        'Optimal concentration: 2-5%'
      ]
    },
    {
      id: 'preservatives-safety',
      title: 'Preservatives: Why Your Products Need Them',
      category: 'formulations',
      readTime: '5 min',
      difficulty: 'intermediate',
      keyPoints: [
        'Prevent dangerous bacterial growth',
        'Extend shelf life from days to years',
        'Challenge testing ensures safety',
        'Natural ≠ preservative-free'
      ],
      myth: 'Preservative-free is always better',
      fact: 'Preservatives prevent harmful bacteria that can cause infections'
    }
  ];

  const ingredientDatabase: Ingredient[] = [
    {
      name: 'Retinol',
      scientificName: 'Vitamin A',
      benefits: ['Anti-aging', 'Acne treatment', 'Texture improvement'],
      concentrationRange: '0.25% - 1%',
      compatibleWith: ['Niacinamide', 'Hyaluronic Acid', 'Peptides'],
      notCompatibleWith: ['Vitamin C', 'AHAs', 'BHAs', 'Benzoyl Peroxide']
    },
    {
      name: 'Vitamin C',
      scientificName: 'L-Ascorbic Acid',
      benefits: ['Brightening', 'Antioxidant', 'Collagen synthesis'],
      concentrationRange: '10% - 20%',
      compatibleWith: ['Vitamin E', 'Ferulic Acid', 'Hyaluronic Acid'],
      notCompatibleWith: ['Retinol', 'Niacinamide (in same routine)', 'Copper Peptides']
    },
    {
      name: 'Salicylic Acid',
      scientificName: 'Beta Hydroxy Acid (BHA)',
      benefits: ['Exfoliation', 'Acne treatment', 'Pore clearing'],
      concentrationRange: '0.5% - 2%',
      compatibleWith: ['Niacinamide', 'Hyaluronic Acid'],
      notCompatibleWith: ['Retinol', 'Vitamin C', 'Other exfoliants']
    }
  ];

  const filteredTopics = selectedCategory === 'all' 
    ? scienceTopics 
    : scienceTopics.filter(topic => topic.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-96 mb-12"></div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Beauty Science Simplified
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Evidence-based insights to help you make informed beauty decisions
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full font-medium transition-all capitalize ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Science Topics */}
      <div className="space-y-4 mb-12">
        {filteredTopics.map((topic) => (
          <div key={topic.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {topic.title}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                      {topic.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>📚 {topic.readTime} read</span>
                    <span className="capitalize">📁 {topic.category}</span>
                  </div>
                </div>
                <div className="text-gray-400">
                  {expandedTopic === topic.id ? '▼' : '▶'}
                </div>
              </div>
            </div>

            {expandedTopic === topic.id && (
              <div className="px-6 pb-6 border-t border-gray-100">
                {/* Key Points */}
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Scientific Facts:</h4>
                  <ul className="space-y-2">
                    {topic.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-600 mr-2 mt-0.5">•</span>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Myth vs Fact */}
                {topic.myth && topic.fact && (
                  <div className="mt-6 grid md:grid-cols-2 gap-4">
                    <div className="bg-red-50 rounded-lg p-4">
                      <h5 className="font-semibold text-red-700 mb-2">❌ Common Myth</h5>
                      <p className="text-gray-700">{topic.myth}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h5 className="font-semibold text-green-700 mb-2">✓ Scientific Fact</h5>
                      <p className="text-gray-700">{topic.fact}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ingredient Compatibility Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-6 md:p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Ingredient Compatibility Quick Guide
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {ingredientDatabase.map((ingredient) => (
            <div key={ingredient.name} className="bg-white rounded-lg p-3 sm:p-4 md:p-6">
              <h4 className="font-semibold text-gray-900 mb-1">
                {ingredient.name}
              </h4>
              {ingredient.scientificName && (
                <p className="text-sm text-gray-600 mb-3 italic">
                  {ingredient.scientificName}
                </p>
              )}
              
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">
                    Concentration
                  </span>
                  <p className="text-sm text-gray-700">{ingredient.concentrationRange}</p>
                </div>
                
                <div>
                  <span className="text-xs font-medium text-green-600 uppercase">
                    ✓ Works well with
                  </span>
                  <p className="text-sm text-gray-700">
                    {ingredient.compatibleWith.join(', ')}
                  </p>
                </div>
                
                <div>
                  <span className="text-xs font-medium text-red-600 uppercase">
                    ✗ Avoid mixing with
                  </span>
                  <p className="text-sm text-gray-700">
                    {ingredient.notCompatibleWith.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Resources */}
      <div className="mt-12 bg-white rounded-lg p-4 sm:p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
          Want to Learn More?
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="p-4">
            <div className="text-2xl mb-2">📖</div>
            <h4 className="font-medium text-gray-900">Research Papers</h4>
            <p className="text-sm text-gray-600 mt-1">
              Access peer-reviewed studies
            </p>
          </div>
          <div className="p-4">
            <div className="text-2xl mb-2">🧪</div>
            <h4 className="font-medium text-gray-900">Clinical Trials</h4>
            <p className="text-sm text-gray-600 mt-1">
              See real testing results
            </p>
          </div>
          <div className="p-4">
            <div className="text-2xl mb-2">👩‍🔬</div>
            <h4 className="font-medium text-gray-900">Expert Q&A</h4>
            <p className="text-sm text-gray-600 mt-1">
              Ask dermatologists directly
            </p>
          </div>
          <div className="p-4">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-medium text-gray-900">Ingredient Database</h4>
            <p className="text-sm text-gray-600 mt-1">
              Search 10,000+ ingredients
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          Make science-backed beauty choices
        </p>
        <Link
          href="/brand"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
        >
          Shop Clinically-Proven Products
        </Link>
      </div>
    </div>
  );
}