# Mailchimp Campaign Integration

This document explains how to use the Mailchimp campaign integration feature in the Email Preview UI.

## Overview

The Mailchimp integration allows you to create and send email campaigns directly from the Email Preview page without having to log into Mailchimp. You can target specific audience segments (Users, Pros, or Both) and either send immediately, schedule for later, or save as draft.

## Setup

### 1. Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Required
MAILCHIMP_API_KEY=your_mailchimp_api_key_here
MAILCHIMP_LIST_ID=your_mailchimp_list_id_here
MAILCHIMP_SERVER_PREFIX=us16  # Match the suffix of your API key

# Optional (with defaults)
MAILCHIMP_FROM_EMAIL=noreply@glamlink.com
MAILCHIMP_FROM_NAME=Glamlink
```

### 2. Getting Your Mailchimp Credentials

1. **API Key**: 
   - Log into Mailchimp
   - Go to Account → Extras → API keys
   - Generate a new API key
   - The server prefix is the part after the dash (e.g., "us16" from "key-us16")

2. **List ID**:
   - Go to Audience → All contacts
   - Click Settings → Audience name and defaults
   - Find the "Audience ID" (also called List ID)

### 3. Set Up Audience Tags

In Mailchimp, create two tags for audience segmentation:
- `users` - General newsletter subscribers
- `pros` - Professional/certified beauty providers

## Using the Integration

### 1. Access the Email Preview Page

Navigate to `/magazine/editor/preview` (must be logged in with authorized email)

### 2. Select Your Email Template

1. Choose template type (Thank You, Section-Based, etc.)
2. Select specific layout or configuration
3. Preview the email in the iframe

### 3. Send via Mailchimp

Click the **"Send via Mailchimp"** button (purple button with email icon)

### 4. Configure Campaign Settings

#### Campaign Details
- **Campaign Name**: Internal name for your reference
- **Subject Line**: What recipients see in their inbox
- **Preview Text**: Additional text shown in inbox preview

#### Target Audience
- **All Subscribers**: Send to entire list
- **Users Only**: General subscribers with "users" tag
- **Pros Only**: Professionals with "pros" tag

#### Send Options
- **Save as Draft**: Create campaign but don't send (review in Mailchimp)
- **Send Now**: Send immediately after creation
- **Schedule for Later**: Pick date and time (minimum 1 hour ahead)

#### Test Emails (Optional)
Enter comma-separated emails to receive test before sending

### 5. Submit Campaign

Click the action button:
- "Save as Draft" - Opens in Mailchimp for review
- "Send Campaign" - Sends immediately
- "Schedule Campaign" - Schedules for selected time

## Features

### Automatic Features
- ✅ HTML template upload to Mailchimp
- ✅ Inline CSS for email compatibility
- ✅ Open and click tracking enabled
- ✅ Recipient count estimation
- ✅ Test email sending
- ✅ Campaign scheduling

### Smart Defaults
- Auto-populates campaign name from template
- Extracts subject from email header section
- Uses brand tagline for preview text
- Remembers last used settings

### Error Handling
- Clear error messages for missing fields
- API connection validation
- Schedule time validation (must be future)
- Development mode fallback (works without API keys)

## API Endpoints

### POST `/api/mailchimp/campaigns`
Creates and optionally sends a campaign

**Request Body:**
```json
{
  "campaignName": "Winter Newsletter",
  "subjectLine": "Your Winter Beauty Guide",
  "previewText": "Exclusive tips inside",
  "htmlContent": "<html>...</html>",
  "targetAudience": "both", // or "users" or "pros"
  "sendNow": false,
  "scheduleTime": "2024-01-15T10:00:00+00:00",
  "testEmails": ["test@example.com"]
}
```

**Response:**
```json
{
  "message": "Campaign created successfully!",
  "campaignId": "abc123",
  "webId": 12345,
  "status": "saved", // or "sent" or "scheduled"
  "editUrl": "https://us16.admin.mailchimp.com/campaigns/edit?id=12345"
}
```

### GET `/api/mailchimp/campaigns?action=segments`
Fetches available audience segments

**Response:**
```json
{
  "segments": [
    { "id": "users", "name": "Users", "member_count": 1000 },
    { "id": "pros", "name": "Pros", "member_count": 500 }
  ],
  "total_items": 2
}
```

## Development Mode

When Mailchimp API keys are not configured:
- All features work in "mock" mode
- Console logs show what would be sent
- Success messages indicate development mode
- No actual emails are sent

## Troubleshooting

### Common Issues

1. **"Mailchimp configuration missing"**
   - Check that API key and List ID are set in `.env.local`
   - Restart the development server after adding env vars

2. **"Failed to create campaign"**
   - Verify API key is valid and active
   - Check that List ID matches your audience
   - Ensure server prefix is correct

3. **"Member Exists" error**
   - This is normal - subscriber is already on list
   - Campaign will still be created successfully

4. **Campaign not sending**
   - Check that you have confirmed subscribers
   - Verify from email is verified in Mailchimp
   - Ensure list has active subscribers

### Testing Workflow

1. Start with "Save as Draft" to test creation
2. Send test emails to yourself first
3. Review in Mailchimp before sending
4. Use scheduling for non-urgent campaigns

## Security Notes

- API keys are never exposed to client
- All Mailchimp calls are server-side only
- User authorization required for access
- Rate limiting applied to prevent abuse

## Future Enhancements

Potential improvements for the integration:

- [ ] Campaign templates library
- [ ] A/B testing support
- [ ] Advanced segmentation options
- [ ] Campaign analytics display
- [ ] Bulk campaign operations
- [ ] Email preview in Mailchimp template
- [ ] Merge tag customization
- [ ] Reply-to email customization

## Support

For issues or questions:
1. Check Mailchimp API status: https://status.mailchimp.com/
2. Verify credentials in Mailchimp account
3. Review server logs for detailed errors
4. Test in development mode first