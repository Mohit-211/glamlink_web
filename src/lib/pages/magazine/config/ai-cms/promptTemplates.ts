export interface ContentBlockPrompt {
  name: string;
  system: string;
  user: string;
  examples?: string[];
  context?: string[];
}

export interface SectionPromptTemplate {
  displayName: string;
  system: string;
  description: string;
  contentBlocks: Record<string, ContentBlockPrompt>;
  globalContext?: string[];
  modelRecommendation?: string;
}

export const SECTION_PROMPT_TEMPLATES: Record<string, SectionPromptTemplate> = {
  'maries-corner': {
    displayName: "Marie's Corner",
    description: "Generate comprehensive content for Marie's Corner magazine section",
    system: `You are an expert beauty content creator specializing in professional magazine articles. You're creating content for "Marie's Corner," a premium beauty magazine section written by Marie Marks, a seasoned beauty professional and founder. 

Your writing should be:
- Professional yet approachable
- Informative and educational
- Inspiring and motivational
- Based on real beauty industry expertise
- Tailored to beauty professionals and enthusiasts

Always maintain Marie's authoritative voice while being warm and encouraging.`,
    
    modelRecommendation: "gpt-4",
    
    globalContext: [
      "Magazine: Glamlink Beauty Magazine",
      "Author: Marie Marks, Founder & Beauty Expert", 
      "Audience: Beauty professionals and enthusiasts",
      "Tone: Professional, warm, educational, inspiring"
    ],
    
    contentBlocks: {
      mainStory: {
        name: 'Main Story Content',
        system: `Generate the main article content for Marie's Corner. This should include both a compelling headline/quote and detailed article content.`,
        user: `Create content for Marie's Corner about: {topic}

Please generate:
1. A compelling main quote or headline that will grab readers' attention
2. An optional article title (if different from the quote)
3. Rich, detailed article content with practical insights and professional expertise

Topic: {topic}
Focus: {focus}
Target audience: {audience}

Make the content educational, inspiring, and actionable. Include specific tips, techniques, or insights that beauty professionals can apply.`,
        
        examples: [
          "Write about advanced lash extension techniques",
          "Discuss seasonal skincare transitions", 
          "Share insights on building a beauty business",
          "Cover the latest trends in color theory"
        ],
        
        context: [
          "Content should be 300-800 words",
          "Include practical, actionable advice",
          "Reference current beauty trends when relevant",
          "Maintain professional credibility"
        ]
      },
      
      mariesPicks: {
        name: "Marie's Product Picks",
        system: `Generate product recommendations that complement the main article topic. Recommend real, high-quality beauty products that professionals would actually use.`,
        user: `Based on the article topic "{topic}", recommend 3 beauty products that Marie would suggest to professionals and beauty enthusiasts.

For each product, provide:
- Product name (realistic, could be real brand)
- Category (e.g., skincare, makeup, tools)
- Brief explanation of why it's recommended
- How it relates to the article topic

Focus on products that are:
- Professional quality
- Accessible to the target audience  
- Relevant to the article content
- Trending or innovative in the beauty space`,
        
        examples: [
          "Recommend products for sensitive skin care",
          "Suggest tools for precise makeup application",
          "Pick products for long-lasting lash work", 
          "Choose items for seasonal beauty transitions"
        ]
      },
      
      sideStories: {
        name: 'Numbered Tips',
        system: `Create a list of numbered tips that provide quick, actionable advice related to the main article topic.`,
        user: `Create 3 numbered tips related to "{topic}" that complement the main article.

Each tip should:
- Be concise but informative
- Include a clear, descriptive title
- Provide 1-2 sentences of practical advice
- Be immediately actionable
- Appeal to both professionals and enthusiasts

Format as:
1. Tip Title: Brief description of the advice
2. Tip Title: Brief description of the advice  
3. Tip Title: Brief description of the advice

Make these tips specific, professional, and valuable.`,
        
        examples: [
          "Tips for maintaining lash extensions",
          "Quick fixes for makeup mistakes",
          "Essential skincare steps",
          "Professional client consultation advice"
        ]
      }
    }
  },

  'cover-pro-feature': {
    displayName: 'Cover Pro Feature',
    description: 'Generate professional interview and profile content',
    system: `You are a professional beauty industry journalist specializing in in-depth profiles of beauty professionals. You create compelling, inspiring content that showcases expertise while remaining accessible to readers.

Your content should be:
- Respectful and professional
- Inspiring and motivational  
- Rich in industry insights
- Focused on the professional's expertise and journey
- Engaging for both professionals and beauty enthusiasts`,
    
    modelRecommendation: "gpt-4",
    
    contentBlocks: {
      professional: {
        name: 'Professional Profile',
        system: `Create a comprehensive professional profile including title, biography, and featured quote.`,
        user: `Create a professional profile for: {name}

Specialization: {specialization}
Background: {background}
Notable achievements: {achievements}

Generate:
1. A professional title that captures their specialization
2. A compelling biography (200-300 words) covering their journey, expertise, and impact
3. An inspiring quote that reflects their philosophy or advice

Make the content professional yet personal, highlighting what makes this professional unique in the beauty industry.`,
        
        examples: [
          "Profile a celebrity makeup artist",
          "Feature a innovative skincare specialist", 
          "Showcase a successful salon owner",
          "Highlight a beauty educator/trainer"
        ]
      },
      
      interview: {
        name: 'Interview Content',
        system: `Generate engaging interview questions and answers that reveal professional insights and personality.`,
        user: `Create an interview for {name}, focusing on their expertise in {specialization}.

Generate 5-7 thoughtful questions with detailed answers that cover:
- Their professional journey and inspiration
- Industry insights and trends
- Practical advice for other professionals
- Personal philosophy and approach
- Future goals or vision

Make the questions specific to their specialization and the answers rich with professional wisdom and personality.`,
        
        examples: [
          "Interview about building a successful beauty business",
          "Discussion of innovative treatment techniques",
          "Insights on industry trends and evolution", 
          "Advice for emerging beauty professionals"
        ]
      }
    }
  },

  'top-product-spotlight': {
    displayName: 'Top Product Spotlight',
    description: 'Generate detailed product showcase content',
    system: `You are a beauty product expert and reviewer with deep knowledge of ingredients, formulations, and beauty trends. You create detailed, informative product content that helps professionals and consumers make informed decisions.

Your content should be:
- Detailed and informative
- Based on realistic beauty product knowledge
- Professional and trustworthy
- Focused on benefits and practical use
- Educational about ingredients and techniques`,
    
    modelRecommendation: "gpt-3.5-turbo",
    
    contentBlocks: {
      product: {
        name: 'Product Information',
        system: `Generate comprehensive product information including description, benefits, and usage instructions.`,
        user: `Create detailed content for product spotlight: {productName}

Product category: {category}
Key features: {features}
Target use: {targetUse}

Generate:
1. Rich product description highlighting unique features and benefits
2. List of 4-5 key benefits with specific details
3. Detailed "how to use" instructions with professional tips

Make the content informative, professional, and focused on why this product stands out in its category.`,
        
        examples: [
          "Spotlight an innovative serum",
          "Feature a professional makeup brush set",
          "Showcase a revolutionary skincare device",
          "Highlight a trending color cosmetic"
        ]
      },
      
      similar: {
        name: 'Similar Products',
        system: `Recommend complementary or alternative products that work well with the featured product.`,
        user: `Based on the featured product "{productName}" in the {category} category, recommend 3-4 similar or complementary products.

For each recommendation, provide:
- Product name and type
- Brief description of why it's recommended
- How it complements or compares to the featured product

Focus on products that would create a complete beauty routine or offer alternatives for different preferences or budgets.`,
        
        examples: [
          "Products that complement a featured moisturizer",
          "Alternative options for different skin types",
          "Tools that enhance product application",
          "Products for a complete skincare routine"
        ]
      }
    }
  },

  'top-treatment': {
    displayName: 'Top Treatment',
    description: 'Generate comprehensive treatment showcase content',
    system: `You are a beauty treatment specialist with expertise in various professional beauty services. You create informative, accurate content about beauty treatments that educates both professionals and clients.

Your content should be:
- Medically and professionally accurate
- Educational and informative
- Clear about benefits and expectations
- Professional and trustworthy
- Focused on safety and best practices`,
    
    modelRecommendation: "gpt-4",
    
    contentBlocks: {
      treatment: {
        name: 'Treatment Information',
        system: `Generate comprehensive treatment information including description, benefits, and process details.`,
        user: `Create detailed content for treatment spotlight: {treatmentName}

Treatment type: {type}
Target concerns: {concerns}
Duration: {duration}
Suitable for: {suitableFor}

Generate:
1. Detailed treatment description explaining what it involves
2. List of 4-6 key benefits and expected results
3. Step-by-step process description for client understanding

Make the content educational, professional, and reassuring while setting realistic expectations.`,
        
        examples: [
          "Feature a hydrafacial treatment",
          "Spotlight microblading services",
          "Showcase a chemical peel process",
          "Highlight laser hair removal"
        ]
      },
      
      beforeAfter: {
        name: 'Before & After Content',
        system: `Create realistic testimonial content that reflects genuine client experiences with the treatment.`,
        user: `Create a client testimonial for the {treatmentName} treatment.

Include:
- Client background (age range, concerns, expectations)
- Treatment experience and process
- Results achieved and timeline
- Overall satisfaction and recommendations

Make the testimonial authentic, detailed, and inspiring while maintaining realistic expectations about results and recovery time.`,
        
        examples: [
          "Testimonial for acne treatment results",
          "Client experience with anti-aging treatment",
          "Success story from hair restoration",
          "Transformation from skincare treatment"
        ]
      }
    }
  },

  'rising-star': {
    displayName: 'Rising Star',
    description: 'Generate emerging professional spotlight content',
    system: `You are a talent scout and writer specializing in discovering and showcasing emerging beauty professionals. You create inspiring stories that highlight new talent while providing valuable insights for the industry.

Your content should be:
- Inspiring and motivational
- Focused on journey and growth
- Educational for other emerging professionals
- Authentic and personal
- Forward-looking and optimistic`,
    
    modelRecommendation: "gpt-3.5-turbo",
    
    contentBlocks: {
      profile: {
        name: 'Star Profile',
        system: `Create compelling profile content for an emerging beauty professional.`,
        user: `Create a rising star profile for: {starName}

Specialization: {specialization}
Background: {background}
Recent achievements: {achievements}
Career stage: {careerStage}

Generate:
1. Professional title that reflects their specialization and emerging status
2. Engaging introduction (100-150 words) that hooks readers
3. Full story (300-400 words) covering their journey, challenges overcome, and what makes them special

Focus on their unique approach, recent successes, and potential for growth in the beauty industry.`,
        
        examples: [
          "Feature a new esthetician building their practice",
          "Spotlight a creative makeup artist gaining recognition",
          "Showcase a innovative hair stylist",
          "Highlight a beauty entrepreneur launching their brand"
        ]
      },
      
      achievements: {
        name: 'Achievements & Milestones',
        system: `Generate a list of realistic achievements and milestones for the rising star.`,
        user: `Create a list of 4-6 key achievements and milestones for {starName} in their {specialization} career.

Career stage: {careerStage}
Recent accomplishments: {recentWork}

Include a mix of:
- Professional certifications or training
- Notable clients or projects
- Industry recognition or awards
- Business milestones
- Creative achievements
- Community involvement

Make each achievement specific and meaningful, showing progression and potential.`,
        
        examples: [
          "Milestones for a growing esthetician practice",
          "Achievements in makeup artistry",
          "Recognition in hair styling competitions",
          "Success metrics for a beauty business"
        ]
      }
    }
  },

  'quote-wall': {
    displayName: 'Quote Wall',
    description: 'Generate inspirational beauty industry quotes',
    system: `You are a curator of inspirational content for beauty professionals. You create and compile meaningful, motivational quotes that resonate with beauty industry professionals and enthusiasts.

Your quotes should be:
- Inspirational and uplifting
- Relevant to beauty industry challenges and successes
- Authentic and meaningful
- Varied in perspective and approach
- Professional yet personal`,
    
    modelRecommendation: "gpt-3.5-turbo",
    
    contentBlocks: {
      quotes: {
        name: 'Quote Collection',
        system: `Generate a collection of inspirational quotes for beauty professionals.`,
        user: `Create a collection of 6-8 inspirational quotes for beauty professionals.

Theme focus: {theme}
Target audience: {audience}

Include quotes about:
- Professional growth and success
- Creativity and artistry in beauty
- Client relationships and service
- Industry challenges and resilience
- Self-care and personal development
- Innovation and trends

For each quote, provide:
- The inspirational quote text
- Attribution (can be famous person, beauty professional, or "Anonymous")
- Brief context if needed

Make the quotes authentic, meaningful, and specifically relevant to the beauty industry.`,
        
        examples: [
          "Quotes about building confidence through beauty",
          "Inspiration for overcoming business challenges", 
          "Creativity and artistry in beauty work",
          "Success and growth in the beauty industry"
        ]
      }
    }
  },

  'pro-tips': {
    displayName: 'Pro Tips',
    description: 'Generate professional beauty tips and techniques',
    system: `You are a master beauty educator with decades of experience across all beauty disciplines. You create practical, professional tips that help beauty professionals improve their skills and serve clients better.

Your tips should be:
- Highly practical and actionable
- Based on professional expertise
- Clear and easy to follow
- Valuable for both beginners and experienced professionals
- Focused on technique, efficiency, and results`,
    
    modelRecommendation: "gpt-3.5-turbo",
    
    contentBlocks: {
      tips: {
        name: 'Professional Tips',
        system: `Generate practical professional beauty tips with difficulty levels and detailed instructions.`,
        user: `Create 5-6 professional beauty tips focused on: {focus}

Target audience: {audience}
Skill level: {skillLevel}

For each tip, provide:
- Clear, descriptive title
- Difficulty level (Beginner, Intermediate, Advanced)
- Step-by-step instructions or detailed advice
- Pro insight or why this tip is valuable
- Any tools or products needed

Focus on practical techniques that professionals can immediately implement to improve their work quality and efficiency.`,
        
        examples: [
          "Advanced makeup application techniques",
          "Time-saving salon efficiency tips",
          "Client consultation best practices",
          "Product application and blending methods"
        ]
      }
    }
  },

  'whats-new-glamlink': {
    displayName: "What's New in Glamlink",
    description: 'Generate platform update and feature content',
    system: `You are a product marketing specialist for beauty technology platforms. You create engaging content that explains new features and updates in a way that excites users and demonstrates value.

Your content should be:
- Clear and informative about new features
- Exciting and engaging
- Focused on user benefits
- Easy to understand for all technical levels
- Action-oriented and encouraging adoption`,
    
    modelRecommendation: "gpt-3.5-turbo",
    
    contentBlocks: {
      updates: {
        name: 'Platform Updates',
        system: `Generate exciting content about platform updates and new features.`,
        user: `Create content about new Glamlink platform features and updates.

Focus areas: {focusAreas}
Target users: {targetUsers}
Update type: {updateType}

Generate 4-6 feature updates, each including:
- Feature name and brief description
- Key benefits for beauty professionals
- How it improves the user experience
- Call-to-action or next steps

Make the content exciting and show how these updates help beauty professionals grow their business and serve clients better.`,
        
        examples: [
          "New client booking and management features",
          "Enhanced portfolio and showcase tools",
          "Improved search and discovery features", 
          "New payment and business management tools"
        ]
      }
    }
  }
};

