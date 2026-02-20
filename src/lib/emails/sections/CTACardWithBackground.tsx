import React from 'react';
import { TrackingParams, EmailTheme } from '../types';
import { getThemedStyles } from '../utils/themeHelper';
import { getDefaultTheme } from '../utils/themeManager';

interface CTACard {
  id: string;
  title: string;
  description: string;
  image: string;
  linkText?: string;
  linkUrl?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

interface CTACardWithBackgroundSection {
  type: 'cta-cards-background';
  headerTitle?: string;
  subtitle?: string;
  cards: CTACard[];
  viewAllText?: string;
  viewAllUrl?: string;
}

interface CTACardWithBackgroundProps {
  section: CTACardWithBackgroundSection;
  tracking: TrackingParams;
  theme?: EmailTheme;
}

const CTACardWithBackground: React.FC<CTACardWithBackgroundProps> = ({ section, tracking, theme = getDefaultTheme() }) => {
  // Get themed styles
  const styles = getThemedStyles(theme);
  // Helper function to add UTM parameters to URLs
  const addTrackingParams = (url: string, content?: string) => {
    if (!url) return '#';
    const params = new URLSearchParams({
      utm_source: tracking?.utm_source || 'email',
      utm_medium: tracking?.utm_medium || 'email',
      utm_campaign: tracking?.utm_campaign || 'campaign',
      utm_content: content || tracking?.utm_content || ''
    });
    
    // Add modal parameter to open the user download dialog
    params.append('modal', 'user');
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  // Default cards with Glamlink teal color scheme
  const defaultCards: CTACard[] = [
    {
      id: 'explore-content',
      title: 'Explore Beauty Content',
      description: 'Dive into expert interviews, product tips, and transformation stories right in the app.',
      image: 'https://via.placeholder.com/300x300/5DD5C4/FFFFFF?text=Beauty+Content',
      linkText: 'See content details',
      linkUrl: 'https://glamlink.net/content',
      gradientFrom: theme.colors.primary.main,
      gradientTo: theme.colors.primary.dark
    },
    {
      id: 'shop-products',
      title: 'Shop & Discover Products',
      description: 'Browse top-rated beauty products and exclusive Glamlink picks - all in one place.',
      image: 'https://via.placeholder.com/300x300/4BBFAE/FFFFFF?text=Shop+Products',
      linkText: 'See product details',
      linkUrl: 'https://glamlink.net/shop',
      gradientFrom: theme.colors.primary.light,
      gradientTo: theme.colors.primary.main
    },
    {
      id: 'find-treatments',
      title: 'Find Treatments Near You',
      description: 'Search and book trusted treatments at salons and spas near you, directly through the app.',
      image: 'https://via.placeholder.com/300x300/39A894/FFFFFF?text=Find+Treatments',
      linkText: 'See treatment details',
      linkUrl: 'https://glamlink.net/treatments',
      gradientFrom: theme.colors.primary.main,
      gradientTo: theme.colors.primary.dark
    }
  ];

  const cards = section.cards?.length > 0 ? section.cards : defaultCards;

  // Create the section HTML as a string for better email compatibility
  const sectionHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 40px; background-color: ${theme.colors.background.alternateSection};">
      <tr>
        <td style="padding: 40px 20px;">
          <!-- Header -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 35px;">
            <tr>
              <td align="center">
                <h2 style="margin: 0 0 12px; ${styles.headingLarge}; text-align: center;">
                  ${section.headerTitle || 'Popular Features'}
                </h2>
                ${section.subtitle ? `
                  <p style="margin: 0; ${styles.bodyText}; text-align: center;">
                    ${section.subtitle}
                  </p>
                ` : ''}
              </td>
            </tr>
          </table>
          
          <!-- Cards Grid -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              ${cards.map((card, index) => {
                return `
                  <td width="33.33%" valign="top" style="padding: ${index > 0 ? '0 0 0 15px' : '0'};">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                           style="background: ${theme.colors.gradient.primary}; 
                                  border-radius: ${theme.borderRadius.lg}; overflow: visible; position: relative; min-height: 380px;">
                      <tr>
                        <td style="padding: 20px;">
                          <!-- Decorative sparkles using table positioning -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="position: relative;">
                            <tr>
                              <td align="left" valign="top" style="padding: 0;">
                                <span style="display: inline-block; font-size: 14px; line-height: 14px; color: rgba(0,0,0,0.15);">⭐</span>
                              </td>
                              <td align="right" valign="top" style="padding: 0;">
                                <span style="display: inline-block; font-size: 18px; line-height: 18px; color: rgba(0,0,0,0.2);">✨</span>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Circular image container with overlap effect -->
                          <div style="text-align: center; margin: -40px auto 20px; position: relative;">
                            <div style="width: 140px; height: 140px; margin: 0 auto; background: white; border-radius: 50%; padding: 5px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                              <img src="${card.image}" 
                                   alt="${card.title}" 
                                   width="130" 
                                   height="130"
                                   style="display: block; width: 130px; height: 130px; border-radius: 50%; object-fit: cover;" />
                            </div>
                          </div>
                          
                          <!-- Card Content -->
                          <div style="text-align: center; padding: 0 10px;">
                            <h3 style="margin: 0 0 12px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.lg}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.text.primary};">
                              ${card.title}
                            </h3>
                            <p style="margin: 0 0 20px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; line-height: 1.5; color: ${theme.colors.text.primary};">
                              ${card.description}
                            </p>
                            
                            ${card.linkText && card.linkUrl ? `
                              <a href="${addTrackingParams(card.linkUrl, `card_${card.id}`)}" 
                                 style="display: inline-block; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; font-weight: ${theme.typography.fontWeight.semibold}; color: ${theme.colors.text.primary}; text-decoration: underline; text-underline-offset: 3px;">
                                ${card.linkText}
                              </a>
                            ` : ''}
                          </div>
                          
                          <!-- Bottom decorative sparkle -->
                          <div style="text-align: right; margin-top: 10px;">
                            <span style="display: inline-block; font-size: 16px; line-height: 16px; color: rgba(0,0,0,0.2);">✨</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                `;
              }).join('')}
            </tr>
          </table>
          
          <!-- View All Button -->
          ${section.viewAllUrl ? `
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 35px;">
              <tr>
                <td align="center">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="border-radius: ${theme.borderRadius.md}; background-color: ${theme.colors.background.card}; border: 2px solid ${theme.colors.primary.main};">
                        <a href="${addTrackingParams(section.viewAllUrl, 'view_all_features')}" 
                           style="display: inline-block; padding: 14px 32px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.base}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.primary.main}; text-decoration: none;">
                          ${section.viewAllText || 'View all features'}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          ` : ''}
          
          <!-- Mobile Version (Stacked Cards) -->
          <!--[if !mso]><!-->
          <div style="display: none; max-height: 0; overflow: hidden;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                   style="display: none;">
              <tr>
                <td>
                  ${cards.map((card) => {
                    return `
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                             style="background: ${theme.colors.gradient.primary}; 
                                    border-radius: ${theme.borderRadius.lg}; margin-bottom: 20px;">
                        <tr>
                          <td style="padding: 20px; text-align: center;">
                            <!-- Decorative elements -->
                            <div style="text-align: right; margin-bottom: 10px;">
                              <span style="display: inline-block; font-size: 16px; line-height: 16px; color: rgba(0,0,0,0.2);">✨</span>
                            </div>
                            
                            <!-- Circular image -->
                            <div style="width: 120px; height: 120px; margin: -30px auto 15px; background: white; border-radius: 50%; padding: 4px;">
                              <img src="${card.image}" alt="${card.title}" 
                                   style="width: 112px; height: 112px; border-radius: 50%; object-fit: cover;" />
                            </div>
                            
                            <!-- Content -->
                            <h3 style="margin: 0 0 10px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.base}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.text.primary};">
                              ${card.title}
                            </h3>
                            <p style="margin: 0 0 15px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.xs}; line-height: 1.4; color: ${theme.colors.text.primary};">
                              ${card.description}
                            </p>
                            ${card.linkText && card.linkUrl ? `
                              <a href="${addTrackingParams(card.linkUrl, `card_${card.id}_mobile`)}" 
                                 style="font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.xs}; font-weight: ${theme.typography.fontWeight.semibold}; color: ${theme.colors.text.primary}; text-decoration: underline;">
                                ${card.linkText}
                              </a>
                            ` : ''}
                          </td>
                        </tr>
                      </table>
                    `;
                  }).join('')}
                </td>
              </tr>
            </table>
          </div>
          <!--<![endif]-->
        </td>
      </tr>
    </table>
    
    <style type="text/css">
      @media only screen and (max-width: 600px) {
        /* Hide desktop version on mobile */
        table[role="presentation"] td[width="33.33%"] {
          display: none !important;
        }
        
        /* Show mobile version */
        div[style*="display: none"] {
          display: block !important;
          max-height: none !important;
          overflow: visible !important;
        }
        
        div[style*="display: none"] table {
          display: table !important;
        }
      }
    </style>
  `;

  // Return the HTML string wrapped in a div with dangerouslySetInnerHTML
  return <div dangerouslySetInnerHTML={{ __html: sectionHtml }} />;
};

export default CTACardWithBackground;