import React, { useState, useEffect } from 'react';
import { mailchimpService, MailchimpSegment } from '../utils/mailchimpService';

interface MailchimpCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
  emailData: any;
  templateName: string;
}

export default function MailchimpCampaignModal({
  isOpen,
  onClose,
  htmlContent,
  emailData,
  templateName
}: MailchimpCampaignModalProps) {
  const [campaignName, setCampaignName] = useState('');
  const [subjectLine, setSubjectLine] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [targetAudience, setTargetAudience] = useState<'users' | 'pros' | 'both'>('both');
  const [sendOption, setSendOption] = useState<'draft' | 'now' | 'schedule'>('draft');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [testEmails, setTestEmails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [segments, setSegments] = useState<MailchimpSegment[]>([]);
  const [recipientCount, setRecipientCount] = useState<number>(0);

  // Initialize form with email data
  useEffect(() => {
    if (isOpen && emailData) {
      // Auto-populate campaign name from template
      setCampaignName(templateName || 'Email Campaign');
      
      // Try to extract subject from email data
      if (emailData.subject) {
        setSubjectLine(emailData.subject);
      } else if (emailData.sections) {
        // Look for header section title
        const headerSection = emailData.sections.find((s: any) => s.type === 'header');
        if (headerSection?.title) {
          setSubjectLine(headerSection.title.replace(/[✨💎🎯]/g, '').trim());
        }
      }
      
      // Set default preview text
      if (emailData.previewText) {
        setPreviewText(emailData.previewText);
      } else if (emailData.brand?.tagline) {
        setPreviewText(emailData.brand.tagline);
      }
    }
  }, [isOpen, emailData, templateName]);

  // Fetch segments when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchSegments();
    }
  }, [isOpen]);

  // Update recipient count when target audience changes
  useEffect(() => {
    if (segments.length > 0) {
      updateRecipientCount();
    }
  }, [targetAudience, segments]);

  const fetchSegments = async () => {
    try {
      const data = await mailchimpService.getSegments();
      setSegments(data.segments || []);
    } catch (error) {
      console.error('Failed to fetch segments:', error);
      // Continue without segments - will use default audiences
    }
  };

  const updateRecipientCount = async () => {
    try {
      const count = await mailchimpService.getEstimatedRecipients(targetAudience);
      setRecipientCount(count);
    } catch (error) {
      console.error('Failed to get recipient count:', error);
      setRecipientCount(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // Validate required fields
      if (!campaignName || !subjectLine) {
        throw new Error('Campaign name and subject line are required');
      }

      // Prepare schedule time if needed
      let scheduleTimeISO: string | undefined;
      if (sendOption === 'schedule') {
        if (!scheduleDate || !scheduleTime) {
          throw new Error('Please select both date and time for scheduling');
        }
        const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
        if (scheduledDateTime <= new Date()) {
          throw new Error('Scheduled time must be in the future');
        }
        scheduleTimeISO = mailchimpService.formatScheduleTime(scheduledDateTime);
      }

      // Parse test emails
      const testEmailList = testEmails
        ? testEmails.split(',').map(email => email.trim()).filter(email => email)
        : [];

      // Create campaign
      const response = await mailchimpService.createCampaign({
        campaignName,
        subjectLine,
        previewText,
        htmlContent,
        targetAudience,
        sendNow: sendOption === 'now',
        scheduleTime: scheduleTimeISO,
        testEmails: testEmailList
      });

      // Show success message
      if (response.status === 'sent') {
        setSuccess(`Campaign sent successfully! ${recipientCount > 0 ? `Delivered to ~${recipientCount} recipients.` : ''}`);
        if (response.archiveUrl) {
          window.open(response.archiveUrl, '_blank');
        }
      } else if (response.status === 'scheduled') {
        setSuccess(`Campaign scheduled for ${new Date(scheduleTimeISO!).toLocaleString()}`);
      } else {
        setSuccess(`Campaign saved as draft! ${response.editUrl ? 'You can edit it in Mailchimp.' : ''}`);
        if (response.editUrl) {
          // Optionally open edit URL
          const openEdit = confirm('Would you like to open the campaign in Mailchimp to review?');
          if (openEdit) {
            window.open(response.editUrl, '_blank');
          }
        }
      }

      // Reset form after short delay
      setTimeout(() => {
        handleClose();
      }, 3000);

    } catch (error: any) {
      console.error('Campaign creation error:', error);
      setError(error.message || 'Failed to create campaign');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setCampaignName('');
    setSubjectLine('');
    setPreviewText('');
    setTargetAudience('both');
    setSendOption('draft');
    setScheduleDate('');
    setScheduleTime('');
    setTestEmails('');
    setError(null);
    setSuccess(null);
    onClose();
  };

  if (!isOpen) return null;

  // Set minimum date/time for scheduling (1 hour from now)
  const minDateTime = new Date();
  minDateTime.setHours(minDateTime.getHours() + 1);
  const minDate = minDateTime.toISOString().split('T')[0];
  const minTime = minDateTime.toTimeString().slice(0, 5);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Send via Mailchimp</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500"
              disabled={isLoading}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Campaign Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Campaign Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
                placeholder="Internal campaign name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Line <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subjectLine}
                onChange={(e) => setSubjectLine(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
                placeholder="Email subject line"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preview Text
              </label>
              <input
                type="text"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
                placeholder="Preview text shown in inbox"
              />
              <p className="text-xs text-gray-500 mt-1">
                This text appears after the subject line in most email clients
              </p>
            </div>
          </div>

          {/* Target Audience */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Target Audience</h3>
            
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="both"
                  checked={targetAudience === 'both'}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-sm">
                  <span className="font-medium">All Subscribers</span>
                  {recipientCount > 0 && targetAudience === 'both' && (
                    <span className="text-gray-500 ml-2">(~{recipientCount} recipients)</span>
                  )}
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  value="users"
                  checked={targetAudience === 'users'}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-sm">
                  <span className="font-medium">Users Only</span>
                  <span className="text-gray-500 ml-2">General newsletter subscribers</span>
                  {recipientCount > 0 && targetAudience === 'users' && (
                    <span className="text-gray-500 ml-2">(~{recipientCount} recipients)</span>
                  )}
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  value="pros"
                  checked={targetAudience === 'pros'}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-sm">
                  <span className="font-medium">Pros Only</span>
                  <span className="text-gray-500 ml-2">Certified beauty professionals</span>
                  {recipientCount > 0 && targetAudience === 'pros' && (
                    <span className="text-gray-500 ml-2">(~{recipientCount} recipients)</span>
                  )}
                </span>
              </label>
            </div>
          </div>

          {/* Send Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Send Options</h3>
            
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="draft"
                  checked={sendOption === 'draft'}
                  onChange={(e) => setSendOption(e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-sm">
                  <span className="font-medium">Save as Draft</span>
                  <span className="text-gray-500 ml-2">Review in Mailchimp before sending</span>
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  value="now"
                  checked={sendOption === 'now'}
                  onChange={(e) => setSendOption(e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-sm">
                  <span className="font-medium">Send Now</span>
                  <span className="text-gray-500 ml-2">Campaign will be sent immediately</span>
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  value="schedule"
                  checked={sendOption === 'schedule'}
                  onChange={(e) => setSendOption(e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-sm">
                  <span className="font-medium">Schedule for Later</span>
                </span>
              </label>
            </div>

            {sendOption === 'schedule' && (
              <div className="ml-6 space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={minDate}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
                    required={sendOption === 'schedule'}
                  />
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
                    required={sendOption === 'schedule'}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Schedule at least 1 hour in advance (timezone: your local time)
                </p>
              </div>
            )}
          </div>

          {/* Test Emails */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Send Test To (Optional)
            </label>
            <input
              type="text"
              value={testEmails}
              onChange={(e) => setTestEmails(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
              placeholder="email1@example.com, email2@example.com"
            />
            <p className="text-xs text-gray-500">
              Send test emails before the campaign. Separate multiple emails with commas.
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-glamlink-teal rounded-md hover:bg-glamlink-teal-dark disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Campaign...
                </span>
              ) : (
                <>
                  {sendOption === 'now' ? 'Send Campaign' : 
                   sendOption === 'schedule' ? 'Schedule Campaign' : 
                   'Save as Draft'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}