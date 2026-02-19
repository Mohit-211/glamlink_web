import { NextRequest, NextResponse } from "next/server";

// Helper to get Mailchimp configuration
function getMailchimpConfig() {
  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;
  const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX || API_KEY?.split('-').pop();
  const FROM_EMAIL = process.env.MAILCHIMP_FROM_EMAIL || 'noreply@glamlink.com';
  const FROM_NAME = process.env.MAILCHIMP_FROM_NAME || 'Glamlink';

  if (!API_KEY || !LIST_ID) {
    throw new Error("Mailchimp configuration missing");
  }

  return {
    apiKey: API_KEY,
    listId: LIST_ID,
    serverPrefix: SERVER_PREFIX,
    fromEmail: FROM_EMAIL,
    fromName: FROM_NAME,
    baseUrl: `https://${SERVER_PREFIX}.api.mailchimp.com/3.0`
  };
}

// Helper to make authenticated Mailchimp API calls
async function mailchimpRequest(endpoint: string, method: string = 'GET', data?: any) {
  const timestamp = new Date().toISOString();
  const config = getMailchimpConfig();
  const url = `${config.baseUrl}${endpoint}`;

  console.log(`[${timestamp}] Mailchimp API Request: ${method} ${endpoint}`);
  if (data && method !== 'GET') {
    console.log(`[${timestamp}] Request body size: ${JSON.stringify(data).length} bytes`);
  }

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(`anystring:${config.apiKey}`).toString('base64')}`
    }
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  const startTime = Date.now();
  const response = await fetch(url, options);
  const responseTime = Date.now() - startTime;

  console.log(`[${timestamp}] Mailchimp API Response: ${response.status} ${response.statusText} (${responseTime}ms)`);

  // Handle 204 No Content response (success with no body)
  if (response.status === 204) {
    console.log(`[${timestamp}] Mailchimp API Success: ${endpoint} completed (no content)`);
    return { success: true };
  }

  const result = await response.json();

  if (!response.ok) {
    console.error(`[${timestamp}] Mailchimp API Error:`, result);
    throw new Error(result.detail || result.title || 'Mailchimp API error');
  }

  console.log(`[${timestamp}] Mailchimp API Success: ${endpoint} completed`);
  return result;
}

// Create a new campaign
export async function POST(request: NextRequest) {
  const timestamp = new Date().toISOString();

  try {
    const body = await request.json();
    const {
      campaignName,
      subjectLine,
      previewText,
      htmlContent,
      targetAudience, // 'users', 'pros', or 'both'
      sendNow = false,
      scheduleTime,
      testEmails = [],
      useTemplateMode = false, // Flag to use template replication mode
      recipientEmail = null // For welcome emails to specific recipient
    } = body;

    console.log(`[${timestamp}] Mailchimp Campaigns API: Received campaign creation request`);
    console.log(`[${timestamp}] Campaign Name: ${campaignName}`);
    console.log(`[${timestamp}] Subject Line: ${subjectLine}`);
    console.log(`[${timestamp}] Send Now: ${sendNow}`);
    console.log(`[${timestamp}] Use Template Mode: ${useTemplateMode}`);
    console.log(`[${timestamp}] HTML Content Size: ${htmlContent?.length || 0} bytes`)

    // Check if we should use template replication mode
    const templateCampaignId = process.env.MAILCHIMP_TEMPLATE_CAMPAIGN_ID;
    const templateModeEnabled = process.env.MAILCHIMP_USE_TEMPLATE_MODE === 'true';

    if ((useTemplateMode || templateModeEnabled) && templateCampaignId) {
      console.log(`[${timestamp}] 📋 TEMPLATE MODE ACTIVATED - Replicating campaign ${templateCampaignId}`);

      try {
        const config = getMailchimpConfig();

        // Step 1: Replicate the template campaign
        console.log(`[${timestamp}] Step 1: Replicating template campaign ${templateCampaignId}...`);
        const replicatedCampaign = await mailchimpRequest(
          `/campaigns/${templateCampaignId}/actions/replicate`,
          'POST'
        );

        console.log(`[${timestamp}] ✅ Campaign replicated successfully`);
        console.log(`[${timestamp}] New Campaign ID: ${replicatedCampaign.id}`);

        // Step 2: Update campaign settings with our custom subject and name
        console.log(`[${timestamp}] Step 2: Updating replicated campaign settings...`);
        await mailchimpRequest(`/campaigns/${replicatedCampaign.id}`, 'PATCH', {
          settings: {
            subject_line: subjectLine || 'Welcome to Glamlink Magazine! 🌟',
            title: campaignName || `Welcome Email - ${new Date().toISOString()}`,
            preview_text: previewText || 'Your exclusive beauty content awaits...'
          }
        });

        console.log(`[${timestamp}] ✅ Campaign settings updated`);

        // Step 3: Update recipients if specific email provided
        if (recipientEmail) {
          console.log(`[${timestamp}] Step 3: Setting recipient to ${recipientEmail}...`);
          await mailchimpRequest(`/campaigns/${replicatedCampaign.id}`, 'PATCH', {
            recipients: {
              list_id: config.listId,
              segment_opts: {
                match: 'all',
                conditions: [
                  {
                    condition_type: 'EmailAddress',
                    field: 'EMAIL',
                    op: 'is',
                    value: recipientEmail
                  }
                ]
              }
            }
          });
          console.log(`[${timestamp}] ✅ Recipient segment configured`);
        }

        // Step 4: Send the campaign
        if (sendNow) {
          console.log(`[${timestamp}] Step 4: Sending replicated campaign immediately...`);
          await mailchimpRequest(`/campaigns/${replicatedCampaign.id}/actions/send`, 'POST');

          console.log(`[${timestamp}] ✅✅✅ REPLICATED CAMPAIGN SENT SUCCESSFULLY! ✅✅✅`);
          console.log(`[${timestamp}] Campaign ID: ${replicatedCampaign.id}`);
          console.log(`[${timestamp}] Web ID: ${replicatedCampaign.web_id}`);

          return NextResponse.json({
            message: "Campaign sent successfully using template!",
            campaignId: replicatedCampaign.id,
            webId: replicatedCampaign.web_id,
            status: 'sent',
            templateUsed: templateCampaignId
          });
        } else {
          console.log(`[${timestamp}] Campaign replicated but not sent (sendNow=false)`);

          return NextResponse.json({
            message: "Campaign replicated successfully!",
            campaignId: replicatedCampaign.id,
            webId: replicatedCampaign.web_id,
            status: 'saved',
            templateUsed: templateCampaignId,
            editUrl: `https://${config.serverPrefix}.admin.mailchimp.com/campaigns/edit?id=${replicatedCampaign.web_id}`
          });
        }

      } catch (templateError: any) {
        console.error(`[${timestamp}] ❌ Template replication failed:`, templateError);
        console.error(`[${timestamp}] Falling back to regular campaign creation...`);
        // Fall through to regular campaign creation
      }
    }

    // Validate required fields for regular campaign creation
    if (!campaignName || !subjectLine || !htmlContent) {
      return NextResponse.json(
        { error: "Missing required fields: campaignName, subjectLine, htmlContent" },
        { status: 400 }
      );
    }

    // Check if we're in development mode
    if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_LIST_ID) {
      console.log(`[${timestamp}] ⚠️ Development mode - No Mailchimp API keys configured`);
      console.log(`[${timestamp}] Development mode - Would create campaign:`, {
        campaignName,
        subjectLine,
        targetAudience,
        sendNow
      });

      const devCampaignId = "dev-campaign-" + Date.now();
      console.log(`[${timestamp}] Development mode - Returning mock campaign ID: ${devCampaignId}`);

      return NextResponse.json({
        message: "Campaign created successfully! (Development mode)",
        campaignId: devCampaignId,
        webId: 12345,
        status: "save"
      });
    }

    const config = getMailchimpConfig();

    // Step 1: Create a template
    console.log(`[${timestamp}] Step 1: Creating Mailchimp template...`);
    console.log(`[${timestamp}] Template name: ${campaignName} - ${new Date().toISOString()}`);

    const template = await mailchimpRequest('/templates', 'POST', {
      name: `${campaignName} - ${new Date().toISOString()}`,
      html: htmlContent
      // folder_id is optional - omit it instead of passing null
    });

    console.log(`[${timestamp}] ✅ Template created successfully`);
    console.log(`[${timestamp}] Template ID: ${template.id}`);
    console.log(`[${timestamp}] Template Type: ${template.type}`)

    // Step 2: Check if this is a welcome email (single recipient)
    const isWelcomeEmail = campaignName.includes('Welcome Email');
    let segmentOpts = null;

    if (isWelcomeEmail && body.recipientEmail) {
      console.log(`[${timestamp}] This is a welcome email for single recipient: ${body.recipientEmail}`);
      // Create a segment for just this email address
      segmentOpts = {
        match: 'all',
        conditions: [
          {
            condition_type: 'EmailAddress',
            field: 'EMAIL',
            op: 'is',
            value: body.recipientEmail
          }
        ]
      };
    } else if (targetAudience && targetAudience !== 'both') {
      // Use the existing segment logic for targeted campaigns
      segmentOpts = {
        conditions: [
          {
            condition_type: 'StaticSegment',
            field: 'static_segment',
            op: 'static_is',
            value: targetAudience === 'pros' ? 'pros' : 'users'
          }
        ]
      };
    }

    // Step 3: Create the campaign
    console.log(`[${timestamp}] Step 3: Creating Mailchimp campaign...`);
    console.log(`[${timestamp}] List ID: ${config.listId}`);
    console.log(`[${timestamp}] From: ${config.fromName} <${config.fromEmail}>`);

    const campaignData: any = {
      type: 'regular',
      recipients: {
        list_id: config.listId
      },
      settings: {
        subject_line: subjectLine,
        preview_text: previewText || '',
        title: campaignName,
        from_name: config.fromName,
        reply_to: config.fromEmail,
        to_name: '*|FNAME|*', // Merge tag for first name
        authenticate: true,
        auto_footer: false,
        inline_css: true,
        track_opens: true,
        track_clicks: true
      }
    };

    // Add segment if targeting specific audience or individual
    if (segmentOpts) {
      campaignData.recipients.segment_opts = segmentOpts;
      console.log(`[${timestamp}] Using segment to target specific recipients:`, segmentOpts);
    } else {
      console.log(`[${timestamp}] WARNING: No segment specified - will send to entire list!`);
    }

    const campaign = await mailchimpRequest('/campaigns', 'POST', campaignData);

    console.log(`[${timestamp}] ✅ Campaign created successfully`);
    console.log(`[${timestamp}] Campaign ID: ${campaign.id}`);
    console.log(`[${timestamp}] Campaign Web ID: ${campaign.web_id}`);
    console.log(`[${timestamp}] Campaign Status: ${campaign.status}`)

    // Step 4: Set campaign content with the template
    console.log(`[${timestamp}] Step 4: Setting campaign content with template...`);
    console.log(`[${timestamp}] Using template ID: ${template.id}`);

    await mailchimpRequest(`/campaigns/${campaign.id}/content`, 'PUT', {
      template: {
        id: template.id,
        sections: {}
      }
    });

    console.log(`[${timestamp}] ✅ Campaign content set successfully`)

    // Step 5: Send test emails if requested
    if (testEmails && testEmails.length > 0) {
      console.log(`[${timestamp}] Step 5: Sending test emails to ${testEmails.length} recipients...`);
      console.log(`[${timestamp}] Test email recipients: ${testEmails.join(', ')}`);

      await mailchimpRequest(`/campaigns/${campaign.id}/actions/test`, 'POST', {
        test_emails: testEmails,
        send_type: 'html'
      });

      console.log(`[${timestamp}] ✅ Test emails sent successfully`);
    } else {
      console.log(`[${timestamp}] Step 5: Skipping test emails (none requested)`);
    }

    // Step 6: Send or schedule the campaign
    if (sendNow) {
      console.log(`[${timestamp}] Step 6: Sending campaign immediately...`);
      console.log(`[${timestamp}] Triggering send action for campaign ${campaign.id}`);

      await mailchimpRequest(`/campaigns/${campaign.id}/actions/send`, 'POST');

      console.log(`[${timestamp}] ✅✅✅ CAMPAIGN SENT SUCCESSFULLY! ✅✅✅`);
      console.log(`[${timestamp}] Campaign ID: ${campaign.id}`);
      console.log(`[${timestamp}] Web ID: ${campaign.web_id}`);
      console.log(`[${timestamp}] Archive URL: ${campaign.archive_url || 'Not available yet'}`);
      console.log(`[${timestamp}] 📧 Email has been dispatched to recipients`);

      return NextResponse.json({
        message: "Campaign sent successfully!",
        campaignId: campaign.id,
        webId: campaign.web_id,
        status: 'sent',
        archiveUrl: campaign.archive_url
      });
      
    } else if (scheduleTime) {
      console.log(`[${timestamp}] Step 6: Scheduling campaign for ${scheduleTime}...`);

      await mailchimpRequest(`/campaigns/${campaign.id}/actions/schedule`, 'POST', {
        schedule_time: scheduleTime
      });

      console.log(`[${timestamp}] ✅ Campaign scheduled successfully`);
      console.log(`[${timestamp}] Will be sent at: ${scheduleTime}`);

      return NextResponse.json({
        message: "Campaign scheduled successfully!",
        campaignId: campaign.id,
        webId: campaign.web_id,
        status: 'scheduled',
        scheduleTime: scheduleTime
      });
      
    } else {
      // Save as draft
      console.log(`[${timestamp}] Step 6: Campaign saved as draft (not sent)`);
      console.log(`[${timestamp}] Edit URL: https://${config.serverPrefix}.admin.mailchimp.com/campaigns/edit?id=${campaign.web_id}`);

      return NextResponse.json({
        message: "Campaign saved as draft!",
        campaignId: campaign.id,
        webId: campaign.web_id,
        status: 'saved',
        editUrl: `https://${config.serverPrefix}.admin.mailchimp.com/campaigns/edit?id=${campaign.web_id}`
      });
    }

  } catch (error: any) {
    console.error(`[${timestamp}] ❌❌❌ CAMPAIGN CREATION FAILED ❌❌❌`);
    console.error(`[${timestamp}] Error message:`, error.message);
    console.error(`[${timestamp}] Error details:`, error);
    console.error(`[${timestamp}] Stack trace:`, error.stack?.split('\n').slice(0, 5).join('\n'));

    return NextResponse.json(
      {
        error: error.message || "Failed to create campaign",
        details: error
      },
      { status: 500 }
    );
  }
}

