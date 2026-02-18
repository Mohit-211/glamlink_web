import React from 'react';
import { TrackingParams } from '../../types';

interface Story {
  profileName: string;
  profileImage?: string;
  image: string;
  caption?: string;
  storyType?: 'before-after' | 'tutorial' | 'product' | 'review' | 'post';
  timestamp?: string;
  likes?: number;
  comments?: number;
  views?: number;
  tags?: string[];
  isVideo?: boolean;
  storyUrl?: string;
  profileUrl?: string;
}

interface StoryGridData {
  type: 'story-grid';
  title?: string;
  subtitle?: string;
  stories: Story[];
  gridLayout?: 'instagram' | 'masonry' | 'uniform';
  showEngagement?: boolean;
  showTimestamp?: boolean;
  backgroundColor?: string;
  loadMoreUrl?: string;
}

interface StoryGridProps {
  section: StoryGridData;
  tracking: TrackingParams;
}

const StoryGrid: React.FC<StoryGridProps> = ({ section, tracking }) => {
  const {
    title = "Community Stories",
    subtitle,
    stories = [],
    gridLayout = 'instagram',
    showEngagement = true,
    showTimestamp = true,
    backgroundColor = '#f8f9fa',
    loadMoreUrl
  } = section;

  // Helper function to add UTM parameters to URLs
  const addTrackingParams = (url: string, content?: string) => {
    if (!url) return '#';
    const params = new URLSearchParams({
      utm_source: tracking?.utm_source || 'email',
      utm_medium: tracking?.utm_medium || 'email',
      utm_campaign: tracking?.utm_campaign || 'campaign',
      utm_content: content || tracking?.utm_content || 'story_grid'
    });
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  // Get story type display text and icon
  const getStoryTypeDisplay = (type?: string) => {
    switch (type) {
      case 'before-after': return { icon: '✨', text: 'Transformation' };
      case 'tutorial': return { icon: '🎥', text: 'Tutorial' };
      case 'product': return { icon: '🛍️', text: 'Product' };
      case 'review': return { icon: '⭐', text: 'Review' };
      case 'post': return { icon: '📸', text: 'Post' };
      default: return { icon: '📸', text: 'Story' };
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 168) return `${Math.floor(diffHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (!stories || stories.length === 0) return null;

  const displayStories = stories.slice(0, 6); // Limit for email

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
                
                <!-- Stories Grid -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    ${displayStories.slice(0, 3).map((story, index) => {
                      const storyType = getStoryTypeDisplay(story.storyType);
                      return `
                        <td width="33.33%" valign="top" style="padding: 0 8px 16px;">
                          <!-- Story Card -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                                 style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                            <tr>
                              <td style="padding: 0; position: relative;">
                                <!-- Story Image -->
                                ${story.storyUrl ? `
                                  <a href="${addTrackingParams(story.storyUrl, 'story_' + index)}" style="text-decoration: none; color: inherit; display: block;">
                                ` : ''}
                                  <div style="position: relative; width: 100%; height: 240px; overflow: hidden; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                                    <img src="${story.image}" 
                                         alt="${story.caption || 'Story'}" 
                                         width="100%" 
                                         height="240"
                                         style="display: block; width: 100%; height: 240px; object-fit: cover;" />
                                    
                                    <!-- Gradient Overlay -->
                                    <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.6) 100%);"></div>
                                    
                                    <!-- Profile Info (Top) -->
                                    <div style="position: absolute; top: 12px; left: 12px; display: flex; align-items: center;">
                                      ${story.profileImage ? `
                                        <div style="width: 32px; height: 32px; border-radius: 50%; overflow: hidden; border: 2px solid white; margin-right: 8px; background-color: #f0f0f0;">
                                          <img src="${story.profileImage}" 
                                               alt="${story.profileName}" 
                                               width="32" 
                                               height="32"
                                               style="display: block; width: 32px; height: 32px; object-fit: cover;" />
                                        </div>
                                      ` : ''}
                                      <div style="color: white;">
                                        <div style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; line-height: 1.2;">
                                          ${story.profileName}
                                        </div>
                                        ${showTimestamp && story.timestamp ? `
                                          <div style="font-family: Arial, sans-serif; font-size: 10px; opacity: 0.8; line-height: 1.2;">
                                            ${formatTimestamp(story.timestamp)}
                                          </div>
                                        ` : ''}
                                      </div>
                                    </div>
                                    
                                    <!-- Story Type Badge (Top Right) -->
                                    ${story.storyType ? `
                                      <div style="position: absolute; top: 12px; right: 12px;">
                                        <span style="background-color: rgba(255,255,255,0.2); color: white; padding: 4px 8px; border-radius: 12px; font-family: Arial, sans-serif; font-size: 10px; font-weight: bold; backdrop-filter: blur(10px);">
                                          ${storyType.icon} ${storyType.text}
                                        </span>
                                      </div>
                                    ` : ''}
                                    
                                    <!-- Video Play Button -->
                                    ${story.isVideo ? `
                                      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                                        <div style="width: 48px; height: 48px; border-radius: 50%; background-color: rgba(255,255,255,0.3); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center;">
                                          <div style="width: 0; height: 0; border-left: 16px solid white; border-top: 10px solid transparent; border-bottom: 10px solid transparent; margin-left: 3px;"></div>
                                        </div>
                                      </div>
                                    ` : ''}
                                    
                                    <!-- Content & Engagement (Bottom) -->
                                    <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 12px; color: white;">
                                      ${story.caption ? `
                                        <p style="margin: 0 0 8px; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.3; opacity: 0.95;">
                                          ${story.caption.length > 80 ? story.caption.substring(0, 80) + '...' : story.caption}
                                        </p>
                                      ` : ''}
                                      
                                      ${showEngagement ? `
                                        <div style="display: flex; align-items: center; gap: 12px; font-family: Arial, sans-serif; font-size: 10px;">
                                          ${story.likes ? `
                                            <span style="display: flex; align-items: center; gap: 2px;">
                                              <span>❤️</span> ${story.likes}
                                            </span>
                                          ` : ''}
                                          ${story.comments ? `
                                            <span style="display: flex; align-items: center; gap: 2px;">
                                              <span>💬</span> ${story.comments}
                                            </span>
                                          ` : ''}
                                          ${story.views ? `
                                            <span style="display: flex; align-items: center; gap: 2px;">
                                              <span>👁️</span> ${story.views}
                                            </span>
                                          ` : ''}
                                        </div>
                                      ` : ''}
                                      
                                      ${story.tags && story.tags.length > 0 ? `
                                        <div style="margin-top: 6px;">
                                          ${story.tags.slice(0, 2).map(tag => `
                                            <span style="font-family: Arial, sans-serif; font-size: 9px; color: #20c997; margin-right: 6px;">
                                              #${tag}
                                            </span>
                                          `).join('')}
                                        </div>
                                      ` : ''}
                                    </div>
                                  </div>
                                ${story.storyUrl ? '</a>' : ''}
                              </td>
                            </tr>
                          </table>
                        </td>
                      `;
                    }).join('')}
                  </tr>
                  
                  ${displayStories.length > 3 ? `
                    <tr>
                      ${displayStories.slice(3, 6).map((story, index) => {
                        const actualIndex = index + 3;
                        const storyType = getStoryTypeDisplay(story.storyType);
                        return `
                          <td width="33.33%" valign="top" style="padding: 0 8px 16px;">
                            <!-- Story Card -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                                   style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                              <tr>
                                <td style="padding: 0; position: relative;">
                                  <!-- Story Image -->
                                  ${story.storyUrl ? `
                                    <a href="${addTrackingParams(story.storyUrl, 'story_' + actualIndex)}" style="text-decoration: none; color: inherit; display: block;">
                                  ` : ''}
                                    <div style="position: relative; width: 100%; height: 200px; overflow: hidden; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                                      <img src="${story.image}" 
                                           alt="${story.caption || 'Story'}" 
                                           width="100%" 
                                           height="200"
                                           style="display: block; width: 100%; height: 200px; object-fit: cover;" />
                                      
                                      <!-- Gradient Overlay -->
                                      <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.6) 100%);"></div>
                                      
                                      <!-- Profile Info (Top) -->
                                      <div style="position: absolute; top: 10px; left: 10px; display: flex; align-items: center;">
                                        ${story.profileImage ? `
                                          <div style="width: 28px; height: 28px; border-radius: 50%; overflow: hidden; border: 2px solid white; margin-right: 6px; background-color: #f0f0f0;">
                                            <img src="${story.profileImage}" 
                                                 alt="${story.profileName}" 
                                                 width="28" 
                                                 height="28"
                                                 style="display: block; width: 28px; height: 28px; object-fit: cover;" />
                                          </div>
                                        ` : ''}
                                        <div style="color: white;">
                                          <div style="font-family: Arial, sans-serif; font-size: 11px; font-weight: bold;">
                                            ${story.profileName}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      ${story.isVideo ? `
                                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                                          <div style="width: 40px; height: 40px; border-radius: 50%; background-color: rgba(255,255,255,0.3); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center;">
                                            <div style="width: 0; height: 0; border-left: 12px solid white; border-top: 8px solid transparent; border-bottom: 8px solid transparent; margin-left: 2px;"></div>
                                          </div>
                                        </div>
                                      ` : ''}
                                      
                                      <!-- Caption (Bottom) -->
                                      ${story.caption ? `
                                        <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 10px; color: white;">
                                          <p style="margin: 0; font-family: Arial, sans-serif; font-size: 11px; line-height: 1.3;">
                                            ${story.caption.length > 60 ? story.caption.substring(0, 60) + '...' : story.caption}
                                          </p>
                                        </div>
                                      ` : ''}
                                    </div>
                                  ${story.storyUrl ? '</a>' : ''}
                                </td>
                              </tr>
                            </table>
                          </td>
                        `;
                      }).join('')}
                      ${displayStories.length < 6 ? '<td></td>'.repeat(6 - displayStories.length) : ''}
                    </tr>
                  ` : ''}
                </table>
                
                ${loadMoreUrl ? `
                  <!-- Load More Button -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px;">
                    <tr>
                      <td align="center">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="border-radius: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                              <a href="${addTrackingParams(loadMoreUrl, 'load_more_stories')}" 
                                 style="display: inline-block; padding: 14px 28px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 6px;">
                                Load More Stories
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
              ${title ? `
                <h2 style="margin: 0 0 20px; font-family: Arial, sans-serif; font-size: 22px; font-weight: bold; color: #1e3a5f; text-align: center;">
                  ${title}
                </h2>
              ` : ''}
              
              <!-- Mobile Stories Stack -->
              <div style="display: block;">
                ${displayStories.slice(0, 4).map((story, index) => `
                  <div style="margin-bottom: 15px; background-color: #f8f9fa; border-radius: 8px; overflow: hidden;">
                    <!-- Mobile Story -->
                    <div style="position: relative; width: 100%; height: 200px; overflow: hidden;">
                      <img src="${story.image}" 
                           alt="${story.caption || 'Story'}" 
                           width="100%" 
                           height="200"
                           style="display: block; width: 100%; height: 200px; object-fit: cover;" />
                      
                      <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.7) 100%);"></div>
                      
                      <!-- Mobile Profile Info -->
                      <div style="position: absolute; top: 10px; left: 10px; display: flex; align-items: center;">
                        ${story.profileImage ? `
                          <div style="width: 24px; height: 24px; border-radius: 50%; overflow: hidden; border: 1px solid white; margin-right: 6px;">
                            <img src="${story.profileImage}" alt="${story.profileName}" width="24" height="24" style="display: block; width: 24px; height: 24px; object-fit: cover;" />
                          </div>
                        ` : ''}
                        <span style="color: white; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold;">
                          ${story.profileName}
                        </span>
                      </div>
                      
                      <!-- Mobile Caption -->
                      ${story.caption ? `
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 10px; color: white;">
                          <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.3;">
                            ${story.caption.length > 80 ? story.caption.substring(0, 80) + '...' : story.caption}
                          </p>
                        </div>
                      ` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
              
              ${loadMoreUrl ? `
                <div style="text-align: center; margin-top: 20px;">
                  <a href="${addTrackingParams(loadMoreUrl, 'load_more_stories_mobile')}" 
                     style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 6px;">
                    Load More Stories
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

export default StoryGrid;