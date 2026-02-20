import React from 'react';
import { TrackingParams } from '../../types';

interface LeaderboardEntry {
  rank: number;
  name: string;
  profileImage: string;
  points: number;
  badge?: string;
  isCurrentUser?: boolean;
  profileUrl?: string;
}

interface LeaderboardData {
  type: 'leaderboard';
  title?: string;
  subtitle?: string;
  period?: string;
  entries: LeaderboardEntry[];
  currentUserRank?: number;
  totalParticipants?: number;
  viewFullUrl?: string;
  backgroundColor?: string;
}

interface LeaderboardProps {
  section: LeaderboardData;
  tracking: TrackingParams;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ section, tracking }) => {
  const {
    title = "Beauty Champions",
    subtitle,
    period = "This Month",
    entries = [],
    currentUserRank,
    totalParticipants,
    viewFullUrl,
    backgroundColor = '#f8f9fa'
  } = section;

  // Helper function to add UTM parameters to URLs
  const addTrackingParams = (url: string, content?: string) => {
    if (!url) return '#';
    const params = new URLSearchParams({
      utm_source: tracking?.utm_source || 'email',
      utm_medium: tracking?.utm_medium || 'email',
      utm_campaign: tracking?.utm_campaign || 'campaign',
      utm_content: content || tracking?.utm_content || 'leaderboard'
    });
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  // Get rank styling
  const getRankStyling = (rank: number, isCurrentUser: boolean = false) => {
    if (isCurrentUser) {
      return {
        bg: '#ffc107',
        color: '#000000',
        border: '3px solid #ffc107'
      };
    }
    
    switch (rank) {
      case 1:
        return {
          bg: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
          color: '#000000',
          border: '2px solid #ffd700'
        };
      case 2:
        return {
          bg: 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)',
          color: '#000000',
          border: '2px solid #c0c0c0'
        };
      case 3:
        return {
          bg: 'linear-gradient(135deg, #cd7f32 0%, #d4924a 100%)',
          color: '#ffffff',
          border: '2px solid #cd7f32'
        };
      default:
        return {
          bg: '#ffffff',
          color: '#333333',
          border: '2px solid #e9ecef'
        };
    }
  };

  // Get rank icon
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  };

  const sectionHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 40px;">
      <tr>
        <td style="padding: 30px; background-color: ${backgroundColor};">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                 style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
            <tr>
              <td style="padding: 0;">
                <!-- Header -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                  <tr>
                    <td style="padding: 30px;" align="center">
                      ${title ? `
                        <h2 style="margin: 0 0 8px; font-family: Arial, sans-serif; font-size: 28px; font-weight: bold; color: #ffffff;">
                          🏆 ${title}
                        </h2>
                      ` : ''}
                      <div style="display: flex; align-items: center; justify-content: center; gap: 15px;">
                        ${subtitle ? `
                          <p style="margin: 0; font-family: Arial, sans-serif; font-size: 16px; color: rgba(255,255,255,0.9);">
                            ${subtitle}
                          </p>
                        ` : ''}
                        <div style="background-color: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px;">
                          <span style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; color: #ffffff;">
                            ${period}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
                
                <!-- Leaderboard Entries -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  ${entries.slice(0, 10).map((entry, index) => {
                    const styling = getRankStyling(entry.rank, entry.isCurrentUser);
                    const rankIcon = getRankIcon(entry.rank);
                    
                    return `
                      <tr>
                        <td style="padding: ${index === 0 ? '25px 30px 15px' : '15px 30px'}; border-bottom: ${index < entries.length - 1 ? '1px solid #f0f0f0' : 'none'};">
                          ${entry.profileUrl ? `
                            <a href="${addTrackingParams(entry.profileUrl, `profile_${entry.rank}`)}" style="text-decoration: none; color: inherit; display: block;">
                          ` : ''}
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                                   style="border-radius: 12px; padding: 15px; background: ${styling.bg}; border: ${styling.border};">
                              <tr>
                                <!-- Rank -->
                                <td width="60" align="center" valign="middle">
                                  <div style="width: 40px; height: 40px; border-radius: 50%; background-color: rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: ${styling.color};">
                                    ${rankIcon || entry.rank}
                                  </div>
                                </td>
                                
                                <!-- Profile Image -->
                                <td width="80" align="center" valign="middle" style="padding: 0 15px;">
                                  <div style="width: 60px; height: 60px; border-radius: 50%; overflow: hidden; border: 3px solid rgba(255,255,255,0.8);">
                                    <img src="${entry.profileImage}" 
                                         alt="${entry.name}" 
                                         width="60" 
                                         height="60"
                                         style="display: block; width: 60px; height: 60px; object-fit: cover;" />
                                  </div>
                                </td>
                                
                                <!-- User Info -->
                                <td valign="middle">
                                  <h4 style="margin: 0 0 4px; font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: ${styling.color};">
                                    ${entry.name}
                                    ${entry.isCurrentUser ? ' (You!)' : ''}
                                  </h4>
                                  ${entry.badge ? `
                                    <p style="margin: 0 0 6px; font-family: Arial, sans-serif; font-size: 12px; color: ${styling.color}; opacity: 0.8;">
                                      🎖️ ${entry.badge}
                                    </p>
                                  ` : ''}
                                  <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; color: ${styling.color}; opacity: 0.9;">
                                    ${entry.points.toLocaleString()} points
                                  </p>
                                </td>
                                
                                <!-- Points Badge -->
                                <td width="80" align="center" valign="middle">
                                  <div style="background-color: rgba(0,0,0,0.1); padding: 8px 12px; border-radius: 20px;">
                                    <span style="font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: ${styling.color};">
                                      #${entry.rank}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          ${entry.profileUrl ? '</a>' : ''}
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </table>
                
                <!-- Footer Stats -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
                  <tr>
                    <td style="padding: 20px 30px;" align="center">
                      <div style="display: flex; align-items: center; justify-content: center; gap: 30px;">
                        ${currentUserRank ? `
                          <div style="text-align: center;">
                            <p style="margin: 0 0 4px; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; color: #1e3a5f;">
                              #${currentUserRank}
                            </p>
                            <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">
                              Your Rank
                            </p>
                          </div>
                        ` : ''}
                        
                        ${totalParticipants ? `
                          <div style="text-align: center;">
                            <p style="margin: 0 0 4px; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; color: #1e3a5f;">
                              ${totalParticipants.toLocaleString()}
                            </p>
                            <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">
                              Total Members
                            </p>
                          </div>
                        ` : ''}
                      </div>
                      
                      ${viewFullUrl ? `
                        <div style="margin-top: 20px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td style="border-radius: 6px; background-color: #1e3a5f;">
                                <a href="${addTrackingParams(viewFullUrl, 'view_full_leaderboard')}" 
                                   style="display: inline-block; padding: 12px 24px; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 6px;">
                                  View Full Leaderboard
                                </a>
                              </td>
                            </tr>
                          </table>
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
          <td style="padding: 0 20px; background-color: ${backgroundColor};">
            <div style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 3px 8px rgba(0,0,0,0.1);">
              <!-- Mobile Header -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px 20px; text-align: center;">
                <h2 style="margin: 0 0 8px; font-family: Arial, sans-serif; font-size: 22px; font-weight: bold; color: #ffffff;">
                  🏆 ${title}
                </h2>
                <div style="background-color: rgba(255,255,255,0.2); padding: 6px 14px; border-radius: 16px; display: inline-block;">
                  <span style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #ffffff;">
                    ${period}
                  </span>
                </div>
              </div>
              
              <!-- Mobile Entries -->
              <div style="padding: 20px;">
                ${entries.slice(0, 5).map((entry, index) => {
                  const styling = getRankStyling(entry.rank, entry.isCurrentUser);
                  const rankIcon = getRankIcon(entry.rank);
                  
                  return `
                    <div style="margin-bottom: ${index < 4 ? '15px' : '0'};">
                      ${entry.profileUrl ? `
                        <a href="${addTrackingParams(entry.profileUrl, `profile_${entry.rank}_mobile`)}" style="text-decoration: none; color: inherit; display: block;">
                      ` : ''}
                        <div style="border-radius: 8px; padding: 12px; background: ${styling.bg}; border: ${styling.border};">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <!-- Mobile Rank -->
                              <td width="50" align="center" valign="middle">
                                <div style="width: 32px; height: 32px; border-radius: 50%; background-color: rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; color: ${styling.color};">
                                  ${rankIcon || entry.rank}
                                </div>
                              </td>
                              
                              <!-- Mobile Profile -->
                              <td width="50" align="center" valign="middle" style="padding: 0 10px;">
                                <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 2px solid rgba(255,255,255,0.8);">
                                  <img src="${entry.profileImage}" 
                                       alt="${entry.name}" 
                                       width="40" 
                                       height="40"
                                       style="display: block; width: 40px; height: 40px; object-fit: cover;" />
                                </div>
                              </td>
                              
                              <!-- Mobile Info -->
                              <td valign="middle">
                                <h4 style="margin: 0 0 2px; font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; color: ${styling.color};">
                                  ${entry.name}${entry.isCurrentUser ? ' (You!)' : ''}
                                </h4>
                                <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: ${styling.color}; opacity: 0.9;">
                                  ${entry.points.toLocaleString()} points
                                </p>
                              </td>
                              
                              <!-- Mobile Rank Badge -->
                              <td width="50" align="center" valign="middle">
                                <div style="background-color: rgba(0,0,0,0.1); padding: 4px 8px; border-radius: 12px;">
                                  <span style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; color: ${styling.color};">
                                    #${entry.rank}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </div>
                      ${entry.profileUrl ? '</a>' : ''}
                    </div>
                  `;
                }).join('')}
                
                ${viewFullUrl ? `
                  <div style="text-align: center; margin-top: 20px;">
                    <a href="${addTrackingParams(viewFullUrl, 'view_full_leaderboard_mobile')}" 
                       style="display: inline-block; padding: 10px 20px; background-color: #1e3a5f; color: #ffffff; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; text-decoration: none; border-radius: 6px;">
                      View Full Leaderboard
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

export default Leaderboard;