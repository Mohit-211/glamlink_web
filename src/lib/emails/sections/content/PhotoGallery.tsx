import React from 'react';
import { TrackingParams } from '../../types';

interface Photo {
  image: string;
  title?: string;
  caption?: string;
  description?: string;
  alt?: string;
  photographer?: string;
  photoUrl?: string;
}

interface PhotoGalleryData {
  type: 'photo-gallery';
  title?: string;
  subtitle?: string;
  photos: Photo[];
  galleryLayout?: 'grid' | 'masonry' | 'carousel';
  columns?: number;
  showCaptions?: boolean;
  showCredits?: boolean;
  backgroundColor?: string;
  viewAllUrl?: string;
}

interface PhotoGalleryProps {
  section: PhotoGalleryData;
  tracking: TrackingParams;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ section, tracking }) => {
  const {
    title = "Photo Gallery",
    subtitle,
    photos = [],
    galleryLayout = 'grid',
    columns = 3,
    showCaptions = true,
    showCredits = false,
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
      utm_content: content || tracking?.utm_content || 'photo_gallery'
    });
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  if (!photos || photos.length === 0) return null;

  const columnWidth = columns === 2 ? '50%' : columns === 3 ? '33.33%' : '25%';
  const displayPhotos = photos.slice(0, columns * 2); // Show 2 rows max for email

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
                          📸 ${title}
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
                
                <!-- Photo Grid -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  ${displayPhotos.map((photo, index) => {
                    // Create rows of photos based on columns
                    if (index % columns === 0) {
                      const rowPhotos = displayPhotos.slice(index, index + columns);
                      return `
                        <tr>
                          ${rowPhotos.map((rowPhoto, photoIndex) => {
                            const actualIndex = index + photoIndex;
                            return `
                              <td width="${columnWidth}" valign="top" style="padding: 0 8px 16px;">
                                <!-- Photo Card -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                                       style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                                  <tr>
                                    <td style="padding: 0; position: relative;">
                                      <!-- Photo Image -->
                                      ${rowPhoto.photoUrl ? `
                                        <a href="${addTrackingParams(rowPhoto.photoUrl, 'photo_' + actualIndex)}" style="text-decoration: none; color: inherit; display: block;">
                                      ` : ''}
                                        <div style="position: relative; width: 100%; height: 200px; overflow: hidden; background-color: #f5f5f5;">
                                          <img src="${rowPhoto.image}" 
                                               alt="${rowPhoto.alt || rowPhoto.title || 'Gallery photo'}" 
                                               width="100%" 
                                               height="200"
                                               style="display: block; width: 100%; height: 200px; object-fit: cover; transition: transform 0.3s ease;" 
                                               onmouseover="this.style.transform='scale(1.05)'"
                                               onmouseout="this.style.transform='scale(1)'" />
                                          
                                          <!-- Hover Overlay -->
                                          ${(showCaptions && (rowPhoto.title || rowPhoto.caption)) || showCredits ? `
                                            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%); opacity: 0; transition: opacity 0.3s ease;" 
                                                 onmouseover="this.style.opacity='1'" 
                                                 onmouseout="this.style.opacity='0'">
                                              <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 15px; color: white;">
                                                ${showCaptions && (rowPhoto.title || rowPhoto.caption) ? `
                                                  <h4 style="margin: 0 0 4px; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; line-height: 1.3;">
                                                    ${rowPhoto.title || rowPhoto.caption}
                                                  </h4>
                                                ` : ''}
                                                ${showCaptions && rowPhoto.caption && rowPhoto.title ? `
                                                  <p style="margin: 0 0 4px; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.3; opacity: 0.9;">
                                                    ${rowPhoto.caption}
                                                  </p>
                                                ` : ''}
                                                ${showCredits && rowPhoto.photographer ? `
                                                  <p style="margin: 0; font-family: Arial, sans-serif; font-size: 10px; opacity: 0.8;">
                                                    📷 ${rowPhoto.photographer}
                                                  </p>
                                                ` : ''}
                                              </div>
                                            </div>
                                          ` : ''}
                                        </div>
                                      ${rowPhoto.photoUrl ? '</a>' : ''}
                                    </td>
                                  </tr>
                                  
                                  ${showCaptions && (rowPhoto.title || rowPhoto.caption || rowPhoto.description) ? `
                                    <tr>
                                      <td style="padding: 12px;">
                                        <!-- Photo Caption -->
                                        ${rowPhoto.title ? `
                                          <h4 style="margin: 0 0 4px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; color: #1e3a5f; line-height: 1.3;">
                                            ${rowPhoto.title}
                                          </h4>
                                        ` : ''}
                                        ${rowPhoto.caption && rowPhoto.title !== rowPhoto.caption ? `
                                          <p style="margin: 0 0 4px; font-family: Arial, sans-serif; font-size: 12px; color: #666666; line-height: 1.4;">
                                            ${rowPhoto.caption}
                                          </p>
                                        ` : ''}
                                        ${rowPhoto.description ? `
                                          <p style="margin: 0; font-family: Arial, sans-serif; font-size: 11px; color: #888888; line-height: 1.3;">
                                            ${rowPhoto.description}
                                          </p>
                                        ` : ''}
                                        ${showCredits && rowPhoto.photographer ? `
                                          <p style="margin: 4px 0 0; font-family: Arial, sans-serif; font-size: 10px; color: #999999;">
                                            Photo by ${rowPhoto.photographer}
                                          </p>
                                        ` : ''}
                                      </td>
                                    </tr>
                                  ` : ''}
                                </table>
                              </td>
                            `;
                          }).join('')}
                          ${rowPhotos.length < columns ? '<td></td>'.repeat(columns - rowPhotos.length) : ''}
                        </tr>
                      `;
                    }
                    return '';
                  }).filter(Boolean).join('')}
                </table>
                
                ${viewAllUrl ? `
                  <!-- View All Photos Button -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px;">
                    <tr>
                      <td align="center">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="border-radius: 6px; background-color: transparent; border: 2px solid #1e3a5f;">
                              <a href="${addTrackingParams(viewAllUrl, 'view_all_photos')}" 
                                 style="display: inline-block; padding: 12px 24px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; color: #1e3a5f; text-decoration: none; border-radius: 6px;">
                                View Full Gallery
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                ` : ''}
                
                ${photos.length > displayPhotos.length ? `
                  <!-- Photos Count Indicator -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 15px;">
                    <tr>
                      <td align="center">
                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 13px; color: #888888;">
                          Showing ${displayPhotos.length} of ${photos.length} photos
                        </p>
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
                  📸 ${title}
                </h2>
              ` : ''}
              
              <!-- Mobile Photo Stack -->
              <div style="display: block;">
                ${displayPhotos.slice(0, 6).map((photo, index) => `
                  <div style="margin-bottom: 20px; background-color: #f8f9fa; border-radius: 8px; overflow: hidden;">
                    <!-- Mobile Photo -->
                    <div style="position: relative; width: 100%; height: 250px; overflow: hidden; background-color: #f0f0f0;">
                      ${photo.photoUrl ? `
                        <a href="${addTrackingParams(photo.photoUrl, `photo_mobile_${index}`)}" style="text-decoration: none; display: block;">
                      ` : ''}
                        <img src="${photo.image}" 
                             alt="${photo.alt || photo.title || 'Gallery photo'}" 
                             width="100%" 
                             height="250"
                             style="display: block; width: 100%; height: 250px; object-fit: cover;" />
                      ${photo.photoUrl ? '</a>' : ''}
                    </div>
                    
                    ${showCaptions && (photo.title || photo.caption) ? `
                      <div style="padding: 15px;">
                        ${photo.title ? `
                          <h4 style="margin: 0 0 6px; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; color: #1e3a5f;">
                            ${photo.title}
                          </h4>
                        ` : ''}
                        ${photo.caption && photo.title !== photo.caption ? `
                          <p style="margin: 0 0 6px; font-family: Arial, sans-serif; font-size: 14px; color: #666666; line-height: 1.4;">
                            ${photo.caption}
                          </p>
                        ` : ''}
                        ${showCredits && photo.photographer ? `
                          <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: #999999;">
                            Photo by ${photo.photographer}
                          </p>
                        ` : ''}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
              
              ${viewAllUrl ? `
                <div style="text-align: center; margin-top: 20px;">
                  <a href="${addTrackingParams(viewAllUrl, 'view_all_photos_mobile')}" 
                     style="display: inline-block; padding: 10px 20px; border: 2px solid #1e3a5f; color: #1e3a5f; font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; text-decoration: none; border-radius: 6px;">
                    View Full Gallery
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
        
        /* Interactive effects fallback for email clients that don't support them */
        img[onmouseover] {
          transition: none !important;
        }
        
        div[onmouseover] {
          opacity: 1 !important;
        }
      }
    </style>
  `;

  return <div dangerouslySetInnerHTML={{ __html: sectionHtml }} />;
};

export default PhotoGallery;