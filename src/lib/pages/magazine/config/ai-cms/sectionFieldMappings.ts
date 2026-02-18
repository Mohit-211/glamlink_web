export interface AIEnabledField {
  name: string;
  type: string;
  aiEnabled: boolean;
  displayName?: string;
  description?: string;
  required?: boolean;
  itemFields?: Record<string, any>; // For array fields, defines the structure of each item
}

export interface ContentBlock {
  name: string;
  displayName: string;
  description?: string;
  fields: AIEnabledField[];
  priority?: number; // For ordering
}

export interface SectionMapping {
  displayName: string;
  description: string;
  category: string;
  contentBlocks: ContentBlock[];
  defaultModel?: string;
  complexity: 'low' | 'medium' | 'high';
}

export const SECTION_FIELD_MAPPINGS: Record<string, SectionMapping> = {
  'maries-corner': {
    displayName: "Marie's Corner",
    description: "Magazine-style layout with main story and sidebars",
    category: "editorial",
    complexity: "high",
    contentBlocks: [
      {
        name: 'mainStory',
        displayName: 'Main Story',
        description: 'Primary article content with quote and body text',
        priority: 1,
        fields: [
          { 
            name: 'title', 
            type: 'textarea', 
            aiEnabled: true, 
            displayName: 'Main Quote/Headline',
            description: 'Primary quote or headline for the article',
            required: true 
          },
          { 
            name: 'articleTitle', 
            type: 'text', 
            aiEnabled: true, 
            displayName: 'Article Title',
            description: 'Optional title above the article content'
          },
          { 
            name: 'content', 
            type: 'richtext', 
            aiEnabled: true, 
            displayName: 'Article Content',
            description: 'Main body text of the article',
            required: true 
          },
          { 
            name: 'authorName', 
            type: 'text', 
            aiEnabled: false, 
            displayName: 'Author Name',
            description: 'Author name (typically Marie Marks)'
          }
        ]
      },
      {
        name: 'mariesPicks',
        displayName: "Marie's Product Picks",
        description: 'Recommended products section',
        priority: 2,
        fields: [
          { 
            name: 'title', 
            type: 'text', 
            aiEnabled: true, 
            displayName: 'Section Title',
            description: 'Title for the product recommendations section'
          },
          { 
            name: 'products', 
            type: 'array', 
            aiEnabled: true, 
            displayName: 'Product Recommendations',
            description: 'Up to 3 recommended products with names, categories, and descriptions'
          }
        ]
      },
      {
        name: 'sideStories',
        displayName: 'Numbered Tips',
        description: 'List of numbered tips or advice',
        priority: 3,
        fields: [
          { 
            name: 'tips', 
            type: 'array', 
            aiEnabled: true, 
            displayName: 'Tips List',
            description: 'Numbered tips with titles and descriptions'
          }
        ]
      }
    ]
  },

  'cover-pro-feature': {
    displayName: 'Cover Pro Feature',
    description: 'Featured professional interview and showcase',
    category: "professional",
    complexity: "high",
    contentBlocks: [
      {
        name: 'professional',
        displayName: 'Professional Profile',
        description: 'Featured professional information',
        priority: 1,
        fields: [
          { 
            name: 'name', 
            type: 'text', 
            aiEnabled: false, 
            displayName: 'Professional Name',
            description: 'Name of the featured professional'
          },
          { 
            name: 'title', 
            type: 'text', 
            aiEnabled: true, 
            displayName: 'Professional Title',
            description: 'Professional title or specialization'
          },
          { 
            name: 'bio', 
            type: 'richtext', 
            aiEnabled: true, 
            displayName: 'Biography',
            description: 'Professional biography and background'
          },
          { 
            name: 'quote', 
            type: 'textarea', 
            aiEnabled: true, 
            displayName: 'Featured Quote',
            description: 'Inspiring quote from the professional'
          }
        ]
      },
      {
        name: 'interview',
        displayName: 'Interview Content',
        description: 'Q&A interview content',
        priority: 2,
        fields: [
          { 
            name: 'questions', 
            type: 'array', 
            aiEnabled: true, 
            displayName: 'Interview Questions',
            description: 'List of interview questions and answers'
          }
        ]
      }
    ]
  },

  'top-product-spotlight': {
    displayName: 'Top Product Spotlight',
    description: 'Featured product showcase with details',
    category: "product",
    complexity: "medium",
    contentBlocks: [
      {
        name: 'product',
        displayName: 'Product Information',
        description: 'Main product details and description',
        priority: 1,
        fields: [
          { 
            name: 'name', 
            type: 'text', 
            aiEnabled: false, 
            displayName: 'Product Name',
            description: 'Name of the featured product'
          },
          { 
            name: 'description', 
            type: 'richtext', 
            aiEnabled: true, 
            displayName: 'Product Description',
            description: 'Detailed product description and benefits'
          },
          { 
            name: 'keyBenefits', 
            type: 'array', 
            aiEnabled: true, 
            displayName: 'Key Benefits',
            description: 'List of main product benefits'
          },
          { 
            name: 'howToUse', 
            type: 'richtext', 
            aiEnabled: true, 
            displayName: 'How to Use',
            description: 'Instructions on how to use the product'
          }
        ]
      },
      {
        name: 'similar',
        displayName: 'Similar Products',
        description: 'Related product recommendations',
        priority: 2,
        fields: [
          { 
            name: 'products', 
            type: 'array', 
            aiEnabled: true, 
            displayName: 'Similar Products',
            description: 'List of similar or complementary products'
          }
        ]
      }
    ]
  },

  'top-treatment': {
    displayName: 'Top Treatment',
    description: 'Featured beauty treatment spotlight',
    category: "professional",
    complexity: "medium",
    contentBlocks: [
      {
        name: 'treatment',
        displayName: 'Treatment Information',
        description: 'Main treatment details',
        priority: 1,
        fields: [
          { 
            name: 'name', 
            type: 'text', 
            aiEnabled: false, 
            displayName: 'Treatment Name',
            description: 'Name of the featured treatment'
          },
          { 
            name: 'description', 
            type: 'richtext', 
            aiEnabled: true, 
            displayName: 'Treatment Description',
            description: 'Detailed description of the treatment process'
          },
          { 
            name: 'benefits', 
            type: 'array', 
            aiEnabled: true, 
            displayName: 'Treatment Benefits',
            description: 'List of key benefits and results'
          },
          { 
            name: 'process', 
            type: 'richtext', 
            aiEnabled: true, 
            displayName: 'Treatment Process',
            description: 'Step-by-step process description'
          }
        ]
      },
      {
        name: 'beforeAfter',
        displayName: 'Before & After',
        description: 'Transformation showcase',
        priority: 2,
        fields: [
          { 
            name: 'testimonial', 
            type: 'richtext', 
            aiEnabled: true, 
            displayName: 'Client Testimonial',
            description: 'Client feedback and experience'
          }
        ]
      }
    ]
  },

  'rising-star': {
    displayName: 'Rising Star',
    description: 'Spotlight on emerging beauty professionals',
    category: "professional",
    complexity: "medium",
    contentBlocks: [
      {
        name: 'profile',
        displayName: 'Star Profile',
        description: 'Rising star professional information',
        priority: 1,
        fields: [
          { 
            name: 'starName', 
            type: 'text', 
            aiEnabled: false, 
            displayName: 'Star Name',
            description: 'Name of the rising star'
          },
          { 
            name: 'starTitle', 
            type: 'text', 
            aiEnabled: true, 
            displayName: 'Professional Title',
            description: 'Title or specialization'
          },
          { 
            name: 'introText', 
            type: 'richtext', 
            aiEnabled: true, 
            displayName: 'Introduction',
            description: 'Introduction and background story'
          },
          { 
            name: 'bodyContent', 
            type: 'richtext', 
            aiEnabled: true, 
            displayName: 'Full Story',
            description: 'Detailed story and achievements'
          }
        ]
      },
      {
        name: 'achievements',
        displayName: 'Achievements & Gallery',
        description: 'Notable achievements and work showcase',
        priority: 2,
        fields: [
          { 
            name: 'achievements', 
            type: 'array', 
            aiEnabled: true, 
            displayName: 'Key Achievements',
            description: 'List of notable achievements and milestones'
          }
        ]
      }
    ]
  },

  'quote-wall': {
    displayName: 'Quote Wall',
    description: 'Collection of inspirational quotes',
    category: "editorial",
    complexity: "low",
    contentBlocks: [
      {
        name: 'quotes',
        displayName: 'Inspirational Quotes',
        description: 'Collection of motivational quotes',
        priority: 1,
        fields: [
          { 
            name: 'quotes', 
            type: 'array', 
            aiEnabled: true, 
            displayName: 'Quote Collection',
            description: 'List of inspirational quotes with authors'
          }
        ]
      }
    ]
  },

  'pro-tips': {
    displayName: 'Pro Tips',
    description: 'Professional beauty tips and advice',
    category: "professional",
    complexity: "low",
    contentBlocks: [
      {
        name: 'tips',
        displayName: 'Tips Collection',
        description: 'Professional beauty tips',
        priority: 1,
        fields: [
          { 
            name: 'tips', 
            type: 'array', 
            aiEnabled: true, 
            displayName: 'Beauty Tips',
            description: 'List of professional beauty tips with difficulty levels'
          }
        ]
      }
    ]
  },

  'whats-new-glamlink': {
    displayName: "What's New in Glamlink",
    description: 'Platform updates and new features',
    category: "interactive",
    complexity: "low",
    contentBlocks: [
      {
        name: 'updates',
        displayName: 'Platform Updates',
        description: 'New features and improvements',
        priority: 1,
        fields: [
          { 
            name: 'updates', 
            type: 'array', 
            aiEnabled: true, 
            displayName: 'Feature Updates',
            description: 'List of new features and platform improvements'
          }
        ]
      }
    ]
  },

  // Generic custom section mapping for dynamic sections
  'custom-section': {
    displayName: 'Custom Section',
    description: 'Dynamically configured section with flexible content',
    category: 'custom',
    complexity: 'medium',
    contentBlocks: [
      {
        name: 'content',
        displayName: 'Content',
        description: 'Main content of the section',
        priority: 1,
        fields: [
          { 
            name: 'title', 
            type: 'text', 
            aiEnabled: true, 
            displayName: 'Title',
            description: 'Section title or headline'
          },
          { 
            name: 'subtitle', 
            type: 'text', 
            aiEnabled: true, 
            displayName: 'Subtitle',
            description: 'Section subtitle or tagline'
          },
          { 
            name: 'content', 
            type: 'richtext', 
            aiEnabled: true, 
            displayName: 'Main Content',
            description: 'Primary text content of the section'
          },
          { 
            name: 'description', 
            type: 'richtext', 
            aiEnabled: true, 
            displayName: 'Description',
            description: 'Descriptive text content'
          }
        ]
      }
    ]
  }
};

