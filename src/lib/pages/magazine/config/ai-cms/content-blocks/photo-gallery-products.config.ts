/**
 * Photo Gallery Products Content Block Configuration
 * 
 * Based on PhotoGalleryProducts component props from:
 * /lib/pages/magazine/components/content/shared/PhotoGalleryProducts.tsx
 */

export const photoGalleryProductsConfig = {
  // This matches the "type" field in your contentBlocks data
  type: 'PhotoGalleryProducts',
  
  // Human readable name for the AI dialog
  displayName: 'Photo Gallery Products',
  
  // Description for AI context
  description: 'Gallery of related products with images, titles, and descriptions',
  
  // Category for organization
  category: 'gallery',
  
  // Complexity level for AI model selection
  complexity: 'medium' as const,
  
  // Map your data structure to AI-enabled fields
  fields: {
    // Section Title (often shown above the gallery)
    title: {
      aiEnabled: true,
      type: 'text' as const,
      displayName: 'Gallery Title',
      description: 'Title for the product gallery section (e.g., "You Might Also Like")',
      required: false
    },
    
    // Individual Products in the Gallery
    'products[].title': {
      aiEnabled: true,
      type: 'text' as const,
      displayName: 'Product Titles',
      description: 'Names of products in the gallery'
    },
    'products[].description': {
      aiEnabled: true, 
      type: 'text' as const,
      displayName: 'Product Descriptions',
      description: 'Brief descriptions for each product (often price or short description)'
    },
    
    // Gallery Configuration (typically not AI-modified)
    columns: {
      aiEnabled: false,
      type: 'text' as const,
      displayName: 'Column Layout',
      description: 'Gallery layout configuration - not modified by AI'
    },
    imageStyling: {
      aiEnabled: false,
      type: 'text' as const,
      displayName: 'Image Styling',
      description: 'Image styling configuration - not modified by AI'
    },
    cardBackgroundColor: {
      aiEnabled: false,
      type: 'text' as const,
      displayName: 'Card Background',
      description: 'Background color for product cards - not modified by AI'
    },
    
    // Images and visual elements (not AI-modified)
    'products[].image': {
      aiEnabled: false,
      type: 'object' as const,
      displayName: 'Product Images',
      description: 'Product images - not modified by AI'
    },
    'products[].titleTypography': {
      aiEnabled: false,
      type: 'object' as const,
      displayName: 'Title Typography',
      description: 'Typography settings - not modified by AI'
    },
    'products[].descriptionTypography': {
      aiEnabled: false,
      type: 'object' as const,
      displayName: 'Description Typography', 
      description: 'Typography settings - not modified by AI'
    },
    titleTypography: {
      aiEnabled: false,
      type: 'object' as const,
      displayName: 'Gallery Title Typography',
      description: 'Typography settings for gallery title - not modified by AI'
    }
  },
  
  // AI-specific prompts for this content type
  aiPrompts: {
    system: `You are editing a product gallery section for a beauty marketplace. Focus on creating compelling product names and descriptions that encourage exploration and purchase. Keep descriptions concise but appealing.`,
    examples: [
      'Make the product titles more appealing and descriptive',
      'Improve the gallery title to be more engaging',
      'Add more specific details to product descriptions',
      'Make the content more actionable and benefit-focused',
      'Optimize for beauty and skincare audience'
    ]
  }
};

export type PhotoGalleryProductsConfig = typeof photoGalleryProductsConfig;