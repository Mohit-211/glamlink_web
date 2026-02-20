import React from 'react';
import { TrackingParams, EmailTheme } from '../../types';
import { getThemedStyles, getCardStyles, mapLegacyColor } from '../../utils/themeHelper';
import { getDefaultTheme } from '../../utils/themeManager';

interface AuthorSignatureData {
  type: 'author-signature';
  authorName: string;
  authorTitle: string;
  authorImage?: string;
  authorBio?: string;
  socialLinks?: {
    platform: string;
    url: string;
    handle: string;
  }[];
  backgroundColor?: string;
}

interface AuthorSignatureProps {
  section: AuthorSignatureData;
  tracking: TrackingParams;
  theme?: EmailTheme;
}

const AuthorSignature: React.FC<AuthorSignatureProps> = ({ section, tracking, theme = getDefaultTheme() }) => {
  const styles = getThemedStyles(theme);
  const {
    authorName,
    authorTitle,
    authorImage,
    authorBio,
    socialLinks = [],
    backgroundColor = theme.colors.background.card
  } = section;

  // Helper function to add UTM parameters to URLs
  const addTrackingParams = (url: string, content?: string) => {
    if (!url) return '#';
    const params = new URLSearchParams({
      utm_source: tracking?.utm_source || 'email',
      utm_medium: tracking?.utm_medium || 'email',
      utm_campaign: tracking?.utm_campaign || 'campaign',
      utm_content: content || tracking?.utm_content || 'author_signature'
    });
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  const sectionHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 40px;">
      <tr>
        <td style="padding: 20px 30px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                 style="background-color: ${backgroundColor}; border-radius: ${theme.borderRadius.lg}; box-shadow: ${theme.shadow.md}; overflow: hidden;">
            <tr>
              <td style="padding: 30px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    ${authorImage ? `
                      <!-- Author Image -->
                      <td width="120" valign="top" style="padding-right: 20px;">
                        <img src="${authorImage}" 
                             alt="${authorName}" 
                             width="100" 
                             height="100"
                             style="display: block; width: 100px; height: 100px; border-radius: ${theme.borderRadius.md}; object-fit: cover; border: 3px solid ${theme.colors.border.light};" />
                      </td>
                    ` : ''}
                    
                    <!-- Author Content -->
                    <td valign="top">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td>
                            <!-- Author Name -->
                            <h3 style="margin: 0 0 5px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.xl}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.primary.main};">
                              ${authorName}
                            </h3>
                            
                            <!-- Author Title -->
                            <p style="margin: 0 0 15px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; font-weight: ${theme.typography.fontWeight.semibold}; color: ${theme.colors.text.secondary}; text-transform: uppercase; letter-spacing: 1px;">
                              ${authorTitle}
                            </p>
                            
                            ${authorBio ? `
                              <!-- Author Bio -->
                              <p style="margin: 0 0 20px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.base}; line-height: ${theme.typography.lineHeight.normal}; color: ${theme.colors.text.primary};">
                                ${authorBio}
                              </p>
                            ` : ''}
                            
                            ${socialLinks.length > 0 ? `
                              <!-- Social Links -->
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                  ${socialLinks.map((social, index) => `
                                    <td style="padding-right: ${index < socialLinks.length - 1 ? '15px' : '0'};">
                                      <a href="${addTrackingParams(social.url, `social_${social.platform}`)}" 
                                         style="display: inline-block; padding: 8px 16px; background-color: ${theme.colors.primary.main}; color: ${theme.colors.text.inverse}; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.xs}; font-weight: ${theme.typography.fontWeight.semibold}; text-decoration: none; border-radius: ${theme.borderRadius.sm}; text-transform: uppercase; letter-spacing: 0.5px;">
                                        ${social.platform}
                                      </a>
                                    </td>
                                  `).join('')}
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
            <div style="background-color: ${backgroundColor}; border-radius: ${theme.borderRadius.md}; padding: 20px; box-shadow: ${theme.shadow.md};">
              ${authorImage ? `
                <!-- Mobile Author Image -->
                <div style="text-align: center; margin-bottom: 15px;">
                  <img src="${authorImage}" 
                       alt="${authorName}" 
                       width="80" 
                       height="80"
                       style="display: inline-block; width: 80px; height: 80px; border-radius: ${theme.borderRadius.sm}; object-fit: cover; border: 2px solid ${theme.colors.border.light};" />
                </div>
              ` : ''}
              
              <!-- Mobile Author Info -->
              <div style="text-align: center;">
                <h3 style="margin: 0 0 5px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.lg}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.primary.main};">
                  ${authorName}
                </h3>
                <p style="margin: 0 0 15px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.xs}; font-weight: ${theme.typography.fontWeight.semibold}; color: ${theme.colors.text.secondary}; text-transform: uppercase; letter-spacing: 1px;">
                  ${authorTitle}
                </p>
                
                ${authorBio ? `
                  <p style="margin: 0 0 20px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; line-height: ${theme.typography.lineHeight.tight}; color: ${theme.colors.text.primary}; text-align: center;">
                    ${authorBio}
                  </p>
                ` : ''}
                
                ${socialLinks.length > 0 ? `
                  <!-- Mobile Social Links -->
                  <div style="text-align: center;">
                    ${socialLinks.map((social, index) => `
                      <a href="${addTrackingParams(social.url, `social_${social.platform}_mobile`)}" 
                         style="display: inline-block; margin: 0 5px 10px; padding: 6px 12px; background-color: ${theme.colors.primary.main}; color: ${theme.colors.text.inverse}; font-family: ${theme.typography.fontFamily.primary}; font-size: 11px; font-weight: ${theme.typography.fontWeight.semibold}; text-decoration: none; border-radius: ${theme.borderRadius.sm}; text-transform: uppercase;">
                        ${social.platform}
                      </a>
                    `).join('')}
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

export default AuthorSignature;