// Helper functions
export function getSectionMapping(sectionType: string): SectionMapping | undefined {
  return SECTION_FIELD_MAPPINGS[sectionType];
}

export function getAIEnabledFields(sectionType: string): AIEnabledField[] {
  const mapping = getSectionMapping(sectionType);
  if (!mapping) return [];
  
  return mapping.contentBlocks.flatMap(block => 
    block.fields.filter(field => field.aiEnabled)
  );
}

export function getAllSectionTypes(): string[] {
  return Object.keys(SECTION_FIELD_MAPPINGS);
}

export function getSectionsByCategory(category: string): string[] {
  return Object.entries(SECTION_FIELD_MAPPINGS)
    .filter(([_, mapping]) => mapping.category === category)
    .map(([sectionType]) => sectionType);
}

// ========================================
// UNIVERSAL DYNAMIC CONTENT SYSTEM
// ========================================

/**
 * Universal function to get dynamic section mapping from any data structure
 * Works with any naming convention and any data format
 * 
 * @param sectionData - Any section data structure
 * @param configPath - Path to configuration directory (e.g., '/lib/pages/magazine/config/ai-cms/content-blocks/')
 * @returns Dynamic section mapping for AI generation
 */
export function getDynamicSectionMapping(
  sectionData: any,
  configPath?: string
): SectionMapping | null {
  console.log(`🎯 [getDynamicSectionMapping] Called with sectionType: ${sectionData?.type}`);
  
  try {
    // For custom-section, ALWAYS do dynamic detection based on actual content blocks
    // This is because custom-section can have any combination of content blocks
    if (sectionData.type === 'custom-section') {
      console.log(`📦 [getDynamicSectionMapping] Custom section detected, doing dynamic content block detection`);
      
      // Detect content blocks in the section data
      const contentBlocks = detectContentBlocksFromSection(sectionData);
      
      console.log(`📦 [getDynamicSectionMapping] Detected content blocks:`, contentBlocks);
      
      if (contentBlocks.length === 0) {
        // No content blocks found, return a generic mapping
        console.log(`⚠️ [getDynamicSectionMapping] No content blocks found, using generic mapping`);
        return createGenericMapping(sectionData);
      }

      // Build dynamic mapping from content blocks using static configs
      console.log(`🏗️ [getDynamicSectionMapping] Building mapping from content blocks...`);
      const mapping = buildMappingFromContentBlocks(contentBlocks, sectionData);
      console.log(`✅ [getDynamicSectionMapping] Built mapping with ${mapping.contentBlocks.length} blocks`);
      return mapping;
    }
    
    // Try to get specific mapping first for non-custom sections
    const specificMapping = getSectionMapping(sectionData.type);
    if (specificMapping) {
      console.log(`✅ [getDynamicSectionMapping] Found specific mapping for type: ${sectionData.type}`);
      return specificMapping;
    }

    console.log(`🔍 [getDynamicSectionMapping] No specific mapping found, detecting content blocks...`);
    
    // Detect content blocks in the section data
    const contentBlocks = detectContentBlocksFromSection(sectionData);
    
    console.log(`📦 [getDynamicSectionMapping] Detected content blocks:`, contentBlocks);
    
    if (contentBlocks.length === 0) {
      // No content blocks found, return a generic mapping
      console.log(`⚠️ [getDynamicSectionMapping] No content blocks found, using generic mapping`);
      return createGenericMapping(sectionData);
    }

    // Build dynamic mapping from content blocks using static configs
    console.log(`🏗️ [getDynamicSectionMapping] Building mapping from content blocks...`);
    const mapping = buildMappingFromContentBlocks(contentBlocks, sectionData);
    console.log(`✅ [getDynamicSectionMapping] Built mapping with ${mapping.contentBlocks.length} blocks`);
    return mapping;
    
  } catch (error) {
    console.error(`❌ [getDynamicSectionMapping] Failed to get dynamic section mapping:`, error);
    return createGenericMapping(sectionData);
  }
}

