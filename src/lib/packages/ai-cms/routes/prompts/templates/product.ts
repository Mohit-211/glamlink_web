/**
 * Template Prompts for Product Content
 * 
 * Pre-configured templates for product descriptions, marketing copy,
 * and e-commerce content optimization.
 */

/**
 * Product content templates
 */
export const PRODUCT_CONTENT_TEMPLATES = {
  'description': {
    title: 'Product Description',
    description: 'Main product descriptions and marketing copy',
    prompts: [
      'Focus on benefits rather than just features',
      'Add emotional appeal and lifestyle context',
      'Include specific use cases and results',
      'Make it more persuasive and compelling',
      'Add social proof and credibility elements',
      'Include sensory descriptions and imagery'
    ],
    examples: {
      headline: 'Transform Your [Skin Concern] with [Product Name]',
      description: 'Explain what the product does and why it matters',
      benefits: 'List specific benefits with emotional appeal',
      usage: 'Clear, simple instructions for use'
    }
  },

  'ingredients': {
    title: 'Ingredient Information',
    description: 'Ingredient lists, benefits, and scientific explanations',
    prompts: [
      'Explain ingredient benefits in simple terms',
      'Add scientific backing and research',
      'Include concentration levels and effectiveness',
      'Make technical information accessible',
      'Add safety information and precautions',
      'Include ingredient synergies and combinations'
    ],
    examples: {
      activeIngredients: 'Key ingredients with percentages and benefits',
      fullIngredients: 'Complete INCI ingredient list',
      keyBenefits: 'What each major ingredient does for skin',
      science: 'Brief scientific explanation of how it works'
    }
  },

  'specifications': {
    title: 'Product Specifications',
    description: 'Technical details, sizes, and product information',
    prompts: [
      'Add missing technical specifications',
      'Include size options and value information',
      'Add compatibility and usage guidelines',
      'Include shelf life and storage information',
      'Add packaging and sustainability details',
      'Include certification and testing information'
    ],
    examples: {
      size: 'Volume/weight with value comparison',
      texture: 'Description of product consistency and feel',
      packaging: 'Container type and sustainability features',
      certifications: 'Relevant certifications and testing'
    }
  },

  'usage': {
    title: 'Usage Instructions',
    description: 'How to use the product for best results',
    prompts: [
      'Make instructions clearer and more detailed',
      'Add timing and frequency recommendations',
      'Include tips for different skin types',
      'Add troubleshooting for common issues',
      'Include safety precautions and warnings',
      'Add tips for maximizing effectiveness'
    ],
    examples: {
      stepByStep: 'Clear numbered instructions',
      frequency: 'How often to use for different needs',
      tips: 'Professional tips for best results',
      precautions: 'Important safety information'
    }
  },

  'reviews': {
    title: 'Product Reviews and Testimonials',
    description: 'Customer feedback and review content',
    prompts: [
      'Add more specific details about results',
      'Include before and after descriptions',
      'Add context about skin type and concerns',
      'Make reviews more authentic and detailed',
      'Include timeline for seeing results',
      'Add comparison with other products'
    ],
    examples: {
      headline: 'Customer review headline',
      experience: 'Detailed description of using the product',
      results: 'Specific outcomes and improvements',
      recommendation: 'Who this product is best for'
    }
  }
};

/**
 * Beauty product category templates
 */
export const BEAUTY_CATEGORY_TEMPLATES = {
  'skincare': {
    title: 'Skincare Products',
    prompts: [
      'Include skin type recommendations',
      'Add layering order in skincare routine',
      'Include pH levels and compatibility',
      'Add seasonal usage recommendations',
      'Include patch testing instructions',
      'Add expected timeline for results'
    ]
  },

  'makeup': {
    title: 'Makeup Products',
    prompts: [
      'Include shade range and undertones',
      'Add application techniques and tools',
      'Include wear time and longevity',
      'Add removal instructions',
      'Include finish and coverage descriptions',
      'Add color matching guidance'
    ]
  },

  'haircare': {
    title: 'Hair Care Products',
    prompts: [
      'Include hair type and texture guidance',
      'Add styling tips and techniques',
      'Include frequency of use recommendations',
      'Add ingredient benefits for different hair needs',
      'Include protection from heat and environment',
      'Add scalp health considerations'
    ]
  },

  'fragrance': {
    title: 'Fragrance Products',
    prompts: [
      'Include fragrance notes and family',
      'Add longevity and sillage information',
      'Include best application techniques',
      'Add seasonal and occasion recommendations',
      'Include layering and combination tips',
      'Add storage and preservation advice'
    ]
  },

  'tools': {
    title: 'Beauty Tools and Devices',
    prompts: [
      'Include detailed usage instructions',
      'Add cleaning and maintenance guidelines',
      'Include safety precautions and warnings',
      'Add technique tips for best results',
      'Include replacement part information',
      'Add troubleshooting common issues'
    ]
  }
};

/**
 * E-commerce optimization templates
 */
