import React from 'react';
import { TrackingParams } from '../../types';

interface Event {
  title: string;
  date: string;
  location: string;
  description?: string;
  type?: string;
  price?: string;
  eventUrl?: string;
  registrationUrl?: string;
  image?: string;
  isVirtual?: boolean;
  capacity?: number;
  organizer?: string;
}

interface EventsListData {
  type: 'events-list';
  title?: string;
  subtitle?: string;
  events: Event[];
  showType?: boolean;
  borderColor?: string;
  backgroundColor?: string;
  viewAllUrl?: string;
  showImages?: boolean;
}

interface EventsListProps {
  section: EventsListData;
  tracking: TrackingParams;
}

const EventsList: React.FC<EventsListProps> = ({ section, tracking }) => {
  const {
    title = "Upcoming Events",
    subtitle,
    events = [],
    showType = true,
    borderColor = '#20c997',
    backgroundColor = '#f8f9fa',
    viewAllUrl,
    showImages = false
  } = section;

  // Helper function to add UTM parameters to URLs
  const addTrackingParams = (url: string, content?: string) => {
    if (!url) return '#';
    const params = new URLSearchParams({
      utm_source: tracking?.utm_source || 'email',
      utm_medium: tracking?.utm_medium || 'email',
      utm_campaign: tracking?.utm_campaign || 'campaign',
      utm_content: content || tracking?.utm_content || 'events_list'
    });
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  // Format date for display
  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
      });
    } catch {
      return dateString;
    }
  };

  if (!events || events.length === 0) return null;

  const displayEvents = events.slice(0, 5); // Limit for email

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
                          📅 ${title}
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
                
                <!-- Events List -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  ${displayEvents.map((event, index) => `
                    <tr>
                      <td style="padding-bottom: ${index < displayEvents.length - 1 ? '20px' : '0'};">
                        <!-- Event Card -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                               style="background-color: #ffffff; border-radius: 12px; border-left: 4px solid ${borderColor}; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                          <tr>
                            ${showImages && event.image ? `
                              <td width="120" valign="top" style="padding: 20px 0 20px 20px;">
                                <!-- Event Image -->
                                <div style="width: 100px; height: 100px; border-radius: 8px; overflow: hidden; background-color: #f0f0f0;">
                                  ${event.eventUrl ? `
                                    <a href="${addTrackingParams(event.eventUrl, `event_image_${index}`)}" style="text-decoration: none; display: block;">
                                  ` : ''}
                                    <img src="${event.image}" 
                                         alt="${event.title}" 
                                         width="100" 
                                         height="100"
                                         style="display: block; width: 100px; height: 100px; object-fit: cover;" />
                                  ${event.eventUrl ? '</a>' : ''}
                                </div>
                              </td>
                            ` : ''}
                            <td valign="top" style="padding: 20px;">
                              <!-- Event Content -->
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td>
                                    <!-- Event Title & Type -->
                                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                                      ${event.eventUrl ? `
                                        <a href="${addTrackingParams(event.eventUrl, `event_title_${index}`)}" style="text-decoration: none; color: inherit;">
                                      ` : ''}
                                        <h4 style="margin: 0; font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #1e3a5f; line-height: 1.3;">
                                          ${event.title}
                                        </h4>
                                      ${event.eventUrl ? '</a>' : ''}
                                      
                                      ${showType && event.type ? `
                                        <span style="background-color: rgba(30, 58, 95, 0.1); color: #1e3a5f; padding: 4px 8px; border-radius: 12px; font-family: Arial, sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                          ${event.type}
                                        </span>
                                      ` : ''}
                                      
                                      ${event.isVirtual ? `
                                        <span style="background-color: #e7f3ff; color: #0066cc; padding: 4px 8px; border-radius: 12px; font-family: Arial, sans-serif; font-size: 11px; font-weight: 600;">
                                          🌐 Virtual
                                        </span>
                                      ` : ''}
                                    </div>
                                    
                                    <!-- Event Details -->
                                    <div style="margin-bottom: 12px;">
                                      <!-- Date & Time -->
                                      <p style="margin: 0 0 4px; font-family: Arial, sans-serif; font-size: 14px; color: #333333; display: flex; align-items: center; gap: 8px;">
                                        <span style="color: ${borderColor};">📅</span>
                                        <strong>${formatEventDate(event.date)}</strong>
                                      </p>
                                      
                                      <!-- Location -->
                                      <p style="margin: 0 0 4px; font-family: Arial, sans-serif; font-size: 14px; color: #333333; display: flex; align-items: center; gap: 8px;">
                                        <span style="color: ${borderColor};">📍</span>
                                        <span>${event.location}</span>
                                      </p>
                                      
                                      ${event.price ? `
                                        <!-- Price -->
                                        <p style="margin: 0 0 4px; font-family: Arial, sans-serif; font-size: 14px; color: #333333; display: flex; align-items: center; gap: 8px;">
                                          <span style="color: ${borderColor};">💰</span>
                                          <span style="font-weight: 600; color: #28a745;">${event.price}</span>
                                        </p>
                                      ` : ''}
                                      
                                      ${event.capacity ? `
                                        <!-- Capacity -->
                                        <p style="margin: 0 0 4px; font-family: Arial, sans-serif; font-size: 14px; color: #333333; display: flex; align-items: center; gap: 8px;">
                                          <span style="color: ${borderColor};">👥</span>
                                          <span>${event.capacity} attendees max</span>
                                        </p>
                                      ` : ''}
                                    </div>
                                    
                                    ${event.description ? `
                                      <!-- Description -->
                                      <p style="margin: 0 0 16px; font-family: Arial, sans-serif; font-size: 14px; color: #666666; line-height: 1.5;">
                                        ${event.description}
                                      </p>
                                    ` : ''}
                                    
                                    ${event.organizer ? `
                                      <!-- Organizer -->
                                      <p style="margin: 0 0 16px; font-family: Arial, sans-serif; font-size: 13px; color: #888888;">
                                        Organized by <strong>${event.organizer}</strong>
                                      </p>
                                    ` : ''}
                                    
                                    <!-- Action Buttons -->
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                      <tr>
                                        ${event.registrationUrl ? `
                                          <td style="padding-right: 10px;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                              <tr>
                                                <td style="border-radius: 6px; background-color: ${borderColor};">
                                                  <a href="${addTrackingParams(event.registrationUrl, `register_${index}`)}" 
                                                     style="display: inline-block; padding: 10px 16px; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 6px;">
                                                    Register Now
                                                  </a>
                                                </td>
                                              </tr>
                                            </table>
                                          </td>
                                        ` : ''}
                                        
                                        ${event.eventUrl ? `
                                          <td>
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                              <tr>
                                                <td style="border-radius: 6px; background-color: transparent; border: 2px solid ${borderColor};">
                                                  <a href="${addTrackingParams(event.eventUrl, `learn_more_${index}`)}" 
                                                     style="display: inline-block; padding: 8px 16px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; color: ${borderColor}; text-decoration: none; border-radius: 6px;">
                                                    Learn More
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
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  `).join('')}
                </table>
                
                ${viewAllUrl ? `
                  <!-- View All Events Button -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px;">
                    <tr>
                      <td align="center">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="border-radius: 6px; background-color: transparent; border: 2px solid #1e3a5f;">
                              <a href="${addTrackingParams(viewAllUrl, 'view_all_events')}" 
                                 style="display: inline-block; padding: 12px 24px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; color: #1e3a5f; text-decoration: none; border-radius: 6px;">
                                View All Events
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
                  📅 ${title}
                </h2>
              ` : ''}
              
              <!-- Mobile Events List -->
              <div style="display: block;">
                ${displayEvents.map((event, index) => `
                  <div style="margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border-left: 3px solid ${borderColor};">
                    <!-- Mobile Event -->
                    <h4 style="margin: 0 0 8px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #1e3a5f;">
                      ${event.title}
                    </h4>
                    
                    <div style="margin-bottom: 8px;">
                      <p style="margin: 0 0 3px; font-family: Arial, sans-serif; font-size: 13px; color: #333333;">
                        📅 ${formatEventDate(event.date)}
                      </p>
                      <p style="margin: 0 0 3px; font-family: Arial, sans-serif; font-size: 13px; color: #333333;">
                        📍 ${event.location}
                      </p>
                      ${event.price ? `
                        <p style="margin: 0 0 3px; font-family: Arial, sans-serif; font-size: 13px; color: #28a745; font-weight: 600;">
                          💰 ${event.price}
                        </p>
                      ` : ''}
                    </div>
                    
                    ${event.description ? `
                      <p style="margin: 0 0 12px; font-family: Arial, sans-serif; font-size: 12px; color: #666666; line-height: 1.4;">
                        ${event.description.length > 100 ? event.description.substring(0, 100) + '...' : event.description}
                      </p>
                    ` : ''}
                    
                    ${event.registrationUrl ? `
                      <div style="text-align: center;">
                        <a href="${addTrackingParams(event.registrationUrl, `register_mobile_${index}`)}" 
                           style="display: inline-block; padding: 8px 16px; background-color: ${borderColor}; color: #ffffff; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; text-decoration: none; border-radius: 6px;">
                          Register Now
                        </a>
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
              
              ${viewAllUrl ? `
                <div style="text-align: center; margin-top: 20px;">
                  <a href="${addTrackingParams(viewAllUrl, 'view_all_events_mobile')}" 
                     style="display: inline-block; padding: 10px 20px; border: 2px solid #1e3a5f; color: #1e3a5f; font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; text-decoration: none; border-radius: 6px;">
                    View All Events
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

export default EventsList;