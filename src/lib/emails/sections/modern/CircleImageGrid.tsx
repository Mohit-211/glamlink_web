import React from 'react';
import { TrackingParams } from '../../types';

interface GridItem {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  itemUrl?: string;
  badge?: string;
  price?: string;
  category?: string;
  isPopular?: boolean;
}

interface CircleImageGridData {
  type: 'circle-image-grid';
  title?: string;
  subtitle?: string;
  description?: string;
  items: GridItem[];
  gridColumns?: number;
  showBadges?: boolean;
  showPrices?: boolean;
  backgroundColor?: string;
  accentColor?: string;
  viewAllUrl?: string;
}

interface CircleImageGridProps {
  section: CircleImageGridData;
  tracking: TrackingParams;
}

const CircleImageGrid: React.FC<CircleImageGridProps> = ({ section, tracking }) => {
  const {
    title = "Discover Amazing Products",
    subtitle,
    description,
    items = [],
    gridColumns = 4,
    showBadges = true,
    showPrices = false,
    backgroundColor = '#f8f9fa',
    accentColor = '#20c997',
    viewAllUrl
  } = section;

  // Helper function to add UTM parameters to URLs
  const addTrackingParams = (url: string, content?: string) => {
    if (!url) return '#';
    const params = new URLSearchParams({
      utm_source: tracking?.utm_source || 'email',
      utm_medium: tracking?.utm_medium || 'email',
      utm_campaign: tracking?.utm_campaign || 'campaign',
      utm_content: content || tracking?.utm_content || 'circle_image_grid'
    });
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  if (!items || items.length === 0) return null;

  const columnWidth = gridColumns === 2 ? '50%' : gridColumns === 3 ? '33.33%' : gridColumns === 4 ? '25%' : '20%';
  const displayItems = items.slice(0, gridColumns * 2); // Show 2 rows max

  const sectionHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 40px;">
      <tr>
        <td style="padding: 30px; background-color: ${backgroundColor};">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                 style="background-color: #ffffff; border-radius: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); overflow: hidden;">
            <tr>
              <td style="padding: 50px 40px;">
                <!-- Header -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 40px;">
                  <tr>
                    <td align="center">
                      ${title ? `
                        <h2 style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 32px; font-weight: 700; color: #1a1a1a; line-height: 1.2; letter-spacing: -0.5px;">
                          ${title}
                        </h2>
                      ` : ''}
                      ${subtitle ? `
                        <h3 style="margin: 0 0 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 500; color: ${accentColor}; line-height: 1.3;">
                          ${subtitle}
                        </h3>
                      ` : ''}
                      ${description ? `
                        <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; color: #666666; line-height: 1.6; max-width: 600px; margin-left: auto; margin-right: auto;">
                          ${description}
                        </p>
                      ` : ''}
                    </td>
                  </tr>
                </table>
                
                <!-- Circle Grid -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  ${displayItems.map((item, index) => {
                    // Create rows based on gridColumns
                    if (index % gridColumns === 0) {
                      const rowItems = displayItems.slice(index, index + gridColumns);
                      return `
                        <tr>
                          ${rowItems.map((rowItem, itemIndex) => {
                            const actualIndex = index + itemIndex;
                            return `
                              <td width="${columnWidth}" align="center" valign="top" style="padding: 0 15px 30px;">
                                <!-- Circle Item -->
                                ${rowItem.itemUrl ? `
                                  <a href="${addTrackingParams(rowItem.itemUrl, 'item_' + actualIndex)}" style="text-decoration: none; color: inherit; display: block;">
                                ` : ''}
                                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                      <td align="center" style="position: relative;">
                                        <!-- Circle Image Container -->
                                        <div style="position: relative; width: 120px; height: 120px; margin: 0 auto 16px; border-radius: 50%; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.15); transition: transform 0.3s ease, box-shadow 0.3s ease; background: linear-gradient(135deg, ${accentColor} 0%, #667eea 100%);">
                                          <!-- Hover Effect (limited email support) -->
                                          <div style="position: absolute; inset: 3px; border-radius: 50%; overflow: hidden; background-color: #ffffff;">
                                            <img src="${rowItem.image}" 
                                                 alt="${rowItem.title}" 
                                                 width="114" 
                                                 height="114"
                                                 style="display: block; width: 114px; height: 114px; object-fit: cover; transition: transform 0.3s ease;" />
                                          </div>
                                          
                                          ${showBadges && rowItem.badge ? `
                                            <!-- Badge -->
                                            <div style="position: absolute; top: -5px; right: -5px; width: 32px; height: 32px; background: linear-gradient(135deg, #ff6b6b 0%, #ffc107 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                                              <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: bold; color: #ffffff;">
                                                ${rowItem.badge}
                                              </span>
                                            </div>
                                          ` : ''}
                                          
                                          ${rowItem.isPopular ? `
                                            <!-- Popular Pulse Effect -->
                                            <div style="position: absolute; top: -8px; left: -8px; right: -8px; bottom: -8px; border-radius: 50%; border: 2px solid ${accentColor}; opacity: 0.6; animation: pulse 2s infinite;"></div>
                                          ` : ''}
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td align="center">
                                        <!-- Item Content -->
                                        <h4 style="margin: 0 0 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #1a1a1a; line-height: 1.3; text-align: center;">
                                          ${rowItem.title}
                                        </h4>
                                        ${rowItem.subtitle ? `
                                          <p style="margin: 0 0 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; color: ${accentColor}; font-weight: 500; text-align: center;">
                                            ${rowItem.subtitle}
                                          </p>
                                        ` : ''}
                                        ${rowItem.description ? `
                                          <p style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #666666; line-height: 1.4; text-align: center;">
                                            ${rowItem.description.length > 60 ? rowItem.description.substring(0, 60) + '...' : rowItem.description}
                                          </p>
                                        ` : ''}
                                        ${showPrices && rowItem.price ? `
                                          <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 700; color: #1a1a1a; text-align: center;">
                                            ${rowItem.price}
                                          </p>
                                        ` : ''}
                                        ${rowItem.category ? `
                                          <div style="margin-top: 8px;">
                                            <span style="background-color: rgba(32, 201, 151, 0.1); color: ${accentColor}; padding: 4px 10px; border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                              ${rowItem.category}
                                            </span>
                                          </div>
                                        ` : ''}
                                      </td>
                                    </tr>
                                  </table>
                                ${rowItem.itemUrl ? '</a>' : ''}
                              </td>
                            `;
                          }).join('')}
                          ${rowItems.length < gridColumns ? '<td></td>'.repeat(gridColumns - rowItems.length) : ''}
                        </tr>
                      `;
                    }
                    return '';
                  }).filter(Boolean).join('')}
                </table>
                
                ${viewAllUrl ? `
                  <!-- View All Button -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 40px;">
                    <tr>
                      <td align="center">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="border-radius: 50px; background: linear-gradient(135deg, ${accentColor} 0%, #667eea 100%); box-shadow: 0 4px 16px rgba(32, 201, 151, 0.3);">
                              <a href="${addTrackingParams(viewAllUrl, 'view_all')}" 
                                 style="display: inline-block; padding: 16px 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 50px; letter-spacing: 0.5px;">
                                Explore All →
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                ` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Mobile Version -->
    <!--[if !mso]><!-->
    <div style="display: none; max-height: 0; overflow: hidden;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
             style="display: none; margin: 0 0 30px;">
        <tr>
          <td style="padding: 0 20px; background-color: ${backgroundColor};">
            <div style="background-color: #ffffff; border-radius: 16px; padding: 30px 25px; box-shadow: 0 6px 24px rgba(0,0,0,0.1);">
              ${title ? `
                <h2 style="margin: 0 0 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; color: #1a1a1a; text-align: center; line-height: 1.2;">
                  ${title}
                </h2>
              ` : ''}
              
              <!-- Mobile Circle Grid -->
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 25px;">
                ${displayItems.slice(0, 6).map((item, index) => `
                  <div style="text-align: center;">
                    ${item.itemUrl ? `
                      <a href="${addTrackingParams(item.itemUrl, `item_mobile_${index}`)}" style="text-decoration: none; color: inherit; display: block;">
                    ` : ''}
                      <!-- Mobile Circle -->
                      <div style="position: relative; width: 90px; height: 90px; margin: 0 auto 12px; border-radius: 50%; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.15); background: linear-gradient(135deg, ${accentColor} 0%, #667eea 100%);">
                        <div style="position: absolute; inset: 2px; border-radius: 50%; overflow: hidden; background-color: #ffffff;">
                          <img src="${item.image}" 
                               alt="${item.title}" 
                               width="86" 
                               height="86"
                               style="display: block; width: 86px; height: 86px; object-fit: cover;" />
                        </div>
                        ${showBadges && item.badge ? `
                          <div style="position: absolute; top: -3px; right: -3px; width: 24px; height: 24px; background: linear-gradient(135deg, #ff6b6b 0%, #ffc107 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 9px; font-weight: bold; color: #ffffff;">
                              ${item.badge}
                            </span>
                          </div>
                        ` : ''}
                      </div>
                      
                      <!-- Mobile Content -->
                      <h4 style="margin: 0 0 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: #1a1a1a; line-height: 1.3;">
                        ${item.title}
                      </h4>
                      ${item.subtitle ? `
                        <p style="margin: 0 0 3px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; color: ${accentColor}; font-weight: 500;">
                          ${item.subtitle}
                        </p>
                      ` : ''}
                      ${showPrices && item.price ? `
                        <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 700; color: #1a1a1a;">
                          ${item.price}
                        </p>
                      ` : ''}
                    ${item.itemUrl ? '</a>' : ''}
                  </div>
                `).join('')}
              </div>
              
              ${viewAllUrl ? `
                <div style="text-align: center;">
                  <a href="${addTrackingParams(viewAllUrl, 'view_all_mobile')}" 
                     style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, ${accentColor} 0%, #667eea 100%); color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 25px;">
                    Explore All →
                  </a>
                </div>
              ` : ''}
            </div>
          </td>
        </tr>
      </table>
    </div>
    <!--<![endif]-->

    <style type="text/css">
      @media only screen and (max-width: 600px) {
        /* Hide desktop version on mobile */
        table[role="presentation"]:not([style*="display: none"]) {
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
      
      /* Animation for popular items (limited email client support) */
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.05); opacity: 0.8; }
        100% { transform: scale(1); opacity: 0.6; }
      }
    </style>
  `;

  return <div dangerouslySetInnerHTML={{ __html: sectionHtml }} />;
};

export default CircleImageGrid;