export const ECOMMERCE_TEMPLATES = {
  'seo-optimized': {
    title: 'SEO-Optimized Product Content',
    prompts: [
      'Include target keywords naturally',
      'Optimize product titles for search',
      'Add long-tail keyword variations',
      'Include semantic keywords and synonyms',
      'Add FAQ sections for voice search',
      'Optimize meta descriptions and alt text'
    ]
  },

  'conversion-focused': {
    title: 'Conversion-Focused Copy',
    prompts: [
      'Add urgency and scarcity elements',
      'Include social proof and testimonials',
      'Add clear value propositions',
      'Include risk reversal and guarantees',
      'Add comparison with competitors',
      'Include strong call-to-action language'
    ]
  },

  'mobile-optimized': {
    title: 'Mobile-Optimized Content',
    prompts: [
      'Make content scannable with bullet points',
      'Keep paragraphs short for mobile reading',
      'Add visual hierarchy with headings',
      'Include tap-friendly elements',
      'Optimize for thumb navigation',
      'Add mobile-specific features and benefits'
    ]
  },

  'accessibility': {
    title: 'Accessibility-Focused Content',
    prompts: [
      'Add descriptive alt text for images',
      'Use clear, simple language',
      'Include screen reader friendly formatting',
      'Add audio descriptions for video content',
      'Use high contrast color descriptions',
      'Include size and texture descriptions'
    ]
  }
};

/**
 * Price and value proposition templates
 */
export const VALUE_PROPOSITION_TEMPLATES = {
  'premium': {
    title: 'Premium Product Positioning',
    prompts: [
      'Emphasize luxury and exclusivity',
      'Add artisan or high-end manufacturing details',
      'Include premium ingredient sourcing',
      'Add professional endorsements',
      'Emphasize long-term value and results',
      'Include limited availability or exclusivity'
    ]
  },

  'budget-friendly': {
    title: 'Budget-Friendly Positioning',
    prompts: [
      'Emphasize value for money',
      'Add cost-per-use calculations',
      'Compare to expensive alternatives',
      'Emphasize accessibility and inclusivity',
      'Add bulk or family size benefits',
      'Include money-saving tips and usage'
    ]
  },

  'clinical': {
    title: 'Clinical/Medical Positioning',
    prompts: [
      'Add scientific research and studies',
      'Include dermatologist recommendations',
      'Add clinical trial results',
      'Include medical-grade positioning',
      'Add safety and efficacy data',
      'Include professional usage recommendations'
    ]
  },

  'natural-organic': {
    title: 'Natural/Organic Positioning',
    prompts: [
      'Emphasize natural and organic ingredients',
      'Add sustainability and environmental benefits',
      'Include ethical sourcing information',
      'Add clean beauty and non-toxic positioning',
      'Include certifications and third-party testing',
      'Add traditional or ancient wisdom references'
    ]
  }
};

/**
 * Get product template by type
 */
export function getProductTemplate(templateType: string) {
  return (PRODUCT_CONTENT_TEMPLATES as Record<string, any>)[templateType] || null;
}

/**
 * Get beauty category template
 */
export function getBeautyCategoryTemplate(category: string) {
  return (BEAUTY_CATEGORY_TEMPLATES as Record<string, any>)[category] || null;
}

/**
 * Get e-commerce template
 */
export function getEcommerceTemplate(templateType: string) {
  return (ECOMMERCE_TEMPLATES as Record<string, any>)[templateType] || null;
}

/**
 * Get value proposition template
 */
export function getValuePropositionTemplate(templateType: string) {
  return (VALUE_PROPOSITION_TEMPLATES as Record<string, any>)[templateType] || null;
}

/**
 * Generate product-specific prompts based on product data
 */
export function generateProductPrompts(
  productData: any,
  category?: string,
  priceRange?: 'budget' | 'mid-range' | 'premium'
): string[] {
  const prompts: string[] = [];
  
  // Add category-specific prompts
  if (category) {
    const categoryTemplate = getBeautyCategoryTemplate(category);
    if (categoryTemplate) {
      prompts.push(...categoryTemplate.prompts);
    }
  }
  
  // Add price-range specific prompts
  if (priceRange) {
    const valueTemplate = getValuePropositionTemplate(priceRange === 'budget' ? 'budget-friendly' : 'premium');
    if (valueTemplate) {
      prompts.push(...valueTemplate.prompts);
    }
  }
  
  // Add data-specific prompts
  if (productData) {
    if (!productData.ingredients || productData.ingredients.length === 0) {
      prompts.push('Add key ingredient information and benefits');
    }
    
    if (!productData.usage || productData.usage.length < 50) {
      prompts.push('Add detailed usage instructions');
    }
    
    if (!productData.benefits || productData.benefits.length === 0) {
      prompts.push('Add specific benefits and results');
    }
    
    if (productData.description && productData.description.length < 100) {
      prompts.push('Expand product description with more details');
    }
  }
  
  return [...new Set(prompts)]; // Remove duplicates
}

/**
 * Get seasonal product prompts
 */
export function getSeasonalProductPrompts(): string[] {
  const month = new Date().getMonth();
  
  if (month >= 2 && month <= 4) { // Spring
    return [
      'Add spring skincare transition advice',
      'Include allergy and sensitivity considerations',
      'Add renewal and fresh start messaging',
      'Include spring cleaning for beauty routines'
    ];
  } else if (month >= 5 && month <= 7) { // Summer
    return [
      'Add sun protection and heat resistance features',
      'Include sweat and humidity resistance',
      'Add vacation and travel-friendly benefits',
      'Include cooling and refreshing properties'
    ];
  } else if (month >= 8 && month <= 10) { // Fall
    return [
      'Add preparation for colder weather',
      'Include back-to-school or work routines',
      'Add cozy and comforting elements',
      'Include autumn color and trend integration'
    ];
  } else { // Winter
    return [
      'Add cold weather protection features',
      'Include holiday party and event preparation',
      'Add indoor heating protection',
      'Include gift-giving and self-care messaging'
    ];
  }
}