/**
 * Get content block config from the centralized configurations
 */
function getStaticContentBlockConfig(blockType: string): any {
  console.log(`🔍 [getStaticContentBlockConfig] Looking for config for blockType: "${blockType}"`);
  
  // Try to import and use the actual content block configurations
  try {
    // Import all configs statically for client-side compatibility
    const { getContentBlockConfigs } = require('./content-blocks');
    const configs = getContentBlockConfigs();
    
    console.log(`📦 [getStaticContentBlockConfig] Available configs:`, Object.keys(configs));
    console.log(`🔎 [getStaticContentBlockConfig] Looking for exact match: "${blockType}"`);
    console.log(`📦 [getStaticContentBlockConfig] Config keys include FeatureList?`, 'FeatureList' in configs);
    console.log(`📦 [getStaticContentBlockConfig] Config keys include SneakPeeks?`, 'SneakPeeks' in configs);
    console.log(`📦 [getStaticContentBlockConfig] Config keys include TipsList?`, 'TipsList' in configs);
    
    // Try exact match first
    let config = configs[blockType];
    
    // If no exact match, try case-insensitive match
    if (!config) {
      const normalizedBlockType = blockType.toLowerCase().replace(/[-_]/g, '');
      const configKey = Object.keys(configs).find(key => 
        key.toLowerCase().replace(/[-_]/g, '') === normalizedBlockType
      );
      if (configKey) {
        config = configs[configKey];
        console.log(`✅ [getStaticContentBlockConfig] Found config via normalized match: ${configKey}`);
      }
    }
    
    if (config) {
      console.log(`✅ [getStaticContentBlockConfig] Found config for "${blockType}":`, { 
        displayName: config.displayName, 
        fieldCount: Object.keys(config.fields || {}).length 
      });
      
      // Convert the config format to our internal format
      const fields: Record<string, any> = {};
      
      Object.entries(config.fields || {}).forEach(([fieldName, fieldConfig]: [string, any]) => {
        // Keep array fields as single units with itemFields metadata
        if (fieldConfig.type === 'array') {
          fields[fieldName] = {
            type: 'array',
            aiEnabled: fieldConfig.aiEnabled !== false,
            displayName: fieldConfig.displayName || fieldName,
            description: fieldConfig.description || `${fieldName} array field`,
            itemFields: fieldConfig.itemFields // Preserve item field schema for AI context
          };
        } else {
          // Handle regular fields
          fields[fieldName] = {
            type: fieldConfig.type || 'text',
            aiEnabled: fieldConfig.aiEnabled !== false,
            displayName: fieldConfig.displayName || fieldName,
            description: fieldConfig.description || `${fieldName} field`
          };
        }
      });
      
      console.log(`📋 [getStaticContentBlockConfig] Converted fields:`, Object.keys(fields).join(', '));
      
      return {
        displayName: config.displayName,
        description: config.description,
        fields
      };
    } else {
      console.warn(`⚠️ [getStaticContentBlockConfig] No config found for blockType: "${blockType}"`);
    }
  } catch (error) {
    console.error('❌ [getStaticContentBlockConfig] Error loading content block config for', blockType, error);
  }
  
  // Fallback to basic config
  console.log(`🔄 [getStaticContentBlockConfig] Using fallback config for "${blockType}"`);
  return {
    displayName: blockType,
    description: `${blockType} content block`,
    fields: {
      title: { type: 'text', aiEnabled: true, displayName: 'Title' },
      content: { type: 'html', aiEnabled: true, displayName: 'Content' }
    }
  };
}

