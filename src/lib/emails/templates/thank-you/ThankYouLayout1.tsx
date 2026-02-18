import React from 'react';
import { ThankYouEmailData } from '../../types';

interface ThankYouLayout1Props {
  data: ThankYouEmailData;
}

const ThankYouLayout1: React.FC<ThankYouLayout1Props> = ({ data }) => {
  const { customer, order, brand, tracking, socialMedia, recommendedProducts, coupon } = data;

  // Helper function to add UTM parameters to URLs
  const addTrackingParams = (url: string, content?: string) => {
    const params = new URLSearchParams({
      utm_source: tracking.utm_source,
      utm_medium: tracking.utm_medium,
      utm_campaign: tracking.utm_campaign,
      utm_content: content || tracking.utm_content
    });
    return `${url}?${params.toString()}`;
  };

  // Create the email HTML as a string for better compatibility
  const emailHtml = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Thank You for Your Order - ${brand.name}</title>
  
  <!--[if mso]>
  <style type="text/css">
    table {border-collapse:collapse;border-spacing:0;margin:0;}
    div, td {padding:0;}
    div {margin:0 !important;}
  </style>
  <![endif]-->

  <style type="text/css">
    /* Email Client Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    
    /* Remove default styles */
    body { margin: 0; padding: 0; width: 100% !important; min-width: 100%; }
    
    /* Mobile Styles */
    @media only screen and (max-width: 600px) {
      .mobile-hide { display: none !important; }
      .mobile-center { text-align: center !important; }
      .container { width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding: 20px !important; }
    }
  </style>
</head>

<body style="margin: 0; padding: 0; word-spacing: normal; background-color: #f4f4f4;">
  <!-- Preheader Text -->
  <div style="display: none; font-size: 1px; color: #333333; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Thank you for your order! Your ${brand.name} products are on their way. Order #${order.orderNumber}
  </div>

  <!-- Email Container -->
  <div role="article" aria-roledescription="email" aria-label="Thank You Email" lang="en" style="text-size-adjust: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    
    <!--[if mso]>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="600">
    <tr>
    <td>
    <![endif]-->
    
    <!-- Main Table -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      
      <!-- Header -->
      <tr>
        <td align="center" style="padding: 40px 20px; background-color: #1e3a5f;">
          <h1 style="margin: 0; font-family: Arial, sans-serif; font-size: 28px; font-weight: bold; color: #ffffff;">
            ${brand.name}
          </h1>
          <p style="margin: 10px 0 0; font-family: Arial, sans-serif; font-size: 14px; color: #b8d4f0;">
            ${brand.tagline}
          </p>
        </td>
      </tr>

      <!-- Thank You Message -->
      <tr>
        <td style="padding: 40px 30px;">
          <h2 style="margin: 0 0 20px; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; color: #333333;">
            Thank You, ${customer.firstName}!
          </h2>
          <p style="margin: 0 0 20px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #666666;">
            Your order has been confirmed and will be shipped soon. We are excited to be part of your beauty journey!
          </p>
        </td>
      </tr>

      <!-- Order Details -->
      <tr>
        <td style="padding: 0 30px 30px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f8f8; border-radius: 8px;">
            <tr>
              <td style="padding: 20px;">
                <h3 style="margin: 0 0 15px; font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #333333;">
                  Order Details
                </h3>
                <p style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 14px; color: #666666;">
                  <strong>Order Number:</strong> ${order.orderNumber}<br />
                  <strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}<br />
                  <strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString()}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Order Items -->
      <tr>
        <td style="padding: 0 30px 30px;">
          <h3 style="margin: 0 0 20px; font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #333333;">
            Your Items
          </h3>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            ${order.items.map((item, index) => `
              <tr>
                <td style="padding-bottom: 20px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td width="80" valign="top">
                        <img src="${item.image}" alt="${item.name}" width="80" height="80" style="display: block; border-radius: 4px;" />
                      </td>
                      <td style="padding-left: 20px;" valign="top">
                        <p style="margin: 0 0 5px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #333333;">
                          ${item.name}
                        </p>
                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; color: #666666;">
                          Quantity: ${item.quantity} &times; $${item.price.toFixed(2)}
                        </p>
                      </td>
                      <td align="right" valign="top">
                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #333333;">
                          $${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            `).join('')}
          </table>
        </td>
      </tr>

      <!-- Order Total -->
      <tr>
        <td style="padding: 0 30px 30px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="border-top: 2px solid #eeeeee; padding-top: 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td align="left">
                      <p style="margin: 0; font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #333333;">
                        Total:
                      </p>
                    </td>
                    <td align="right">
                      <p style="margin: 0; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; color: #1e3a5f;">
                        $${order.totalAmount.toFixed(2)}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Shipping Address -->
      <tr>
        <td style="padding: 0 30px 30px;">
          <h3 style="margin: 0 0 15px; font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #333333;">
            Shipping Address
          </h3>
          <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666666;">
            ${customer.firstName} ${customer.lastName}<br />
            ${order.shippingAddress.street}<br />
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}
          </p>
        </td>
      </tr>

      ${coupon ? `
      <!-- Coupon Section -->
      <tr>
        <td style="padding: 0 30px 30px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fff3e0; border-radius: 8px; border: 2px dashed #ff9800;">
            <tr>
              <td align="center" style="padding: 30px;">
                <h3 style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; color: #ff6b00;">
                  Special Offer Just for You!
                </h3>
                <p style="margin: 0 0 15px; font-family: Arial, sans-serif; font-size: 16px; color: #666666;">
                  Get ${coupon.discount} ${coupon.description}
                </p>
                <div style="margin: 20px 0; padding: 15px; background-color: #ffffff; border-radius: 4px; display: inline-block;">
                  <p style="margin: 0; font-family: Courier, monospace; font-size: 24px; font-weight: bold; color: #ff6b00; letter-spacing: 2px;">
                    ${coupon.code}
                  </p>
                </div>
                <p style="margin: 15px 0 0; font-family: Arial, sans-serif; font-size: 12px; color: #999999;">
                  Valid until ${new Date(coupon.expiryDate).toLocaleDateString()}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      ` : ''}

      ${recommendedProducts && recommendedProducts.length > 0 ? `
      <!-- Recommended Products -->
      <tr>
        <td style="padding: 0 30px 30px;">
          <h3 style="margin: 0 0 20px; font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #333333;">
            You Might Also Like
          </h3>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              ${recommendedProducts.slice(0, 3).map((product, index) => `
                <td width="33%" align="center" style="padding: 0 10px;">
                  <a href="${addTrackingParams(product.url, `recommended_product_${index + 1}`)}" style="text-decoration: none;">
                    <img src="${product.image}" alt="${product.name}" width="150" height="150" style="display: block; border-radius: 4px; margin-bottom: 10px;" />
                    <p style="margin: 0 0 5px; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; color: #333333;">
                      ${product.name}
                    </p>
                    <p style="margin: 0; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #1e3a5f;">
                      $${product.price.toFixed(2)}
                    </p>
                  </a>
                </td>
              `).join('')}
            </tr>
          </table>
        </td>
      </tr>
      ` : ''}

      <!-- CTA Button -->
      <tr>
        <td align="center" style="padding: 0 30px 40px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td align="center" style="border-radius: 4px; background-color: #1e3a5f;">
                <a href="${addTrackingParams(brand.website, 'track_order_button')}" style="display: inline-block; padding: 15px 30px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 4px;">
                  Track Your Order
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding: 30px; background-color: #f8f8f8;">
          <!-- Social Media Links -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
            <tr>
              ${socialMedia.facebook ? `
                <td style="padding: 0 10px;">
                  <a href="${addTrackingParams(socialMedia.facebook, 'social_facebook')}">
                    <img src="https://cdn-icons-png.flaticon.com/32/733/733547.png" alt="Facebook" width="32" height="32" style="display: block;" />
                  </a>
                </td>
              ` : ''}
              ${socialMedia.instagram ? `
                <td style="padding: 0 10px;">
                  <a href="${addTrackingParams(socialMedia.instagram, 'social_instagram')}">
                    <img src="https://cdn-icons-png.flaticon.com/32/2111/2111463.png" alt="Instagram" width="32" height="32" style="display: block;" />
                  </a>
                </td>
              ` : ''}
              ${socialMedia.twitter ? `
                <td style="padding: 0 10px;">
                  <a href="${addTrackingParams(socialMedia.twitter, 'social_twitter')}">
                    <img src="https://cdn-icons-png.flaticon.com/32/733/733579.png" alt="Twitter" width="32" height="32" style="display: block;" />
                  </a>
                </td>
              ` : ''}
              ${socialMedia.tiktok ? `
                <td style="padding: 0 10px;">
                  <a href="${addTrackingParams(socialMedia.tiktok, 'social_tiktok')}">
                    <img src="https://cdn-icons-png.flaticon.com/32/5968/5968812.png" alt="TikTok" width="32" height="32" style="display: block;" />
                  </a>
                </td>
              ` : ''}
            </tr>
          </table>
          
          <!-- Footer Text -->
          <p style="margin: 20px 0 0; font-family: Arial, sans-serif; font-size: 12px; line-height: 18px; color: #999999; text-align: center;">
            &copy; ${new Date().getFullYear()} ${brand.name}. All rights reserved.<br />
            Questions? Contact us at <a href="mailto:${brand.supportEmail}" style="color: #1e3a5f;">${brand.supportEmail}</a><br />
            <br />
            <a href="${addTrackingParams(`${brand.website}/unsubscribe`, 'unsubscribe')}" style="color: #999999; text-decoration: underline;">Unsubscribe</a> | 
            <a href="${addTrackingParams(`${brand.website}/preferences`, 'preferences')}" style="color: #999999; text-decoration: underline;"> Update Preferences</a>
          </p>
        </td>
      </tr>
    </table>

    <!--[if mso]>
    </td>
    </tr>
    </table>
    <![endif]-->
  </div>
</body>
</html>
  `;

  // Return the HTML string wrapped in a div with dangerouslySetInnerHTML
  return <div dangerouslySetInnerHTML={{ __html: emailHtml }} />;
};

export default ThankYouLayout1;