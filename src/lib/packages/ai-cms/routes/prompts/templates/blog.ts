/**
 * Template Prompts for Blog Content
 * 
 * Pre-configured templates for blog posts and editorial content.
 * Optimized for web content, SEO, and reader engagement.
 */

/**
 * Blog content type templates
 */
export const BLOG_CONTENT_TEMPLATES = {
  'how-to': {
    title: 'How-To Guide',
    description: 'Step-by-step instructional content',
    prompts: [
      'Create a comprehensive step-by-step guide',
      'Add troubleshooting tips and common mistakes',
      'Include preparation and materials needed',
      'Make instructions clearer and more detailed',
      'Add safety tips and precautions',
      'Include time estimates and difficulty levels'
    ],
    examples: {
      title: 'How to Achieve [Goal] in [Time Frame]',
      introduction: 'Hook readers with the problem and promise a solution',
      steps: 'Clear, numbered steps with detailed explanations',
      conclusion: 'Summarize key points and encourage action'
    }
  },

  'listicle': {
    title: 'List Article',
    description: 'Numbered or bulleted list format',
    prompts: [
      'Make list items more specific and actionable',
      'Add supporting details and examples',
      'Improve headlines for each list item',
      'Include relevant statistics or data',
      'Add practical tips for implementation',
      'Make the order more logical or impactful'
    ],
    examples: {
      title: '[Number] Ways to [Achieve Goal]',
      introduction: 'Preview the value readers will get',
      listItems: 'Each item should be substantial and valuable',
      conclusion: 'Tie everything together with next steps'
    }
  },

  'review': {
    title: 'Product/Service Review',
    description: 'Honest evaluation of products or services',
    prompts: [
      'Add more balanced pros and cons',
      'Include specific use cases and results',
      'Add comparison with alternatives',
      'Include pricing and value analysis',
      'Add personal experience and testing notes',
      'Include recommendations for different user types'
    ],
    examples: {
      title: '[Product] Review: Is It Worth the Hype?',
      overview: 'Brief introduction to the product and your experience',
      details: 'In-depth analysis of features, benefits, and drawbacks',
      verdict: 'Final recommendation with specific use cases'
    }
  },

  'opinion': {
    title: 'Opinion Piece',
    description: 'Personal viewpoint on industry topics',
    prompts: [
      'Strengthen your argument with evidence',
      'Add counterarguments and rebuttals',
      'Include expert opinions and citations',
      'Make your stance clearer and more compelling',
      'Add personal anecdotes and experiences',
      'Include actionable takeaways for readers'
    ],
    examples: {
      title: 'Why [Controversial Statement] About [Topic]',
      introduction: 'Present your thesis clearly and compellingly',
      argument: 'Build your case with evidence and examples',
      conclusion: 'Reinforce your position and call for action'
    }
  },

  'news': {
    title: 'News and Updates',
    description: 'Industry news and trending topics',
    prompts: [
      'Add more context and background information',
      'Include expert commentary and analysis',
      'Add implications for readers and industry',
      'Include relevant statistics and data',
      'Add actionable insights for readers',
      'Make the significance clearer'
    ],
    examples: {
      title: '[Company/Industry] Announces [News]: What It Means',
      summary: 'Quick overview of the key facts',
      analysis: 'What this means for the industry and consumers',
      impact: 'How readers should respond or prepare'
    }
  },

  'educational': {
    title: 'Educational Content',
    description: 'Teaching and informational posts',
    prompts: [
      'Break down complex concepts into simpler terms',
      'Add practical examples and case studies',
      'Include visual descriptions and diagrams',
      'Add frequently asked questions',
      'Include additional resources for deeper learning',
      'Make technical information more accessible'
    ],
    examples: {
      title: 'Understanding [Complex Topic]: A Beginner\'s Guide',
      introduction: 'Why this topic matters and what readers will learn',
      explanation: 'Clear, structured explanation with examples',
      application: 'How to apply this knowledge practically'
    }
  }
};