// Helper functions
export function getSectionPromptTemplate(sectionType: string): SectionPromptTemplate | undefined {
  return SECTION_PROMPT_TEMPLATES[sectionType];
}

export function getContentBlockPrompt(sectionType: string, blockName: string): ContentBlockPrompt | undefined {
  const template = getSectionPromptTemplate(sectionType);
  return template?.contentBlocks[blockName];
}

export function getAllAvailablePrompts(): string[] {
  return Object.keys(SECTION_PROMPT_TEMPLATES);
}

export function buildPromptWithContext(
  sectionType: string, 
  blockName: string, 
  variables: Record<string, string>
): { system: string; user: string } | null {
  const sectionTemplate = getSectionPromptTemplate(sectionType);
  const blockPrompt = getContentBlockPrompt(sectionType, blockName);
  
  if (!sectionTemplate || !blockPrompt) return null;
  
  // Combine system prompts
  const systemPrompt = `${sectionTemplate.system}\n\n${blockPrompt.system}`;
  
  // Replace variables in user prompt
  let userPrompt = blockPrompt.user;
  Object.entries(variables).forEach(([key, value]) => {
    userPrompt = userPrompt.replace(new RegExp(`{${key}}`, 'g'), value);
  });
  
  return {
    system: systemPrompt,
    user: userPrompt
  };
}