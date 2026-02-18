import React from 'react';
import { TrackingParams } from '../../types';

interface ContentCard {
  id: string;
  type: 'article' | 'video' | 'product' | 'tutorial' | 'event' | 'offer';
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  cardUrl?: string;
  author?: string;
  authorImage?: string;
  date?: string;
  duration?: string;
  price?: string;
  originalPrice?: string;
  badge?: string;
  category?: string;
  readTime?: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

interface InteractiveContentCardsData {
  type: 'interactive-content-cards';
  title?: string;
  subtitle?: string;
  cards: ContentCard[];
  layout?: 'grid' | 'masonry' | 'slider';
  showCategories?: boolean;
  showAuthors?: boolean;
  showDates?: boolean;
  backgroundColor?: string;
  accentColor?: string;
  viewAllUrl?: string;
}

interface InteractiveContentCardsProps {
  section: InteractiveContentCardsData;
  tracking: TrackingParams;
}

const InteractiveContentCards: React.FC<InteractiveContentCardsProps> = ({ section, tracking }) => {
  const {
    title = "Latest Content",
    subtitle,
    cards = [],
    layout = 'grid',
    showCategories = true,
    showAuthors = true,
    showDates = true,
    backgroundColor = '#f8f9fa',
    accentColor = '#6366f1',
    viewAllUrl
  } = section;

  // Helper function to add UTM parameters to URLs
  const addTrackingParams = (url: string, content?: string) => {
    if (!url) return '#';
    const params = new URLSearchParams({
      utm_source: tracking?.utm_source || 'email',
      utm_medium: tracking?.utm_medium || 'email',
      utm_campaign: tracking?.utm_campaign || 'campaign',
      utm_content: content || tracking?.utm_content || 'interactive_content_cards'
    });
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  // Get type-specific styling and icons
  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'article':
        return { icon: '📖', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' };
      case 'video':
        return { icon: '🎥', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
      case 'product':
        return { icon: '🛍️', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
      case 'tutorial':
        return { icon: '🎯', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
      case 'event':
        return { icon: '📅', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' };
      case 'offer':
        return { icon: '🎁', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' };
      default:
        return { icon: '📄', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' };
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  if (!cards || cards.length === 0) return null;

  const displayCards = cards.slice(0, 6); // Limit for email

  const sectionHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 40px;">
      <tr>
        <td style="padding: 30px; background-color: ${backgroundColor};">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                 style="background-color: #ffffff; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden;">
            <tr>
              <td style="padding: 50px 40px;">
                <!-- Header -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 40px;">
                  <tr>
                    <td align="center">
                      ${title ? `
                        <h2 style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 32px; font-weight: 700; color: #1f2937; line-height: 1.2; letter-spacing: -0.5px;">
                          ${title}
                        </h2>
                      ` : ''}
                      ${subtitle ? `
                        <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 18px; color: #6b7280; line-height: 1.5; max-width: 600px; margin-left: auto; margin-right: auto;">
                          ${subtitle}
                        </p>
                      ` : ''}
                    </td>
                  </tr>
                </table>
                
                <!-- Cards Grid -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  ${displayCards.map((card, index) => {
                    if (index % 2 === 0) {
                      const nextCard = displayCards[index + 1];
                      return `
                        <tr>
                          <!-- Card ${index + 1} -->
                          <td width="50%" valign="top" style="padding: 0 12px 24px;">
                            ${renderCard(card, index, getTypeInfo(card.type), showCategories, showAuthors, showDates, accentColor, addTrackingParams, formatDate)}
                          </td>
                          
                          ${nextCard ? `
                            <!-- Card ${index + 2} -->
                            <td width="50%" valign="top" style="padding: 0 12px 24px;">
                              ${renderCard(nextCard, index + 1, getTypeInfo(nextCard.type), showCategories, showAuthors, showDates, accentColor, addTrackingParams, formatDate)}
                            </td>
                          ` : '<td width="50%"></td>'}
                        </tr>
                      `;
                    }
                    return '';
                  }).filter(Boolean).join('')}
                </table>
                
                ${viewAllUrl ? `
                  <!-- View All Button -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px;">
                    <tr>
                      <td align="center">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="border-radius: 12px; background: linear-gradient(135deg, ${accentColor} 0%, #8b5cf6 100%); box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);">
                              <a href="${addTrackingParams(viewAllUrl, 'view_all')}" 
                                 style="display: inline-block; padding: 16px 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 12px; letter-spacing: 0.5px;">
                                View All Content →
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
                <h2 style="margin: 0 0 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; color: #1f2937; text-align: center; line-height: 1.2;">
                  ${title}
                </h2>
              ` : ''}
              
              <!-- Mobile Cards Stack -->
              <div style="display: block;">
                ${displayCards.slice(0, 4).map((card, index) => {
                  const typeInfo = getTypeInfo(card.type);
                  return `
                    <div style="margin-bottom: 20px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
                      ${card.cardUrl ? `
                        <a href="${addTrackingParams(card.cardUrl, `card_mobile_${index}`)}" style="text-decoration: none; color: inherit; display: block;">
                      ` : ''}
                        <!-- Mobile Card Image -->
                        <div style="position: relative; width: 100%; height: 160px; overflow: hidden; background-color: #f3f4f6;">
                          <img src="${card.image}" 
                               alt="${card.title}" 
                               width="100%" 
                               height="160"
                               style="display: block; width: 100%; height: 160px; object-fit: cover;" />
                          
                          <!-- Mobile Badges -->
                          <div style="position: absolute; top: 12px; left: 12px; display: flex; align-items: center; gap: 6px;">
                            <span style="background-color: ${typeInfo.bg}; color: ${typeInfo.color}; padding: 4px 8px; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; backdrop-filter: blur(10px);">
                              ${typeInfo.icon} ${card.type.charAt(0).toUpperCase() + card.type.slice(1)}
                            </span>
                            ${card.badge ? `
                              <span style="background-color: ${accentColor}; color: #ffffff; padding: 4px 8px; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600;">
                                ${card.badge}
                              </span>
                            ` : ''}
                          </div>
                          
                          ${card.isNew ? `
                            <div style="position: absolute; top: 12px; right: 12px;">
                              <span style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 4px 8px; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: bold;">
                                NEW
                              </span>
                            </div>
                          ` : ''}
                        </div>
                        
                        <!-- Mobile Card Content -->
                        <div style="padding: 16px;">
                          <h4 style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #1f2937; line-height: 1.3;">
                            ${card.title}
                          </h4>
                          
                          <p style="margin: 0 0 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; color: #6b7280; line-height: 1.4;">
                            ${card.description.length > 80 ? card.description.substring(0, 80) + '...' : card.description}
                          </p>
                          
                          <!-- Mobile Meta Info -->
                          <div style="display: flex; align-items: center; justify-content: space-between; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; color: #9ca3af;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                              ${showDates && card.date ? `
                                <span>${formatDate(card.date)}</span>
                              ` : ''}
                              ${card.readTime ? `
                                <span>• ${card.readTime}</span>
                              ` : ''}
                              ${card.duration ? `
                                <span>• ${card.duration}</span>
                              ` : ''}
                            </div>
                            ${card.price ? `
                              <div style="color: ${accentColor}; font-weight: 600;">
                                ${card.price}
                                ${card.originalPrice ? `
                                  <span style="text-decoration: line-through; color: #9ca3af; margin-left: 4px;">${card.originalPrice}</span>
                                ` : ''}
                              </div>
                            ` : ''}
                          </div>
                        </div>
                      ${card.cardUrl ? '</a>' : ''}
                    </div>
                  `;
                }).join('')}
              </div>
              
              ${viewAllUrl ? `
                <div style="text-align: center; margin-top: 20px;">
                  <a href="${addTrackingParams(viewAllUrl, 'view_all_mobile')}" 
                     style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, ${accentColor} 0%, #8b5cf6 100%); color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 10px;">
                    View All Content →
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
      
      /* Hover effects for supported email clients */
      .card-hover:hover {
        box-shadow: 0 8px 32px rgba(0,0,0,0.15) !important;
        transform: translateY(-2px) !important;
      }
    </style>
  `;

  return <div dangerouslySetInnerHTML={{ __html: sectionHtml }} />;
};

// Helper function to render individual cards
function renderCard(
  card: ContentCard, 
  index: number, 
  typeInfo: any, 
  showCategories: boolean, 
  showAuthors: boolean, 
  showDates: boolean,
  accentColor: string,
  addTrackingParams: Function,
  formatDate: Function
): string {
  return `
    <!-- Card Container -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
           style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; transition: all 0.3s ease;" 
           class="card-hover">
      <tr>
        <td style="padding: 0; position: relative;">
          ${card.cardUrl ? `
            <a href="${addTrackingParams(card.cardUrl, 'card_' + index)}" style="text-decoration: none; color: inherit; display: block;">
          ` : ''}
            <!-- Card Image -->
            <div style="position: relative; width: 100%; height: 180px; overflow: hidden; background-color: #f3f4f6;">
              <img src="${card.image}" 
                   alt="${card.title}" 
                   width="100%" 
                   height="180"
                   style="display: block; width: 100%; height: 180px; object-fit: cover; transition: transform 0.3s ease;" />
              
              <!-- Image Overlay -->
              <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.3) 100%);"></div>
              
              <!-- Type Badge -->
              <div style="position: absolute; top: 12px; left: 12px;">
                <span style="background-color: ${typeInfo.bg}; backdrop-filter: blur(10px); color: ${typeInfo.color}; padding: 6px 10px; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 600; border: 1px solid rgba(255,255,255,0.2);">
                  ${typeInfo.icon} ${card.type.charAt(0).toUpperCase() + card.type.slice(1)}
                </span>
              </div>
              
              ${card.isNew || card.isFeatured ? `
                <!-- Status Badge -->
                <div style="position: absolute; top: 12px; right: 12px;">
                  <span style="background: linear-gradient(135deg, ${card.isNew ? '#10b981' : accentColor} 0%, ${card.isNew ? '#059669' : '#8b5cf6'} 100%); color: #ffffff; padding: 6px 10px; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${card.isNew ? 'NEW' : 'FEATURED'}
                  </span>
                </div>
              ` : ''}
              
              ${card.badge ? `
                <!-- Custom Badge -->
                <div style="position: absolute; bottom: 12px; left: 12px;">
                  <span style="background-color: ${accentColor}; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 600;">
                    ${card.badge}
                  </span>
                </div>
              ` : ''}
              
              ${card.duration ? `
                <!-- Duration Badge -->
                <div style="position: absolute; bottom: 12px; right: 12px;">
                  <span style="background-color: rgba(0,0,0,0.7); color: #ffffff; padding: 4px 8px; border-radius: 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600;">
                    ${card.duration}
                  </span>
                </div>
              ` : ''}
            </div>
          ${card.cardUrl ? '</a>' : ''}
        </td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <!-- Card Content -->
          ${card.cardUrl ? `
            <a href="${addTrackingParams(card.cardUrl, 'card_title_' + index)}" style="text-decoration: none; color: inherit;">
          ` : ''}
            <h4 style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 600; color: #1f2937; line-height: 1.3;">
              ${card.title}
            </h4>
          ${card.cardUrl ? '</a>' : ''}
          
          ${card.subtitle ? `
            <p style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: ${accentColor}; font-weight: 500;">
              ${card.subtitle}
            </p>
          ` : ''}
          
          <p style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #6b7280; line-height: 1.5;">
            ${card.description.length > 100 ? card.description.substring(0, 100) + '...' : card.description}
          </p>
          
          <!-- Card Footer -->
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 8px;">
              ${showAuthors && card.author ? `
                <div style="display: flex; align-items: center; gap: 6px;">
                  ${card.authorImage ? `
                    <div style="width: 24px; height: 24px; border-radius: 50%; overflow: hidden;">
                      <img src="${card.authorImage}" alt="${card.author}" width="24" height="24" style="display: block; width: 24px; height: 24px; object-fit: cover;" />
                    </div>
                  ` : ''}
                  <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #6b7280; font-weight: 500;">
                    ${card.author}
                  </span>
                </div>
              ` : ''}
              
              ${showDates && card.date ? `
                <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #9ca3af;">
                  ${showAuthors && card.author ? '•' : ''} ${formatDate(card.date)}
                </span>
              ` : ''}
              
              ${card.readTime ? `
                <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #9ca3af;">
                  • ${card.readTime}
                </span>
              ` : ''}
            </div>
            
            ${card.price ? `
              <div style="text-align: right;">
                <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 700; color: ${accentColor};">
                  ${card.price}
                </span>
                ${card.originalPrice ? `
                  <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; text-decoration: line-through; color: #9ca3af; margin-left: 6px;">
                    ${card.originalPrice}
                  </span>
                ` : ''}
              </div>
            ` : ''}
          </div>
          
          ${showCategories && card.category ? `
            <!-- Category -->
            <div style="margin-top: 12px;">
              <span style="background-color: rgba(99, 102, 241, 0.1); color: ${accentColor}; padding: 4px 10px; border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                ${card.category}
              </span>
            </div>
          ` : ''}
        </td>
      </tr>
    </table>
  `;
}

export default InteractiveContentCards;