/**
 * SEO-focused blog templates
 */
export const SEO_BLOG_TEMPLATES = {
  'keyword-focused': {
    title: 'Keyword-Optimized Content',
    prompts: [
      'Include target keywords naturally throughout',
      'Add semantic keywords and related terms',
      'Optimize headlines for search intent',
      'Create compelling meta descriptions',
      'Add internal linking opportunities',
      'Include FAQ sections for long-tail keywords'
    ]
  },

  'local-seo': {
    title: 'Local SEO Content',
    prompts: [
      'Add location-specific information and references',
      'Include local landmarks and area details',
      'Add local business mentions and partnerships',
      'Include location-based keywords naturally',
      'Add local events and seasonal references',
      'Include community-focused content'
    ]
  },

  'featured-snippet': {
    title: 'Featured Snippet Optimization',
    prompts: [
      'Structure content to answer questions directly',
      'Add numbered lists and bullet points',
      'Include clear, concise definitions',
      'Add comparison tables and charts',
      'Structure with clear headings and subheadings',
      'Include step-by-step processes'
    ]
  }
};

/**
 * Blog structure templates
 */
export const BLOG_STRUCTURE_TEMPLATES = {
  'problem-solution': {
    title: 'Problem-Solution Structure',
    sections: [
      'Hook: Present the problem dramatically',
      'Agitate: Explain why this problem matters',
      'Solution: Present your solution clearly',
      'Benefits: Show the positive outcomes',
      'Proof: Provide evidence and examples',
      'Call-to-Action: Tell readers what to do next'
    ]
  },

  'story-driven': {
    title: 'Story-Driven Structure',
    sections: [
      'Story Hook: Start with a compelling narrative',
      'Lesson: Extract the key lesson or insight',
      'Application: Show how readers can apply this',
      'Examples: Provide additional supporting stories',
      'Takeaway: Summarize the key message',
      'Engagement: Encourage reader interaction'
    ]
  },

  'comprehensive-guide': {
    title: 'Comprehensive Guide Structure',
    sections: [
      'Introduction: Set expectations and scope',
      'Background: Provide necessary context',
      'Main Content: Detailed information in sections',
      'Examples: Real-world applications',
      'Resources: Additional tools and references',
      'Conclusion: Summarize and provide next steps'
    ]
  }
};

/**
 * Beauty industry specific blog templates
 */
export const BEAUTY_BLOG_TEMPLATES = {
  'skincare-routine': {
    title: 'Skincare Routine Guide',
    prompts: [
      'Add specific product recommendations',
      'Include different routines for different skin types',
      'Add seasonal adjustments and variations',
      'Include timing and order of application',
      'Add tips for sensitive skin',
      'Include budget-friendly alternatives'
    ]
  },

  'ingredient-spotlight': {
    title: 'Ingredient Education',
    prompts: [
      'Explain the science behind the ingredient',
      'Add benefits for different skin concerns',
      'Include usage instructions and precautions',
      'Add product recommendations containing the ingredient',
      'Include before/after expectations',
      'Add compatibility with other ingredients'
    ]
  },

  'trend-analysis': {
    title: 'Beauty Trend Analysis',
    prompts: [
      'Analyze why this trend is popular now',
      'Add historical context and evolution',
      'Include expert opinions and predictions',
      'Add accessibility and inclusivity considerations',
      'Include cost analysis and alternatives',
      'Add tips for adapting the trend personally'
    ]
  },

  'seasonal-beauty': {
    title: 'Seasonal Beauty Content',
    prompts: [
      'Add specific seasonal challenges and solutions',
      'Include product switches for the season',
      'Add environmental factors and considerations',
      'Include lifestyle adjustments for beauty routines',
      'Add holiday or event-specific tips',
      'Include travel and climate considerations'
    ]
  }
};

/**
 * Engagement-focused prompt templates
 */
