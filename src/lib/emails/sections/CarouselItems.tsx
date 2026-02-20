import React from 'react';
import { TrackingParams, EmailTheme } from '../types';
import { getThemedStyles, getCardStyles, mapLegacyColor } from '../utils/themeHelper';
import { getDefaultTheme } from '../utils/themeManager';

interface CarouselItem {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  link: string;
  modalType?: 'user' | 'pro';
}

interface CarouselItemsSection {
  type: 'carousel-items';
  headerTitle?: string;
  headerSubtitle?: string;
  items: CarouselItem[];
  viewAllLink: string;
  viewAllText?: string;
}

interface CarouselItemsProps {
  section: CarouselItemsSection;
  tracking: TrackingParams;
  theme?: EmailTheme;
}

const CarouselItems: React.FC<CarouselItemsProps> = ({ section, tracking, theme = getDefaultTheme() }) => {
  const styles = getThemedStyles(theme);
  // Helper function to add UTM parameters to URLs
  const addTrackingParams = (url: string, content?: string, modalType?: string) => {
    if (!url) return '#';
    const params = new URLSearchParams({
      utm_source: tracking?.utm_source || 'email',
      utm_medium: tracking?.utm_medium || 'email',
      utm_campaign: tracking?.utm_campaign || 'campaign',
      utm_content: content || tracking?.utm_content || ''
    });
    
    // Add modal parameter if specified
    if (modalType) {
      params.append('modal', modalType);
    }
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  // Ensure we have items to display
  const items = section.items || [];
  
  // Create the carousel HTML as a string for email compatibility
  const sectionHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 40px;">
      <tr>
        <td style="padding: 30px; background-color: ${theme.colors.background.alternateSection};">
          <!-- Header Section -->
          ${section.headerTitle || section.headerSubtitle ? `
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
              <tr>
                <td align="center">
                  ${section.headerTitle ? `
                    <h2 style="margin: 0 0 10px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.xxxl}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.primary.main};">
                      ${section.headerTitle}
                    </h2>
                  ` : ''}
                  ${section.headerSubtitle ? `
                    <p style="margin: 0; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.base}; color: ${theme.colors.text.secondary};">
                      ${section.headerSubtitle}
                    </p>
                  ` : ''}
                </td>
              </tr>
            </table>
          ` : ''}
          
          <!-- Carousel Container -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${theme.colors.background.card}; border-radius: ${theme.borderRadius.lg}; overflow: hidden; box-shadow: ${theme.shadow.md};">
            <tr>
              <td style="padding: 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <!-- Items Container -->
                    <td>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          ${items.slice(0, 5).map((item, index) => `
                            <td width="20%" align="center" valign="top" style="padding: ${index > 0 ? '0 0 0 10px' : '0'};">
                              <a href="${addTrackingParams(item.link, `carousel_item_${item.id}`, item.modalType)}" 
                                 style="text-decoration: none; color: inherit; display: block;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td align="center">
                                      <!-- Item Image -->
                                      <div style="width: 100%; height: 100px; overflow: hidden; border-radius: ${theme.borderRadius.md}; background-color: ${theme.colors.background.alternateSection}; margin-bottom: 8px;">
                                        <img src="${item.image}" 
                                             alt="${item.title}" 
                                             width="100" 
                                             height="100"
                                             style="display: block; width: 100px; height: 100px; object-fit: cover; border-radius: ${theme.borderRadius.md};" />
                                      </div>
                                      
                                      <!-- Item Title -->
                                      <p style="margin: 0 0 4px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; font-weight: ${theme.typography.fontWeight.semibold}; color: ${theme.colors.text.primary}; line-height: ${theme.typography.lineHeight.tight};">
                                        ${item.title}
                                      </p>
                                      
                                      ${item.subtitle ? `
                                        <!-- Item Subtitle -->
                                        <p style="margin: 0; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.xs}; color: ${theme.colors.text.tertiary};">
                                          ${item.subtitle}
                                        </p>
                                      ` : ''}
                                    </td>
                                  </tr>
                                </table>
                              </a>
                            </td>
                          `).join('')}
                          
                          <!-- Arrow Navigation -->
                          <td width="60" align="center" valign="middle">
                            <a href="${addTrackingParams(section.viewAllLink, 'carousel_view_all')}" 
                               style="display: inline-block; text-decoration: none;">
                              <div style="width: 40px; height: 40px; border-radius: ${theme.borderRadius.full}; background-color: ${theme.colors.primary.main}; display: flex; align-items: center; justify-content: center; line-height: 40px; text-align: center;">
                                <span style="color: ${theme.colors.text.inverse}; font-size: 20px; font-weight: ${theme.typography.fontWeight.bold};">&rarr;</span>
                              </div>
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  ${section.viewAllText ? `
                    <!-- View All Link Text -->
                    <tr>
                      <td align="center" style="padding-top: 20px;">
                        <a href="${addTrackingParams(section.viewAllLink, 'carousel_view_all_text')}" 
                           style="font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; font-weight: ${theme.typography.fontWeight.semibold}; color: ${theme.colors.primary.main}; text-decoration: underline;">
                          ${section.viewAllText}
                        </a>
                      </td>
                    </tr>
                  ` : ''}
                </table>
              </td>
            </tr>
          </table>
          
          <!-- Mobile Version (Vertical Stack) -->
          <!--[if !mso]><!-->
          <div style="display: none; max-height: 0; overflow: hidden;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                   style="display: none; background-color: ${theme.colors.background.card}; border-radius: ${theme.borderRadius.lg}; margin-top: 20px;">
              <tr>
                <td style="padding: 20px;">
                  ${items.map((item, index) => `
                    <a href="${addTrackingParams(item.link, `carousel_item_${item.id}_mobile`, item.modalType)}" 
                       style="text-decoration: none; color: inherit; display: block; margin-bottom: ${index < items.length - 1 ? '15px' : '0'};">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                             style="border: 1px solid ${theme.colors.border.light}; border-radius: ${theme.borderRadius.md}; overflow: hidden;">
                        <tr>
                          <td width="80" valign="middle" style="padding: 10px;">
                            <img src="${item.image}" 
                                 alt="${item.title}" 
                                 width="60" 
                                 height="60"
                                 style="display: block; width: 60px; height: 60px; object-fit: cover; border-radius: ${theme.borderRadius.sm};" />
                          </td>
                          <td valign="middle" style="padding: 10px;">
                            <p style="margin: 0 0 4px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; font-weight: ${theme.typography.fontWeight.semibold}; color: ${theme.colors.text.primary};">
                              ${item.title}
                            </p>
                            ${item.subtitle ? `
                              <p style="margin: 0; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.xs}; color: ${theme.colors.text.tertiary};">
                                ${item.subtitle}
                              </p>
                            ` : ''}
                          </td>
                          <td width="30" align="center" valign="middle" style="padding: 10px;">
                            <span style="color: ${theme.colors.primary.main}; font-size: 16px;">&rarr;</span>
                          </td>
                        </tr>
                      </table>
                    </a>
                  `).join('')}
                  
                  ${section.viewAllText ? `
                    <div style="text-align: center; margin-top: 20px;">
                      <a href="${addTrackingParams(section.viewAllLink, 'carousel_view_all_mobile')}" 
                         style="display: inline-block; padding: 12px 24px; background-color: ${theme.colors.primary.main}; color: ${theme.colors.text.inverse}; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; font-weight: ${theme.typography.fontWeight.bold}; text-decoration: none; border-radius: ${theme.borderRadius.sm};">
                        ${section.viewAllText}
                      </a>
                    </div>
                  ` : ''}
                </td>
              </tr>
            </table>
          </div>
          <!--<![endif]-->
          
          <style type="text/css">
            @media only screen and (max-width: 600px) {
              /* Hide desktop carousel on mobile */
              table[role="presentation"] td[width="20%"] {
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
        </td>
      </tr>
    </table>
  `;

  // Return the HTML string wrapped in a div with dangerouslySetInnerHTML
  return <div dangerouslySetInnerHTML={{ __html: sectionHtml }} />;
};

export default CarouselItems;