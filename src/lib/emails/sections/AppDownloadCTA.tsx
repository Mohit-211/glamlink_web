import React from 'react';
import { TrackingParams, EmailTheme } from '../types';
import { getThemedStyles, getCardStyles } from '../utils/themeHelper';
import { getDefaultTheme } from '../utils/themeManager';

interface AppDownloadCTASection {
  type: 'app-download-cta';
  showUserSection?: boolean;
  showProSection?: boolean;
  userTitle?: string;
  userSubtitle?: string;
  userButtonText?: string;
  proTitle?: string;
  proSubtitle?: string;
  proButtonText?: string;
}

interface AppDownloadCTAProps {
  section: AppDownloadCTASection;
  tracking: TrackingParams;
  theme?: EmailTheme;
}

const AppDownloadCTA: React.FC<AppDownloadCTAProps> = ({ section, tracking, theme = getDefaultTheme() }) => {
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

  const showUser = section.showUserSection !== false;
  const showPro = section.showProSection !== false;

  // Default content
  const userTitle = section.userTitle || 'Have you joined Glamlink yet?';
  const userSubtitle = section.userSubtitle || 'Discover beauty experts, services, and products you’ll love.';
  const userButtonText = section.userButtonText || 'Download Glamlink';
  
  const proTitle = section.proTitle || 'Are you a beauty professional?';
  const proSubtitle = section.proSubtitle || 'You need Glamlink Pro - discovery, social, booking, and e-commerce.';
  const proButtonText = section.proButtonText || 'Join Glamlink Pro';

  // When showing both buttons, use black for user and primary color for pro
  // When showing only one, use primary color
  const userButtonBg = showUser && showPro ? '#000000' : theme.colors.primary.main;
  const proButtonBg = theme.colors.primary.main;
  
  // Border colors to match button colors
  const userBorderColor = showUser && showPro ? '#333333' : theme.colors.primary.light;
  const proBorderColor = theme.colors.primary.main;
  
  // Create the section HTML as a string for better email compatibility
  const sectionHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px; background: ${theme.colors.gradient.secondary};">
      <tr>
        <td style="padding: 40px 20px;">
          <!-- Container -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: ${theme.spacing.container}; margin: 0 auto;">
            ${showUser && showPro ? `
              <!-- Two Column Layout for Desktop -->
              <tr>
                ${showUser ? `
                  <!-- User Section -->
                  <td width="48%" valign="top" style="padding-right: 2%;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                           style="${getCardStyles(theme)}; border: 2px solid ${userBorderColor}; padding: 25px; min-height: 200px;">
                      <tr>
                        <td>
                          <h3 style="margin: 0 0 12px; ${styles.headingSmall}">
                            ${userTitle}
                          </h3>
                          <p style="margin: 0 0 20px; ${styles.bodyText}">
                            ${userSubtitle}
                          </p>
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td style="border-radius: ${theme.borderRadius.md}; background-color: ${userButtonBg};">
                                <a href="${addTrackingParams('https://glamlink.net?modal=user', 'app_download_user')}" 
                                   style="display: inline-block; padding: 14px 28px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.base}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.text.inverse}; text-decoration: none; border-radius: ${theme.borderRadius.md};">
                                  ${userButtonText}
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                ` : '<td width="48%"></td>'}
                
                ${showPro ? `
                  <!-- Pro Section -->
                  <td width="48%" valign="top" style="padding-left: 2%;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                           style="${getCardStyles(theme)}; border: 2px solid ${proBorderColor}; padding: 25px; min-height: 200px;">
                      <tr>
                        <td>
                          <h3 style="margin: 0 0 12px; ${styles.headingSmall}">
                            ${proTitle}
                          </h3>
                          <p style="margin: 0 0 20px; ${styles.bodyText}">
                            ${proSubtitle}
                          </p>
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td style="border-radius: ${theme.borderRadius.md}; background-color: ${proButtonBg};">
                                <a href="${addTrackingParams('https://glamlink.net?modal=pro', 'app_download_pro')}" 
                                   style="display: inline-block; padding: 14px 28px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.base}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.text.inverse}; text-decoration: none; border-radius: ${theme.borderRadius.md};">
                                  ${proButtonText}
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                ` : '<td width="48%"></td>'}
              </tr>
            ` : `
              <!-- Single Column Layout -->
              ${showUser ? `
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                           style="${getCardStyles(theme)}; border: 2px solid ${userBorderColor}; padding: 30px; margin-bottom: ${showPro ? '20px' : '0'};">
                      <tr>
                        <td align="center">
                          <h3 style="margin: 0 0 12px; ${styles.headingMedium}; text-align: center;">
                            ${userTitle}
                          </h3>
                          <p style="margin: 0 0 20px; ${styles.bodyText}; text-align: center;">
                            ${userSubtitle}
                          </p>
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td style="border-radius: ${theme.borderRadius.md}; background-color: ${userButtonBg};">
                                <a href="${addTrackingParams('https://glamlink.net?modal=user', 'app_download_user')}" 
                                   style="display: inline-block; padding: 14px 32px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.base}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.text.inverse}; text-decoration: none; border-radius: ${theme.borderRadius.md};">
                                  ${userButtonText}
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              ` : ''}
              
              ${showPro ? `
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                           style="${getCardStyles(theme)}; border: 2px solid ${proBorderColor}; padding: 30px;">
                      <tr>
                        <td align="center">
                          <h3 style="margin: 0 0 12px; ${styles.headingMedium}; text-align: center;">
                            ${proTitle}
                          </h3>
                          <p style="margin: 0 0 20px; ${styles.bodyText}; text-align: center;">
                            ${proSubtitle}
                          </p>
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td style="border-radius: ${theme.borderRadius.md}; background-color: ${proButtonBg};">
                                <a href="${addTrackingParams('https://glamlink.net?modal=pro', 'app_download_pro')}" 
                                   style="display: inline-block; padding: 14px 32px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.base}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.text.inverse}; text-decoration: none; border-radius: ${theme.borderRadius.md};">
                                  ${proButtonText}
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              ` : ''}
            `}
          </table>
          
          <!-- Mobile Version (Stacked) -->
          <!--[if !mso]><!-->
          <div style="display: none; max-height: 0; overflow: hidden;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                   style="display: none;">
              ${showUser ? `
                <tr>
                  <td style="padding: 0 0 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                           style="${getCardStyles(theme)}; border: 2px solid ${userBorderColor}; padding: 25px;">
                      <tr>
                        <td>
                          <h3 style="margin: 0 0 10px; ${styles.headingSmall}">
                            ${userTitle}
                          </h3>
                          <p style="margin: 0 0 15px; ${styles.bodyText}">
                            ${userSubtitle}
                          </p>
                          <a href="${addTrackingParams('https://glamlink.net?modal=user', 'app_download_user_mobile')}" 
                             style="display: inline-block; padding: 12px 24px; background-color: ${userButtonBg}; color: ${theme.colors.text.inverse}; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; font-weight: ${theme.typography.fontWeight.bold}; text-decoration: none; border-radius: ${theme.borderRadius.md};">
                            ${userButtonText}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              ` : ''}
              
              ${showPro ? `
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                           style="${getCardStyles(theme)}; border: 2px solid ${proBorderColor}; padding: 25px;">
                      <tr>
                        <td>
                          <h3 style="margin: 0 0 10px; ${styles.headingSmall}">
                            ${proTitle}
                          </h3>
                          <p style="margin: 0 0 15px; ${styles.bodyText}">
                            ${proSubtitle}
                          </p>
                          <a href="${addTrackingParams('https://glamlink.net?modal=pro', 'app_download_pro_mobile')}" 
                             style="display: inline-block; padding: 12px 24px; background-color: ${proButtonBg}; color: ${theme.colors.text.inverse}; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; font-weight: ${theme.typography.fontWeight.bold}; text-decoration: none; border-radius: ${theme.borderRadius.md};">
                            ${proButtonText}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              ` : ''}
            </table>
          </div>
          <!--<![endif]-->
        </td>
      </tr>
    </table>
    
    <style type="text/css">
      @media only screen and (max-width: 600px) {
        /* Hide desktop version on mobile */
        table[role="presentation"] td[width="48%"] {
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

export default AppDownloadCTA;