import React from 'react';
import { TrackingParams } from '../../types';

interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  image: string;
  originalPrice?: string;
  discountPrice: string;
  discountPercentage?: string;
  coinCost?: number;
  redemptionRequirement?: string;
  expiryDate: string;
  ctaText: string;
  ctaUrl: string;
  badge?: string;
  badgeColor?: string;
  status?: 'active' | 'completed' | 'limited';
}

interface SpecialOffersData {
  type: 'special-offers';
  title?: string;
  subtitle?: string;
  primaryOffer?: SpecialOffer;
  secondaryOffers: SpecialOffer[];
  layout?: 'featured' | 'grid';
  backgroundColor?: string;
}

interface SpecialOffersProps {
  section: SpecialOffersData;
  tracking: TrackingParams;
}

const SpecialOffers: React.FC<SpecialOffersProps> = ({ section, tracking }) => {
  const {
    title = "Special Offers",
    subtitle,
    primaryOffer,
    secondaryOffers = [],
    layout = 'featured',
    backgroundColor = '#f8f9fa'
  } = section;

  // Helper function to add UTM parameters to URLs
  const addTrackingParams = (url: string, content?: string) => {
    if (!url) return '#';
    const params = new URLSearchParams({
      utm_source: tracking?.utm_source || 'email',
      utm_medium: tracking?.utm_medium || 'email',
      utm_campaign: tracking?.utm_campaign || 'campaign',
      utm_content: content || tracking?.utm_content || 'special_offers'
    });
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  // Get badge styling
  const getBadgeStyle = (offer: SpecialOffer) => {
    const baseStyle = 'padding: 6px 12px; border-radius: 16px; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;';
    
    if (offer.badgeColor) {
      return `${baseStyle} background-color: ${offer.badgeColor}; color: #ffffff;`;
    }
    
    switch (offer.status) {
      case 'completed':
        return `${baseStyle} background-color: #28a745; color: #ffffff;`;
      case 'limited':
        return `${baseStyle} background-color: #dc3545; color: #ffffff;`;
      default:
        return `${baseStyle} background-color: #ffc107; color: #000000;`;
    }
  };

  const sectionHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 40px;">
      <tr>
        <td style="padding: 30px; background-color: ${backgroundColor};">
          <!-- Header -->
          ${title || subtitle ? `
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
              <tr>
                <td align="center">
                  ${title ? `
                    <h2 style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 28px; font-weight: bold; color: #1e3a5f;">
                      🎯 ${title}
                    </h2>
                  ` : ''}
                  ${subtitle ? `
                    <p style="margin: 0; font-family: Arial, sans-serif; font-size: 16px; color: #666666;">
                      ${subtitle}
                    </p>
                  ` : ''}
                </td>
              </tr>
            </table>
          ` : ''}
          
          ${layout === 'featured' && primaryOffer ? `
            <!-- Featured Primary Offer -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                   style="background: linear-gradient(135deg, #1e3a5f 0%, #2c5aa0 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 6px 16px rgba(0,0,0,0.15); margin-bottom: 30px;">
              <tr>
                <td style="padding: 0;">
                  <a href="${addTrackingParams(primaryOffer.ctaUrl, `primary_offer_${primaryOffer.id}`)}" 
                     style="text-decoration: none; color: inherit; display: block;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <!-- Primary Offer Image -->
                        <td width="40%" valign="top" style="padding: 30px 15px 30px 30px;">
                          <div style="position: relative;">
                            <div style="width: 100%; height: 250px; overflow: hidden; border-radius: 12px; background-color: rgba(255,255,255,0.1);">
                              <img src="${primaryOffer.image}" 
                                   alt="${primaryOffer.title}" 
                                   width="100%" 
                                   height="250"
                                   style="display: block; width: 100%; height: 250px; object-fit: cover; border-radius: 12px;" />
                            </div>
                            
                            ${primaryOffer.badge ? `
                              <div style="position: absolute; top: 12px; left: 12px; ${getBadgeStyle(primaryOffer)}">
                                ${primaryOffer.badge}
                              </div>
                            ` : ''}
                            
                            ${primaryOffer.status === 'completed' ? `
                              <div style="position: absolute; top: 12px; right: 12px; background-color: #28a745; color: #ffffff; padding: 8px 12px; border-radius: 8px; font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
                                ✓ Completed
                              </div>
                            ` : ''}
                          </div>
                        </td>
                        
                        <!-- Primary Offer Content -->
                        <td width="60%" valign="middle" style="padding: 30px 30px 30px 15px;">
                          <h3 style="margin: 0 0 15px; font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; color: #ffffff; line-height: 1.2;">
                            ${primaryOffer.title}
                          </h3>
                          
                          <p style="margin: 0 0 20px; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: rgba(255,255,255,0.9);">
                            ${primaryOffer.description}
                          </p>
                          
                          <!-- Primary Offer Pricing -->
                          <div style="margin: 0 0 20px;">
                            ${primaryOffer.originalPrice ? `
                              <span style="font-family: Arial, sans-serif; font-size: 18px; color: rgba(255,255,255,0.7); text-decoration: line-through; margin-right: 15px;">
                                ${primaryOffer.originalPrice}
                              </span>
                            ` : ''}
                            <span style="font-family: Arial, sans-serif; font-size: 32px; font-weight: bold; color: #ffffff;">
                              ${primaryOffer.discountPrice}
                            </span>
                            ${primaryOffer.discountPercentage ? `
                              <span style="background-color: #28a745; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; margin-left: 15px;">
                                ${primaryOffer.discountPercentage}% OFF
                              </span>
                            ` : ''}
                          </div>
                          
                          ${primaryOffer.coinCost ? `
                            <div style="margin: 0 0 20px; padding: 12px; background-color: rgba(255,255,255,0.1); border-radius: 8px;">
                              <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; color: rgba(255,255,255,0.9);">
                                🪙 <strong>${primaryOffer.coinCost} coins required</strong>
                              </p>
                            </div>
                          ` : ''}
                          
                          <!-- Primary Offer CTA -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 15px;">
                            <tr>
                              <td style="border-radius: 8px; background-color: #ffffff;">
                                <span style="display: inline-block; padding: 16px 32px; font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #1e3a5f; border-radius: 8px;">
                                  ${primaryOffer.ctaText}
                                </span>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Primary Offer Expiry -->
                          <p style="margin: 0; font-family: Arial, sans-serif; font-size: 13px; color: rgba(255,255,255,0.8);">
                            ⏰ Expires: ${primaryOffer.expiryDate}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </a>
                </td>
              </tr>
            </table>
          ` : ''}
          
          <!-- Secondary Offers -->
          ${secondaryOffers.length > 0 ? `
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                ${secondaryOffers.map((offer, index) => {
                  const width = secondaryOffers.length === 1 ? '100%' : secondaryOffers.length === 2 ? '50%' : '33.33%';
                  const padding = index > 0 ? '0 0 0 15px' : '0';
                  
                  return `
                    <td width="${width}" valign="top" style="padding: ${padding};">
                      <a href="${addTrackingParams(offer.ctaUrl, `offer_${offer.id}`)}" 
                         style="text-decoration: none; color: inherit; display: block;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                               style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom: 15px; border: 2px solid ${offer.status === 'completed' ? '#28a745' : '#e9ecef'};">
                          <tr>
                            <td style="padding: 0;">
                              <!-- Secondary Offer Image -->
                              <div style="width: 100%; height: 160px; overflow: hidden; background-color: #f5f5f5; position: relative;">
                                <img src="${offer.image}" 
                                     alt="${offer.title}" 
                                     width="100%" 
                                     height="160"
                                     style="display: block; width: 100%; height: 160px; object-fit: cover;" />
                                
                                ${offer.badge ? `
                                  <div style="position: absolute; top: 8px; left: 8px; ${getBadgeStyle(offer)}">
                                    ${offer.badge}
                                  </div>
                                ` : ''}
                                
                                ${offer.status === 'completed' ? `
                                  <div style="position: absolute; top: 8px; right: 8px; background-color: #28a745; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-family: Arial, sans-serif; font-size: 10px; font-weight: bold;">
                                    ✓ Done
                                  </div>
                                ` : ''}
                              </div>
                              
                              <!-- Secondary Offer Content -->
                              <div style="padding: 15px;">
                                <h4 style="margin: 0 0 8px; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; color: #333333; line-height: 1.3;">
                                  ${offer.title}
                                </h4>
                                
                                <p style="margin: 0 0 12px; font-family: Arial, sans-serif; font-size: 13px; line-height: 1.4; color: #666666;">
                                  ${offer.description}
                                </p>
                                
                                <!-- Secondary Offer Pricing -->
                                <div style="margin: 0 0 12px;">
                                  ${offer.originalPrice ? `
                                    <span style="font-family: Arial, sans-serif; font-size: 14px; color: #999999; text-decoration: line-through; margin-right: 8px;">
                                      ${offer.originalPrice}
                                    </span>
                                  ` : ''}
                                  <span style="font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #e74c3c;">
                                    ${offer.discountPrice}
                                  </span>
                                </div>
                                
                                ${offer.coinCost ? `
                                  <div style="margin: 0 0 12px; padding: 8px; background-color: #f8f9fa; border-radius: 4px;">
                                    <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: #666666;">
                                      🪙 ${offer.coinCost} coins
                                    </p>
                                  </div>
                                ` : ''}
                                
                                <!-- Secondary Offer CTA -->
                                <div style="margin: 0 0 8px;">
                                  <span style="display: inline-block; width: 100%; padding: 10px; text-align: center; background-color: #1e3a5f; color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; border-radius: 6px;">
                                    ${offer.ctaText}
                                  </span>
                                </div>
                                
                                <!-- Secondary Offer Expiry -->
                                <p style="margin: 0; font-family: Arial, sans-serif; font-size: 11px; color: #999999; text-align: center;">
                                  Expires: ${offer.expiryDate}
                                </p>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </a>
                    </td>
                  `;
                }).join('')}
              </tr>
            </table>
          ` : ''}
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
            ${title ? `
              <h2 style="margin: 0 0 20px; font-family: Arial, sans-serif; font-size: 22px; font-weight: bold; color: #1e3a5f; text-align: center;">
                🎯 ${title}
              </h2>
            ` : ''}
            
            <!-- Mobile Offers -->
            ${primaryOffer ? `
              <div style="margin-bottom: 20px;">
                <a href="${addTrackingParams(primaryOffer.ctaUrl, `primary_offer_${primaryOffer.id}_mobile`)}" 
                   style="text-decoration: none; color: inherit; display: block;">
                  <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2c5aa0 100%); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                    <div style="padding: 20px;">
                      <h3 style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; color: #ffffff;">
                        ${primaryOffer.title}
                      </h3>
                      <p style="margin: 0 0 15px; font-family: Arial, sans-serif; font-size: 14px; color: rgba(255,255,255,0.9);">
                        ${primaryOffer.description}
                      </p>
                      <div style="margin: 0 0 15px;">
                        <span style="font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; color: #ffffff;">
                          ${primaryOffer.discountPrice}
                        </span>
                        ${primaryOffer.originalPrice ? `
                          <span style="font-family: Arial, sans-serif; font-size: 14px; color: rgba(255,255,255,0.7); text-decoration: line-through; margin-left: 10px;">
                            ${primaryOffer.originalPrice}
                          </span>
                        ` : ''}
                      </div>
                      <div style="text-align: center;">
                        <span style="display: inline-block; padding: 12px 24px; background-color: #ffffff; color: #1e3a5f; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; border-radius: 6px;">
                          ${primaryOffer.ctaText}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ` : ''}
            
            ${secondaryOffers.map((offer, index) => `
              <div style="margin-bottom: ${index < secondaryOffers.length - 1 ? '15px' : '0'};">
                <a href="${addTrackingParams(offer.ctaUrl, `offer_${offer.id}_mobile`)}" 
                   style="text-decoration: none; color: inherit; display: block;">
                  <div style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1); border: 2px solid ${offer.status === 'completed' ? '#28a745' : '#e9ecef'};">
                    <div style="padding: 15px;">
                      <h4 style="margin: 0 0 8px; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; color: #333333;">
                        ${offer.title}
                      </h4>
                      <p style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 13px; color: #666666;">
                        ${offer.description}
                      </p>
                      <div style="margin: 0 0 12px;">
                        <span style="font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #e74c3c;">
                          ${offer.discountPrice}
                        </span>
                        ${offer.originalPrice ? `
                          <span style="font-family: Arial, sans-serif; font-size: 12px; color: #999999; text-decoration: line-through; margin-left: 8px;">
                            ${offer.originalPrice}
                          </span>
                        ` : ''}
                      </div>
                      <div style="text-align: center;">
                        <span style="display: inline-block; width: 100%; padding: 8px; background-color: #1e3a5f; color: #ffffff; font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; border-radius: 4px;">
                          ${offer.ctaText}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            `).join('')}
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
    </style>
  `;

  return <div dangerouslySetInnerHTML={{ __html: sectionHtml }} />;
};

export default SpecialOffers;