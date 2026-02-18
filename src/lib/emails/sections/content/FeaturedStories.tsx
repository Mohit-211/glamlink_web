import React from 'react';
import { TrackingParams } from '../../types';

interface FeaturedStory {
  title: string;
  description: string;
  image: string;
  profileName: string;
  profileImage?: string;
  badge?: string;
  storyUrl?: string;
  profileUrl?: string;
}

interface FeaturedStoriesData {
  type: 'featured-stories';
  title?: string;
  subtitle?: string;
  stories: FeaturedStory[];
  gridColumns?: number;
  showBadges?: boolean;
  backgroundColor?: string;
  viewAllUrl?: string;
}

interface FeaturedStoriesProps {
  section: FeaturedStoriesData;
  tracking: TrackingParams;
}

const FeaturedStories: React.FC<FeaturedStoriesProps> = ({ section, tracking }) => {
  const {
    title = "⭐ Featured This Week",
    subtitle,
    stories = [],
    gridColumns = 3,
    showBadges = true,
    backgroundColor = '#f8f9fa',
    viewAllUrl
  } = section;

  // Helper function to add UTM parameters to URLs
  const addTrackingParams = (url: string, content?: string) => {
    if (!url) return '#';
    const params = new URLSearchParams({
      utm_source: tracking?.utm_source || 'email',
      utm_medium: tracking?.utm_medium || 'email',
      utm_campaign: tracking?.utm_campaign || 'campaign',
      utm_content: content || tracking?.utm_content || 'featured_stories'
    });
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  if (!stories || stories.length === 0) return null;

  const columnWidth = gridColumns === 2 ? '50%' : gridColumns === 3 ? '33.33%' : '25%';
  const storiesDisplayed = stories.slice(0, gridColumns * 2); // Show 2 rows max

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
                  ${storiesDisplayed.map((story, index) => {
                    // Create rows of stories based on gridColumns
                    if (index % gridColumns === 0) {
                      const rowStories = storiesDisplayed.slice(index, index + gridColumns);
                      return `
                        <tr>
                          ${rowStories.map(rowStory => `
                            <td width="${columnWidth}" valign="top" style="padding: 0 10px 20px;">
                              <!-- Story Card -->
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                                     style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                                <tr>
                                  <td style="padding: 0; position: relative;">
                                    <!-- Story Image -->
                                    ${rowStory.storyUrl ? `
                                      <a href="${addTrackingParams(rowStory.storyUrl, 'story_' + index)}" style="text-decoration: none; color: inherit; display: block;">
                                    ` : ''}
                                      <div style="position: relative; width: 100%; height: 180px; overflow: hidden; background-color: #f5f5f5;">
                                        <img src="${rowStory.image}" 
                                             alt="${rowStory.title}" 
                                             width="100%" 
                                             height="180"
                                             style="display: block; width: 100%; height: 180px; object-fit: cover;" />
                                        ${showBadges && rowStory.badge ? `
                                          <div style="position: absolute; top: 12px; left: 12px; background-color: rgba(255,255,255,0.9); color: #333333; padding: 4px 8px; border-radius: 12px; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold;">
                                            ${rowStory.badge}
                                          </div>
                                        ` : ''}
                                      </div>
                                    ${rowStory.storyUrl ? '</a>' : ''}
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 15px;">
                                    <!-- Story Content -->
                                    ${rowStory.storyUrl ? `
                                      <a href="${addTrackingParams(rowStory.storyUrl, 'story_title_' + index)}" style="text-decoration: none; color: inherit;">
                                    ` : ''}
                                      <h4 style="margin: 0 0 8px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #1e3a5f; line-height: 1.3;">
                                        ${rowStory.title}
                                      </h4>
                                    ${rowStory.storyUrl ? '</a>' : ''}
                                    
                                    <p style="margin: 0 0 12px; font-family: Arial, sans-serif; font-size: 13px; color: #666666; line-height: 1.4;">
                                      ${rowStory.description}
                                    </p>
                                    
                                    <!-- Profile Info -->
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                      <tr>
                                        <td style="display: flex; align-items: center;">
                                          ${rowStory.profileImage ? `
                                            <div style="width: 24px; height: 24px; border-radius: 50%; overflow: hidden; margin-right: 8px; background-color: #f0f0f0;">
                                              <img src="${rowStory.profileImage}" 
                                                   alt="${rowStory.profileName}" 
                                                   width="24" 
                                                   height="24"
                                                   style="display: block; width: 24px; height: 24px; object-fit: cover;" />
                                            </div>
                                          ` : ''}
                                          ${rowStory.profileUrl ? `
                                            <a href="${addTrackingParams(rowStory.profileUrl, 'profile_' + index)}" style="text-decoration: none; color: #666666; font-family: Arial, sans-serif; font-size: 12px; font-weight: 500;">
                                              ${rowStory.profileName}
                                            </a>
                                          ` : `
                                            <span style="color: #666666; font-family: Arial, sans-serif; font-size: 12px; font-weight: 500;">
                                              ${rowStory.profileName}
                                            </span>
                                          `}
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          `).join('')}
                        </tr>
                      `;
                    }
                    return '';
                  }).filter(Boolean).join('')}
                </table>
                
                ${viewAllUrl ? `
                  <!-- View All Button -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px;">
                    <tr>
                      <td align="center">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="border-radius: 6px; background-color: transparent; border: 2px solid #1e3a5f;">
                              <a href="${addTrackingParams(viewAllUrl, 'view_all_stories')}" 
                                 style="display: inline-block; padding: 12px 24px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; color: #1e3a5f; text-decoration: none; border-radius: 6px;">
                                View All Stories
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

    <!-- Mobile Version -->\
    <!--[if !mso]><!-->\
    <div style="display: none; max-height: 0; overflow: hidden;">\
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" \
             style="display: none; margin: 0 0 30px;">\
        <tr>\
          <td style="padding: 0 20px; background-color: ${backgroundColor};">\
            <div style="background-color: #ffffff; border-radius: 12px; padding: 25px; box-shadow: 0 3px 8px rgba(0,0,0,0.1);">\
              ${title ? `\
                <h2 style="margin: 0 0 20px; font-family: Arial, sans-serif; font-size: 22px; font-weight: bold; color: #1e3a5f; text-align: center;">\
                  ${title}\
                </h2>\
              ` : ''}\
              \
              <!-- Mobile Stories Stack -->\
              <div style="display: block;">\
                ${storiesDisplayed.slice(0, 4).map((story, index) => `\
                  <div style="margin-bottom: 20px; background-color: #f8f9fa; border-radius: 8px; overflow: hidden;">\
                    <div style="display: flex; align-items: flex-start; padding: 15px;">\
                      <!-- Mobile Story Image -->\
                      <div style="width: 80px; height: 80px; border-radius: 6px; overflow: hidden; background-color: #f0f0f0; margin-right: 15px; flex-shrink: 0;">\
                        <img src="${story.image}" \
                             alt="${story.title}" \
                             width="80" \
                             height="80"\
                             style="display: block; width: 80px; height: 80px; object-fit: cover;" />\
                      </div>\
                      \
                      <!-- Mobile Story Content -->\
                      <div style="flex: 1;">\
                        <h4 style="margin: 0 0 6px; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; color: #1e3a5f; line-height: 1.3;">\
                          ${story.title}\
                        </h4>\
                        <p style="margin: 0 0 8px; font-family: Arial, sans-serif; font-size: 12px; color: #666666; line-height: 1.3;">\
                          ${story.description.length > 60 ? story.description.substring(0, 60) + '...' : story.description}\
                        </p>\
                        <span style="color: #666666; font-family: Arial, sans-serif; font-size: 11px;">\
                          ${story.profileName}\
                        </span>\
                      </div>\
                    </div>\
                  </div>\
                `).join('')}\
              </div>\
              \
              ${viewAllUrl ? `\
                <div style="text-align: center; margin-top: 20px;">\
                  <a href="${addTrackingParams(viewAllUrl, 'view_all_stories_mobile')}" \
                     style="display: inline-block; padding: 10px 20px; border: 2px solid #1e3a5f; color: #1e3a5f; font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; text-decoration: none; border-radius: 6px;">\
                    View All Stories\
                  </a>\
                </div>\
              ` : ''}\
            </div>\
          </td>\
        </tr>\
      </table>\
    </div>\
    <!--<![endif]-->\

    <style type="text/css">\
      @media only screen and (max-width: 600px) {\
        /* Hide desktop version on mobile */\
        table[role="presentation"]:not([style*="display: none"]) {\
          display: none !important;\
        }\
        \
        /* Show mobile version */\
        div[style*="display: none"] {\
          display: block !important;\
          max-height: none !important;\
          overflow: visible !important;\
        }\
        \
        div[style*="display: none"] table {\
          display: table !important;\
        }\
      }\
    </style>
  `;

  return <div dangerouslySetInnerHTML={{ __html: sectionHtml }} />;
};

export default FeaturedStories;