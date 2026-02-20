import React from 'react';
import { TrackingParams, EmailTheme } from '../../types';
import { getThemedStyles, getCardStyles, mapLegacyColor } from '../../utils/themeHelper';
import { getDefaultTheme } from '../../utils/themeManager';

interface QuoteSectionData {
  type: 'quote';
  quote: string;
  author?: string;
  authorTitle?: string;
  style?: 'inline' | 'decorative';
  textColor?: string;
  alignment?: 'left' | 'center' | 'right';
  backgroundImage?: string;
  backgroundColor?: string;
}

interface QuoteSectionProps {
  section: QuoteSectionData;
  tracking: TrackingParams;
  theme?: EmailTheme;
}

const QuoteSection: React.FC<QuoteSectionProps> = ({ section, tracking, theme = getDefaultTheme() }) => {
  const styles = getThemedStyles(theme);
  const {
    quote,
    author,
    authorTitle,
    style = 'decorative',
    textColor,
    alignment = 'center',
    backgroundImage,
    backgroundColor = theme.colors.background.alternateSection
  } = section;

  // Determine text colors based on background
  const hasBackground = backgroundImage || backgroundColor !== theme.colors.background.alternateSection;
  const defaultTextColor = hasBackground ? theme.colors.text.inverse : theme.colors.text.primary;
  const quoteColor = textColor || defaultTextColor;
  const authorColor = hasBackground ? theme.colors.text.inverse : theme.colors.text.secondary;
  const quoteMarkColor = hasBackground ? theme.colors.overlay.light : theme.colors.overlay.primary;

  // Background styling
  const backgroundStyle = backgroundImage 
    ? `background-image: url('${backgroundImage}'); background-size: cover; background-position: center;`
    : `background-color: ${backgroundColor};`;

  // Text alignment
  const textAlign = alignment === 'center' ? 'center' : alignment === 'right' ? 'right' : 'left';

  const sectionHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 40px;">
      <tr>
        <td style="padding: 30px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                 style="border-radius: ${theme.borderRadius.lg}; overflow: hidden; ${backgroundStyle}">
            ${backgroundImage ? `
              <!-- Background overlay for readability -->
              <tr>
                <td style="background: ${theme.colors.overlay.dark}; padding: 40px 30px;">
            ` : `
              <tr>
                <td style="padding: 40px 30px;">
            `}
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="${textAlign}">
                        <!-- Quote Content -->
                        ${style === 'decorative' ? `
                          <!-- Decorative Quote Style -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="position: relative;">
                                <!-- Opening Quote Mark -->
                                <div style="margin-bottom: 20px;">
                                  <span style="font-family: ${theme.typography.fontFamily.secondary}; font-size: 48px; color: ${quoteMarkColor}; line-height: 1;">&ldquo;</span>
                                </div>
                                
                                <!-- Quote Text -->
                                <p style="margin: 0; font-family: ${theme.typography.fontFamily.secondary}; font-style: italic; font-size: ${theme.typography.fontSize.xxl}; line-height: ${theme.typography.lineHeight.tight}; color: ${quoteColor}; text-align: ${textAlign};">
                                  ${quote}
                                </p>
                                
                                <!-- Closing Quote Mark -->
                                <div style="text-align: right; margin-top: 20px;">
                                  <span style="font-family: ${theme.typography.fontFamily.secondary}; font-size: 48px; color: ${quoteMarkColor}; line-height: 1;">&rdquo;</span>
                                </div>
                              </td>
                            </tr>
                          </table>
                        ` : `
                          <!-- Inline Quote Style -->
                          <p style="margin: 0; font-family: ${theme.typography.fontFamily.secondary}; font-size: ${theme.typography.fontSize.xxl}; line-height: ${theme.typography.lineHeight.normal}; color: ${quoteColor}; text-align: ${textAlign};">
                            &ldquo;${quote}&rdquo;
                          </p>
                        `}
                        
                        ${author || authorTitle ? `
                          <!-- Author Attribution -->
                          <div style="margin-top: 30px; text-align: ${textAlign};">
                            ${author ? `
                              <p style="margin: 0 0 5px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.base}; font-weight: ${theme.typography.fontWeight.semibold}; color: ${quoteColor};">
                                &mdash; ${author}
                              </p>
                            ` : ''}
                            ${authorTitle ? `
                              <p style="margin: 0; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; color: ${authorColor};">
                                ${authorTitle}
                              </p>
                            ` : ''}
                          </div>
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
            <div style="padding: 30px 20px; border-radius: ${theme.borderRadius.md}; ${backgroundStyle}">
              ${backgroundImage ? `
                <div style="background: ${theme.colors.overlay.dark}; padding: 20px; border-radius: ${theme.borderRadius.md};">
              ` : ''}
                <!-- Mobile Quote -->
                <p style="margin: 0; font-family: ${theme.typography.fontFamily.secondary}; font-size: ${theme.typography.fontSize.lg}; line-height: ${theme.typography.lineHeight.normal}; color: ${quoteColor}; text-align: center;">
                  &ldquo;${quote}&rdquo;
                </p>
                
                ${author || authorTitle ? `
                  <!-- Mobile Author -->
                  <div style="margin-top: 20px; text-align: center;">
                    ${author ? `
                      <p style="margin: 0 0 3px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; font-weight: ${theme.typography.fontWeight.semibold}; color: ${quoteColor};">
                        &mdash; ${author}
                      </p>
                    ` : ''}
                    ${authorTitle ? `
                      <p style="margin: 0; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.xs}; color: ${authorColor};">
                        ${authorTitle}
                      </p>
                    ` : ''}
                  </div>
                ` : ''}
              ${backgroundImage ? '</div>' : ''}
            </div>
          </td>
        </tr>
      </table>
    </div>
    <!--<![endif]-->

    <style type="text/css">
      @media only screen and (max-width: 600px) {
        /* Hide desktop version on mobile */
        table[role="presentation"] {
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

export default QuoteSection;