/**
 * Detect content blocks from any section data structure
 * Works with various naming conventions (contentBlocks, blocks, items, etc.)
 */
function detectContentBlocksFromSection(sectionData: any): string[] {
  const blockTypes: string[] = [];
  
  // Try different common naming patterns for content blocks
  const possiblePaths = [
    'content.contentBlocks',
    'contentBlocks', 
    'blocks',
    'items',
    'components',
    'parts'
  ];
  
  for (const path of possiblePaths) {
    const value = getNestedValue(sectionData, path);
    if (Array.isArray(value)) {
      value.forEach(block => {
        if (block && typeof block === 'object' && block.type) {
          if (!blockTypes.includes(block.type)) {
            blockTypes.push(block.type);
          }
        }
      });
      break; // Found blocks, no need to check other paths
    }
  }
  
  return blockTypes;
}

/**
 * Build section mapping from detected content blocks
 */
function buildMappingFromContentBlocks(
  contentBlockTypes: string[],
  sectionData: any
): SectionMapping {
  console.log(`🏗️ [buildMappingFromContentBlocks] Building mapping for block types:`, contentBlockTypes);
  console.log(`📊 [buildMappingFromContentBlocks] Full sectionData:`, JSON.stringify(sectionData, null, 2));
  
  const mapping: SectionMapping = {
    displayName: `${sectionData.type} Section`,
    description: `Dynamic mapping for ${sectionData.type} with ${contentBlockTypes.length} content blocks`,
    category: "dynamic",
    complexity: contentBlockTypes.length > 2 ? "high" : "medium",
    contentBlocks: []
  };
  
  contentBlockTypes.forEach(blockType => {
    console.log(`📦 [buildMappingFromContentBlocks] Processing block type: "${blockType}"`);
    
    let config;
    try {
      config = getStaticContentBlockConfig(blockType);
      console.log(`📋 [buildMappingFromContentBlocks] Config retrieved for "${blockType}":`, config ? 'Success' : 'Failed');
      if (config) {
        console.log(`📋 [buildMappingFromContentBlocks] Config details:`, {
          displayName: config.displayName,
          fieldCount: Object.keys(config.fields || {}).length
        });
      }
    } catch (error) {
      console.error(`❌ [buildMappingFromContentBlocks] Error getting config for "${blockType}":`, error);
      config = null;
    }
    
    console.log(`📋 [buildMappingFromContentBlocks] Config for "${blockType}":`, { 
      displayName: config.displayName, 
      fieldCount: Object.keys(config.fields || {}).length 
    });
    
    // Ensure config and fields exist
    if (!config || !config.fields || Object.keys(config.fields).length === 0) {
      console.error(`❌ [buildMappingFromContentBlocks] No fields found for block type "${blockType}"`);
      // Add default fields as fallback
      const defaultFields: AIEnabledField[] = [
        {
          name: 'title',
          type: 'text',
          aiEnabled: true,
          displayName: 'Title',
          description: 'Block title'
        },
        {
          name: 'content',
          type: 'html',
          aiEnabled: true,
          displayName: 'Content',
          description: 'Block content'
        }
      ];
      
      const contentBlock: ContentBlock = {
        name: blockType,
        displayName: blockType,
        description: `${blockType} content block (using defaults)`,
        priority: 1,
        fields: defaultFields
      };
      
      mapping.contentBlocks.push(contentBlock);
      return;
    }
    
    // Convert config fields to ContentBlock format
    const fields: AIEnabledField[] = Object.entries(config.fields).map(([fieldName, fieldConfig]: [string, any]) => ({
      name: fieldName,
      type: fieldConfig.type || 'text',
      aiEnabled: fieldConfig.aiEnabled !== false,
      displayName: fieldConfig.displayName || fieldName,
      description: fieldConfig.description || `${fieldName} field`,
      required: fieldConfig.required || false,
      itemFields: fieldConfig.itemFields // Preserve itemFields for array fields
    }));
    
    console.log(`🔤 [buildMappingFromContentBlocks] Fields for "${blockType}":`, fields.map(f => f.name).join(', '));
    
    const contentBlock: ContentBlock = {
      name: blockType,
      displayName: config.displayName || blockType,
      description: config.description || `${blockType} content block`,
      priority: 1,
      fields: fields
    };
    
    mapping.contentBlocks.push(contentBlock);
  });
  
  console.log(`✅ [buildMappingFromContentBlocks] Final mapping:`, Object.keys(mapping).join(', '));
  return mapping;
}

