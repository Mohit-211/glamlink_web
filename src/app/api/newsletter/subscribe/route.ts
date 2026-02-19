import { NextRequest, NextResponse } from "next/server";
import { welcomeEmailService } from "@/lib/emails/services/welcomeEmailService";
import crypto from "crypto";

// ============================================
// EMAIL SENDING CONFIGURATION
// Set to false to disable welcome emails (still subscribes to list)
// ============================================
const DISABLE_EMAIL_SENDING = false; // Set to true to disable emails

// Mailchimp requires a specific format for the API endpoint
function getMailchimpEndpoint() {
  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;

  if (!API_KEY || !LIST_ID) {
    throw new Error("Mailchimp configuration missing");
  }

  // Extract data center from API key (e.g., "us21" from "key-us21")
  const DC = process.env.MAILCHIMP_SERVER_PREFIX || API_KEY.split('-').pop();

  return {
    url: `https://${DC}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`,
    apiKey: API_KEY
  };
}

export async function POST(request: NextRequest) {
  const timestamp = new Date().toISOString();
  let email = ''; // Declare email outside try block for error handling

  try {
    // Parse request body
    const body = await request.json();
    const { email: emailInput, firstName, lastName, userType, forceWelcomeEmail = false } = body;
    email = emailInput; // Assign to outer scope variable

    console.log(`[${timestamp}] Newsletter subscription initiated for: ${email} (${firstName} ${lastName})`);
    console.log(`[${timestamp}] User type: ${userType || 'users'}`);
    if (forceWelcomeEmail) {
      console.log(`[${timestamp}] ⚠️ Force welcome email flag is set - will send email even if already subscribed`);
    }

    // Validate email
    if (!email || !email.includes("@")) {
      console.error(`[${timestamp}] Invalid email address provided: ${email}`);
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Check if we're in development mode (no Mailchimp keys)
    if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_LIST_ID) {
      console.log(`[${timestamp}] ⚠️ Development mode - No Mailchimp API keys configured`);
      console.log(`[${timestamp}] Development mode - Newsletter subscription:`, { email, firstName, lastName });

      // In development, still trigger the welcome email (it will log instead of sending)
      if (!DISABLE_EMAIL_SENDING) {
        try {
          const magazineIssueUrl = process.env.LATEST_MAGAZINE_URL || 'https://glamlink.net/magazine/issue-103';

          console.log(`[${timestamp}] Development mode - Initiating welcome email process for: ${email}`);
          console.log(`[${timestamp}] Magazine URL: ${magazineIssueUrl}`);

          await welcomeEmailService.sendWelcomeEmail({
            email: email.toLowerCase(),
            firstName: firstName || '',
            lastName: lastName || '',
            magazineIssueUrl
          });

          console.log(`[${timestamp}] ✅ Development mode - Welcome email process completed for: ${email}`);
        } catch (emailError) {
          console.error(`[${timestamp}] ❌ Development mode - Failed to generate welcome email:`, emailError);
        }
      } else {
        console.log(`[${timestamp}] ⚠️ Email sending disabled in development mode - skipping welcome email for: ${email}`);
      }

      // In development, just log and return success
      return NextResponse.json({
        message: "Successfully subscribed! (Development mode)",
        email,
        firstName,
        lastName
      });
    }

    // Get Mailchimp configuration
    const { url, apiKey } = getMailchimpEndpoint();
    console.log(`[${timestamp}] Mailchimp API endpoint configured: ${url.split('/').slice(0, 3).join('/')}`);

    // Prepare data for Mailchimp
    const data = {
      email_address: email.toLowerCase(),
      status: "subscribed", // Use "pending" to require double opt-in
      merge_fields: {
        FNAME: firstName || "",
        LNAME: lastName || "",
      },
      tags: [userType || "users"], // "pros" or "users" based on signup source
    };

    console.log(`[${timestamp}] Subscribing to Mailchimp list with tags: ${data.tags.join(', ')}`);

    // Make request to Mailchimp
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    // Handle Mailchimp response
    if (response.ok) {
      console.log(`[${timestamp}] ✅ Mailchimp subscription successful for: ${email}`);
      console.log(`[${timestamp}] Mailchimp response: ID=${result.id}, Status=${result.status}`);

      // Send welcome email after successful subscription
      if (!DISABLE_EMAIL_SENDING) {
        try {
          console.log(`[${timestamp}] 📧 Starting welcome email process for: ${email}`);

          // Get the latest magazine issue URL (you can customize this)
          const magazineIssueUrl = process.env.LATEST_MAGAZINE_URL || 'https://glamlink.net/magazine/issue-103';
          console.log(`[${timestamp}] Magazine URL for welcome email: ${magazineIssueUrl}`);

          const emailResult = await welcomeEmailService.sendWelcomeEmail({
            email: email.toLowerCase(),
            firstName: firstName || '',
            lastName: lastName || '',
            magazineIssueUrl
          });

          if (emailResult) {
            console.log(`[${timestamp}] ✅ Welcome email sent successfully to: ${email}`);
            console.log(`[${timestamp}] Campaign details:`, emailResult);
          } else {
            console.log(`[${timestamp}] ⚠️ Welcome email service returned null for: ${email}`);
          }
        } catch (emailError) {
          // Log error but don't fail the subscription
          console.error(`[${timestamp}] ❌ Failed to send welcome email to ${email}:`, emailError);
        }
      } else {
        console.log(`[${timestamp}] ⚠️ Email sending disabled - skipping welcome email for: ${email}`);
      }

      return NextResponse.json({
        message: "Successfully subscribed to Glamlink newsletter!",
        email: result.email_address,
      });
    } else {
      // Handle specific Mailchimp errors
      if (result.title === "Member Exists") {
        console.log(`[${timestamp}] ℹ️ Member exists in list, attempting to resubscribe: ${email}`);

        // Try to update the member's status to subscribed (handles unsubscribed users)
        try {
          const emailHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
          const memberUrl = `${url}/${emailHash}`;
          console.log(`[${timestamp}] Updating member status via PUT request to: ${memberUrl}`);

          const updateResponse = await fetch(memberUrl, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
            },
            body: JSON.stringify(data),
          });

          const updateResult = await updateResponse.json();

          if (updateResponse.ok) {
            console.log(`[${timestamp}] ✅ Member resubscribed successfully: ${email}`);
            console.log(`[${timestamp}] Updated status: ${updateResult.status}`);

            // Send welcome email after successful resubscription
            if (!DISABLE_EMAIL_SENDING) {
              try {
                console.log(`[${timestamp}] 📧 Starting welcome email process for resubscribed user: ${email}`);
                const magazineIssueUrl = process.env.LATEST_MAGAZINE_URL || 'https://glamlink.net/magazine/issue-103';

                const emailResult = await welcomeEmailService.sendWelcomeEmail({
                  email: email.toLowerCase(),
                  firstName: firstName || '',
                  lastName: lastName || '',
                  magazineIssueUrl
                });

                if (emailResult) {
                  console.log(`[${timestamp}] ✅ Welcome email sent successfully to resubscribed user: ${email}`);
                }
              } catch (emailError) {
                console.error(`[${timestamp}] ❌ Failed to send welcome email to resubscribed user ${email}:`, emailError);
              }
            } else {
              console.log(`[${timestamp}] ⚠️ Email sending disabled - skipping welcome email for resubscribed user: ${email}`);
            }

            return NextResponse.json({
              message: "Successfully resubscribed to Glamlink newsletter!",
              email: updateResult.email_address,
              resubscribed: true
            });
          }
        } catch (updateError) {
          console.error(`[${timestamp}] ❌ Failed to resubscribe member ${email}:`, updateError);
        }

        // If resubscription failed or member is already subscribed, check if we should force send the welcome email
        if (forceWelcomeEmail && !DISABLE_EMAIL_SENDING) {
          console.log(`[${timestamp}] 📧 Force flag set - sending welcome email despite existing subscription`);

          try {
            const magazineIssueUrl = process.env.LATEST_MAGAZINE_URL || 'https://glamlink.net/magazine/issue-103';
            console.log(`[${timestamp}] Magazine URL for welcome email: ${magazineIssueUrl}`);

            const emailResult = await welcomeEmailService.sendWelcomeEmail({
              email: email.toLowerCase(),
              firstName: firstName || '',
              lastName: lastName || '',
              magazineIssueUrl
            });

            if (emailResult) {
              console.log(`[${timestamp}] ✅ Welcome email sent successfully to existing subscriber: ${email}`);
              console.log(`[${timestamp}] Campaign details:`, emailResult);
            } else {
              console.log(`[${timestamp}] ⚠️ Welcome email service returned null for: ${email}`);
            }
          } catch (emailError) {
            console.error(`[${timestamp}] ❌ Failed to send welcome email to existing subscriber ${email}:`, emailError);
          }
        } else if (DISABLE_EMAIL_SENDING && forceWelcomeEmail) {
          console.log(`[${timestamp}] ⚠️ Email sending disabled - skipping forced welcome email for existing subscriber: ${email}`);
        }

        // Return appropriate response based on whether we tried to send email
        if (forceWelcomeEmail) {
          return NextResponse.json({
            message: "You're already subscribed! Welcome email has been sent for testing.",
            email,
            testEmailSent: true
          });
        }

        return NextResponse.json({
          message: "You're already subscribed!",
          email,
        });
      }

      console.error(`[${timestamp}] ❌ Mailchimp subscription failed for ${email}:`, result);
      console.error(`[${timestamp}] Error details: Status=${response.status}, Title=${result.title}, Detail=${result.detail}`);

      return NextResponse.json(
        {
          error: result.detail || result.title || "Subscription failed. Please try again."
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error(`[${timestamp}] ❌ Newsletter subscription error for ${email}:`, error);

    return NextResponse.json(
      {
        error: "An error occurred while processing your subscription. Please try again later."
      },
      { status: 500 }
    );
  }
}

// Handle other methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}