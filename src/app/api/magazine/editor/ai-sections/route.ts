import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { 
  SectionGenerationRequest,
  MagazineSectionService 
} from '@/lib/packages/ai-cms/services/MagazineSectionService';
import { 
  getSectionMapping,
  getModelById
} from '@/lib/pages/magazine/config/ai-cms';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

interface RequestBody {
  sectionType: string;
  sectionData: any;
  modelId: string;
  contentBlocks: string[];
  selectedFields?: Record<string, string[]>;
  context: {
    title?: string;
    theme?: string;
    targetAudience?: string;
    globalPrompt?: string;
    customPrompt?: string;
    userPrompt?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: RequestBody = await request.json();
    const { sectionType, sectionData, modelId, contentBlocks, selectedFields, context } = body;

    // Validate required fields
    if (!sectionType || !modelId || !contentBlocks || contentBlocks.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: sectionType, modelId, and contentBlocks are required' 
        },
        { status: 400 }
      );
    }

    // Validate request size and content
    const MAX_CONTENT_BLOCKS = 10;
    const MAX_CONTEXT_LENGTH = 10000;

    if (contentBlocks.length > MAX_CONTENT_BLOCKS) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Too many content blocks. Maximum: ${MAX_CONTENT_BLOCKS}` 
        },
        { status: 400 }
      );
    }

    const totalContextLength = Object.values(context || {}).join('').length;
    if (totalContextLength > MAX_CONTEXT_LENGTH) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Context too long. Please reduce the input size.' 
        },
        { status: 400 }
      );
    }

    // Validate section type - use dynamic mapping for custom sections
    let sectionMapping;
    
    // For custom-section, ALWAYS use dynamic mapping to detect actual content blocks
    if (sectionType === 'custom-section') {
      console.log(`[AI Sections API] Custom section detected, using dynamic mapping`);
      const { getDynamicSectionMapping } = await import('@/lib/pages/magazine/config/ai-cms/sectionFieldMappings');
      const configPath = '/lib/pages/magazine/config/ai-cms/content-blocks/';
      sectionMapping = getDynamicSectionMapping(sectionData, configPath);
      
      if (!sectionMapping) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Failed to create dynamic mapping for custom section` 
          },
          { status: 400 }
        );
      }
      
      console.log(`[AI Sections API] Dynamic mapping created with ${sectionMapping.contentBlocks.length} content blocks`);
    } else {
      // For other sections, try static mapping first
      sectionMapping = getSectionMapping(sectionType);
      
      // If no static mapping, try dynamic mapping
      if (!sectionMapping) {
        const { getDynamicSectionMapping } = await import('@/lib/pages/magazine/config/ai-cms/sectionFieldMappings');
        const configPath = '/lib/pages/magazine/config/ai-cms/content-blocks/';
        sectionMapping = getDynamicSectionMapping(sectionData, configPath);
        
        if (!sectionMapping) {
          return NextResponse.json(
            { 
              success: false, 
              error: `Invalid section type: ${sectionType}. No mapping found for this section type.` 
            },
            { status: 400 }
          );
        }
      }
    }

    // Validate model
    const model = getModelById(modelId);
    if (!model || !model.available) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid or unavailable model: ${modelId}` 
        },
        { status: 400 }
      );
    }

    // Validate content blocks
    // For custom-section with dynamic content blocks, detect the actual blocks from the data
    let validBlocks = sectionMapping.contentBlocks.map(block => block.name);
    
    console.log(`[AI Sections API] Section mapping content blocks:`, sectionMapping.contentBlocks.map(b => ({
      name: b.name,
      fieldCount: b.fields?.length || 0
    })));
    
    // If this is a custom-section and we have sectionData, check for actual content blocks
    if (sectionType === 'custom-section' && sectionData?.content?.contentBlocks) {
      const actualContentBlocks = sectionData.content.contentBlocks
        .map((block: any) => block.type)
        .filter((type: string) => type);
      
      if (actualContentBlocks.length > 0) {
        console.log(`[AI Sections API] Detected actual content blocks for custom-section:`, actualContentBlocks);
        // For custom sections, accept the actual content block types found in the data
        validBlocks = [...new Set([...validBlocks, ...actualContentBlocks])];
      }
    }
    
    console.log(`[AI Sections API] Valid blocks for ${sectionType}:`, validBlocks);
    console.log(`[AI Sections API] Requested blocks:`, contentBlocks);
    
    const invalidBlocks = contentBlocks.filter(block => !validBlocks.includes(block));
    if (invalidBlocks.length > 0) {
      console.error(`[AI Sections API] Invalid blocks detected:`, invalidBlocks);
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid content blocks for ${sectionType}: ${invalidBlocks.join(', ')}. Valid blocks: ${validBlocks.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Prepare generation request
    const generationRequest: SectionGenerationRequest = {
      sectionType,
      sectionData: sectionData || {},
      modelId,
      contentBlocks,
      sectionMapping, // Pass the section mapping we found (static or dynamic)
      selectedFields: selectedFields || {},
      context: {
        title: context?.title,
        theme: context?.theme,
        targetAudience: context?.targetAudience || 'beauty professionals and enthusiasts',
        globalPrompt: context?.globalPrompt,
        customPrompt: context?.customPrompt,
        userPrompt: context?.userPrompt
      }
    };

    // Rate limiting check (basic implementation)
    // In production, implement proper rate limiting with Redis or similar
    const userRateLimit = 10; // requests per minute
    const userKey = `ai_sections_${currentUser.uid}`;
    // Rate limiting implementation would go here

    // Generate content using the magazine section service
    console.log(`[AI Sections API] Starting generation for ${sectionType} with model ${modelId}`);
    console.log(`[AI Sections API] OpenAI client available:`, !!openai);
    console.log(`[AI Sections API] Generation request:`, {
      sectionType,
      modelId,
      contentBlocks,
      hasMapping: !!sectionMapping,
      contextKeys: Object.keys(context || {}),
      selectedFieldsKeys: Object.keys(selectedFields || {})
    });
    
    // Create service instance with OpenAI client
    const serviceWithOpenAI = new MagazineSectionService(openai);
    const result = await serviceWithOpenAI.generateSectionContent(generationRequest);

    if (result.success) {
      console.log(`[AI Sections API] Successfully generated content for ${sectionType}`);
      console.log(`[AI Sections API] Generated data keys:`, Object.keys(result.data || {}));
      
      return NextResponse.json({
        success: true,
        data: result.data,
        contentBlocks: result.contentBlocks,
        usage: result.usage,
        metadata: {
          sectionType,
          modelId,
          contentBlocksProcessed: contentBlocks.length,
          timestamp: new Date().toISOString(),
          userId: currentUser.uid
        }
      });
    } else {
      console.error(`[AI Sections API] Generation failed for ${sectionType}:`, result.error);
      console.error(`[AI Sections API] Failed content blocks:`, result.contentBlocks?.filter(b => !b.success).map(b => ({
        name: b.blockName,
        error: b.error
      })));
      
      return NextResponse.json({
        success: false,
        error: result.error || 'Content generation failed',
        contentBlocks: result.contentBlocks,
        failedBlocks: result.contentBlocks?.filter(b => !b.success).map(b => ({
          name: b.blockName,
          error: b.error
        })),
        metadata: {
          sectionType,
          modelId,
          contentBlocksProcessed: contentBlocks.length,
          timestamp: new Date().toISOString(),
          userId: currentUser.uid
        }
      }, { status: 422 });
    }

  } catch (error) {
    console.error('[AI Sections API] Unexpected error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

// GET method to retrieve section configuration info
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sectionType = searchParams.get('sectionType');

    if (sectionType) {
      // Get specific section configuration
      const sectionMapping = getSectionMapping(sectionType);
      if (!sectionMapping) {
        return NextResponse.json(
          { success: false, error: `Invalid section type: ${sectionType}` },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        sectionType,
        configuration: {
          displayName: sectionMapping.displayName,
          description: sectionMapping.description,
          category: sectionMapping.category,
          complexity: sectionMapping.complexity,
          contentBlocks: sectionMapping.contentBlocks.map(block => ({
            name: block.name,
            displayName: block.displayName,
            description: block.description,
            fields: block.fields.filter(field => field.aiEnabled)
          }))
        }
      });
    } else {
      // Get all available section types
      const { SECTION_FIELD_MAPPINGS } = await import('@/lib/pages/magazine/config/ai-cms');
      
      const availableSections = Object.entries(SECTION_FIELD_MAPPINGS).map(([type, mapping]) => ({
        sectionType: type,
        displayName: mapping.displayName,
        description: mapping.description,
        category: mapping.category,
        complexity: mapping.complexity,
        contentBlockCount: mapping.contentBlocks.length
      }));

      return NextResponse.json({
        success: true,
        availableSections,
        totalSections: availableSections.length
      });
    }

  } catch (error) {
    console.error('[AI Sections API] GET error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}