/**
 * Create a generic mapping for unknown content types
 * Introspects the data structure to find text/html fields
 */
function createGenericMapping(sectionData: any): SectionMapping {
  const fields: any[] = [];
  
  // Common field names that are likely to be AI-editable
  const commonFields = ['title', 'subtitle', 'description', 'content', 'text', 'body'];
  
  commonFields.forEach(fieldName => {
    const value = getNestedValue(sectionData, fieldName);
    if (value !== undefined) {
      fields.push({
        name: fieldName,
        type: typeof value === 'string' && value.includes('<') ? 'richtext' : 'text',
        aiEnabled: true,
        displayName: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
        description: `${fieldName} field`
      });
    }
  });
  
  // If no common fields found, try to introspect the structure
  if (fields.length === 0) {
    introspectDataStructure(sectionData, fields, '');
  }
  
  return {
    displayName: 'Generic Content',
    description: 'Generic mapping for unrecognized content structure',
    category: 'generic',
    complexity: 'medium',
    contentBlocks: [
      {
        name: 'genericContent',
        displayName: 'Content',
        description: 'Auto-detected content fields',
        fields: fields.length > 0 ? fields : [
          {
            name: 'title',
            type: 'text',
            aiEnabled: true,
            displayName: 'Title',
            description: 'Content title'
          },
          {
            name: 'content',
            type: 'richtext',
            aiEnabled: true,
            displayName: 'Content',
            description: 'Main content'
          }
        ]
      }
    ]
  };
}

/**
 * Helper function to get nested values from objects
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

/**
 * Introspect data structure to find editable fields
 */
function introspectDataStructure(obj: any, fields: any[], prefix: string, depth = 0): void {
  if (depth > 3) return; // Prevent infinite recursion
  
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    Object.entries(obj).forEach(([key, value]) => {
      const fieldPath = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'string' && value.length > 0 && value.length < 5000) {
        // Likely a text field
        fields.push({
          name: fieldPath,
          type: value.includes('<') ? 'richtext' : 'text',
          aiEnabled: true,
          displayName: key.charAt(0).toUpperCase() + key.slice(1),
          description: `${key} field`
        });
      } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
        // Likely an array of strings
        fields.push({
          name: fieldPath,
          type: 'array',
          aiEnabled: true,
          displayName: key.charAt(0).toUpperCase() + key.slice(1),
          description: `${key} list`
        });
      } else if (typeof value === 'object' && value !== null) {
        // Recurse into nested objects
        introspectDataStructure(value, fields, fieldPath, depth + 1);
      }
    });
  }
}