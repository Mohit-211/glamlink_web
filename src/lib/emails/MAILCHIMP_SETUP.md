# Mailchimp Email Setup for Magazine Subscriptions

This guide explains how to set up Mailchimp integration for sending welcome emails when users subscribe through the Magazine listing page.

## Overview

When a user subscribes to the newsletter on the Magazine listing page (`/magazine`), the system:
1. Adds them to your Mailchimp list
2. Automatically sends a welcome email with magazine highlights
3. Stores their subscription status locally to avoid repeated prompts

## Setup Instructions

### 1. Mailchimp Account Configuration

#### Get Your API Key
1. Log into your Mailchimp account at https://mailchimp.com
2. Go to **Account → Extras → API keys**
3. Click **Create A Key**
4. Copy the API key (format: `xxxxxxxxxxxxxxxxxxxxxxxxx-us16`)

#### Get Your List/Audience ID
1. Go to **Audience → All contacts**
2. Click **Settings → Audience name and defaults**
3. Find the **Audience ID** (looks like: `a1b2c3d4e5`)

#### Note Your Data Center
- Look at your API key suffix (e.g., `us16`, `us21`)
- This is your server prefix

### 2. Environment Variables

Add these to your `.env.local` file:

```bash
# Required Mailchimp Configuration
MAILCHIMP_API_KEY=your_api_key_here-us16
MAILCHIMP_LIST_ID=your_list_id_here
MAILCHIMP_SERVER_PREFIX=us16  # Match your API key suffix
MAILCHIMP_FROM_EMAIL=noreply@glamlink.com
MAILCHIMP_FROM_NAME=Glamlink

# Optional Magazine Configuration
LATEST_MAGAZINE_URL=https://glamlink.net/magazine/issue-103
MAILCHIMP_WELCOME_TEMPLATE_ID=254  # Optional: Use existing Mailchimp template
```

### 3. Testing the Integration

#### Development Mode (No Mailchimp Keys)
Without Mailchimp configuration, the system runs in development mode:
- Subscriptions are logged to console
- Welcome email HTML is generated but not sent
- Perfect for local testing

#### Production Mode (With Mailchimp Keys)
With proper configuration:
1. Navigate to `/magazine`
2. Click "Subscribe to Newsletter"
3. Fill in the form
4. Check that:
   - User is added to Mailchimp list
   - Welcome email is sent immediately
   - Subscription status is saved locally

### 4. Welcome Email Customization

#### Using the Default Template
The system uses a pre-configured welcome email template located at:
`/lib/emails/data/custom/Magazine-Welcome.json`

To customize:
1. Edit the JSON file
2. Update sections, images, and links
3. Changes apply immediately

#### Using a Mailchimp Template
If you have an existing Mailchimp template (like campaign ID 254):
1. Set `MAILCHIMP_WELCOME_TEMPLATE_ID=254` in your `.env.local`
2. The system will use that template instead

### 5. Email Content Structure

The welcome email includes:
- **Header**: Welcome message with Glamlink branding
- **Personalized Greeting**: Uses subscriber's first name
- **Magazine Preview**:
  - Main feature article
  - 4 secondary content cards
  - Direct links to magazine sections
- **Call to Action**: Browse all issues button
- **Footer**: Unsubscribe and preference links

### 6. Monitoring & Debugging

#### Check Logs
- Development: Check browser and server console
- Production: Monitor server logs for:
  ```
  Welcome email queued for user@example.com
  Welcome email sent successfully: { campaignId: ... }
  ```

#### Mailchimp Dashboard
1. Go to **Campaigns** to see sent welcome emails
2. Check **Reports** for open rates and clicks
3. View **Audience** to confirm new subscribers

### 7. Common Issues

#### "Mailchimp configuration missing"
- Ensure all required environment variables are set
- Restart the development server after adding variables

#### "Member Exists" Error
- User is already subscribed to the list
- This is handled gracefully - they still see success message

#### Email Not Sending
- Check API key and list ID are correct
- Verify server prefix matches your data center
- Check Mailchimp account is active and not paused

#### CORS or Network Errors
- Mailchimp API is called server-side, not from browser
- Check your API key has proper permissions

### 8. Advanced Features

#### Segmentation
The system tags subscribers with `"users"` by default. You can:
- Create segments in Mailchimp based on tags
- Send targeted campaigns to magazine subscribers

#### Automation
Set up Mailchimp automations to:
- Send weekly magazine updates
- Re-engage inactive subscribers
- Celebrate subscription anniversaries

#### Analytics
Track in Mailchimp:
- Open rates for welcome emails
- Click-through rates on magazine links
- Subscriber growth over time

## API Endpoints

### Newsletter Subscribe
**POST** `/api/newsletter/subscribe`
```json
{
  "email": "user@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "userType": "users"
}
```

### Campaign Creation (Internal)
**POST** `/api/mailchimp/campaigns`
- Automatically called by welcome email service
- Creates and sends campaign immediately

## File Structure

```
/lib/emails/
├── services/
│   └── welcomeEmailService.ts    # Welcome email logic
├── data/custom/
│   └── Magazine-Welcome.json     # Email template
└── utils/
    └── mailchimpService.ts       # Mailchimp API wrapper

/app/api/
└── newsletter/
    └── subscribe/
        └── route.ts              # Subscribe endpoint
```

## Support

For issues or questions:
- Check Mailchimp status: https://status.mailchimp.com
- Review Mailchimp API docs: https://mailchimp.com/developer/
- Contact support@glamlink.com

## Security Notes

- Never commit `.env.local` to version control
- Keep API keys secure and rotate regularly
- Use environment variables for all sensitive data
- Monitor Mailchimp account for unusual activity