export const ENGAGEMENT_TEMPLATES = {
  'interactive': {
    title: 'Interactive Content',
    prompts: [
      'Add questions throughout to engage readers',
      'Include polls, quizzes, or assessments',
      'Add opportunities for reader input',
      'Create shareable quotes and snippets',
      'Include challenges or exercises',
      'Add community discussion starters'
    ]
  },

  'controversial': {
    title: 'Discussion-Provoking Content',
    prompts: [
      'Present multiple viewpoints fairly',
      'Ask thought-provoking questions',
      'Challenge common assumptions',
      'Include debate points and counterarguments',
      'Add personal stakes and experiences',
      'Encourage respectful disagreement'
    ]
  },

  'actionable': {
    title: 'Action-Oriented Content',
    prompts: [
      'Add specific, implementable steps',
      'Include downloadable resources or templates',
      'Add progress tracking methods',
      'Include success metrics and milestones',
      'Add troubleshooting for common obstacles',
      'Create implementation timelines'
    ]
  }
};

/**
 * Get blog template by type
 */
export function getBlogTemplate(templateType: string) {
  return (BLOG_CONTENT_TEMPLATES as Record<string, any>)[templateType] || null;
}

/**
 * Get SEO template by type
 */
export function getSEOTemplate(templateType: string) {
  return (SEO_BLOG_TEMPLATES as Record<string, any>)[templateType] || null;
}

/**
 * Get structure template by type
 */
export function getStructureTemplate(templateType: string) {
  return (BLOG_STRUCTURE_TEMPLATES as Record<string, any>)[templateType] || null;
}

/**
 * Get beauty-specific template by type
 */
export function getBeautyBlogTemplate(templateType: string) {
  return (BEAUTY_BLOG_TEMPLATES as Record<string, any>)[templateType] || null;
}

/**
 * Get engagement template by type
 */
export function getEngagementTemplate(templateType: string) {
  return (ENGAGEMENT_TEMPLATES as Record<string, any>)[templateType] || null;
}

/**
 * Generate blog prompts based on content analysis
 */
export function generateBlogPrompts(
  contentType: string,
  currentContent: string,
  goals: string[] = []
): string[] {
  const template = getBlogTemplate(contentType);
  const prompts: string[] = template?.prompts || [];
  
  // Add content-specific prompts
  if (currentContent) {
    const wordCount = currentContent.split(' ').length;
    
    if (wordCount < 300) {
      prompts.push('Expand this content with more details and examples');
    } else if (wordCount > 2000) {
      prompts.push('Make this more concise and focused');
    }
    
    if (!currentContent.includes('?')) {
      prompts.push('Add engaging questions to involve readers');
    }
    
    if (currentContent.split('\n').length < 5) {
      prompts.push('Break this into more readable sections');
    }
  }
  
  // Add goal-specific prompts
  goals.forEach(goal => {
    switch (goal) {
      case 'seo':
        prompts.push('Optimize for search engines with relevant keywords');
        break;
      case 'engagement':
        prompts.push('Add more interactive elements and reader engagement');
        break;
      case 'conversion':
        prompts.push('Include stronger calls-to-action and conversion elements');
        break;
      case 'shareability':
        prompts.push('Add quotable moments and shareable insights');
        break;
    }
  });
  
  return [...new Set(prompts)]; // Remove duplicates
}

/**
 * Get content improvement suggestions based on analysis
 */
export function getContentImprovements(content: string): string[] {
  const improvements: string[] = [];
  
  // Check for common issues
  if (!content.includes('\n\n')) {
    improvements.push('Add paragraph breaks for better readability');
  }
  
  if (content.split('.').length < 5) {
    improvements.push('Expand with more detailed explanations');
  }
  
  if (!content.toLowerCase().includes('how to') && !content.includes('?')) {
    improvements.push('Add instructional elements or questions');
  }
  
  if (content.length < 500) {
    improvements.push('Add more comprehensive coverage of the topic');
  }
  
  if (!content.includes('example') && !content.includes('for instance')) {
    improvements.push('Include specific examples and case studies');
  }
  
  return improvements;
}