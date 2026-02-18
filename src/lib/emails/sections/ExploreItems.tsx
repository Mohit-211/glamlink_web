import React from 'react';
import { TrackingParams, EmailTheme } from '../types';
import { getDefaultTheme } from '../utils/themeManager';

interface TreatmentCategory {
  id: string;
  icon: string;
  title: string;
  description?: string;
}

interface ExploreItemsSection {
  type: 'explore-items';
  headerTitle?: string;
  searchPlaceholder?: string;
  searchHelpText?: string;
  popularSearchesTitle?: string;
  categories: TreatmentCategory[];
  modalType?: 'user' | 'pro';
}

interface ExploreItemsProps {
  section: ExploreItemsSection;
  tracking: TrackingParams;
  theme?: EmailTheme;
}

const ExploreItems: React.FC<ExploreItemsProps> = ({ section, tracking, theme = getDefaultTheme() }) => {
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
    const modalType = section.modalType || 'user';
    params.append('modal', modalType);
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  // Default categories if none provided
  const defaultCategories: TreatmentCategory[] = [
    { id: 'facials', icon: '🧖‍♀️', title: 'Facials' },
    { id: 'massage', icon: '💆‍♀️', title: 'Massage' },
    { id: 'hair', icon: '💇‍♀️', title: 'Hair Treatment' },
    { id: 'lashes', icon: '👁️', title: 'Lashes & Brows' },
    { id: 'body', icon: '✨', title: 'Body Sculpting' },
    { id: 'nails', icon: '💅', title: 'Nail Services' }
  ];

  const categories = section.categories?.length > 0 ? section.categories : defaultCategories;

  // Create the section HTML as a string for better email compatibility
  const sectionHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 40px;">
      <tr>
        <td style="padding: 30px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <!-- Header -->
          <h2 style="margin: 0 0 20px; font-family: Arial, sans-serif; font-size: 28px; font-weight: bold; color: #1e3a5f; text-align: center;">
            ${section.headerTitle || 'Find the right treatment'}
          </h2>
          
          <!-- Search Bar -->
          <a href="${addTrackingParams('https://glamlink.net/', 'search_bar')}" 
             style="text-decoration: none; display: block; margin-bottom: 25px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                   style="background-color: #f8f9fa; border-radius: 8px; border: 2px solid #e9ecef;">
              <tr>
                <td style="padding: 15px 20px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td width="30" valign="middle">
                        <span style="font-size: 20px; color: #6c757d;">🔍</span>
                      </td>
                      <td style="padding-left: 10px;" valign="middle">
                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 16px; color: #6c757d;">
                          ${section.searchPlaceholder || 'Discover treatments perfect for you'}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </a>
          
          <!-- Help Text -->
          <p style="margin: 0 0 20px; font-family: Arial, sans-serif; font-size: 16px; color: #333333; text-align: center;">
            ${section.searchHelpText || "Don't know where to start?"}
          </p>
          
          <p style="margin: 0 0 25px; font-family: Arial, sans-serif; font-size: 14px; color: #666666; text-align: center;">
            ${section.popularSearchesTitle || 'Here are some popular treatments right now:'}
          </p>
          
          <!-- Category Icons Grid -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              ${categories.slice(0, 6).map((category, index) => `
                <td width="16.66%" align="center" valign="top" style="padding: ${index > 0 ? '0 5px' : '0 5px 0 0'};">
                  <a href="${addTrackingParams('https://glamlink.net/', `category_${category.id}`)}" 
                     style="text-decoration: none; color: inherit; display: block;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td align="center">
                          <!-- Category Icon Circle -->
                          <div style="width: 70px; height: 70px; margin: 0 auto 8px; background-color: #f8f9fa; border-radius: 50%; display: table; border: 2px solid #e9ecef;">
                            <div style="display: table-cell; vertical-align: middle; text-align: center;">
                              <span style="font-size: 28px; line-height: 1;">
                                ${category.icon}
                              </span>
                            </div>
                          </div>
                          
                          <!-- Category Title -->
                          <p style="margin: 0; font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #333333; line-height: 1.3;">
                            ${category.title}
                          </p>
                          
                          ${category.description ? `
                            <p style="margin: 2px 0 0; font-family: Arial, sans-serif; font-size: 11px; color: #999999;">
                              ${category.description}
                            </p>
                          ` : ''}
                        </td>
                      </tr>
                    </table>
                  </a>
                </td>
              `).join('')}
            </tr>
          </table>
          
          <!-- Mobile Version (Vertical Stack) -->
          <!--[if !mso]><!-->
          <div style="display: none; max-height: 0; overflow: hidden;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                   style="display: none;">
              <tr>
                <td>
                  <!-- Mobile Category Grid (2 columns) -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    ${categories.map((category, index) => {
                      if (index % 2 === 0) {
                        const nextCategory = categories[index + 1];
                        return `
                          <tr>
                            <td width="50%" align="center" valign="top" style="padding: 10px;">
                              <a href="${addTrackingParams('https://glamlink.net/', `category_${category.id}_mobile`)}" 
                                 style="text-decoration: none; color: inherit;">
                                <div style="width: 60px; height: 60px; margin: 0 auto 5px; background-color: #f8f9fa; border-radius: 50%; display: table;">
                                  <div style="display: table-cell; vertical-align: middle; text-align: center;">
                                    <span style="font-size: 24px;">${category.icon}</span>
                                  </div>
                                </div>
                                <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; font-weight: 600; color: #333333;">
                                  ${category.title}
                                </p>
                              </a>
                            </td>
                            ${nextCategory ? `
                              <td width="50%" align="center" valign="top" style="padding: 10px;">
                                <a href="${addTrackingParams('https://glamlink.net/', `category_${nextCategory.id}_mobile`)}" 
                                   style="text-decoration: none; color: inherit;">
                                  <div style="width: 60px; height: 60px; margin: 0 auto 5px; background-color: #f8f9fa; border-radius: 50%; display: table;">
                                    <div style="display: table-cell; vertical-align: middle; text-align: center;">
                                      <span style="font-size: 24px;">${nextCategory.icon}</span>
                                    </div>
                                  </div>
                                  <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; font-weight: 600; color: #333333;">
                                    ${nextCategory.title}
                                  </p>
                                </a>
                              </td>
                            ` : '<td width="50%"></td>'}
                          </tr>
                        `;
                      }
                      return '';
                    }).join('')}
                  </table>
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
        table[role="presentation"] td[width="16.66%"] {
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

export default ExploreItems;