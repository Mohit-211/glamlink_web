import React from 'react';
import { TrackingParams } from '../../types';

interface ModalFeature {
  icon: string;
  title: string;
  description: string;
}

interface DarkCTAModalData {
  type: 'dark-cta-modal';
  title: string;
  subtitle?: string;
  description?: string;
  ctaText: string;
  ctaUrl: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  heroImage?: string;
  features?: ModalFeature[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    avatar?: string;
  };
  backgroundColor?: string;
  accentColor?: string;
  urgencyText?: string;
  badge?: string;
}

interface DarkCTAModalProps {
  section: DarkCTAModalData;
  tracking: TrackingParams;
}

const DarkCTAModal: React.FC<DarkCTAModalProps> = ({ section, tracking }) => {
  const {
    title,
    subtitle,
    description,
    ctaText,
    ctaUrl,
    secondaryCtaText,
    secondaryCtaUrl,
    heroImage,
    features = [],
    testimonial,
    backgroundColor = '#0d1117',
    accentColor = '#58a6ff',
    urgencyText,
    badge
  } = section;

  // Helper function to add UTM parameters to URLs
  const addTrackingParams = (url: string, content?: string) => {
    if (!url) return '#';
    const params = new URLSearchParams({
      utm_source: tracking?.utm_source || 'email',
      utm_medium: tracking?.utm_medium || 'email',
      utm_campaign: tracking?.utm_campaign || 'campaign',
      utm_content: content || tracking?.utm_content || 'dark_cta_modal'
    });
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  if (!title || !ctaText || !ctaUrl) return null;

  const sectionHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 40px;">
      <tr>
        <td style="padding: 40px 30px; background: linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%);">
          <!-- Modal Container -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
            <tr>
              <td style="background: linear-gradient(135deg, ${backgroundColor} 0%, #161b22 100%); border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1); overflow: hidden; position: relative;">
                
                ${heroImage ? `
                  <!-- Hero Image Section -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td style="position: relative; height: 200px; overflow: hidden; background: linear-gradient(135deg, ${accentColor} 0%, #7c3aed 100%);">
                        <img src="${heroImage}" 
                             alt="Hero" 
                             width="100%" 
                             height="200"
                             style="display: block; width: 100%; height: 200px; object-fit: cover; opacity: 0.8;" />
                        
                        <!-- Gradient Overlay -->
                        <div style="position: absolute; inset: 0; background: linear-gradient(135deg, rgba(88, 166, 255, 0.8) 0%, rgba(124, 58, 237, 0.8) 100%);"></div>
                        
                        ${badge ? `
                          <!-- Badge -->
                          <div style="position: absolute; top: 20px; left: 20px;">
                            <span style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); color: #ffffff; padding: 8px 16px; border-radius: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid rgba(255,255,255,0.2);">
                              ${badge}
                            </span>
                          </div>
                        ` : ''}
                        
                        ${urgencyText ? `
                          <!-- Urgency Badge -->
                          <div style="position: absolute; top: 20px; right: 20px;">
                            <span style="background: linear-gradient(135deg, #ff6b6b 0%, #ffc107 100%); color: #ffffff; padding: 6px 12px; border-radius: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);">
                              ⚡ ${urgencyText}
                            </span>
                          </div>
                        ` : ''}
                      </td>
                    </tr>
                  </table>
                ` : ''}
                
                <!-- Main Content -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: ${heroImage ? '40px 40px 20px' : '50px 40px 20px'}; text-align: center; position: relative;">
                      
                      ${!heroImage && badge ? `
                        <!-- Top Badge (No Hero Image) -->
                        <div style="margin-bottom: 20px;">
                          <span style="background: linear-gradient(135deg, ${accentColor} 0%, #7c3aed 100%); color: #ffffff; padding: 8px 20px; border-radius: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 16px rgba(88, 166, 255, 0.3);">
                            ${badge}
                          </span>
                        </div>
                      ` : ''}
                      
                      <!-- Title -->
                      <h1 style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 36px; font-weight: 800; color: #ffffff; line-height: 1.1; letter-spacing: -1px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                        ${title}
                      </h1>
                      
                      ${subtitle ? `
                        <!-- Subtitle -->
                        <h2 style="margin: 0 0 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 500; color: ${accentColor}; line-height: 1.3;">
                          ${subtitle}
                        </h2>
                      ` : ''}
                      
                      ${description ? `
                        <!-- Description -->
                        <p style="margin: 0 0 30px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; color: #8b949e; line-height: 1.6; max-width: 480px; margin-left: auto; margin-right: auto;">
                          ${description}
                        </p>
                      ` : ''}
                      
                      <!-- CTA Buttons -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 30px;">
                        <tr>
                          <td style="padding-right: ${secondaryCtaUrl ? '12px' : '0'};">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                              <tr>
                                <td style="border-radius: 12px; background: linear-gradient(135deg, ${accentColor} 0%, #7c3aed 100%); box-shadow: 0 8px 24px rgba(88, 166, 255, 0.4); position: relative; overflow: hidden;">
                                  <!-- Shine Effect -->
                                  <div style="position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); animation: shine 2s infinite;"></div>
                                  <a href="${addTrackingParams(ctaUrl, 'primary_cta')}" 
                                     style="display: inline-block; padding: 18px 36px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 12px; letter-spacing: 0.5px; position: relative; z-index: 1;">
                                    ${ctaText} →
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                          ${secondaryCtaUrl ? `
                            <td>
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                  <td style="border-radius: 12px; background-color: transparent; border: 2px solid rgba(139, 148, 158, 0.3);">
                                    <a href="${addTrackingParams(secondaryCtaUrl, 'secondary_cta')}" 
                                       style="display: inline-block; padding: 16px 36px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 600; color: #8b949e; text-decoration: none; border-radius: 12px; letter-spacing: 0.5px;">
                                      ${secondaryCtaText}
                                    </a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          ` : ''}
                        </tr>
                      </table>
                      
                      ${urgencyText && !heroImage ? `
                        <!-- Urgency Text (No Hero Image) -->
                        <div style="margin-bottom: 20px;">
                          <span style="background: linear-gradient(135deg, #ff6b6b 0%, #ffc107 100%); color: #ffffff; padding: 8px 16px; border-radius: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
                            ⚡ ${urgencyText}
                          </span>
                        </div>
                      ` : ''}
                    </td>
                  </tr>
                </table>
                
                ${features.length > 0 ? `
                  <!-- Features Section -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-top: 1px solid rgba(139, 148, 158, 0.2);">
                    <tr>
                      <td style="padding: 30px 40px;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            ${features.slice(0, 3).map((feature, index) => `
                              <td width="33.33%" align="center" valign="top" style="padding: 0 15px;">
                                <div style="text-align: center;">
                                  <div style="margin-bottom: 12px; font-size: 32px;">
                                    ${feature.icon}
                                  </div>
                                  <h4 style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #ffffff;">
                                    ${feature.title}
                                  </h4>
                                  <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #8b949e; line-height: 1.5;">
                                    ${feature.description}
                                  </p>
                                </div>
                              </td>
                            `).join('')}
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                ` : ''}
                
                ${testimonial ? `
                  <!-- Testimonial Section -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-top: 1px solid rgba(139, 148, 158, 0.2);">
                    <tr>
                      <td style="padding: 30px 40px; text-align: center;">
                        <div style="background: rgba(139, 148, 158, 0.1); border-radius: 16px; padding: 24px; border: 1px solid rgba(139, 148, 158, 0.2);">
                          <blockquote style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; line-height: 1.6; font-style: italic;">
                            "${testimonial.quote}"
                          </blockquote>
                          <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
                            ${testimonial.avatar ? `
                              <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 2px solid ${accentColor};">
                                <img src="${testimonial.avatar}" 
                                     alt="${testimonial.author}" 
                                     width="40" 
                                     height="40"
                                     style="display: block; width: 40px; height: 40px; object-fit: cover;" />
                              </div>
                            ` : ''}
                            <div style="text-align: left;">
                              <p style="margin: 0 0 2px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: #ffffff;">
                                ${testimonial.author}
                              </p>
                              <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: ${accentColor};">
                                ${testimonial.role}
                              </p>
                            </div>
                          </div>
                        </div>
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

    <!-- Mobile Version -->
    <!--[if !mso]><!-->
    <div style="display: none; max-height: 0; overflow: hidden;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
             style="display: none; margin: 0 0 30px;">
        <tr>
          <td style="padding: 20px; background: linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%);">
            <div style="background: linear-gradient(135deg, ${backgroundColor} 0%, #161b22 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.3);">
              
              ${heroImage ? `
                <!-- Mobile Hero -->
                <div style="position: relative; height: 150px; overflow: hidden; background: linear-gradient(135deg, ${accentColor} 0%, #7c3aed 100%);">
                  <img src="${heroImage}" alt="Hero" width="100%" height="150" style="display: block; width: 100%; height: 150px; object-fit: cover; opacity: 0.8;" />
                  <div style="position: absolute; inset: 0; background: linear-gradient(135deg, rgba(88, 166, 255, 0.8) 0%, rgba(124, 58, 237, 0.8) 100%);"></div>
                  ${badge ? `
                    <div style="position: absolute; top: 15px; left: 15px;">
                      <span style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); color: #ffffff; padding: 6px 12px; border-radius: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase;">
                        ${badge}
                      </span>
                    </div>
                  ` : ''}
                </div>
              ` : ''}
              
              <!-- Mobile Content -->
              <div style="padding: 30px 25px; text-align: center;">
                ${!heroImage && badge ? `
                  <div style="margin-bottom: 15px;">
                    <span style="background: linear-gradient(135deg, ${accentColor} 0%, #7c3aed 100%); color: #ffffff; padding: 6px 16px; border-radius: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase;">
                      ${badge}
                    </span>
                  </div>
                ` : ''}
                
                <h1 style="margin: 0 0 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 800; color: #ffffff; line-height: 1.1; letter-spacing: -0.5px;">
                  ${title}
                </h1>
                
                ${subtitle ? `
                  <h2 style="margin: 0 0 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 500; color: ${accentColor};">
                    ${subtitle}
                  </h2>
                ` : ''}
                
                ${description ? `
                  <p style="margin: 0 0 25px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #8b949e; line-height: 1.5;">
                    ${description}
                  </p>
                ` : ''}
                
                <!-- Mobile CTA -->
                <div style="margin-bottom: ${secondaryCtaUrl ? '12px' : '20px'};">
                  <a href="${addTrackingParams(ctaUrl, 'primary_cta_mobile')}" 
                     style="display: inline-block; padding: 16px 28px; background: linear-gradient(135deg, ${accentColor} 0%, #7c3aed 100%); color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 10px; width: 80%; max-width: 250px;">
                    ${ctaText} →
                  </a>
                </div>
                
                ${secondaryCtaUrl ? `
                  <div style="margin-bottom: 20px;">
                    <a href="${addTrackingParams(secondaryCtaUrl, 'secondary_cta_mobile')}" 
                       style="display: inline-block; padding: 12px 24px; border: 2px solid rgba(139, 148, 158, 0.3); color: #8b949e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 10px;">
                      ${secondaryCtaText}
                    </a>
                  </div>
                ` : ''}
                
                ${urgencyText && !heroImage ? `
                  <div>
                    <span style="background: linear-gradient(135deg, #ff6b6b 0%, #ffc107 100%); color: #ffffff; padding: 6px 12px; border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: bold; text-transform: uppercase;">
                      ⚡ ${urgencyText}
                    </span>
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
      
      /* Shine animation (limited email client support) */
      @keyframes shine {
        0% { left: -100%; }
        100% { left: 100%; }
      }
    </style>
  `;

  return <div dangerouslySetInnerHTML={{ __html: sectionHtml }} />;
};

export default DarkCTAModal;