/**
 * Template Prompts for Magazine Content
 * 
 * Pre-configured templates for common magazine content types and sections.
 * These templates provide starting points for various magazine editing scenarios.
 */

/**
 * Magazine section templates
 */
export const MAGAZINE_SECTION_TEMPLATES = {
  'basic-info': {
    title: 'Magazine Basic Info',
    description: 'Core magazine information including titles, descriptions, and metadata',
    prompts: [
      'Make this more professional and engaging',
      'Optimize for SEO and discoverability',
      'Improve readability and clarity',
      'Add compelling value propositions',
      'Make it more specific and descriptive',
      'Enhance for social media sharing'
    ],
    examples: {
      title: 'Create a compelling magazine title that captures attention and conveys the value proposition',
      subtitle: 'Write a supporting subtitle that provides context and encourages reading',
      description: 'Generate an engaging description that summarizes the magazine content and entices readers',
      editorNote: 'Write a personal editor note that connects with readers and sets expectations'
    }
  },

  'cover-config': {
    title: 'Magazine Cover Configuration',
    description: 'Cover image settings, featured persons, and visual elements',
    prompts: [
      'Update featured person details for accuracy',
      'Improve alt text for accessibility',
      'Enhance featured titles for impact',
      'Make cover text more compelling',
      'Optimize for mobile display',
      'Add visual hierarchy guidance'
    ],
    examples: {
      featuredPerson: 'Create an accurate, professional name for the featured person',
      featuredTitle: 'Generate a compelling title or role description',
      coverImageAlt: 'Write descriptive alt text that explains the cover image clearly',
      coverTagline: 'Create a catchy tagline that appears on the cover'
    }
  },

  'maries-corner': {
    title: "Marie's Corner Section",
    description: 'Founder column with personal insights and advice',
    prompts: [
      'Make this more personal and relatable',
      'Add specific examples and stories',
      'Include actionable advice for readers',
      'Enhance the founder voice and expertise',
      'Make it more engaging and conversational',
      'Add industry insights and trends'
    ],
    examples: {
      title: 'Create a compelling headline for the founder column',
      introText: 'Write a personal introduction that connects with readers',
      mainContent: 'Generate insightful content that provides value and showcases expertise',
      callToAction: 'Include a clear call-to-action for reader engagement'
    }
  },

  'cover-pro-feature': {
    title: 'Cover Professional Feature',
    description: 'Featured professional interviews and spotlights',
    prompts: [
      'Make the professional profile more compelling',
      'Add specific achievements and credentials',
      'Include inspirational quotes and insights',
      'Enhance the interview questions and answers',
      'Make it more relatable to readers',
      'Add expert tips and advice'
    ],
    examples: {
      professionalName: 'Full name with proper credentials and titles',
      specialization: 'Clear description of their area of expertise',
      achievements: 'Notable accomplishments and recognition',
      quote: 'Inspirational or insightful quote from the professional'
    }
  },

  'top-treatment': {
    title: 'Top Treatment Spotlight',
    description: 'Featured beauty treatment or service spotlight',
    prompts: [
      'Make the treatment description more appealing',
      'Add specific benefits and results',
      'Include before/after expectations',
      'Enhance the technical explanation',
      'Make it more accessible to general readers',
      'Add safety and preparation information'
    ],
    examples: {
      treatmentName: 'Professional name of the beauty treatment',
      description: 'Clear explanation of what the treatment involves',
      benefits: 'Specific benefits and expected results',
      process: 'Step-by-step overview of the treatment process'
    }
  },

  'top-product-spotlight': {
    title: 'Top Product Spotlight',
    description: 'Featured product deep dive and review',
    prompts: [
      'Make the product description more compelling',
      'Add specific use cases and benefits',
      'Include ingredient highlights',
      'Enhance the review with personal insights',
      'Make it more helpful for purchase decisions',
      'Add comparison with similar products'
    ],
    examples: {
      productName: 'Full product name with brand information',
      keyBenefits: 'Main benefits and unique selling points',
      ingredients: 'Key ingredients and their effects',
      usage: 'How to use the product for best results'
    }
  }
};

/**
 * Quick prompt suggestions for common editing tasks
 */
export const QUICK_PROMPTS = {
  improve: [
    'Make this more professional',
    'Improve readability and flow',
    'Enhance engagement and interest',
    'Add more specific details',
    'Make it more compelling',
    'Improve clarity and precision'
  ],
  
  tone: [
    'Make this more conversational',
    'Add a professional tone',
    'Make it more friendly and approachable',
    'Add expert authority',
    'Make it more inspiring',
    'Add warmth and personality'
  ],
  
  seo: [
    'Optimize for search engines',
    'Add relevant keywords naturally',
    'Improve meta description',
    'Make titles more SEO-friendly',
    'Enhance for local search',
    'Add semantic keywords'
  ],
  
  length: [
    'Make this more concise',
    'Expand with more details',
    'Add supporting examples',
    'Trim unnecessary content',
    'Make it more comprehensive',
    'Condense to key points'
  ],
  
  beauty: [
    'Add more beauty industry expertise',
    'Include skincare science',
    'Make it more inclusive for all skin types',
    'Add seasonal beauty tips',
    'Include ingredient education',
    'Add professional techniques'
  ]
};

