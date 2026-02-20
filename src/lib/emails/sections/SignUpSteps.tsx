import React from 'react';
import { TrackingParams, EmailTheme } from '../types';
import { getThemedStyles } from '../utils/themeHelper';
import { getDefaultTheme } from '../utils/themeManager';

interface Step {
  id: string;
  title: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaUrl?: string;
}

interface SignUpStepsSection {
  type: 'signup-steps';
  headerTitle?: string;
  subtitle?: string;
  steps: Step[];
}

interface SignUpStepsProps {
  section: SignUpStepsSection;
  tracking: TrackingParams;
  theme?: EmailTheme;
}

const SignUpSteps: React.FC<SignUpStepsProps> = ({ section, tracking, theme = getDefaultTheme() }) => {
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
    
    // Add modal parameter to open the user download dialog
    params.append('modal', 'user');
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  // Default steps if none provided
  const defaultSteps: Step[] = [
    {
      id: 'download',
      title: 'Download the Glamlink App',
      description: 'Start your journey by downloading the Glamlink mobile app. Available on iOS and Android.',
      image: 'https://via.placeholder.com/400x300/FFE5B4/D2691E?text=Download+App',
      ctaText: 'Download the App',
      ctaUrl: 'https://glamlink.net'
    },
    {
      id: 'signup',
      title: 'Create Your Free Account',
      description: 'Sign up in just a few steps to unlock beauty content, product reviews, and local treatment searches.',
      image: 'https://via.placeholder.com/400x300/FFDAB9/CD853F?text=Sign+Up',
      ctaText: 'Sign Up',
      ctaUrl: 'https://glamlink.net/signup'
    },
    {
      id: 'explore',
      title: 'Explore Beauty Content',
      description: 'Dive into expert interviews, product tips, and transformation stories right in the app.',
      image: 'https://via.placeholder.com/400x300/FFE4B5/DEB887?text=Explore'
    },
    {
      id: 'shop',
      title: 'Shop & Discover Products',
      description: 'Browse top-rated beauty products and exclusive Glamlink picks - all in one place.',
      image: 'https://via.placeholder.com/400x300/FFEFD5/F0E68C?text=Shop',
      ctaText: 'Start Shopping',
      ctaUrl: 'https://glamlink.net/shop'
    },
    {
      id: 'treatments',
      title: 'Find Treatments Near You',
      description: 'Search and book trusted treatments at salons and spas near you, directly through the app.',
      image: 'https://via.placeholder.com/400x300/FFF8DC/FFE4A1?text=Find+Treatments',
      ctaText: 'Find Treatments',
      ctaUrl: 'https://glamlink.net/treatments'
    },
    {
      id: 'rewards',
      title: 'Earn & Save with Glamlink',
      description: 'Get rewarded for exploring, sharing, and booking through the app. Watch your Glamlink points grow.',
      image: 'https://via.placeholder.com/400x300/FFFACD/FFD700?text=Earn+Rewards',
      ctaText: 'Learn More',
      ctaUrl: 'https://glamlink.net/rewards'
    }
  ];

  const steps = section.steps?.length > 0 ? section.steps : defaultSteps;

  // Create the section HTML as a string for better email compatibility
  const sectionHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 40px; background-color: ${theme.colors.background.alternateSection};">
      <tr>
        <td style="padding: 40px 20px;">
          <!-- Header -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 35px;">
            <tr>
              <td align="center">
                <h2 style="margin: 0 0 12px; ${styles.headingLarge}; text-align: center;">
                  ${section.headerTitle || 'Step One to Glamlink Success: Your Quick-Start Guide'}
                </h2>
                ${section.subtitle ? `
                  <p style="margin: 0; ${styles.bodyText}; text-align: center;">
                    ${section.subtitle}
                  </p>
                ` : ''}
              </td>
            </tr>
          </table>
          
          <!-- Steps -->
          ${steps.map((step, index) => {
            const isEven = index % 2 === 0;
            return `
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  ${isEven ? `
                    <!-- Image on left for even items -->
                    <td width="45%" valign="middle" style="padding-right: 20px;">
                      <div style="background: ${theme.colors.gradient.primary}; border-radius: ${theme.borderRadius.lg}; padding: 20px; text-align: center;">
                        <!-- Decorative sparkles using inline spans -->
                        <div style="text-align: right; margin-bottom: -10px;">
                          <span style="display: inline-block; font-size: 20px; line-height: 20px; color: rgba(255,255,255,0.7);">✨</span>
                        </div>
                        <img src="${step.image}" 
                             alt="${step.title}" 
                             width="100%" 
                             style="display: block; width: 100%; height: auto; border-radius: 15px; max-width: 280px; margin: 0 auto;" />
                        <div style="text-align: left; margin-top: -10px;">
                          <span style="display: inline-block; font-size: 16px; line-height: 16px; color: rgba(255,255,255,0.6);">⭐</span>
                        </div>
                      </div>
                    </td>
                    <td width="55%" valign="middle">
                      <h3 style="margin: 0 0 12px; ${styles.headingMedium};">
                        ${step.title}
                      </h3>
                      <p style="margin: 0 0 ${step.ctaText ? '16px' : '0'}; ${styles.bodyText};">
                        ${step.description}
                      </p>
                      ${step.ctaText && step.ctaUrl ? `
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="border-radius: ${theme.borderRadius.md}; background-color: ${theme.colors.background.card}; border: 2px solid ${theme.colors.primary.main};">
                              <a href="${addTrackingParams(step.ctaUrl, `step_${step.id}`)}" 
                                 style="display: inline-block; padding: 12px 24px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.base}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.primary.main}; text-decoration: none;">
                                ${step.ctaText}
                              </a>
                            </td>
                          </tr>
                        </table>
                      ` : ''}
                    </td>
                  ` : `
                    <!-- Text on left for odd items -->
                    <td width="55%" valign="middle" style="padding-right: 20px;">
                      <h3 style="margin: 0 0 12px; ${styles.headingMedium};">
                        ${step.title}
                      </h3>
                      <p style="margin: 0 0 ${step.ctaText ? '16px' : '0'}; ${styles.bodyText};">
                        ${step.description}
                      </p>
                      ${step.ctaText && step.ctaUrl ? `
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="border-radius: ${theme.borderRadius.md}; background-color: ${theme.colors.background.card}; border: 2px solid ${theme.colors.primary.main};">
                              <a href="${addTrackingParams(step.ctaUrl, `step_${step.id}`)}" 
                                 style="display: inline-block; padding: 12px 24px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.base}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.primary.main}; text-decoration: none;">
                                ${step.ctaText}
                              </a>
                            </td>
                          </tr>
                        </table>
                      ` : ''}
                    </td>
                    <td width="45%" valign="middle">
                      <div style="background: ${theme.colors.gradient.primary}; border-radius: ${theme.borderRadius.lg}; padding: 20px; text-align: center;">
                        <!-- Decorative sparkles using inline spans -->
                        <div style="text-align: left; margin-bottom: -10px;">
                          <span style="display: inline-block; font-size: 20px; line-height: 20px; color: rgba(255,255,255,0.7);">✨</span>
                        </div>
                        <img src="${step.image}" 
                             alt="${step.title}" 
                             width="100%" 
                             style="display: block; width: 100%; height: auto; border-radius: 15px; max-width: 280px; margin: 0 auto;" />
                        <div style="text-align: right; margin-top: -10px;">
                          <span style="display: inline-block; font-size: 16px; line-height: 16px; color: rgba(255,255,255,0.6);">⭐</span>
                        </div>
                      </div>
                    </td>
                  `}
                </tr>
              </table>
            `;
          }).join('')}
          
          <!-- Mobile Version (Stacked) -->
          <!--[if !mso]><!-->
          <div style="display: none; max-height: 0; overflow: hidden;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                   style="display: none;">
              ${steps.map((step) => `
                <tr>
                  <td style="padding: 20px;">
                    <div style="background: ${theme.colors.gradient.primary}; border-radius: ${theme.borderRadius.md}; padding: 15px; margin-bottom: 15px;">
                      <img src="${step.image}" alt="${step.title}" width="100%" style="display: block; width: 100%; height: auto; border-radius: 10px;" />
                    </div>
                    <h3 style="margin: 0 0 10px; ${styles.headingSmall};">
                      ${step.title}
                    </h3>
                    <p style="margin: 0 0 ${step.ctaText ? '12px' : '0'}; ${styles.bodyText}; font-size: ${theme.typography.fontSize.sm};}">
                      ${step.description}
                    </p>
                    ${step.ctaText && step.ctaUrl ? `
                      <a href="${addTrackingParams(step.ctaUrl, `step_${step.id}_mobile`)}" 
                         style="display: inline-block; padding: 10px 20px; background-color: ${theme.colors.background.card}; border: 2px solid ${theme.colors.primary.main}; color: ${theme.colors.primary.main}; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; font-weight: ${theme.typography.fontWeight.bold}; text-decoration: none; border-radius: ${theme.borderRadius.md};">
                        ${step.ctaText}
                      </a>
                    ` : ''}
                  </td>
                </tr>
              `).join('')}
            </table>
          </div>
          <!--<![endif]-->
        </td>
      </tr>
    </table>
    
    <style type="text/css">
      @media only screen and (max-width: 600px) {
        /* Hide desktop version on mobile */
        table[role="presentation"] td[width="45%"],
        table[role="presentation"] td[width="55%"] {
          display: block !important;
          width: 100% !important;
          padding: 0 !important;
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

export default SignUpSteps;