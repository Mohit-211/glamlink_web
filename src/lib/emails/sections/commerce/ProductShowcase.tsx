import React from 'react';
import { TrackingParams, EmailTheme } from '../../types';
import { getThemedStyles, getCardStyles, mapLegacyColor } from '../../utils/themeHelper';
import { getDefaultTheme } from '../../utils/themeManager';

interface ProductShowcaseData {
  type: 'product-showcase';
  title?: string;
  subtitle?: string;
  productName: string;
  productDescription: string;
  productImage: string;
  gallery?: string[];
  price: string;
  originalPrice?: string;
  discount?: string;
  rating?: number;
  reviewCount?: number;
  features?: string[];
  ctaText?: string;
  ctaUrl?: string;
  backgroundColor?: string;
  badge?: string;
}

interface ProductShowcaseProps {
  section: ProductShowcaseData;
  tracking: TrackingParams;
  theme?: EmailTheme;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ section, tracking, theme = getDefaultTheme() }) => {
  const styles = getThemedStyles(theme);
  const {
    title = "Featured Product",
    subtitle,
    productName,
    productDescription,
    productImage,
    gallery = [],
    price,
    originalPrice,
    discount,
    rating,
    reviewCount,
    features = [],
    ctaText = "Shop Now",
    ctaUrl,
    backgroundColor = theme.colors.background.card,
    badge
  } = section;

  // Helper function to add UTM parameters to URLs
  const addTrackingParams = (url: string, content?: string) => {
    if (!url) return '#';
    const params = new URLSearchParams({
      utm_source: tracking?.utm_source || 'email',
      utm_medium: tracking?.utm_medium || 'email',
      utm_campaign: tracking?.utm_campaign || 'campaign',
      utm_content: content || tracking?.utm_content || 'product_showcase'
    });
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  // Generate star rating HTML
  const generateStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHtml = '';
    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<span style="color: #ffc107;">★</span>';
    }
    if (hasHalfStar) {
      starsHtml += '<span style="color: #ffc107;">☆</span>';
    }
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<span style="color: #e0e0e0;">★</span>';
    }
    return starsHtml;
  };

  const sectionHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 40px;">
      <tr>
        <td style="padding: 30px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                 style="background-color: ${backgroundColor}; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
            <tr>
              <td style="padding: 0;">
                <!-- Header -->
                ${title || subtitle ? `
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
                    <tr>
                      <td style="padding: 30px 30px 20px;" align="center">
                        ${title ? `
                          <h2 style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 28px; font-weight: bold; color: #1e3a5f;">
                            ${title}
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
                
                <!-- Product Content -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <!-- Product Image Column -->
                    <td width="50%" valign="top" style="padding: 30px 15px 30px 30px;">
                      <div style="position: relative;">
                        <!-- Main Product Image -->
                        <div style="width: 100%; height: 300px; overflow: hidden; border-radius: 12px; background-color: #f5f5f5; position: relative;">
                          <img src="${productImage}" 
                               alt="${productName}" 
                               width="100%" 
                               height="300"
                               style="display: block; width: 100%; height: 300px; object-fit: cover; border-radius: 12px;" />
                          
                          ${badge ? `
                            <!-- Product Badge -->
                            <div style="position: absolute; top: 15px; left: 15px; background-color: #e74c3c; color: #ffffff; padding: 8px 12px; border-radius: 6px; font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
                              ${badge}
                            </div>
                          ` : ''}
                          
                          ${discount ? `
                            <!-- Discount Badge -->
                            <div style="position: absolute; top: 15px; right: 15px; background-color: #27ae60; color: #ffffff; padding: 8px 12px; border-radius: 6px; font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
                              ${discount}% OFF
                            </div>
                          ` : ''}
                        </div>
                        
                        ${gallery.length > 0 ? `
                          <!-- Gallery Thumbnails -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 15px;">
                            <tr>
                              ${gallery.slice(0, 4).map((image, index) => `
                                <td width="25%" style="padding-right: ${index < 3 ? '10px' : '0'};">
                                  <img src="${image}" 
                                       alt="Product view ${index + 2}" 
                                       width="100%" 
                                       height="60"
                                       style="display: block; width: 100%; height: 60px; object-fit: cover; border-radius: 6px; border: 2px solid #f0f0f0;" />
                                </td>
                              `).join('')}
                            </tr>
                          </table>
                        ` : ''}
                      </div>
                    </td>
                    
                    <!-- Product Details Column -->
                    <td width="50%" valign="top" style="padding: 30px 30px 30px 15px;">
                      <!-- Product Name -->
                      <h3 style="margin: 0 0 15px; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; color: #333333; line-height: 1.3;">
                        ${productName}
                      </h3>
                      
                      <!-- Rating -->
                      ${rating ? `
                        <div style="margin: 0 0 15px;">
                          <span style="font-size: 16px; line-height: 1;">${generateStars(rating)}</span>
                          ${reviewCount ? `
                            <span style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; margin-left: 8px;">
                              (${reviewCount} reviews)
                            </span>
                          ` : ''}
                        </div>
                      ` : ''}
                      
                      <!-- Price -->
                      <div style="margin: 0 0 20px;">
                        ${originalPrice ? `
                          <span style="font-family: Arial, sans-serif; font-size: 18px; color: #999999; text-decoration: line-through; margin-right: 15px;">
                            ${originalPrice}
                          </span>
                        ` : ''}
                        <span style="font-family: Arial, sans-serif; font-size: 28px; font-weight: bold; color: #e74c3c;">
                          ${price}
                        </span>
                        ${originalPrice && discount ? `
                          <span style="font-family: Arial, sans-serif; font-size: 14px; color: #27ae60; font-weight: 600; margin-left: 10px;">
                            Save ${discount}%
                          </span>
                        ` : ''}
                      </div>
                      
                      <!-- Description -->
                      <p style="margin: 0 0 20px; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #555555;">
                        ${productDescription}
                      </p>
                      
                      ${features.length > 0 ? `
                        <!-- Features -->
                        <ul style="margin: 0 0 25px; padding-left: 20px; font-family: Arial, sans-serif; font-size: 15px; color: #555555;">
                          ${features.map(feature => `
                            <li style="margin-bottom: 8px; line-height: 1.4;">
                              ${feature}
                            </li>
                          `).join('')}
                        </ul>
                      ` : ''}
                      
                      ${ctaUrl ? `
                        <!-- CTA Button -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="border-radius: 8px; background: linear-gradient(135deg, #1e3a5f 0%, #2c5aa0 100%);">
                              <a href="${addTrackingParams(ctaUrl, 'product_cta')}" 
                                 style="display: inline-block; padding: 16px 32px; font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
                                ${ctaText}
                              </a>
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
        </td>
      </tr>
    </table>

    <!-- Mobile Version -->
    <!--[if !mso]><!-->
    <div style="display: none; max-height: 0; overflow: hidden;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
             style="display: none; margin: 0 0 30px;">
        <tr>
          <td style="padding: 0 20px;">
            <div style="background-color: ${backgroundColor}; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
              ${title ? `
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                  <h2 style="margin: 0; font-family: Arial, sans-serif; font-size: 22px; font-weight: bold; color: #1e3a5f;">
                    ${title}
                  </h2>
                </div>
              ` : ''}
              
              <div style="padding: 20px;">
                <!-- Mobile Product Image -->
                <div style="width: 100%; height: 250px; overflow: hidden; border-radius: 8px; background-color: #f5f5f5; position: relative; margin-bottom: 20px;">
                  <img src="${productImage}" 
                       alt="${productName}" 
                       width="100%" 
                       height="250"
                       style="display: block; width: 100%; height: 250px; object-fit: cover; border-radius: 8px;" />
                  
                  ${badge ? `
                    <div style="position: absolute; top: 10px; left: 10px; background-color: #e74c3c; color: #ffffff; padding: 6px 10px; border-radius: 4px; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; text-transform: uppercase;">
                      ${badge}
                    </div>
                  ` : ''}
                </div>
                
                <!-- Mobile Product Details -->
                <h3 style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; color: #333333; text-align: center;">
                  ${productName}
                </h3>
                
                ${rating ? `
                  <div style="text-align: center; margin: 0 0 15px;">
                    <span style="font-size: 14px;">${generateStars(rating)}</span>
                    ${reviewCount ? `
                      <span style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; margin-left: 5px;">
                        (${reviewCount})
                      </span>
                    ` : ''}
                  </div>
                ` : ''}
                
                <!-- Mobile Price -->
                <div style="text-align: center; margin: 0 0 15px;">
                  <span style="font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; color: #e74c3c;">
                    ${price}
                  </span>
                  ${originalPrice ? `
                    <br>
                    <span style="font-family: Arial, sans-serif; font-size: 16px; color: #999999; text-decoration: line-through;">
                      ${originalPrice}
                    </span>
                  ` : ''}
                </div>
                
                <p style="margin: 0 0 20px; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #555555; text-align: center;">
                  ${productDescription}
                </p>
                
                ${ctaUrl ? `
                  <div style="text-align: center;">
                    <a href="${addTrackingParams(ctaUrl, 'product_cta_mobile')}" 
                       style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #1e3a5f 0%, #2c5aa0 100%); color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 6px; text-transform: uppercase;">
                      ${ctaText}
                    </a>
                  </div>
                ` : ''}
              </div>
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
    </style>
  `;

  return <div dangerouslySetInnerHTML={{ __html: sectionHtml }} />;
};

export default ProductShowcase;