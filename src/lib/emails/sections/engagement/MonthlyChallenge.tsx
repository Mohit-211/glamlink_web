import React from 'react';
import { TrackingParams } from '../../types';

interface ChallengeStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  reward?: string;
}

interface MonthlyChallengeData {
  type: 'monthly-challenge';
  title?: string;
  subtitle?: string;
  challengeName: string;
  challengeImage: string;
  description: string;
  deadline: string;
  totalReward: string;
  currentProgress: number;
  totalSteps: number;
  steps: ChallengeStep[];
  ctaText?: string;
  ctaUrl?: string;
  backgroundColor?: string;
  status?: 'active' | 'completed' | 'upcoming';
}

interface MonthlyChallengeProps {
  section: MonthlyChallengeData;
  tracking: TrackingParams;
}

const MonthlyChallenge: React.FC<MonthlyChallengeProps> = ({ section, tracking }) => {
  const {
    title = "Monthly Challenge",
    subtitle,
    challengeName,
    challengeImage,
    description,
    deadline,
    totalReward,
    currentProgress,
    totalSteps,
    steps = [],
    ctaText = "View Challenge",
    ctaUrl,
    backgroundColor = '#f8f9fa',
    status = 'active'
  } = section;

  // Helper function to add UTM parameters to URLs
  const addTrackingParams = (url: string, content?: string) => {
    if (!url) return '#';
    const params = new URLSearchParams({
      utm_source: tracking?.utm_source || 'email',
      utm_medium: tracking?.utm_medium || 'email',
      utm_campaign: tracking?.utm_campaign || 'campaign',
      utm_content: content || tracking?.utm_content || 'monthly_challenge'
    });
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  // Calculate progress percentage
  const progressPercentage = totalSteps > 0 ? (currentProgress / totalSteps) * 100 : 0;

  // Get status styling
  const getStatusStyling = () => {
    switch (status) {
      case 'completed':
        return {
          badge: { bg: '#28a745', text: 'Completed' },
          border: '#28a745'
        };
      case 'upcoming':
        return {
          badge: { bg: '#6c757d', text: 'Coming Soon' },
          border: '#6c757d'
        };
      default:
        return {
          badge: { bg: '#ffc107', text: 'Active' },
          border: '#ffc107'
        };
    }
  };

  const statusStyling = getStatusStyling();

  const sectionHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 40px;">
      <tr>
        <td style="padding: 30px; background-color: ${backgroundColor};">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                 style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; border: 3px solid ${statusStyling.border};">
            <tr>
              <td style="padding: 0;">
                <!-- Header -->
                ${title || subtitle ? `
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #1e3a5f 0%, #2c5aa0 100%);">
                    <tr>
                      <td style="padding: 25px 30px;" align="center">
                        ${title ? `
                          <h2 style="margin: 0 0 8px; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; color: #ffffff;">
                            ${title}
                          </h2>
                        ` : ''}
                        ${subtitle ? `
                          <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; color: rgba(255,255,255,0.9);">
                            ${subtitle}
                          </p>
                        ` : ''}
                      </td>
                    </tr>
                  </table>
                ` : ''}
                
                <!-- Challenge Content -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <!-- Challenge Image -->
                    <td width="40%" valign="top" style="padding: 30px 15px 30px 30px;">
                      <div style="position: relative;">
                        <!-- Challenge Image -->
                        <div style="width: 100%; height: 200px; overflow: hidden; border-radius: 12px; background-color: #f5f5f5; position: relative;">
                          <img src="${challengeImage}" 
                               alt="${challengeName}" 
                               width="100%" 
                               height="200"
                               style="display: block; width: 100%; height: 200px; object-fit: cover; border-radius: 12px;" />
                          
                          <!-- Status Badge -->
                          <div style="position: absolute; top: 12px; right: 12px; background-color: ${statusStyling.badge.bg}; color: #ffffff; padding: 6px 12px; border-radius: 16px; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${statusStyling.badge.text}
                          </div>
                          
                          <!-- Reward Badge -->
                          <div style="position: absolute; bottom: 12px; left: 12px; background-color: rgba(0,0,0,0.8); color: #ffffff; padding: 8px 12px; border-radius: 8px; font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
                            🏆 ${totalReward}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <!-- Challenge Details -->
                    <td width="60%" valign="top" style="padding: 30px 30px 30px 15px;">
                      <!-- Challenge Name -->
                      <h3 style="margin: 0 0 12px; font-family: Arial, sans-serif; font-size: 22px; font-weight: bold; color: #1e3a5f; line-height: 1.3;">
                        ${challengeName}
                      </h3>
                      
                      <!-- Description -->
                      <p style="margin: 0 0 20px; font-family: Arial, sans-serif; font-size: 15px; line-height: 1.5; color: #555555;">
                        ${description}
                      </p>
                      
                      <!-- Progress -->
                      <div style="margin: 0 0 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                          <span style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; color: #333333;">
                            Progress: ${currentProgress}/${totalSteps}
                          </span>
                          <span style="font-family: Arial, sans-serif; font-size: 14px; color: #666666;">
                            ${Math.round(progressPercentage)}%
                          </span>
                        </div>
                        <div style="width: 100%; height: 8px; background-color: #e9ecef; border-radius: 4px; overflow: hidden;">
                          <div style="width: ${progressPercentage}%; height: 100%; background: linear-gradient(90deg, #28a745 0%, #20c997 100%); border-radius: 4px;"></div>
                        </div>
                      </div>
                      
                      <!-- Deadline -->
                      <div style="margin: 0 0 25px; padding: 12px; background-color: #fff3cd; border-radius: 6px; border-left: 4px solid #ffc107;">
                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 13px; color: #856404;">
                          <strong>⏰ Deadline:</strong> ${deadline}
                        </p>
                      </div>
                      
                      ${ctaUrl ? `
                        <!-- CTA Button -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="border-radius: 8px; background: linear-gradient(135deg, #1e3a5f 0%, #2c5aa0 100%);">
                              <a href="${addTrackingParams(ctaUrl, 'challenge_cta')}" 
                                 style="display: inline-block; padding: 14px 28px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 8px;">
                                ${ctaText}
                              </a>
                            </td>
                          </tr>
                        </table>
                      ` : ''}
                    </td>
                  </tr>
                </table>
                
                ${steps.length > 0 ? `
                  <!-- Challenge Steps -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
                    <tr>
                      <td style="padding: 25px 30px;">
                        <h4 style="margin: 0 0 20px; font-family: Arial, sans-serif; font-size: 18px; font-weight: 600; color: #333333;">
                          Challenge Steps
                        </h4>
                        
                        ${steps.map((step, index) => `
                          <div style="display: flex; align-items: flex-start; margin-bottom: ${index < steps.length - 1 ? '15px' : '0'};">
                            <!-- Step Number/Check -->
                            <div style="width: 32px; height: 32px; border-radius: 50%; background-color: ${step.completed ? '#28a745' : '#e9ecef'}; color: ${step.completed ? '#ffffff' : '#666666'}; display: flex; align-items: center; justify-content: center; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; margin-right: 15px; flex-shrink: 0; margin-top: 2px;">
                              ${step.completed ? '✓' : (index + 1)}
                            </div>
                            
                            <!-- Step Content -->
                            <div style="flex: 1;">
                              <h5 style="margin: 0 0 4px; font-family: Arial, sans-serif; font-size: 15px; font-weight: 600; color: ${step.completed ? '#28a745' : '#333333'};">
                                ${step.title}
                              </h5>
                              <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; color: #666666; line-height: 1.4;">
                                ${step.description}
                              </p>
                              ${step.reward ? `
                                <p style="margin: 4px 0 0; font-family: Arial, sans-serif; font-size: 12px; color: #ffc107; font-weight: 600;">
                                  🎁 ${step.reward}
                                </p>
                              ` : ''}
                            </div>
                          </div>
                        `).join('')}
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
          <td style="padding: 0 20px; background-color: ${backgroundColor};">
            <div style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 3px 8px rgba(0,0,0,0.1); border: 2px solid ${statusStyling.border};">
              ${title ? `
                <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2c5aa0 100%); padding: 20px; text-align: center;">
                  <h2 style="margin: 0; font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; color: #ffffff;">
                    ${title}
                  </h2>
                </div>
              ` : ''}
              
              <div style="padding: 20px;">
                <!-- Mobile Challenge Image -->
                <div style="width: 100%; height: 180px; overflow: hidden; border-radius: 8px; background-color: #f5f5f5; position: relative; margin-bottom: 20px;">
                  <img src="${challengeImage}" 
                       alt="${challengeName}" 
                       width="100%" 
                       height="180"
                       style="display: block; width: 100%; height: 180px; object-fit: cover; border-radius: 8px;" />
                  
                  <div style="position: absolute; top: 8px; right: 8px; background-color: ${statusStyling.badge.bg}; color: #ffffff; padding: 4px 8px; border-radius: 12px; font-family: Arial, sans-serif; font-size: 10px; font-weight: bold;">
                    ${statusStyling.badge.text}
                  </div>
                  
                  <div style="position: absolute; bottom: 8px; left: 8px; background-color: rgba(0,0,0,0.8); color: #ffffff; padding: 6px 10px; border-radius: 6px; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold;">
                    🏆 ${totalReward}
                  </div>
                </div>
                
                <!-- Mobile Challenge Details -->
                <h3 style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #1e3a5f; text-align: center;">
                  ${challengeName}
                </h3>
                
                <p style="margin: 0 0 15px; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4; color: #555555; text-align: center;">
                  ${description}
                </p>
                
                <!-- Mobile Progress -->
                <div style="margin: 0 0 15px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                    <span style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #333333;">
                      Progress: ${currentProgress}/${totalSteps}
                    </span>
                    <span style="font-family: Arial, sans-serif; font-size: 13px; color: #666666;">
                      ${Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <div style="width: 100%; height: 6px; background-color: #e9ecef; border-radius: 3px; overflow: hidden;">
                    <div style="width: ${progressPercentage}%; height: 100%; background: linear-gradient(90deg, #28a745 0%, #20c997 100%);"></div>
                  </div>
                </div>
                
                <!-- Mobile Deadline -->
                <div style="margin: 0 0 20px; padding: 10px; background-color: #fff3cd; border-radius: 6px; border-left: 3px solid #ffc107;">
                  <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: #856404;">
                    <strong>⏰ Deadline:</strong> ${deadline}
                  </p>
                </div>
                
                ${ctaUrl ? `
                  <div style="text-align: center;">
                    <a href="${addTrackingParams(ctaUrl, 'challenge_cta_mobile')}" 
                       style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #1e3a5f 0%, #2c5aa0 100%); color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 6px;">
                      ${ctaText}
                    </a>
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

export default MonthlyChallenge;