/**
 * Content type specific prompt templates
 */
export const CONTENT_TYPE_TEMPLATES = {
  editorial: {
    name: 'Editorial Content',
    prompts: [
      'Write an engaging article about [topic]',
      'Create a compelling editorial on [subject]',
      'Develop an opinion piece about [trend]',
      'Write a thought leadership article on [industry topic]'
    ]
  },
  
  review: {
    name: 'Product/Service Review',
    prompts: [
      'Write a comprehensive review of [product/service]',
      'Create a balanced analysis of [item]',
      'Compare [product A] vs [product B]',
      'Review the pros and cons of [treatment/service]'
    ]
  },
  
  tutorial: {
    name: 'How-To Tutorial',
    prompts: [
      'Create a step-by-step guide for [process]',
      'Write tutorial instructions for [technique]',
      'Explain how to achieve [beauty goal]',
      'Create a beginner guide to [beauty routine]'
    ]
  },
  
  interview: {
    name: 'Interview Content',
    prompts: [
      'Create interview questions for [professional type]',
      'Write answers for expert interview about [topic]',
      'Develop a Q&A section about [subject]',
      'Create a professional spotlight interview'
    ]
  }
};

/**
 * Seasonal and trending prompt templates
 */
export const SEASONAL_TEMPLATES = {
  spring: {
    name: 'Spring Beauty Content',
    prompts: [
      'Create spring skincare transition tips',
      'Write about fresh spring makeup looks',
      'Develop seasonal ingredient spotlights',
      'Create spring cleaning beauty routines'
    ]
  },
  
  summer: {
    name: 'Summer Beauty Content',
    prompts: [
      'Write summer sun protection advice',
      'Create heat-proof makeup tutorials',
      'Develop beach-ready beauty routines',
      'Write about summer skin hydration'
    ]
  },
  
  fall: {
    name: 'Fall Beauty Content',
    prompts: [
      'Create fall skincare preparation tips',
      'Write about autumn color trends',
      'Develop cold weather beauty routines',
      'Create seasonal ingredient transitions'
    ]
  },
  
  winter: {
    name: 'Winter Beauty Content',
    prompts: [
      'Write winter skin protection advice',
      'Create holiday party makeup looks',
      'Develop dry skin solution guides',
      'Write about winter wellness routines'
    ]
  }
};

/**
 * Get template by section type
 */
export function getMagazineSectionTemplate(sectionType: string) {
  return (MAGAZINE_SECTION_TEMPLATES as Record<string, any>)[sectionType] || null;
}

/**
 * Get quick prompts by category
 */
export function getQuickPrompts(category: string): string[] {
  return (QUICK_PROMPTS as Record<string, string[]>)[category] || [];
}

/**
 * Get all available template categories
 */
export function getTemplateCategories(): string[] {
  return Object.keys(MAGAZINE_SECTION_TEMPLATES);
}

/**
 * Get seasonal prompts for current time of year
 */
export function getSeasonalPrompts(): { name: string; prompts: string[] } | null {
  const month = new Date().getMonth();
  
  if (month >= 2 && month <= 4) {
    return SEASONAL_TEMPLATES.spring;
  } else if (month >= 5 && month <= 7) {
    return SEASONAL_TEMPLATES.summer;
  } else if (month >= 8 && month <= 10) {
    return SEASONAL_TEMPLATES.fall;
  } else {
    return SEASONAL_TEMPLATES.winter;
  }
}

/**
 * Generate contextual prompts based on content data
 */
export function generateContextualPrompts(
  contentType: string,
  currentData: any,
  userGoals?: string[]
): string[] {
  const template = getMagazineSectionTemplate(contentType);
  const basePrompts = template?.prompts || [];
  
  const contextualPrompts: string[] = [...basePrompts];
  
  // Add data-specific prompts
  if (currentData.title && currentData.title.length < 30) {
    contextualPrompts.push('Expand the title to be more descriptive');
  }
  
  if (currentData.description && currentData.description.length > 300) {
    contextualPrompts.push('Make the description more concise');
  }
  
  // Add goal-specific prompts
  if (userGoals) {
    userGoals.forEach(goal => {
      switch (goal) {
        case 'seo':
          contextualPrompts.push(...getQuickPrompts('seo'));
          break;
        case 'engagement':
          contextualPrompts.push('Make this more engaging and interactive');
          break;
        case 'professional':
          contextualPrompts.push('Enhance professional credibility');
          break;
      }
    });
  }
  
  return [...new Set(contextualPrompts)]; // Remove duplicates
}