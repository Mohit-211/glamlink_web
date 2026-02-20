// Mailchimp Campaign Service
// Handles communication with the Mailchimp API endpoints

export interface MailchimpCampaignOptions {
  campaignName: string;
  subjectLine: string;
  previewText?: string;
  htmlContent: string;
  targetAudience?: 'users' | 'pros' | 'both';
  recipientEmail?: string; // For single recipient (welcome emails)
  sendNow?: boolean;
  scheduleTime?: string;
  testEmails?: string[];
  useTemplateMode?: boolean; // Use template replication mode
}

export interface MailchimpCampaignResponse {
  message: string;
  campaignId?: string;
  webId?: number;
  status?: string;
  archiveUrl?: string;
  editUrl?: string;
  scheduleTime?: string;
  error?: string;
}

export interface MailchimpSegment {
  id: string;
  name: string;
  member_count: number;
}

class MailchimpService {
  private getBaseUrl() {
    // Use absolute URL - check if we're on server or client
    if (typeof window === 'undefined') {
      // Server-side: use full URL
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      return `${baseUrl}/api/mailchimp/campaigns`;
    } else {
      // Client-side: use origin
      return `${window.location.origin}/api/mailchimp/campaigns`;
    }
  }

  /**
   * Create a new Mailchimp campaign
   */
  async createCampaign(options: MailchimpCampaignOptions): Promise<MailchimpCampaignResponse> {
    const timestamp = new Date().toISOString();
    const baseUrl = this.getBaseUrl();

    console.log(`[${timestamp}] MailchimpService: Creating campaign request`);
    console.log(`[${timestamp}] MailchimpService: Campaign details:`, {
      campaignName: options.campaignName,
      subjectLine: options.subjectLine,
      targetAudience: options.targetAudience,
      sendNow: options.sendNow,
      scheduleTime: options.scheduleTime,
      testEmails: options.testEmails?.length || 0
    });

    try {
      console.log(`[${timestamp}] MailchimpService: Sending POST request to ${baseUrl}`);

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(options),
      });

      console.log(`[${timestamp}] MailchimpService: Response status: ${response.status} ${response.statusText}`);

      const data = await response.json();
      console.log(`[${timestamp}] MailchimpService: Response data:`, data);

      if (!response.ok) {
        console.error(`[${timestamp}] MailchimpService: ❌ Campaign creation failed`);
        console.error(`[${timestamp}] MailchimpService: Error details:`, data);
        throw new Error(data.error || 'Failed to create campaign');
      }

      console.log(`[${timestamp}] MailchimpService: ✅ Campaign created successfully`);
      if (data.campaignId) {
        console.log(`[${timestamp}] MailchimpService: Campaign ID: ${data.campaignId}`);
        console.log(`[${timestamp}] MailchimpService: Status: ${data.status}`);
        if (data.archiveUrl) {
          console.log(`[${timestamp}] MailchimpService: Archive URL: ${data.archiveUrl}`);
        }
      }

      return data;
    } catch (error: any) {
      console.error(`[${timestamp}] MailchimpService: ❌ Error creating campaign:`, error);
      console.error(`[${timestamp}] MailchimpService: Error stack:`, error.stack?.split('\n').slice(0, 3).join('\n'));
      throw error;
    }
  }

  /**
   * Get available segments (user groups)
   */
  async getSegments(): Promise<{ segments: MailchimpSegment[]; total_items: number }> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}?action=segments`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch segments');
      }

      return data;
    } catch (error: any) {
      console.error('Error fetching segments:', error);
      throw error;
    }
  }

  /**
   * Get recent campaigns
   */
  async getRecentCampaigns(): Promise<{ campaigns: any[]; total_items: number }> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(baseUrl, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch campaigns');
      }

      return data;
    } catch (error: any) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  /**
   * Update an existing campaign
   */
  async updateCampaign(campaignId: string, updates: any): Promise<MailchimpCampaignResponse> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(baseUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ campaignId, updates }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update campaign');
      }

      return data;
    } catch (error: any) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  }

  /**
   * Delete a campaign
   */
  async deleteCampaign(campaignId: string): Promise<{ message: string }> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}?campaignId=${campaignId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete campaign');
      }

      return data;
    } catch (error: any) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }

  /**
   * Send a test email for the campaign
   */
  async sendTestEmail(campaignId: string, testEmails: string[]): Promise<{ message: string }> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ campaignId, testEmails }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send test email');
      }

      return data;
    } catch (error: any) {
      console.error('Error sending test email:', error);
      throw error;
    }
  }

  /**
   * Validate Mailchimp configuration
   */
  async validateConfig(): Promise<boolean> {
    try {
      // Try to fetch segments as a way to validate the API connection
      await this.getSegments();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Format date for Mailchimp scheduling (ISO 8601 with timezone)
   */
  formatScheduleTime(date: Date): string {
    // Mailchimp expects ISO 8601 format with timezone
    // Example: "2024-01-15T10:00:00+00:00"
    return date.toISOString().replace('.000Z', '+00:00');
  }

  /**
   * Calculate estimated recipient count based on target audience
   */
  async getEstimatedRecipients(targetAudience: 'users' | 'pros' | 'both'): Promise<number> {
    try {
      const { segments } = await this.getSegments();
      
      if (targetAudience === 'both') {
        // Sum all segments
        return segments.reduce((total, segment) => total + segment.member_count, 0);
      }
      
      // Find specific segment
      const segment = segments.find(s => s.name.toLowerCase() === targetAudience);
      return segment ? segment.member_count : 0;
    } catch (error) {
      console.error('Error getting recipient count:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const mailchimpService = new MailchimpService();