import React from 'react';
import { PreviewCTASection, TrackingParams, SecondaryCard, EmailTheme } from '../types';
import { getThemedStyles, getCardStyles } from '../utils/themeHelper';
import { getDefaultTheme } from '../utils/themeManager';

interface PreviewCTAProps {
  section: PreviewCTASection;
  tracking: TrackingParams;
  theme?: EmailTheme;
}

const PreviewCTA: React.FC<PreviewCTAProps> = ({ section, tracking, theme = getDefaultTheme() }) => {
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
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  // Safety check for secondaryCards
  const secondaryCards = section.secondaryCards || [];
  
  console.log('PreviewCTA section data:', {
    hasSecondaryCards: !!section.secondaryCards,
    cardsCount: secondaryCards.length,
    cards: secondaryCards
  });

  // Create the section HTML as a string for better email compatibility
  const sectionHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 40px;">
      <tr>
        <td style="padding: 20px 30px;">
          <!-- Primary Card - Full Width -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                 style="${getCardStyles(theme)}; overflow: hidden; margin-bottom: 20px;">
            <tr>
              <td>
                ${section.primaryLinkUrl ? `
                  <a href="${addTrackingParams(section.primaryLinkUrl, 'primary_content')}" style="text-decoration: none; color: inherit; display: block;">
                ` : ''}
                  <!-- Primary Image Container -->
                  <div style="width: 100%; background-color: ${theme.colors.background.alternateSection};">
                    <img src="${section.primaryImage}" 
                         alt="${section.primaryTitle || 'Featured Content'}" 
                         width="100%" 
                         style="display: block; width: 100%; height: auto;" />
                  </div>
                  
                  <!-- Primary Content -->
                  <div style="padding: 25px;">
                    ${section.primaryTitle ? `
                      <h2 style="margin: 0 0 15px; ${styles.headingMedium}">
                        ${section.primaryTitle}
                      </h2>
                    ` : ''}
                    
                    ${section.primaryDescription ? `
                      <p style="margin: 0 0 20px; ${styles.bodyText}">
                        ${section.primaryDescription}
                      </p>
                    ` : ''}
                    
                    ${section.primaryLinkText ? `
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="border-radius: ${theme.borderRadius.sm}; background-color: ${theme.colors.button.primary.background};">
                            <span style="display: inline-block; padding: 14px 28px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.base}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.button.primary.text}; text-decoration: none; border-radius: ${theme.borderRadius.sm};">
                              ${section.primaryLinkText}
                            </span>
                          </td>
                        </tr>
                      </table>
                    ` : ''}
                  </div>
                ${section.primaryLinkUrl ? '</a>' : ''}
              </td>
            </tr>
          </table>
          
          <!-- Secondary Cards - Each Full Width -->
          ${secondaryCards.map((card: any, index: number) => {
            const isSelected = card.isSelected === true;
            const cardStyle = isSelected 
              ? getCardStyles(theme, 'selected')
              : getCardStyles(theme);
            
            return `
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                   style="${cardStyle}; overflow: hidden; margin-bottom: ${index < secondaryCards.length - 1 ? '15px' : '0'};">
              <tr>
                <td>
                  <a href="${addTrackingParams(card.linkUrl, `secondary_${card.id}`)}" 
                     style="text-decoration: none; color: inherit; display: block;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <!-- Card Image -->
                        <td width="150" valign="top">
                          <img src="${card.image}" 
                               alt="${card.title}" 
                               width="150" 
                               height="150" 
                               style="display: block; width: 150px; height: 150px; object-fit: cover; border-radius: ${theme.borderRadius.md};" />
                        </td>
                        <!-- Card Content -->
                        <td valign="top" style="padding-left: 20px;">
                          <h3 style="margin: 0 0 8px; ${styles.headingSmall}">
                            ${card.title}
                          </h3>
                          <p style="margin: 0 0 12px; ${styles.bodyText}">
                            ${card.description}
                          </p>
                          ${card.linkText ? `
                            <span style="${styles.link}; font-weight: ${theme.typography.fontWeight.semibold};">
                              ${card.linkText} →
                            </span>
                          ` : ''}
                        </td>
                      </tr>
                    </table>
                  </a>
                </td>
              </tr>
            </table>
            `;
          }).join('')}
          
          <!-- Mobile Responsive Styles -->
          <style>
            @media only screen and (max-width: 600px) {
              td[width="150"] {
                width: 100% !important;
                display: block !important;
              }
              td[width="150"] img {
                width: 100% !important;
                height: auto !important;
              }
              td[valign="top"] {
                display: block !important;
                padding-left: 0 !important;
                padding-top: 15px !important;
              }
            }
          </style>
        </td>
      </tr>
    </table>
  `;

  return <div dangerouslySetInnerHTML={{ __html: sectionHtml }} />;
};

export default PreviewCTA;