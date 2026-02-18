import React from 'react';
import { TrackingParams, EmailTheme } from '../../types';
import { getThemedStyles, getCardStyles, mapLegacyColor } from '../../utils/themeHelper';
import { getDefaultTheme } from '../../utils/themeManager';

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  price?: string;
  originalPrice?: string;
  link: string;
  badge?: string;
}

interface ProductRecommendationsData {
  type: 'product-recommendations';
  title?: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
  viewAllText?: string;
  layout?: 'grid' | 'list';
  backgroundColor?: string;
}

interface ProductRecommendationsProps {
  section: ProductRecommendationsData;
  tracking: TrackingParams;
  theme?: EmailTheme;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({ section, tracking, theme = getDefaultTheme() }) => {
  const styles = getThemedStyles(theme);
  const {
    title = "Marie's Picks",
    subtitle,
    products = [],
    viewAllLink,
    viewAllText = "View All Products",
    layout = 'grid',
    backgroundColor = theme.colors.background.alternateSection
  } = section;

  // Helper function to add UTM parameters to URLs
  const addTrackingParams = (url: string, content?: string) => {
    if (!url) return '#';
    const params = new URLSearchParams({
      utm_source: tracking?.utm_source || 'email',
      utm_medium: tracking?.utm_medium || 'email',
      utm_campaign: tracking?.utm_campaign || 'campaign',
      utm_content: content || tracking?.utm_content || 'product_recommendations'
    });
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  // Limit products for email (max 6 for grid, 4 for list)
  const maxProducts = layout === 'grid' ? 6 : 4;
  const displayProducts = products.slice(0, maxProducts);

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
                    <h2 style="margin: 0 0 10px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.xxxl}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.primary.main};">
                      ${title}
                    </h2>
                  ` : ''}
                  ${subtitle ? `
                    <p style="margin: 0; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.base}; color: ${theme.colors.text.secondary};">
                      ${subtitle}
                    </p>
                  ` : ''}
                </td>
              </tr>
            </table>
          ` : ''}
          
          <!-- Products Container -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            ${layout === 'grid' ? `
              <!-- Grid Layout -->
              ${displayProducts.reduce((rows, product, index) => {
                if (index % 3 === 0) {
                  const rowProducts = displayProducts.slice(index, index + 3);
                  return rows + `
                    <tr>
                      ${rowProducts.map((prod, rowIndex) => `
                        <td width="33.33%" valign="top" style="padding: ${rowIndex > 0 ? '0 0 0 15px' : '0'};">
                          <a href="${addTrackingParams(prod.link, `product_${prod.id}`)}" 
                             style="text-decoration: none; color: inherit; display: block;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                                   style="background-color: ${theme.colors.background.card}; border-radius: ${theme.borderRadius.md}; overflow: hidden; box-shadow: ${theme.shadow.md}; margin-bottom: 20px;">
                              <tr>
                                <td>
                                  <!-- Product Image -->
                                  <div style="width: 100%; height: 160px; overflow: hidden; background-color: ${theme.colors.background.alternateSection}; position: relative;">
                                    <img src="${prod.image}" 
                                         alt="${prod.name}" 
                                         width="100%" 
                                         height="160"
                                         style="display: block; width: 100%; height: 160px; object-fit: cover;" />
                                    ${prod.badge ? `
                                      <div style="position: absolute; top: 8px; left: 8px; background-color: ${theme.colors.badge.sale}; color: ${theme.colors.text.inverse}; padding: 4px 8px; border-radius: ${theme.borderRadius.sm}; font-family: ${theme.typography.fontFamily.primary}; font-size: 11px; font-weight: ${theme.typography.fontWeight.bold}; text-transform: uppercase;">
                                        ${prod.badge}
                                      </div>
                                    ` : ''}
                                  </div>
                                  
                                  <!-- Product Info -->
                                  <div style="padding: 15px;">
                                    <p style="margin: 0 0 5px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.xs}; color: ${theme.colors.text.tertiary}; text-transform: uppercase; letter-spacing: 0.5px;">
                                      ${prod.category}
                                    </p>
                                    <h4 style="margin: 0 0 10px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; font-weight: ${theme.typography.fontWeight.semibold}; color: ${theme.colors.text.primary}; line-height: ${theme.typography.lineHeight.tight};">
                                      ${prod.name}
                                    </h4>
                                    ${prod.price ? `
                                      <div style="margin: 0;">
                                        ${prod.originalPrice ? `
                                          <span style="font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.xs}; color: ${theme.colors.commerce.originalPrice}; text-decoration: line-through; margin-right: 8px;">
                                            ${prod.originalPrice}
                                          </span>
                                        ` : ''}
                                        <span style="font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.commerce.price};">
                                          ${prod.price}
                                        </span>
                                      </div>
                                    ` : ''}
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </a>
                        </td>
                      `).join('')}
                      ${rowProducts.length < 3 ? `<td width="${(3 - rowProducts.length) * 33.33}%" style=""></td>` : ''}
                    </tr>
                  `;
                }
                return rows;
              }, '')}
            ` : `
              <!-- List Layout -->
              ${displayProducts.map((product, index) => `
                <tr>
                  <td style="padding-bottom: ${index < displayProducts.length - 1 ? '20px' : '0'};">
                    <a href="${addTrackingParams(product.link, `product_${product.id}`)}" 
                       style="text-decoration: none; color: inherit; display: block;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                             style="background-color: ${theme.colors.background.card}; border-radius: ${theme.borderRadius.md}; overflow: hidden; box-shadow: ${theme.shadow.md};">
                        <tr>
                          <!-- Product Image -->
                          <td width="120" valign="top" style="padding: 15px 0 15px 15px;">
                            <div style="width: 100px; height: 100px; overflow: hidden; border-radius: ${theme.borderRadius.sm}; background-color: ${theme.colors.background.alternateSection}; position: relative;">
                              <img src="${product.image}" 
                                   alt="${product.name}" 
                                   width="100" 
                                   height="100"
                                   style="display: block; width: 100px; height: 100px; object-fit: cover;" />
                              ${product.badge ? `
                                <div style="position: absolute; top: 4px; left: 4px; background-color: ${theme.colors.badge.sale}; color: ${theme.colors.text.inverse}; padding: 2px 6px; border-radius: ${theme.borderRadius.sm}; font-family: ${theme.typography.fontFamily.primary}; font-size: 9px; font-weight: ${theme.typography.fontWeight.bold}; text-transform: uppercase;">
                                  ${product.badge}
                                </div>
                              ` : ''}
                            </div>
                          </td>
                          
                          <!-- Product Content -->
                          <td valign="top" style="padding: 15px;">
                            <p style="margin: 0 0 5px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.xs}; color: ${theme.colors.text.tertiary}; text-transform: uppercase; letter-spacing: 0.5px;">
                              ${product.category}
                            </p>
                            <h4 style="margin: 0 0 8px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.base}; font-weight: ${theme.typography.fontWeight.semibold}; color: ${theme.colors.text.primary}; line-height: ${theme.typography.lineHeight.tight};">
                              ${product.name}
                            </h4>
                            ${product.price ? `
                              <div style="margin: 0;">
                                ${product.originalPrice ? `
                                  <span style="font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; color: ${theme.colors.commerce.originalPrice}; text-decoration: line-through; margin-right: 10px;">
                                    ${product.originalPrice}
                                  </span>
                                ` : ''}
                                <span style="font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.base}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.commerce.price};">
                                  ${product.price}
                                </span>
                              </div>
                            ` : ''}
                          </td>
                        </tr>
                      </table>
                    </a>
                  </td>
                </tr>
              `).join('')}
            `}
            
            ${viewAllLink ? `
              <!-- View All Button -->
              <tr>
                <td align="center" style="padding-top: 30px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="border-radius: ${theme.borderRadius.sm}; background-color: ${theme.colors.primary.main};">
                        <a href="${addTrackingParams(viewAllLink, 'view_all_products')}" 
                           style="display: inline-block; padding: 14px 28px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.base}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.text.inverse}; text-decoration: none; border-radius: ${theme.borderRadius.sm};">
                          ${viewAllText}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            ` : ''}
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
            <div style="padding: 20px 0;">
              ${title ? `
                <h2 style="margin: 0 0 20px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.xxl}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.primary.main}; text-align: center;">
                  ${title}
                </h2>
              ` : ''}
              
              <!-- Mobile Products -->
              ${displayProducts.map((product, index) => `
                <a href="${addTrackingParams(product.link, `product_${product.id}_mobile`)}" 
                   style="text-decoration: none; color: inherit; display: block; margin-bottom: ${index < displayProducts.length - 1 ? '15px' : '0'};">
                  <div style="background-color: ${theme.colors.background.card}; border-radius: ${theme.borderRadius.sm}; padding: 15px; box-shadow: ${theme.shadow.sm};">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="80" valign="top">
                          <img src="${product.image}" 
                               alt="${product.name}" 
                               width="65" 
                               height="65"
                               style="display: block; width: 65px; height: 65px; border-radius: ${theme.borderRadius.sm}; object-fit: cover;" />
                        </td>
                        <td style="padding-left: 15px;" valign="top">
                          <p style="margin: 0 0 3px; font-family: ${theme.typography.fontFamily.primary}; font-size: 11px; color: ${theme.colors.text.tertiary}; text-transform: uppercase;">
                            ${product.category}
                          </p>
                          <h4 style="margin: 0 0 5px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; font-weight: ${theme.typography.fontWeight.semibold}; color: ${theme.colors.text.primary}; line-height: ${theme.typography.lineHeight.tight};">
                            ${product.name}
                          </h4>
                          ${product.price ? `
                            <p style="margin: 0; font-family: ${theme.typography.fontFamily.primary}; font-size: 13px; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.commerce.price};">
                              ${product.price}
                            </p>
                          ` : ''}
                        </td>
                      </tr>
                    </table>
                  </div>
                </a>
              `).join('')}
              
              ${viewAllLink ? `
                <div style="text-align: center; margin-top: 25px;">
                  <a href="${addTrackingParams(viewAllLink, 'view_all_products_mobile')}" 
                     style="display: inline-block; padding: 12px 24px; background-color: ${theme.colors.primary.main}; color: ${theme.colors.text.inverse}; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; font-weight: ${theme.typography.fontWeight.bold}; text-decoration: none; border-radius: ${theme.borderRadius.sm};">
                    ${viewAllText}
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
    </style>
  `;

  return <div dangerouslySetInnerHTML={{ __html: sectionHtml }} />;
};

export default ProductRecommendations;