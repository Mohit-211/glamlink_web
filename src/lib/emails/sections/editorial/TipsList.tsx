import React from 'react';
import { TrackingParams, EmailTheme } from '../../types';
import { getThemedStyles, getCardStyles, mapLegacyColor } from '../../utils/themeHelper';
import { getDefaultTheme } from '../../utils/themeManager';

interface Tip {
  number: string;
  title: string;
  content: string;
  icon?: string;
}

interface TipsListData {
  type: 'tips-list';
  title?: string;
  subtitle?: string;
  tips: Tip[];
  style?: 'numbered' | 'bulleted' | 'checkmarks';
  backgroundColor?: string;
  accentColor?: string;
}

interface TipsListProps {
  section: TipsListData;
  tracking: TrackingParams;
  theme?: EmailTheme;
}

const TipsList: React.FC<TipsListProps> = ({ section, tracking, theme = getDefaultTheme() }) => {
  const styles = getThemedStyles(theme);
  const {
    title = "Pro Tips",
    subtitle,
    tips = [],
    style = 'numbered',
    backgroundColor = theme.colors.background.card,
    accentColor = theme.colors.primary.main
  } = section;

  // Get the appropriate marker for each tip
  const getMarker = (tip: Tip, index: number) => {
    switch (style) {
      case 'numbered':
        return tip.number || (index + 1).toString();
      case 'bulleted':
        return '•';
      case 'checkmarks':
        return '✓';
      default:
        return (index + 1).toString();
    }
  };

  // Get marker styling
  const getMarkerStyle = () => {
    switch (style) {
      case 'numbered':
        return `display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; background-color: ${accentColor}; color: ${theme.colors.text.inverse}; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; font-weight: ${theme.typography.fontWeight.bold}; border-radius: ${theme.borderRadius.full}; margin-right: 15px; flex-shrink: 0;`;
      case 'bulleted':
        return `display: inline-block; width: 20px; height: 20px; background-color: ${accentColor}; border-radius: 50%; margin-right: 15px; margin-top: 3px; flex-shrink: 0;`;
      case 'checkmarks':
        return `display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; background-color: ${theme.colors.text.success}; color: ${theme.colors.text.inverse}; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.base}; font-weight: ${theme.typography.fontWeight.bold}; border-radius: ${theme.borderRadius.sm}; margin-right: 15px; flex-shrink: 0;`;
      default:
        return `display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; background-color: ${accentColor}; color: ${theme.colors.text.inverse}; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; font-weight: ${theme.typography.fontWeight.bold}; border-radius: ${theme.borderRadius.full}; margin-right: 15px; flex-shrink: 0;`;
    }
  };

  const sectionHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 40px;">
      <tr>
        <td style="padding: 30px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                 style="background-color: ${backgroundColor}; border-radius: ${theme.borderRadius.lg}; box-shadow: ${theme.shadow.md}; overflow: hidden;">
            <tr>
              <td style="padding: 30px;">
                <!-- Header -->
                ${title || subtitle ? `
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 25px;">
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
                
                <!-- Tips List -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  ${tips.map((tip, index) => `
                    <tr>
                      <td style="padding-bottom: ${index < tips.length - 1 ? '20px' : '0'};">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <!-- Marker -->
                            <td width="50" valign="top">
                              ${style === 'bulleted' ? `
                                <div style="${getMarkerStyle()}"></div>
                              ` : `
                                <div style="${getMarkerStyle()}">
                                  ${getMarker(tip, index)}
                                </div>
                              `}
                            </td>
                            
                            <!-- Content -->
                            <td valign="top">
                              <h4 style="margin: 0 0 8px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.lg}; font-weight: ${theme.typography.fontWeight.semibold}; color: ${theme.colors.text.primary}; line-height: ${theme.typography.lineHeight.tight};">
                                ${tip.title}
                              </h4>
                              <p style="margin: 0; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.base}; line-height: ${theme.typography.lineHeight.normal}; color: ${theme.colors.text.primary};">
                                ${tip.content}
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  `).join('')}
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
            <div style="background-color: ${backgroundColor}; border-radius: 8px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
              ${title ? `
                <h2 style="margin: 0 0 20px; font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; color: #1e3a5f; text-align: center;">
                  ${title}
                </h2>
              ` : ''}
              
              <!-- Mobile Tips -->
              ${tips.map((tip, index) => `
                <div style="margin-bottom: ${index < tips.length - 1 ? '20px' : '0'};">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <!-- Mobile Marker -->
                      <td width="40" valign="top">
                        ${style === 'bulleted' ? `
                          <div style="width: 16px; height: 16px; background-color: ${accentColor}; border-radius: 50%; margin-top: 2px;"></div>
                        ` : style === 'checkmarks' ? `
                          <div style="display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; background-color: #27ae60; color: #ffffff; font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; border-radius: 3px;">
                            ✓
                          </div>
                        ` : `
                          <div style="display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; background-color: ${accentColor}; color: #ffffff; font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; border-radius: 50%;">
                            ${getMarker(tip, index)}
                          </div>
                        `}
                      </td>
                      
                      <!-- Mobile Content -->
                      <td valign="top" style="padding-left: 10px;">
                        <h4 style="margin: 0 0 5px; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; color: #333333; line-height: 1.2;">
                          ${tip.title}
                        </h4>
                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4; color: #555555;">
                          ${tip.content}
                        </p>
                      </td>
                    </tr>
                  </table>
                </div>
              `).join('')}
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

export default TipsList;