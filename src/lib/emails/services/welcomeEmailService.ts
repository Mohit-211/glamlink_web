import { mailchimpService } from '../utils/mailchimpService';
import fs from 'fs/promises';
import path from 'path';

export interface WelcomeEmailOptions {
  email: string;
  firstName?: string;
  lastName?: string;
  magazineIssueUrl?: string;
}

class WelcomeEmailService {
  /**
   * Send a welcome email to new magazine subscribers
   */
  async sendWelcomeEmail(options: WelcomeEmailOptions): Promise<any> {
    const { email, firstName = '', lastName = '' } = options;
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] WelcomeEmailService: Starting welcome email process for ${email}`);
    console.log(`[${timestamp}] WelcomeEmailService: Recipient details - Name: ${firstName} ${lastName}`);

    try {
      // Check if template mode is enabled
      const useTemplateMode = process.env.MAILCHIMP_USE_TEMPLATE_MODE === 'true';
      const templateCampaignId = process.env.MAILCHIMP_TEMPLATE_CAMPAIGN_ID;

      let htmlContent = '';

      // Only read HTML if not in template mode
      if (!useTemplateMode || !templateCampaignId) {
        // Read the HTML file directly from the public folder
        const htmlPath = path.join(process.cwd(), 'public', 'email', 'subscribed-final.html');
        console.log(`[${timestamp}] WelcomeEmailService: Reading HTML template from: ${htmlPath}`);

        htmlContent = await fs.readFile(htmlPath, 'utf-8');
        console.log(`[${timestamp}] WelcomeEmailService: HTML template loaded successfully (${htmlContent.length} bytes)`)
      } else {
        console.log(`[${timestamp}] WelcomeEmailService: Template mode enabled - will replicate campaign ${templateCampaignId}`);
      }

      // Create and send the campaign via Mailchimp
      const campaignConfig = {
        campaignName: `Welcome Email - ${firstName || email}`,
        subjectLine: 'Welcome to Glamlink Magazine! 🌟',
        previewText: 'Your exclusive beauty content awaits...',
        htmlContent: htmlContent,
        recipientEmail: email, // IMPORTANT: Send only to this specific email
        sendNow: true, // Send immediately
        testEmails: [], // No test emails for welcome messages
        useTemplateMode: useTemplateMode // Pass template mode flag
      };

      console.log(`[${timestamp}] WelcomeEmailService: Creating Mailchimp campaign with config:`, {
        campaignName: campaignConfig.campaignName,
        subjectLine: campaignConfig.subjectLine,
        recipientEmail: campaignConfig.recipientEmail,
        sendNow: campaignConfig.sendNow,
        useTemplateMode: campaignConfig.useTemplateMode,
        templateId: templateCampaignId || 'N/A',
        htmlSize: htmlContent.length
      });

      const campaignResponse = await mailchimpService.createCampaign(campaignConfig);

      console.log(`[${timestamp}] WelcomeEmailService: ✅ Campaign creation response:`, campaignResponse);

      if (campaignResponse && campaignResponse.campaignId) {
        console.log(`[${timestamp}] WelcomeEmailService: ✅ Welcome email sent successfully to ${email}`);
        console.log(`[${timestamp}] WelcomeEmailService: Campaign ID: ${campaignResponse.campaignId}, Status: ${campaignResponse.status}`);
      } else {
        console.log(`[${timestamp}] WelcomeEmailService: ⚠️ Campaign created but response incomplete`);
      }

      return campaignResponse;

    } catch (error: any) {
      console.error(`[${timestamp}] WelcomeEmailService: ❌ Error sending welcome email to ${email}:`, error);
      console.error(`[${timestamp}] WelcomeEmailService: Error details:`, {
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join('\n')
      });

      // Don't throw error - we don't want to break the subscription flow
      // if email sending fails
      return null;
    }
  }

}

// Export singleton instance
export const welcomeEmailService = new WelcomeEmailService();