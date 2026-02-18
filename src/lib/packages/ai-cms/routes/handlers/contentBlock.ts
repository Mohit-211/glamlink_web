/**
 * Content Block AI Generation Handler
 * 
 * Handles content block AI generation for structured content editing.
 * Optimized for larger content blocks and rich text content.
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import type { 
  ContentBlockRequest, 
  AIContentBlockResponse, 
  ErrorResponse,
  AIModel 
} from '../../types';

export interface ContentBlockHandlerOptions {
  collection?: string;
  contentType?: string;
  requireAuth?: boolean;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
  maxContentLength?: number;
}

/**
 * Main content block generation handler
 */
export async function handleContentBlockGeneration(
  request: NextRequest,
  options: ContentBlockHandlerOptions = {}
): Promise<NextResponse<AIContentBlockResponse | ErrorResponse>> {
  try {
    // Authentication check
    if (options.requireAuth !== false) {
      const { currentUser } = await getAuthenticatedAppForUser();
      if (!currentUser) {
        return NextResponse.json({ 
          success: false, 
          error: "Authentication required" 
        }, { status: 401 });
      }
    }

    // Parse request body
    const body = await request.json() as ContentBlockRequest;
    const { 
      contentType, 
      userPrompt, 
      currentContent,
      contentField,
      model = 'gpt-5-mini',
      maxLength,
      preserveFormatting = true,
      includeMarkdown = false
    } = body;

    // Validation
    if (!contentType || !userPrompt || !contentField) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields: contentType, userPrompt, or contentField"
      }, { status: 400 });
    }

    // Content length validation
    const maxAllowed = options.maxContentLength || 10000;
    if (currentContent && currentContent.length > maxAllowed) {
      return NextResponse.json({
        success: false,
        error: `Content too long. Maximum ${maxAllowed} characters allowed.`
      }, { status: 400 });
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    if (!openai.apiKey) {
      return NextResponse.json({
        success: false,
        error: "OpenAI API key not configured"
      }, { status: 500 });
    }

    // Build system message for content block editing
    const systemMessage = buildContentBlockSystemMessage({
      contentType,
      contentField,
      preserveFormatting,
      includeMarkdown,
      maxLength
    });

    // Build user message with content and instructions
    const userMessage = buildContentBlockUserMessage({
      contentType,
      contentField,
      userPrompt,
      currentContent: currentContent || '',
      maxLength
    });

    // Call OpenAI with appropriate settings for content generation
    console.log('Calling OpenAI for content block generation with model:', model);
    const completion = await openai.chat.completions.create({
      model: mapModelToOpenAI(model),
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      max_tokens: getMaxTokensForModel(model),
      temperature: 0.8, // Higher creativity for content generation
      top_p: 0.9,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json({
        success: false,
        error: "No response from AI"
      }, { status: 500 });
    }

    // Parse and validate the generated content
    const parsedResponse = parseContentBlockResponse(aiResponse, maxLength);

    return NextResponse.json({
      success: true,
      timestamp: new Date(),
      generatedContent: parsedResponse.content,
      explanation: parsedResponse.explanation,
      wordCount: countWords(parsedResponse.content),
      characterCount: parsedResponse.content.length,
      tokensUsed: completion.usage?.total_tokens || 0,
      model: model,
      contentField: contentField
    } as AIContentBlockResponse);

  } catch (error) {
    console.error('Content block generation error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error"
    } as ErrorResponse, { status: 500 });
  }
}

/**
 * Build system message for content block generation
 */
function buildContentBlockSystemMessage({
  contentType,
  contentField,
  preserveFormatting,
  includeMarkdown,
  maxLength
}: {
  contentType: string;
  contentField: string;
  preserveFormatting: boolean;
  includeMarkdown: boolean;
  maxLength?: number;
}): string {
  let message = `You are an AI content editor specializing in beauty and wellness content.
You help create and improve content blocks for magazine articles, blog posts, and marketing materials.

CONTENT TYPE: ${contentType}
CONTENT FIELD: ${contentField}

CONTENT GENERATION GUIDELINES:
1. Focus on beauty, skincare, wellness, and lifestyle topics
2. Write engaging, informative content that provides value to readers
3. Maintain a professional yet approachable tone
4. Use active voice and clear, concise language
5. Include specific details and actionable advice when appropriate`;

  if (preserveFormatting) {
    message += `
6. Preserve existing HTML structure and formatting
7. Maintain proper paragraph breaks and text hierarchy`;
  }

  if (includeMarkdown) {
    message += `
8. Use Markdown formatting for emphasis (*italic*, **bold**)
9. Use appropriate heading levels (## for subheadings)
10. Include lists and bullet points where helpful`;
  }

  if (maxLength) {
    message += `
11. Keep content within ${maxLength} characters
12. Prioritize quality and completeness within the length limit`;
  }

  message += `

RESPONSE FORMAT:
Provide your response in two parts:
1. A brief explanation of your approach and changes
2. The improved content marked with:

GENERATED_CONTENT:
[Your generated content here]

IMPORTANT: Only include the content for the specified field, no additional fields or metadata.`;

  return message;
}

/**
 * Build user message for content block generation
 */
function buildContentBlockUserMessage({
  contentType,
  contentField,
  userPrompt,
  currentContent,
  maxLength
}: {
  contentType: string;
  contentField: string;
  userPrompt: string;
  currentContent: string;
  maxLength?: number;
}): string {
  let message = `Content Type: ${contentType}
Field: ${contentField}

User Instructions: ${userPrompt}`;

  if (currentContent) {
    message += `

Current Content:
${currentContent}`;
  }

  if (maxLength) {
    message += `

Length Requirement: Maximum ${maxLength} characters`;
  }

  message += `

Please ${currentContent ? 'improve the existing content' : 'generate new content'} based on the user instructions.`;

  return message;
}

/**
 * Parse content block response
 */
function parseContentBlockResponse(response: string, maxLength?: number): {
  content: string;
  explanation: string;
} {
  // Split response into explanation and generated content
  const parts = response.split('GENERATED_CONTENT:');
  const explanation = parts[0]?.trim() || 'Content generated successfully.';
  
  let content = '';
  
  if (parts[1]) {
    content = parts[1].trim();
    
    // Apply length limit if specified
    if (maxLength && content.length > maxLength) {
      content = truncateContentSafely(content, maxLength);
    }
  } else {
    // Fallback: use entire response as content if no delimiter found
    content = response;
    if (maxLength && content.length > maxLength) {
      content = truncateContentSafely(content, maxLength);
    }
  }
  
  return {
    content,
    explanation
  };
}

/**
 * Safely truncate content at word boundaries
 */
function truncateContentSafely(content: string, maxLength: number): string {
  if (content.length <= maxLength) return content;
  
  const truncated = content.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  // If we can find a word boundary, use it
  if (lastSpaceIndex > 0 && lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
}

/**
 * Count words in content
 */
function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Map internal model names to OpenAI model names
 */
function mapModelToOpenAI(model: AIModel): string {
  const modelMap: Record<AIModel, string> = {
    'gpt-5': 'gpt-4-1106-preview',
    'gpt-5-mini': 'gpt-4',
    'gpt-5-nano': 'gpt-3.5-turbo'
  };
  
  return modelMap[model] || 'gpt-4';
}

/**
 * Get max tokens based on model
 */
function getMaxTokensForModel(model: AIModel): number {
  const tokenLimits: Record<AIModel, number> = {
    'gpt-5': 4096,
    'gpt-5-mini': 2048,
    'gpt-5-nano': 1024
  };
  
  return tokenLimits[model] || 2048;
}