import React from 'react';
import { TrackingParams } from '../../types';

interface Stat {
  value: string;
  label: string;
  icon?: string;
  color?: string;
}

interface CTAWithStatsData {
  type: 'cta-with-stats';
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText: string;
  ctaUrl: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  stats: Stat[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  backgroundColor?: string;
  ctaBackgroundColor?: string;
  statsBackgroundColor?: string;
  showIcons?: boolean;
}

interface CTAWithStatsProps {
  section: CTAWithStatsData;
  tracking: TrackingParams;
}

const CTAWithStats: React.FC<CTAWithStatsProps> = ({ section, tracking }) => {
  const {
    title = "Ready to Get Started?",
    subtitle,
    description,
    ctaText,
    ctaUrl,
    secondaryCtaText,
    secondaryCtaUrl,
    stats = [],
    layout = 'horizontal',
    backgroundColor = '#f8f9fa',
    ctaBackgroundColor = '#1e3a5f',
    statsBackgroundColor = '#ffffff',
    showIcons = true
  } = section;

  // Helper function to add UTM parameters to URLs
  const addTrackingParams = (url: string, content?: string) => {
    if (!url) return '#';
    const params = new URLSearchParams({
      utm_source: tracking?.utm_source || 'email',
      utm_medium: tracking?.utm_medium || 'email',
      utm_campaign: tracking?.utm_campaign || 'campaign',
      utm_content: content || tracking?.utm_content || 'cta_with_stats'
    });
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  if (!ctaText || !ctaUrl) return null;

  const isVerticalLayout = layout === 'vertical';
  const isGridLayout = layout === 'grid';
  const hasStats = stats && stats.length > 0;

  const sectionHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 40px;">
      <tr>
        <td style="padding: 30px; background-color: ${backgroundColor};">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                 style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
            ${isVerticalLayout ? `
              <!-- Vertical Layout: CTA First, Then Stats -->
              <tr>
                <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, ${ctaBackgroundColor} 0%, #2c5aa0 100%); color: white;">
                  <!-- CTA Section -->
                  ${title ? `
                    <h2 style="margin: 0 0 12px; font-family: Arial, sans-serif; font-size: 32px; font-weight: bold; color: #ffffff; line-height: 1.2;">
                      ${title}
                    </h2>
                  ` : ''}
                  ${subtitle ? `
                    <h3 style="margin: 0 0 16px; font-family: Arial, sans-serif; font-size: 20px; font-weight: 500; color: rgba(255,255,255,0.9);">
                      ${subtitle}
                    </h3>
                  ` : ''}
                  ${description ? `
                    <p style="margin: 0 0 24px; font-family: Arial, sans-serif; font-size: 16px; color: rgba(255,255,255,0.9); line-height: 1.5; max-width: 500px; margin-left: auto; margin-right: auto;">
                      ${description}
                    </p>
                  ` : ''}
                  
                  <!-- CTA Buttons -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                    <tr>
                      <td style="padding-right: ${secondaryCtaUrl ? '10px' : '0'};">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="border-radius: 8px; background-color: #ffffff;">
                              <a href="${addTrackingParams(ctaUrl, 'primary_cta')}" 
                                 style="display: inline-block; padding: 16px 32px; font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: ${ctaBackgroundColor}; text-decoration: none; border-radius: 8px;">
                                ${ctaText}
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                      ${secondaryCtaUrl ? `
                        <td>
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td style="border-radius: 8px; background-color: transparent; border: 2px solid rgba(255,255,255,0.5);">
                                <a href="${addTrackingParams(secondaryCtaUrl, 'secondary_cta')}" 
                                   style="display: inline-block; padding: 14px 32px; font-family: Arial, sans-serif; font-size: 18px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
                                  ${secondaryCtaText}
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      ` : ''}
                    </tr>
                  </table>
                </td>
              </tr>
              
              ${hasStats ? `
                <!-- Stats Section -->
                <tr>
                  <td style="padding: 30px; background-color: ${statsBackgroundColor};">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        ${stats.map((stat, index) => `
                          <td width="${100 / stats.length}%" align="center" valign="top" style="padding: 0 15px;">
                            <div style="text-align: center;">
                              ${showIcons && stat.icon ? `
                                <div style="margin-bottom: 8px; font-size: 24px; color: ${stat.color || '#1e3a5f'};">
                                  ${stat.icon}
                                </div>
                              ` : ''}
                              <h3 style="margin: 0 0 4px; font-family: Arial, sans-serif; font-size: 28px; font-weight: bold; color: ${stat.color || '#1e3a5f'};">
                                ${stat.value}
                              </h3>
                              <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">
                                ${stat.label}
                              </p>
                            </div>
                          </td>
                        `).join('')}
                      </tr>
                    </table>
                  </td>
                </tr>
              ` : ''}
            ` : `
              <!-- Horizontal Layout: Side by Side -->
              <tr>
                <td style="padding: 40px 30px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <!-- CTA Section -->
                      <td width="${hasStats ? '60%' : '100%'}" valign="middle" style="padding-right: ${hasStats ? '30px' : '0'};">
                        ${title ? `
                          <h2 style="margin: 0 0 12px; font-family: Arial, sans-serif; font-size: 28px; font-weight: bold; color: #1e3a5f; line-height: 1.2;">
                            ${title}
                          </h2>
                        ` : ''}
                        ${subtitle ? `
                          <h3 style="margin: 0 0 16px; font-family: Arial, sans-serif; font-size: 18px; font-weight: 500; color: #666666;">
                            ${subtitle}
                          </h3>
                        ` : ''}
                        ${description ? `
                          <p style="margin: 0 0 24px; font-family: Arial, sans-serif; font-size: 16px; color: #666666; line-height: 1.5;">
                            ${description}
                          </p>
                        ` : ''}
                        
                        <!-- CTA Buttons -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="padding-right: ${secondaryCtaUrl ? '10px' : '0'};">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                  <td style="border-radius: 8px; background-color: ${ctaBackgroundColor};">
                                    <a href="${addTrackingParams(ctaUrl, 'primary_cta')}" 
                                       style="display: inline-block; padding: 16px 28px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 8px;">
                                      ${ctaText}
                                    </a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            ${secondaryCtaUrl ? `
                              <td>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                  <tr>
                                    <td style="border-radius: 8px; background-color: transparent; border: 2px solid ${ctaBackgroundColor};">
                                      <a href="${addTrackingParams(secondaryCtaUrl, 'secondary_cta')}" 
                                         style="display: inline-block; padding: 14px 28px; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; color: ${ctaBackgroundColor}; text-decoration: none; border-radius: 8px;">
                                        ${secondaryCtaText}
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            ` : ''}
                          </tr>
                        </table>
                      </td>
                      
                      ${hasStats ? `
                        <!-- Stats Section -->
                        <td width="40%" valign="middle" style="padding-left: 30px; border-left: 1px solid #e9ecef;">
                          ${isGridLayout ? `
                            <!-- Grid Layout for Stats -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              ${stats.map((stat, index) => {
                                if (index % 2 === 0) {
                                  const nextStat = stats[index + 1];
                                  return `
                                    <tr>
                                      <td width="50%" align="center" style="padding: 10px;">
                                        <div style="text-align: center;">
                                          ${showIcons && stat.icon ? `
                                            <div style="margin-bottom: 6px; font-size: 20px; color: ${stat.color || '#1e3a5f'};">
                                              ${stat.icon}
                                            </div>
                                          ` : ''}
                                          <h4 style="margin: 0 0 3px; font-family: Arial, sans-serif; font-size: 22px; font-weight: bold; color: ${stat.color || '#1e3a5f'};">
                                            ${stat.value}
                                          </h4>
                                          <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 0.3px;">
                                            ${stat.label}
                                          </p>
                                        </div>
                                      </td>
                                      ${nextStat ? `
                                        <td width="50%" align="center" style="padding: 10px;">
                                          <div style="text-align: center;">
                                            ${showIcons && nextStat.icon ? `
                                              <div style="margin-bottom: 6px; font-size: 20px; color: ${nextStat.color || '#1e3a5f'};">
                                                ${nextStat.icon}
                                              </div>
                                            ` : ''}
                                            <h4 style="margin: 0 0 3px; font-family: Arial, sans-serif; font-size: 22px; font-weight: bold; color: ${nextStat.color || '#1e3a5f'};">
                                              ${nextStat.value}
                                            </h4>
                                            <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 0.3px;">
                                              ${nextStat.label}
                                            </p>
                                          </div>
                                        </td>
                                      ` : '<td width="50%"></td>'}
                                    </tr>
                                  `;
                                }
                                return '';
                              }).filter(Boolean).join('')}
                            </table>
                          ` : `
                            <!-- Vertical Layout for Stats -->
                            ${stats.map((stat, index) => `
                              <div style="text-align: center; margin-bottom: ${index < stats.length - 1 ? '20px' : '0'};">
                                ${showIcons && stat.icon ? `
                                  <div style="margin-bottom: 8px; font-size: 24px; color: ${stat.color || '#1e3a5f'};">
                                    ${stat.icon}
                                  </div>
                                ` : ''}
                                <h4 style="margin: 0 0 4px; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; color: ${stat.color || '#1e3a5f'};">
                                  ${stat.value}
                                </h4>
                                <p style="margin: 0; font-family: Arial, sans-serif; font-size: 13px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">
                                  ${stat.label}
                                </p>
                              </div>
                            `).join('')}
                          `}
                        </td>
                      ` : ''}
                    </tr>
                  </table>
                </td>
              </tr>
            `}
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
            <div style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 3px 8px rgba(0,0,0,0.1);">
              <!-- Mobile CTA Section -->
              <div style="padding: 30px 25px; text-align: center; background: linear-gradient(135deg, ${ctaBackgroundColor} 0%, #2c5aa0 100%); color: white;">
                ${title ? `
                  <h2 style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; color: #ffffff; line-height: 1.2;">
                    ${title}
                  </h2>
                ` : ''}
                ${subtitle ? `
                  <h3 style="margin: 0 0 12px; font-family: Arial, sans-serif; font-size: 16px; font-weight: 500; color: rgba(255,255,255,0.9);">
                    ${subtitle}
                  </h3>
                ` : ''}
                ${description ? `
                  <p style="margin: 0 0 20px; font-family: Arial, sans-serif; font-size: 14px; color: rgba(255,255,255,0.9); line-height: 1.5;">
                    ${description}
                  </p>
                ` : ''}
                
                <!-- Mobile CTA Buttons -->
                <div style="margin-bottom: ${secondaryCtaUrl ? '10px' : '0'};">
                  <a href="${addTrackingParams(ctaUrl, 'primary_cta_mobile')}" 
                     style="display: inline-block; padding: 14px 24px; background-color: #ffffff; color: ${ctaBackgroundColor}; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 6px; width: 80%; max-width: 200px;">
                    ${ctaText}
                  </a>
                </div>
                ${secondaryCtaUrl ? `
                  <div>
                    <a href="${addTrackingParams(secondaryCtaUrl, 'secondary_cta_mobile')}" 
                       style="display: inline-block; padding: 12px 24px; border: 2px solid rgba(255,255,255,0.5); color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 6px;">
                      ${secondaryCtaText}
                    </a>
                  </div>
                ` : ''}
              </div>
              
              ${hasStats ? `
                <!-- Mobile Stats Section -->
                <div style="padding: 25px; background-color: ${statsBackgroundColor};">
                  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                    ${stats.map(stat => `
                      <div style="text-align: center;">
                        ${showIcons && stat.icon ? `
                          <div style="margin-bottom: 6px; font-size: 20px; color: ${stat.color || '#1e3a5f'};">
                            ${stat.icon}
                          </div>
                        ` : ''}
                        <h4 style="margin: 0 0 3px; font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; color: ${stat.color || '#1e3a5f'};">
                          ${stat.value}
                        </h4>
                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 0.3px;">
                          ${stat.label}
                        </p>
                      </div>
                    `).join('')}
                  </div>
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

export default CTAWithStats;