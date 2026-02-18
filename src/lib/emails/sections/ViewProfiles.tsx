import React from 'react';
import { TrackingParams, EmailTheme } from '../types';
import { getThemedStyles, getCardStyles } from '../utils/themeHelper';
import { getDefaultTheme } from '../utils/themeManager';

interface ProfessionalProfile {
  id: string;
  name: string;
  title: string;
  business?: string;
  image: string;
  specialties?: string[];
  badge?: string;
}

interface ViewProfilesSection {
  type: 'view-profiles';
  headerTitle?: string;
  subtitle?: string;
  profiles: ProfessionalProfile[];
  viewAllText?: string;
  viewAllLink?: string;
  modalType?: 'user' | 'pro';
  filterText?: string;
}

interface ViewProfilesProps {
  section: ViewProfilesSection;
  tracking: TrackingParams;
  theme?: EmailTheme;
}

const ViewProfiles: React.FC<ViewProfilesProps> = ({ section, tracking, theme = getDefaultTheme() }) => {
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
    const modalType = section.modalType || 'user';
    params.append('modal', modalType);
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  // Default profiles based on the provided sample data
  const defaultProfiles: ProfessionalProfile[] = [
    {
      id: 'jackie-stryker',
      name: 'JACKIE STRYKER',
      title: 'CEO OF RESHAPE BODY BAR',
      image: 'https://firebasestorage.googleapis.com/v0/b/glamlink-test.firebasestorage.app/o/magazine%2Ftemp%2Fcontent%2Fcontent_1755187449263_55220.jpg?alt=media&token=4cd64a68-8e83-4233-8e2b-f5f1b5e17c62',
      specialties: ['Body Sculpting', 'Wellness'],
      badge: 'Verified Pro'
    },
    {
      id: 'jann-nguyen',
      name: 'JANN NGUYEN',
      title: 'LAS VEGAS LASHES AND BROWS',
      image: 'https://firebasestorage.googleapis.com/v0/b/glamlink-test.firebasestorage.app/o/magazine%2Ftemp%2Fcontent%2Fcontent_1755186723612_IMG_8213.jpg?alt=media&token=d43e5dc5-67a9-46f4-9f47-81ac6fcf76ce',
      specialties: ['Lashes', 'Brows', 'Beauty'],
      badge: 'Top Rated'
    },
    {
      id: 'kassandra-franco',
      name: 'KASSANDRA FRANCO',
      title: 'CERTIFIED BODY SCULPTING EXPERT',
      image: 'https://firebasestorage.googleapis.com/v0/b/glamlink-test.firebasestorage.app/o/magazine%2Ftemp%2Fcontent%2Fcontent_1755187065113_IMG_8464.jpg?alt=media&token=e44f9bdd-1ee1-45f3-ac33-f9bc6c37e9cf',
      specialties: ['Body Contouring', 'Non-Invasive', 'Wellness'],
      badge: 'Rising Star'
    },
    {
      id: 'elena-martinez',
      name: 'ELENA MARTINEZ',
      title: 'MEDICAL AESTHETICIAN',
      image: 'https://firebasestorage.googleapis.com/v0/b/glamlink-test.firebasestorage.app/o/magazine%2Ftemp%2Fcontent%2Fcontent_1755187065113_IMG_8464.jpg?alt=media&token=e44f9bdd-1ee1-45f3-ac33-f9bc6c37e9cf',
      specialties: ['Skincare', 'Facial Treatments', 'Anti-Aging'],
      badge: 'Expert'
    }
  ];

  const profiles = section.profiles || defaultProfiles;

  // Badge colors and styles
  const getBadgeStyle = (badge?: string) => {
    if (!badge) return '';
    
    let bgColor = theme.colors.primary.main;
    let textColor = theme.colors.text.inverse;
    
    switch (badge.toLowerCase()) {
      case 'verified pro':
        bgColor = theme.colors.primary.main;
        break;
      case 'top rated':
        bgColor = theme.colors.badge.featured;
        textColor = theme.colors.text.primary;
        break;
      case 'rising star':
        bgColor = theme.colors.badge.trending;
        break;
      case 'expert':
        bgColor = theme.colors.primary.dark;
        break;
      default:
        bgColor = theme.colors.primary.light;
        textColor = theme.colors.text.primary;
    }
    
    return `display: inline-block; padding: 4px 10px; background-color: ${bgColor}; color: ${textColor}; font-size: 11px; font-weight: ${theme.typography.fontWeight.bold}; border-radius: ${theme.borderRadius.sm}; text-transform: uppercase; letter-spacing: 0.5px;`;
  };

  // Create the section HTML as a string for better email compatibility
  const sectionHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 40px;">
      <tr>
        <td style="padding: 30px 20px; background-color: ${theme.colors.background.alternateSection};">
          <!-- Header -->
          ${section.headerTitle || section.subtitle ? `
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 25px;">
              <tr>
                <td align="center">
                  ${section.headerTitle ? `
                    <h2 style="margin: 0 0 10px; ${styles.headingMedium}; text-align: center;">
                      ${section.headerTitle}
                    </h2>
                  ` : ''}
                  ${section.subtitle ? `
                    <p style="margin: 0; ${styles.bodyText}; text-align: center;">
                      ${section.subtitle}
                    </p>
                  ` : ''}
                </td>
              </tr>
            </table>
          ` : ''}
          
          <!-- Profiles Grid Container -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
            <tr>
              <td>
                <!-- Profiles Grid -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  ${profiles.map((profile, index) => {
                    const isLeft = index % 2 === 0;
                    const isLastRow = index === profiles.length - 1 || index === profiles.length - 2;
                    const nextProfile = profiles[index + 1];
                    
                    // Start a new row for every odd index or first item
                    if (isLeft) {
                      return `
                        <tr>
                          <!-- Profile Card -->
                          <td width="48%" valign="top" style="padding-bottom: ${isLastRow ? '0' : '20px'};">
                            <a href="${addTrackingParams('https://glamlink.net/profile/' + profile.id, 'profile_' + profile.id)}" 
                               style="text-decoration: none; color: inherit; display: block;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                                     style="${getCardStyles(theme)}; overflow: hidden; transition: all 0.3s;">
                                <tr>
                                  <td>
                                    <!-- Profile Image -->
                                    <div style="width: 100%; height: 200px; overflow: hidden; background-color: ${theme.colors.background.alternateSection};">
                                      <img src="${profile.image}" 
                                           alt="${profile.name}" 
                                           width="100%" 
                                           height="200" 
                                           style="display: block; width: 100%; height: 200px; object-fit: cover;" />
                                    </div>
                                    
                                    <!-- Profile Info -->
                                    <div style="padding: 20px;">
                                      ${profile.badge ? `
                                        <span style="${getBadgeStyle(profile.badge)}">
                                          ${profile.badge}
                                        </span>
                                        <div style="margin-bottom: 8px;"></div>
                                      ` : ''}
                                      
                                      <h3 style="margin: 0 0 6px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.lg}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.text.primary}; line-height: 1.2;">
                                        ${profile.name}
                                      </h3>
                                      
                                      <p style="margin: 0 0 12px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; color: ${theme.colors.primary.main}; font-weight: ${theme.typography.fontWeight.medium};">
                                        ${profile.title}
                                      </p>
                                      
                                      ${profile.specialties && profile.specialties.length > 0 ? `
                                        <div style="margin-top: 10px;">
                                          ${profile.specialties.map((specialty: string) => `
                                            <span style="display: inline-block; margin: 0 6px 6px 0; padding: 4px 10px; background-color: ${theme.colors.background.highlight}; color: ${theme.colors.primary.dark}; font-size: ${theme.typography.fontSize.xs}; border-radius: ${theme.borderRadius.full};">
                                              ${specialty}
                                            </span>
                                          `).join('')}
                                        </div>
                                      ` : ''}
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </a>
                          </td>
                          
                          <!-- Spacer -->
                          <td width="4%"></td>
                          
                          ${nextProfile ? `
                            <!-- Second Profile Card in Row -->
                            <td width="48%" valign="top" style="padding-bottom: ${isLastRow ? '0' : '20px'};">
                              <a href="${addTrackingParams('https://glamlink.net/profile/' + nextProfile.id, 'profile_' + nextProfile.id)}" 
                                 style="text-decoration: none; color: inherit; display: block;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                                       style="${getCardStyles(theme)}; overflow: hidden; transition: all 0.3s;">
                                  <tr>
                                    <td>
                                      <!-- Profile Image -->
                                      <div style="width: 100%; height: 200px; overflow: hidden; background-color: ${theme.colors.background.alternateSection};">
                                        <img src="${nextProfile.image}" 
                                             alt="${nextProfile.name}" 
                                             width="100%" 
                                             height="200" 
                                             style="display: block; width: 100%; height: 200px; object-fit: cover;" />
                                      </div>
                                      
                                      <!-- Profile Info -->
                                      <div style="padding: 20px;">
                                        ${nextProfile.badge ? `
                                          <span style="${getBadgeStyle(nextProfile.badge)}">
                                            ${nextProfile.badge}
                                          </span>
                                          <div style="margin-bottom: 8px;"></div>
                                        ` : ''}
                                        
                                        <h3 style="margin: 0 0 6px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.lg}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.text.primary}; line-height: 1.2;">
                                          ${nextProfile.name}
                                        </h3>
                                        
                                        <p style="margin: 0 0 12px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.sm}; color: ${theme.colors.primary.main}; font-weight: ${theme.typography.fontWeight.medium};">
                                          ${nextProfile.title}
                                        </p>
                                        
                                        ${nextProfile && nextProfile.specialties && nextProfile.specialties.length > 0 ? `
                                          <div style="margin-top: 10px;">
                                            ${nextProfile.specialties.map((specialty: string) => `
                                              <span style="display: inline-block; margin: 0 6px 6px 0; padding: 4px 10px; background-color: ${theme.colors.background.highlight}; color: ${theme.colors.primary.dark}; font-size: ${theme.typography.fontSize.xs}; border-radius: ${theme.borderRadius.full};">
                                                ${specialty}
                                              </span>
                                            `).join('')}
                                          </div>
                                        ` : ''}
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </a>
                            </td>
                          ` : '<td width="48%"></td>'}
                        </tr>
                      `;
                    }
                    return '';
                  }).join('')}
                </table>
                
                <!-- View All Link -->
                ${section.viewAllLink ? `
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px;">
                    <tr>
                      <td align="center">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="border-radius: ${theme.borderRadius.md}; background-color: #000000;">
                              <a href="${addTrackingParams(section.viewAllLink, 'view_all_profiles')}" 
                                 style="display: inline-block; padding: 14px 32px; font-family: ${theme.typography.fontFamily.primary}; font-size: ${theme.typography.fontSize.base}; font-weight: ${theme.typography.fontWeight.bold}; color: ${theme.colors.text.inverse}; text-decoration: none; border-radius: ${theme.borderRadius.md};">
                                ${section.viewAllText || 'View All Professionals'}
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
    
    <!-- Mobile Responsive Styles -->
    <style type="text/css">
      @media only screen and (max-width: 600px) {
        /* Stack profile cards on mobile */
        td[width="48%"] {
          width: 100% !important;
          display: block !important;
          padding-bottom: 20px !important;
        }
        
        td[width="4%"] {
          display: none !important;
        }
      }
    </style>
  `;

  // Return the HTML string wrapped in a div with dangerouslySetInnerHTML
  return <div dangerouslySetInnerHTML={{ __html: sectionHtml }} />;
};

export default ViewProfiles;