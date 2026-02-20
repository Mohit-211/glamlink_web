import React from 'react';
import { TrackingParams } from '../../types';

interface RewardMilestone {
  points: number;
  title: string;
  image: string;
  description?: string;
  achieved: boolean;
  current?: boolean;
}

interface RewardProgressData {
  type: 'reward-progress';
  title?: string;
  subtitle?: string;
  currentPoints: number;
  nextMilestone: number;
  customerName?: string;
  milestones: RewardMilestone[];
  progressMessage?: string;
  viewHistoryUrl?: string;
  backgroundColor?: string;
  progressColor?: string;
}

interface RewardProgressProps {
  section: RewardProgressData;
  tracking: TrackingParams;
}

const RewardProgress: React.FC<RewardProgressProps> = ({ section, tracking }) => {
  const {
    title = "Your Reward Progress",
    subtitle,
    currentPoints,
    nextMilestone,
    customerName,
    milestones = [],
    progressMessage,
    viewHistoryUrl,
    backgroundColor = '#f8f9fa',
    progressColor = '#28a745'
  } = section;

  // Helper function to add UTM parameters to URLs
  const addTrackingParams = (url: string, content?: string) => {
    if (!url) return '#';
    const params = new URLSearchParams({
      utm_source: tracking?.utm_source || 'email',
      utm_medium: tracking?.utm_medium || 'email',
      utm_campaign: tracking?.utm_campaign || 'campaign',
      utm_content: content || tracking?.utm_content || 'reward_progress'
    });
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  // Calculate progress percentage
  const maxPoints = milestones.length > 0 ? milestones[milestones.length - 1].points : 1000;
  const progressPercentage = Math.min((currentPoints / maxPoints) * 100, 100);

  // Calculate next milestone progress
  const nextMilestoneProgress = nextMilestone > 0 ? Math.min((currentPoints / nextMilestone) * 100, 100) : 100;

  const sectionHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 40px;">
      <tr>
        <td style="padding: 30px; background-color: ${backgroundColor};">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                 style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
            <tr>
              <td style="padding: 40px 30px;">
                <!-- Header -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
                  <tr>
                    <td align="center">
                      ${title ? `
                        <h2 style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 28px; font-weight: bold; color: #1e3a5f;">
                          ${title}
                        </h2>
                      ` : ''}
                      ${subtitle ? `
                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 16px; color: #666666;">
                          ${subtitle}
                        </p>
                      ` : ''}
                    </td>
                  </tr>
                </table>
                
                <!-- Current Points Display -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
                  <tr>
                    <td align="center">
                      ${customerName ? `
                        <p style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 18px; color: #333333;">
                          Hi ${customerName}, you have
                        </p>
                      ` : ''}
                      <h1 style="margin: 0 0 15px; font-family: Arial, sans-serif; font-size: 48px; font-weight: bold; color: #1e3a5f;">
                        ${currentPoints} <span style="font-size: 24px; color: #666666;">points</span>
                      </h1>
                      ${progressMessage ? `
                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 16px; color: #666666;">
                          ${progressMessage}
                        </p>
                      ` : ''}
                    </td>
                  </tr>
                </table>
                
                <!-- Progress Bar -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 40px;">
                  <tr>
                    <td>
                      <!-- Progress Track -->
                      <div style="width: 100%; height: 12px; background-color: #e9ecef; border-radius: 6px; position: relative; overflow: hidden;">
                        <!-- Progress Fill -->
                        <div style="width: ${nextMilestoneProgress}%; height: 100%; background: linear-gradient(90deg, ${progressColor} 0%, #20c997 100%); border-radius: 6px; transition: width 0.3s ease;"></div>
                      </div>
                      
                      <!-- Progress Labels -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 8px;">
                        <tr>
                          <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666;">
                            0
                          </td>
                          <td align="right" style="font-family: Arial, sans-serif; font-size: 12px; color: #666666;">
                            ${nextMilestone > 0 ? nextMilestone : maxPoints}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                
                <!-- Milestones -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    ${milestones.map((milestone, index) => {
                      const isAchieved = milestone.achieved;
                      const isCurrent = milestone.current;
                      const opacity = isAchieved ? '1' : '0.5';
                      const borderStyle = isCurrent ? '3px solid #ffc107' : isAchieved ? '2px solid #28a745' : '2px solid #e9ecef';
                      
                      return `
                        <td width="${100 / milestones.length}%" align="center" valign="top" style="padding: 0 8px;">
                          <!-- Milestone Image -->
                          <div style="width: 80px; height: 80px; border-radius: 12px; overflow: hidden; margin: 0 auto 10px; border: ${borderStyle}; opacity: ${opacity}; position: relative;">
                            <img src="${milestone.image}" 
                                 alt="${milestone.title}" 
                                 width="80" 
                                 height="80"
                                 style="display: block; width: 80px; height: 80px; object-fit: cover;" />
                            ${isAchieved ? `
                              <div style="position: absolute; top: -5px; right: -5px; width: 24px; height: 24px; background-color: #28a745; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <span style="color: #ffffff; font-size: 14px; font-weight: bold;">✓</span>
                              </div>
                            ` : ''}
                          </div>
                          
                          <!-- Points -->
                          <p style="margin: 0 0 5px; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; color: ${isAchieved ? '#28a745' : '#666666'};">
                            ${milestone.points}
                          </p>
                          
                          <!-- Title -->
                          <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: #333333; line-height: 1.3; text-align: center;">
                            ${milestone.title}
                          </p>
                        </td>
                      `;
                    }).join('')}
                  </tr>
                </table>
                
                ${viewHistoryUrl ? `
                  <!-- View History Button -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px;">
                    <tr>
                      <td align="center">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="border-radius: 6px; background-color: transparent; border: 2px solid #1e3a5f;">
                              <a href="${addTrackingParams(viewHistoryUrl, 'view_history')}" 
                                 style="display: inline-block; padding: 12px 24px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; color: #1e3a5f; text-decoration: none; border-radius: 6px;">
                                Points History + FAQ
                              </a>
                            </td>
                          </tr>
                        </table>
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
            <div style="background-color: #ffffff; border-radius: 12px; padding: 25px; box-shadow: 0 3px 8px rgba(0,0,0,0.1);">
              <!-- Mobile Header -->
              ${title ? `
                <h2 style="margin: 0 0 20px; font-family: Arial, sans-serif; font-size: 22px; font-weight: bold; color: #1e3a5f; text-align: center;">
                  ${title}
                </h2>
              ` : ''}
              
              <!-- Mobile Points Display -->
              <div style="text-align: center; margin-bottom: 25px;">
                ${customerName ? `
                  <p style="margin: 0 0 8px; font-family: Arial, sans-serif; font-size: 16px; color: #333333;">
                    Hi ${customerName}, you have
                  </p>
                ` : ''}
                <h1 style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 36px; font-weight: bold; color: #1e3a5f;">
                  ${currentPoints} <span style="font-size: 18px; color: #666666;">points</span>
                </h1>
                ${progressMessage ? `
                  <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; color: #666666;">
                    ${progressMessage}
                  </p>
                ` : ''}
              </div>
              
              <!-- Mobile Progress Bar -->
              <div style="margin-bottom: 30px;">
                <div style="width: 100%; height: 10px; background-color: #e9ecef; border-radius: 5px; overflow: hidden; margin-bottom: 5px;">
                  <div style="width: ${nextMilestoneProgress}%; height: 100%; background: linear-gradient(90deg, ${progressColor} 0%, #20c997 100%);"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-family: Arial, sans-serif; font-size: 11px; color: #666666;">
                  <span>0</span>
                  <span>${nextMilestone > 0 ? nextMilestone : maxPoints}</span>
                </div>
              </div>
              
              <!-- Mobile Milestones -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 15px; text-align: center;">
                ${milestones.map(milestone => {
                  const isAchieved = milestone.achieved;
                  const isCurrent = milestone.current;
                  const opacity = isAchieved ? '1' : '0.6';
                  const borderColor = isCurrent ? '#ffc107' : isAchieved ? '#28a745' : '#e9ecef';
                  
                  return `
                    <div style="text-align: center;">
                      <div style="width: 60px; height: 60px; border-radius: 8px; overflow: hidden; margin: 0 auto 8px; border: 2px solid ${borderColor}; opacity: ${opacity}; position: relative;">
                        <img src="${milestone.image}" 
                             alt="${milestone.title}" 
                             width="60" 
                             height="60"
                             style="display: block; width: 60px; height: 60px; object-fit: cover;" />
                        ${isAchieved ? `
                          <div style="position: absolute; top: -3px; right: -3px; width: 18px; height: 18px; background-color: #28a745; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <span style="color: #ffffff; font-size: 10px;">✓</span>
                          </div>
                        ` : ''}
                      </div>
                      <p style="margin: 0 0 3px; font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; color: ${isAchieved ? '#28a745' : '#666666'};">
                        ${milestone.points}
                      </p>
                      <p style="margin: 0; font-family: Arial, sans-serif; font-size: 10px; color: #333333; line-height: 1.2;">
                        ${milestone.title}
                      </p>
                    </div>
                  `;
                }).join('')}
              </div>
              
              ${viewHistoryUrl ? `
                <div style="text-align: center; margin-top: 25px;">
                  <a href="${addTrackingParams(viewHistoryUrl, 'view_history_mobile')}" 
                     style="display: inline-block; padding: 10px 20px; border: 2px solid #1e3a5f; color: #1e3a5f; font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; text-decoration: none; border-radius: 6px;">
                    Points History + FAQ
                  </a>
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

export default RewardProgress;