import { NextRequest, NextResponse } from 'next/server';
import { askAI } from '@/lib/server/chatgpt';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { currentUser } = await getAuthenticatedAppForUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify user is authorized for editor
    const authorizedEmails = [
      'mohit@blockcod.com',
      'melanie@glamlink.net',
      'admin@glamlink.com'
    ];

    if (!authorizedEmails.includes(currentUser.email || '')) {
      return NextResponse.json(
        { error: 'Not authorized to use AI editor' },
        { status: 403 }
      );
    }

    // Get request body
    const body = await request.json();
    const { currentContent, userPrompt, selectedModel } = body;

    if (!userPrompt) {
      return NextResponse.json(
        { error: 'User prompt is required' },
        { status: 400 }
      );
    }

    // Create a system prompt for content editing
    const systemPrompt = `You are an expert content editor and writer for a digital magazine. 
    Your task is to help edit and improve article content based on the user's instructions.
    
    IMPORTANT: You must return your response as a valid JSON object with exactly this structure:
    {
      "user_response": "Detailed list of specific changes made",
      "html_content": "The edited content in clean HTML format"
    }
    
    Guidelines for the html_content:
    - Maintain a professional magazine writing style
    - Keep the content engaging and reader-friendly
    - Preserve important information while improving clarity
    - Use proper HTML formatting (paragraphs with <p> tags, headings, lists, etc.)
    - Focus on the specific changes requested by the user
    - Do NOT include markdown code blocks or backticks
    - Return only clean, valid HTML
    
    Guidelines for the user_response:
    - MUST provide a DETAILED list of SPECIFIC changes made
    - List each change as a separate point
    - Be specific about what was changed and where
    - Include counts when applicable (e.g., "Fixed 5 grammar issues")
    - Mention specific corrections, additions, or modifications
    
    Examples of GOOD user_response formats:
    
    For grammar fixes:
    "Fixed 6 grammar issues: 
    • Added comma after 'At five years old' in paragraph 1
    • Corrected 'dtition' to 'edition' in paragraph 4
    • Fixed subject-verb agreement: 'she have' to 'she has' in paragraph 3
    • Added missing period at end of paragraph 2
    • Corrected 'its' to 'it's' (contraction) in paragraph 5
    • Fixed run-on sentence in paragraph 6 by adding semicolon"
    
    For content additions:
    "Added 2 new paragraphs and enhanced existing content:
    • Inserted new paragraph about UFC training camp experience after paragraph 3
    • Added details about 3-week training routine and challenges faced
    • Expanded description of her role as Octagon Girl with specific UFC events
    • Added transition sentences between paragraphs 2 and 3 for better flow
    • Included mention of her specific achievements during training"
    
    For style changes:
    "Enhanced language for more dramatic effect:
    • Replaced 'walked' with 'strode confidently' in paragraph 1
    • Changed 'said' to 'proclaimed' in quoted sections
    • Added metaphor 'dancing between worlds' in paragraph 2
    • Strengthened opening: 'has mastered' to 'has brilliantly orchestrated'
    • Enhanced closing with more impactful language
    • Added sensory details in paragraphs 3 and 5"
    
    NEVER use vague responses like "I've made some improvements" or "Grammar has been fixed".
    ALWAYS be specific about what you changed.
    
    Return ONLY the JSON object, no additional text or markdown.`;

    // Create the full prompt with current content context
    const fullPrompt = `Current article content:
    ${currentContent || '[Empty content]'}
    
    User's editing request:
    ${userPrompt}
    
    Please provide the edited version of the content based on the user's request.`;

    // Call the AI service
    const aiResponse = await askAI({
      prompt: fullPrompt,
      systemPrompt: systemPrompt,
      model: selectedModel || 'gpt-5-mini', // Use selected model or default
      files: [] // No files needed for this use case
    });

    // Check for error response
    if (aiResponse === 'Error getting response from AI.' || aiResponse === 'No response from AI.') {
      return NextResponse.json(
        { error: 'Failed to get AI response. Please try again.' },
        { status: 500 }
      );
    }

    // Helper function to clean markdown artifacts
    const cleanMarkdown = (text: string): string => {
      // Remove markdown code blocks
      let cleaned = text.replace(/```html\s*/gi, '').replace(/```\s*/g, '');
      // Remove any backticks
      cleaned = cleaned.replace(/`/g, '');
      // Trim whitespace
      return cleaned.trim();
    };

    try {
      // First, try to parse as JSON
      let parsedResponse;
      
      // Clean up the response first in case it has markdown artifacts
      const cleanedResponse = cleanMarkdown(aiResponse);
      
      try {
        parsedResponse = JSON.parse(cleanedResponse);
      } catch (parseError) {
        // If JSON parsing fails, try to extract JSON from the response
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback: treat entire response as HTML content
          parsedResponse = {
            user_response: "I've updated the content based on your request.",
            html_content: cleanedResponse
          };
        }
      }

      // Ensure we have the required fields
      if (!parsedResponse.user_response || !parsedResponse.html_content) {
        parsedResponse = {
          user_response: parsedResponse.user_response || "Content has been edited according to your instructions.",
          html_content: parsedResponse.html_content || parsedResponse.content || cleanedResponse
        };
      }

      // Clean any remaining markdown from the HTML content
      parsedResponse.html_content = cleanMarkdown(parsedResponse.html_content);

      // Return the structured response
      return NextResponse.json({
        success: true,
        user_response: parsedResponse.user_response,
        html_content: parsedResponse.html_content
      });

    } catch (processingError) {
      console.error('Error processing AI response:', processingError);
      
      // Fallback: return the original response as HTML
      return NextResponse.json({
        success: true,
        user_response: "Content has been updated based on your request.",
        html_content: cleanMarkdown(aiResponse)
      });
    }

  } catch (error) {
    console.error('AI content API error:', error);
    
    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('OPENAI_API_KEY')) {
        return NextResponse.json(
          { error: 'AI service not configured. Please contact administrator.' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request' },
      { status: 500 }
    );
  }
}