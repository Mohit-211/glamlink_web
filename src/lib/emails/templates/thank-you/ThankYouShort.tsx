import React from 'react';
import { ThankYouEmailData } from '../../types';

interface ThankYouShortProps {
  data: ThankYouEmailData;
}

const ThankYouShort: React.FC<ThankYouShortProps> = ({ data }) => {
  const { customer, order, brand, tracking } = data;

  const addTrackingParams = (url: string, content?: string) => {
    const params = new URLSearchParams({
      utm_source: tracking.utm_source,
      utm_medium: tracking.utm_medium,
      utm_campaign: tracking.utm_campaign,
      utm_content: content || tracking.utm_content
    });
    return `${url}?${params.toString()}`;
  };

  // Format the delivery date
  const deliveryDate = new Date(order.estimatedDelivery).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Create the email HTML as a string for better compatibility
  const emailHtml = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Order Confirmation - ${brand.name}</title>
  
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; }
    body { margin: 0; padding: 0; width: 100% !important; }
    
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .mobile-padding { padding: 20px !important; }
    }
  </style>
</head>

<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
  <!-- Preheader -->
  <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Order confirmed! #${order.orderNumber} - Thank you for your purchase at ${brand.name}
  </div>

  <!-- Main Container -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: 0 auto;">
    <!-- Logo Header - Minimal -->
    <tr>
      <td align="center" style="padding: 30px 0; background-color: #ffffff;">
        <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #1e3a5f;">
          ${brand.name}
        </h1>
      </td>
    </tr>

    <!-- Main Content -->
    <tr>
      <td style="background-color: #ffffff; padding: 0 40px 40px;">
        <!-- Success Icon -->
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; width: 80px; height: 80px; border-radius: 50%; background-color: #4caf50; line-height: 80px; font-size: 48px; color: #ffffff;">
            &#10003;
          </div>
        </div>

        <!-- Thank You Message -->
        <h2 style="margin: 0 0 20px; font-size: 28px; font-weight: bold; color: #333333; text-align: center;">
          Thank You, ${customer.firstName}!
        </h2>
        
        <p style="margin: 0 0 30px; font-size: 16px; line-height: 24px; color: #666666; text-align: center;">
          Your order has been confirmed and will be delivered by<br />
          <strong style="color: #333333;">${deliveryDate}</strong>
        </p>

        <!-- Order Summary Box -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa; border-radius: 8px; margin-bottom: 30px;">
          <tr>
            <td style="padding: 25px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="margin: 0 0 5px; font-size: 14px; color: #999999;">ORDER NUMBER</p>
                    <p style="margin: 0 0 15px; font-size: 18px; font-weight: bold; color: #333333;">${order.orderNumber}</p>
                  </td>
                  <td align="right">
                    <p style="margin: 0 0 5px; font-size: 14px; color: #999999;">TOTAL</p>
                    <p style="margin: 0 0 15px; font-size: 24px; font-weight: bold; color: #1e3a5f;">$${order.totalAmount.toFixed(2)}</p>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <p style="margin: 0; font-size: 14px; color: #666666;">
                      <strong>${order.items.length} item${order.items.length !== 1 ? 's' : ''}</strong> will be shipped to:
                    </p>
                    <p style="margin: 10px 0 0; font-size: 14px; color: #666666;">
                      ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- CTA Buttons -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td align="center">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding-right: 10px;">
                    <a href="${addTrackingParams(`${brand.website}/orders/${order.orderNumber}`, 'view_order_button')}" 
                       style="display: inline-block; padding: 12px 24px; background-color: #1e3a5f; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 4px;">
                      View Order Details
                    </a>
                  </td>
                  <td style="padding-left: 10px;">
                    <a href="${addTrackingParams(`${brand.website}/track`, 'track_shipment_button')}" 
                       style="display: inline-block; padding: 12px 24px; background-color: #ffffff; color: #1e3a5f; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 4px; border: 2px solid #1e3a5f;">
                      Track Shipment
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 30px; background-color: #f8f9fa; text-align: center;">
        <p style="margin: 0 0 10px; font-size: 14px; color: #666666;">
          Questions? Contact us at <a href="mailto:${brand.supportEmail}" style="color: #1e3a5f;">${brand.supportEmail}</a>
        </p>
        <p style="margin: 0; font-size: 12px; color: #999999;">
          &copy; ${new Date().getFullYear()} ${brand.name}. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // Return the HTML string wrapped in a div with dangerouslySetInnerHTML
  return <div dangerouslySetInnerHTML={{ __html: emailHtml }} />;
};

export default ThankYouShort;