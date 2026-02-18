/**
 * Single Field AI Generation Handler
 * 
 * Handles single field AI generation for quick edits and simple content updates.
 * Optimized for fast, focused changes to individual form fields.
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import type { 
  SingleFieldRequest, 
  AISingleFieldResponse, 
  ErrorResponse,
  AIModel,
  FieldType
} from '../../types';

export interface SingleFieldHandlerOptions {
  collection?: string;
  contentType?: string;
  requireAuth?: boolean;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
  maxFieldLength?: number;
}

/**
 * Main single field generation handler
 */
export async function handleSingleFieldGeneration(
  request: NextRequest,
  options: SingleFieldHandlerOptions = {}
): Promise<NextResponse<AISingleFieldResponse | ErrorResponse>> {
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
    const body = await request.json() as SingleFieldRequest;
    const { 
      contentType, 
      fieldName,
      fieldType = 'text',
      userPrompt, 
      currentValue,
      context,
      model = 'gpt-5-nano', // Use fastest model for single fields
      maxLength,
      suggestions = []
    } = body;

    // Validation
    if (!contentType || !fieldName || !userPrompt) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields: contentType, fieldName, or userPrompt"
      }, { status: 400 });
    }

    // Field length validation
    const maxAllowed = options.maxFieldLength || 2000;
    if (currentValue && currentValue.length > maxAllowed) {
      return NextResponse.json({
        success: false,
        error: `Field value too long. Maximum ${maxAllowed} characters allowed.`
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

    // Build system message for single field editing
    const systemMessage = buildSingleFieldSystemMessage({
      contentType,
      fieldName,
      fieldType,
      maxLength
    });

    // Build user message with field context
    const userMessage = buildSingleFieldUserMessage({
      contentType,
      fieldName,
      fieldType,
      userPrompt,
      currentValue: currentValue || '',
      context,
      suggestions,
      maxLength
    });

    // Call OpenAI with optimized settings for single field generation
    console.log(`Calling OpenAI for single field generation: ${fieldName} with model:`, model);
    const completion = await openai.chat.completions.create({
      model: mapModelToOpenAI(model),
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      max_tokens: getMaxTokensForField(fieldType, model),
      temperature: getTemperatureForFieldType(fieldType),
      top_p: 0.95,
      presence_penalty: 0.0,
      frequency_penalty: 0.0
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json({
        success: false,
        error: "No response from AI"
      }, { status: 500 });
    }

    // Parse and validate the generated field value
    const parsedResponse = parseSingleFieldResponse(aiResponse, fieldType, maxLength);

    // Generate alternative suggestions if requested
    const alternatives = suggestions.length > 0 
      ? await generateAlternatives(openai, systemMessage, userMessage, model, 2)
      : [];

    return NextResponse.json({
      success: true,
      timestamp: new Date(),
      fieldName: fieldName,
      generatedValue: parsedResponse.value,
      explanation: parsedResponse.explanation,
      alternatives: alternatives,
      characterCount: parsedResponse.value.length,
      wordCount: fieldType === 'text' || fieldType === 'textarea' 
        ? countWords(parsedResponse.value) 
        : undefined,
      tokensUsed: completion.usage?.total_tokens || 0,
      model: model,
      fieldType: fieldType
    } as AISingleFieldResponse);

  } catch (error) {
    console.error('Single field generation error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error"
    } as ErrorResponse, { status: 500 });
  }
}

/**
 * Build system message for single field generation
 */
function buildSingleFieldSystemMessage({
  contentType,
  fieldName,
  fieldType,
  maxLength
}: {
  contentType: string;
  fieldName: string;
  fieldType: FieldType;
  maxLength?: number;
}): string {
  let message = `You are an AI content editor specializing in beauty and wellness content.
You help improve individual form fields with focused, high-quality content.

CONTENT TYPE: ${contentType}
FIELD NAME: ${fieldName}
FIELD TYPE: ${fieldType}

FIELD-SPECIFIC GUIDELINES:`;

  switch (fieldType) {
    case 'text':
      message += `
- Generate concise, impactful text
- Focus on clarity and engagement
- Avoid unnecessary words or filler`;
      break;
    
    case 'textarea':
      message += `
- Create well-structured paragraphs
- Use clear topic sentences
- Maintain consistent tone throughout`;
      break;
    
    case 'html':
      message += `
- Generate valid HTML markup
- Use appropriate tags (p, strong, em, etc.)
- Maintain proper nesting and structure`;
      break;
    
    case 'url':
      message += `
- Generate valid, relevant URLs
- Ensure URLs are properly formatted
- Use descriptive path segments when creating examples`;
      break;
    
    case 'email':
      message += `
- Generate valid email addresses
- Use professional, appropriate domains
- Follow email formatting standards`;
      break;
    
    default:
      message += `
- Generate content appropriate for ${fieldType} field type
- Maintain proper formatting and structure
- Focus on relevance and quality`;
  }

  message += `

BEAUTY INDUSTRY FOCUS:
- Keep content relevant to beauty, skincare, wellness, and lifestyle
- Use industry-appropriate terminology
- Maintain professional yet approachable tone
- Include specific, actionable information when relevant`;

  if (maxLength) {
    message += `

LENGTH REQUIREMENT: Maximum ${maxLength} characters
- Prioritize quality within the character limit
- Be concise but complete
- Avoid truncating mid-sentence`;
  }

  message += `

RESPONSE FORMAT:
Provide a brief explanation followed by:

FIELD_VALUE:
[Your generated value here]

IMPORTANT: Only provide the value for this specific field, no additional content.`;

  return message;
}

/**
 * Build user message for single field generation
 */
function buildSingleFieldUserMessage({
  contentType,
  fieldName,
  fieldType,
  userPrompt,
  currentValue,
  context,
  suggestions,
  maxLength
}: {
  contentType: string;
  fieldName: string;
  fieldType: FieldType;
  userPrompt: string;
  currentValue: string;
  context?: Record<string, any>;
  suggestions?: string[];
  maxLength?: number;
}): string {
  let message = `Field: ${fieldName} (${fieldType})
Content Type: ${contentType}

User Instructions: ${userPrompt}`;

  if (currentValue) {
    message += `

Current Value:
${currentValue}`;
  }

  if (context && Object.keys(context).length > 0) {
    message += `

Additional Context:`;
    for (const [key, value] of Object.entries(context)) {
      message += `
${key}: ${value}`;
    }
  }

  if (suggestions && suggestions.length > 0) {
    message += `

User Suggestions:
${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
  }

  if (maxLength) {
    message += `

Length Limit: ${maxLength} characters maximum`;
  }

  message += `

Please ${currentValue ? 'improve the current value' : 'generate a new value'} for this field based on the instructions.`;

  return message;
}

/**
 * Parse single field response
 */
function parseSingleFieldResponse(response: string, fieldType: FieldType, maxLength?: number): {
  value: string;
  explanation: string;
} {
  // Split response into explanation and field value
  const parts = response.split('FIELD_VALUE:');
  const explanation = parts[0]?.trim() || 'Field updated successfully.';
  
  let value = '';
  
  if (parts[1]) {
    value = parts[1].trim();
    
    // Clean up based on field type
    value = cleanFieldValue(value, fieldType);
    
    // Apply length limit if specified
    if (maxLength && value.length > maxLength) {
      value = truncateFieldValue(value, fieldType, maxLength);
    }
  } else {
    // Fallback: use entire response as value if no delimiter found
    value = cleanFieldValue(response, fieldType);
    if (maxLength && value.length > maxLength) {
      value = truncateFieldValue(value, fieldType, maxLength);
    }
  }
  
  return { value, explanation };
}

/**
 * Clean field value based on type
 */
function cleanFieldValue(value: string, fieldType: FieldType): string {
  switch (fieldType) {
    case 'email':
      // Extract email if wrapped in text
      const emailMatch = value.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
      return emailMatch ? emailMatch[0] : value;
    
    case 'url':
      // Extract URL if wrapped in text
      const urlMatch = value.match(/https?:\/\/[^\s]+/);
      return urlMatch ? urlMatch[0] : value;
    
    case 'text':
      // Remove line breaks for single-line text
      return value.replace(/\n/g, ' ').trim();
    
    default:
      return value.trim();
  }
}

/**
 * Truncate field value appropriately for field type
 */
function truncateFieldValue(value: string, fieldType: FieldType, maxLength: number): string {
  if (value.length <= maxLength) return value;
  
  switch (fieldType) {
    case 'text':
      // Truncate at word boundary
      const truncated = value.substring(0, maxLength);
      const lastSpace = truncated.lastIndexOf(' ');
      return lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated;
    
    case 'html':
      // Try to maintain valid HTML structure
      return value.substring(0, maxLength) + (value.includes('<') ? '...' : '');
    
    default:
      return value.substring(0, maxLength);
  }
}

/**
 * Generate alternative suggestions
 */
async function generateAlternatives(
  openai: OpenAI, 
  systemMessage: string, 
  userMessage: string, 
  model: AIModel,
  count: number
): Promise<string[]> {
  try {
    const alternativePrompt = userMessage + `

Please provide ${count} alternative versions of this field, each with a slightly different approach or style.`;

    const completion = await openai.chat.completions.create({
      model: mapModelToOpenAI(model),
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: alternativePrompt }
      ],
      max_tokens: getMaxTokensForField('text', model) * count,
      temperature: 0.9, // Higher temperature for variety
      n: count
    });

    return completion.choices.map(choice => {
      const content = choice.message?.content || '';
      const parts = content.split('FIELD_VALUE:');
      return parts[1]?.trim() || content.trim();
    });
  } catch (error) {
    console.error('Failed to generate alternatives:', error);
    return [];
  }
}

/**
 * Get appropriate temperature for field type
 */
function getTemperatureForFieldType(fieldType: FieldType): number {
  switch (fieldType) {
    case 'email':
    case 'url':
      return 0.3; // Low creativity for structured data
    case 'text':
      return 0.7; // Balanced creativity
    case 'textarea':
    case 'html':
      return 0.8; // Higher creativity for content
    default:
      return 0.7;
  }
}

/**
 * Get max tokens for field type and model
 */
function getMaxTokensForField(fieldType: FieldType, model: AIModel): number {
  const baseTokens = getMaxTokensForModel(model);
  
  switch (fieldType) {
    case 'text':
    case 'email':
    case 'url':
      return Math.min(baseTokens, 256);
    case 'textarea':
      return Math.min(baseTokens, 512);
    case 'html':
      return Math.min(baseTokens, 1024);
    default:
      return Math.min(baseTokens, 512);
  }
}

/**
 * Count words in text
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
  
  return modelMap[model] || 'gpt-3.5-turbo';
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
  
  return tokenLimits[model] || 1024;
}