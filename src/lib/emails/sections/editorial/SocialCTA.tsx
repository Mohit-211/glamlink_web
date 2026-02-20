import React from 'react';
import { TrackingParams, EmailTheme } from '../../types';
import { getThemedStyles, getCardStyles, mapLegacyColor, getSocialColor } from '../../utils/themeHelper';
import { getDefaultTheme } from '../../utils/themeManager';

interface SocialLink {
  platform: string;
  url: string;
  handle: string;
  icon?: string;
}

interface SocialCTAData {
  type: 'social-cta';
  title?: string;
  subtitle?: string;
  description?: string;
  socialLinks: SocialLink[];
  qrCode?: string;
  ctaText?: string;
  ctaUrl?: string;
  backgroundColor?: string;
  style?: 'centered' | 'split';
}

interface SocialCTAProps {
  section: SocialCTAData;
  tracking: TrackingParams;
  theme?: EmailTheme;
}

const SocialCTA: React.FC<SocialCTAProps> = ({ section, tracking, theme = getDefaultTheme() }) => {
  const styles = getThemedStyles(theme);
  const {
    title = "Follow Us",
    subtitle,
    description,
    socialLinks = [],
    qrCode,
    ctaText = "Follow Now",
    ctaUrl,
    backgroundColor = theme.colors.primary.main,
    style = 'centered'
  } = section;

  // Helper function to add UTM parameters to URLs
  const addTrackingParams = (url: string, content?: string) => {
    if (!url) return '#';
    const params = new URLSearchParams({
      utm_source: tracking?.utm_source || 'email',
      utm_medium: tracking?.utm_medium || 'email',
      utm_campaign: tracking?.utm_campaign || 'campaign',
      utm_content: content || tracking?.utm_content || 'social_cta'
    });
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  // Platform-specific colors using theme
  const getPlatformColor = (platform: string) => {
    return getSocialColor(theme, platform);
  };

  const sectionHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 40px;">
      <tr>
        <td style="padding: 30px; background-color: ${backgroundColor};">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                 style="border-radius: ${theme.borderRadius.lg}; overflow: hidden;">
            <tr>
              <td style="padding: 40px 30px;">
                ${style === 'split' && qrCode ? `
                  <!-- Split Layout with QR Code -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <!-- Content Column -->
                      <td width="60%" valign="middle" style="padding-right: 30px;">
                        ${title ? `
                          <h2 style="margin: 0 0 15px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.xxxl}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.text.inverse};">
                            ${title}
                          </h2>
                        ` : ''}
                        ${subtitle ? `
                          <h3 style="margin: 0 0 15px; font-family: Arial, sans-serif; font-size: 18px; font-weight: 600; color: rgba(255,255,255,0.9);">
                            ${subtitle}
                          </h3>
                        ` : ''}
                        ${description ? `
                          <p style="margin: 0 0 25px; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: rgba(255,255,255,0.8);">
                            ${description}
                          </p>
                        ` : ''}
                        
                        <!-- Social Links -->
                        ${socialLinks.length > 0 ? `
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              ${socialLinks.map((social, index) => `
                                <td style="padding-right: ${index < socialLinks.length - 1 ? '12px' : '0'}; padding-bottom: 10px;">
                                  <a href="${addTrackingParams(social.url, `social_${social.platform}`)}" 
                                     style="display: inline-block; padding: 10px 16px; background-color: ${getPlatformColor(social.platform)}; color: ${theme.colors.text.inverse}; font-family: ${theme.typography.fontFamily.primary}; font-size: 13px; font-weight: ${theme.typography.fontWeight.semibold}; text-decoration: none; border-radius: ${theme.borderRadius.sm}; text-transform: capitalize;">
                                    ${social.platform}
                                  </a>
                                </td>
                              `).join('')}
                            </tr>
                          </table>
                        ` : ''}
                      </td>
                      
                      <!-- QR Code Column -->
                      <td width="40%" valign="middle" align="center">
                        <div style="background-color: ${theme.colors.background.card}; padding: 20px; border-radius: ${theme.borderRadius.lg}; display: inline-block;">
                          <img src="${qrCode}" 
                               alt="QR Code to follow us" 
                               width="120" 
                               height="120"
                               style="display: block; width: 120px; height: 120px;" />
                          <p style="margin: 10px 0 0; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.xs}; color: ${theme.colors.text.secondary}; text-align: center;">
                            Scan to follow
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>
                ` : `
                  <!-- Centered Layout -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center">
                        ${title ? `
                          <h2 style="margin: 0 0 15px; font-family: Arial, sans-serif; font-size: 28px; font-weight: bold; color: #ffffff;">
                            ${title}
                          </h2>
                        ` : ''}
                        ${subtitle ? `
                          <h3 style="margin: 0 0 15px; font-family: Arial, sans-serif; font-size: 18px; font-weight: 600; color: rgba(255,255,255,0.9);">
                            ${subtitle}
                          </h3>
                        ` : ''}
                        ${description ? `
                          <p style="margin: 0 0 25px; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: rgba(255,255,255,0.8); max-width: 400px;">
                            ${description}
                          </p>
                        ` : ''}
                        
                        ${qrCode ? `
                          <!-- QR Code -->
                          <div style="margin: 0 0 25px;">
                            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; display: inline-block;">
                              <img src="${qrCode}" 
                                   alt="QR Code to follow us" 
                                   width="100" 
                                   height="100"
                                   style="display: block; width: 100px; height: 100px;" />
                            </div>
                          </div>
                        ` : ''}
                        
                        <!-- Social Links -->
                        ${socialLinks.length > 0 ? `
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                            <tr>
                              ${socialLinks.map((social, index) => `
                                <td style="padding: 0 8px;">
                                  <a href="${addTrackingParams(social.url, `social_${social.platform}`)}" 
                                     style="display: inline-block; padding: 12px 20px; background-color: ${getPlatformColor(social.platform)}; color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 6px; text-transform: capitalize;">
                                    ${social.platform}
                                  </a>
                                </td>
                              `).join('')}
                            </tr>
                          </table>
                        ` : ''}
                        
                        ${ctaUrl ? `
                          <!-- Main CTA -->
                          <div style="margin-top: 25px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                              <tr>
                                <td style="border-radius: 6px; background-color: #ffffff;">
                                  <a href="${addTrackingParams(ctaUrl, 'main_cta')}" 
                                     style="display: inline-block; padding: 16px 32px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: ${backgroundColor}; text-decoration: none; border-radius: 6px;">
                                    ${ctaText}
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </div>
                        ` : ''}
                      </td>
                    </tr>
                  </table>
                `}
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
            <div style="padding: 30px 20px; border-radius: 8px; text-align: center;">
              ${title ? `
                <h2 style="margin: 0 0 15px; font-family: Arial, sans-serif; font-size: 22px; font-weight: bold; color: #ffffff;">
                  ${title}
                </h2>
              ` : ''}
              ${description ? `
                <p style="margin: 0 0 20px; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4; color: rgba(255,255,255,0.8);">
                  ${description}
                </p>
              ` : ''}
              
              ${qrCode ? `
                <div style="margin: 0 0 20px;">
                  <div style="background-color: #ffffff; padding: 12px; border-radius: 6px; display: inline-block;">
                    <img src="${qrCode}" 
                         alt="QR Code to follow us" 
                         width="80" 
                         height="80"
                         style="display: block; width: 80px; height: 80px;" />
                  </div>
                </div>
              ` : ''}
              
              <!-- Mobile Social Links -->
              ${socialLinks.length > 0 ? `
                <div style="margin-bottom: 20px;">
                  ${socialLinks.map((social, index) => `
                    <a href="${addTrackingParams(social.url, `social_${social.platform}_mobile`)}" 
                       style="display: inline-block; margin: 0 4px 8px; padding: 8px 16px; background-color: ${getPlatformColor(social.platform)}; color: #ffffff; font-family: Arial, sans-serif; font-size: 12px; font-weight: 600; text-decoration: none; border-radius: 4px; text-transform: capitalize;">
                      ${social.platform}
                    </a>
                  `).join('')}
                </div>
              ` : ''}
              
              ${ctaUrl ? `
                <a href="${addTrackingParams(ctaUrl, 'main_cta_mobile')}" 
                   style="display: inline-block; padding: 12px 24px; background-color: #ffffff; color: ${backgroundColor}; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 6px;">
                  ${ctaText}
                </a>
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

export default SocialCTA;