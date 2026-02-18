/**
 * Product Details Content Block Configuration
 * 
 * Based on ProductDetails component props from:
 * /lib/pages/magazine/components/content/top-product-spotlight/ProductDetails.tsx
 */

export const productDetailsConfig = {
  // This matches the "type" field in your contentBlocks data
  type: 'ProductDetails',
  
  // Human readable name for the AI dialog
  displayName: 'Product Details',
  
  // Description for AI context
  description: 'Detailed product information including descriptions, features, and professional recommendations',
  
  // Category for organization
  category: 'product',
  
  // Complexity level for AI model selection
  complexity: 'high' as const,
  
  // Map your data structure to AI-enabled fields
  fields: {
    // Basic Product Info
    productName: {
      aiEnabled: true,
      type: 'text' as const,
      displayName: 'Product Name',
      description: 'The main name/title of the product',
      required: true
    },
    brandName: {
      aiEnabled: true,
      type: 'text' as const,
      displayName: 'Brand Name', 
      description: 'The brand or manufacturer name'
    },
    description: {
      aiEnabled: true,
      type: 'html' as const,
      displayName: 'Product Description',
      description: 'Detailed product description with rich formatting and benefits'
    },
    
    // Pricing (typically not AI-generated)
    price: {
      aiEnabled: false,
      type: 'text' as const,
      displayName: 'Price',
      description: 'Product price - usually not modified by AI'
    },
    originalPrice: {
      aiEnabled: false,
      type: 'text' as const,
      displayName: 'Original Price'
    },
    
    // Product Features
    keyFeatures: {
      aiEnabled: true,
      type: 'array' as const,
      displayName: 'Key Features',
      description: 'List of key product features and benefits'
    },
    keyFeaturesTitle: {
      aiEnabled: true,
      type: 'text' as const,
      displayName: 'Key Features Title',
      description: 'Header for the key features section (e.g., "Why We Love It")'
    },
    ingredients: {
      aiEnabled: true,
      type: 'array' as const,
      displayName: 'Ingredients List',
      description: 'List of product ingredients or components'
    },
    ingredientsTitle: {
      aiEnabled: true,
      type: 'text' as const,
      displayName: 'Ingredients Title',
      description: 'Header for ingredients section (e.g., "Key Ingredients")'
    },
    
    // Professional Recommendation
    'proRecommendation.proName': {
      aiEnabled: true,
      type: 'text' as const,
      displayName: 'Professional Name',
      description: 'Name of the recommending professional or expert'
    },
    'proRecommendation.quote': {
      aiEnabled: true,
      type: 'html' as const,
      displayName: 'Professional Quote',
      description: 'Detailed quote or recommendation from the professional'
    },
    
    // Customer Reviews
    reviewHighlights: {
      aiEnabled: true,
      type: 'array' as const,
      displayName: 'Review Highlights',
      description: 'Highlights or excerpts from customer reviews'
    },
    reviewHighlightsTitle: {
      aiEnabled: true,
      type: 'text' as const,
      displayName: 'Review Section Title',
      description: 'Header for review highlights (e.g., "What Customers Say")'
    },
    
    // Badge/Label Content
    bestsellerLabel: {
      aiEnabled: true,
      type: 'text' as const,
      displayName: 'Bestseller Label',
      description: 'Custom label for bestseller badge (e.g., "GREAT PRODUCT", "TOP SELLER")',
      condition: 'isBestseller === true'
    },
    
    // Fields typically not modified by AI
    image: {
      aiEnabled: false,
      type: 'object' as const,
      displayName: 'Product Image',
      description: 'Main product image - not modified by AI'
    },
    'proRecommendation.proImage': {
      aiEnabled: false,
      type: 'object' as const, 
      displayName: 'Professional Image',
      description: 'Professional headshot - not modified by AI'
    },
    isBestseller: {
      aiEnabled: false,
      type: 'boolean' as const,
      displayName: 'Is Bestseller',
      description: 'Boolean flag - not modified by AI'
    }
  },
  
  // AI-specific prompts for this content type
  aiPrompts: {
    system: `You are editing product details for a beauty and skincare marketplace. Focus on creating compelling, professional descriptions that highlight benefits and build trust with customers. Maintain a knowledgeable but accessible tone.`,
    examples: [
      'Make the product description more compelling and benefit-focused',
      'Add more technical details about the ingredients and how they work',
      'Improve the professional recommendation to sound more authentic',
      'Enhance the key features to be more specific and actionable',
      'Optimize the content for beauty enthusiasts and professionals'
    ]
  }
};

export type ProductDetailsConfig = typeof productDetailsConfig;