// Get campaign status or list segments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Check if we're in development mode
    if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_LIST_ID) {
      if (action === 'segments') {
        return NextResponse.json({
          segments: [
            { id: 'users', name: 'Users', member_count: 100 },
            { id: 'pros', name: 'Pros', member_count: 50 }
          ],
          total_items: 2
        });
      }
      
      return NextResponse.json({
        message: "Development mode - no campaigns",
        campaigns: [],
        total_items: 0
      });
    }

    // Get list segments to show available audiences
    if (action === 'segments') {
      const config = getMailchimpConfig();
      const segments = await mailchimpRequest(`/lists/${config.listId}/segments`);
      
      return NextResponse.json({
        segments: segments.segments || [],
        total_items: segments.total_items || 0
      });
    }

    // Get recent campaigns
    const campaigns = await mailchimpRequest('/campaigns?count=10&sort_field=create_time&sort_dir=DESC');
    
    return NextResponse.json({
      campaigns: campaigns.campaigns || [],
      total_items: campaigns.total_items || 0
    });

  } catch (error: any) {
    console.error("Campaign fetch error:", error);
    
    return NextResponse.json(
      { 
        error: error.message || "Failed to fetch campaign data"
      },
      { status: 500 }
    );
  }
}

// Update campaign (for editing drafts)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, updates } = body;

    if (!campaignId) {
      return NextResponse.json(
        { error: "Campaign ID is required" },
        { status: 400 }
      );
    }

    // Check if we're in development mode
    if (!process.env.MAILCHIMP_API_KEY) {
      return NextResponse.json({
        message: "Campaign updated successfully! (Development mode)",
        campaignId
      });
    }

    // Update campaign settings
    if (updates.settings) {
      await mailchimpRequest(`/campaigns/${campaignId}`, 'PATCH', {
        settings: updates.settings
      });
    }

    // Update campaign content
    if (updates.htmlContent) {
      await mailchimpRequest(`/campaigns/${campaignId}/content`, 'PUT', {
        html: updates.htmlContent
      });
    }

    return NextResponse.json({
      message: "Campaign updated successfully!",
      campaignId
    });

  } catch (error: any) {
    console.error("Campaign update error:", error);
    
    return NextResponse.json(
      { 
        error: error.message || "Failed to update campaign"
      },
      { status: 500 }
    );
  }
}

// Delete campaign
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    if (!campaignId) {
      return NextResponse.json(
        { error: "Campaign ID is required" },
        { status: 400 }
      );
    }

    // Check if we're in development mode
    if (!process.env.MAILCHIMP_API_KEY) {
      return NextResponse.json({
        message: "Campaign deleted successfully! (Development mode)"
      });
    }

    await mailchimpRequest(`/campaigns/${campaignId}`, 'DELETE');

    return NextResponse.json({
      message: "Campaign deleted successfully!"
    });

  } catch (error: any) {
    console.error("Campaign deletion error:", error);
    
    return NextResponse.json(
      { 
        error: error.message || "Failed to delete campaign"
      },
      { status: 500 }
    );
  }
}