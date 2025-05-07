import nodemailer from 'nodemailer';
import twilio from 'twilio';
import type { InsertContactSubmission, InsertServiceRequest } from '@shared/schema';

// Brevo (formerly Sendinblue) SMTP configuration - has generous free tier (300 emails/day)
// You can also use other services like Gmail or Zoho Mail by changing these settings
const createTransporter = () => {
  // Default config for Brevo SMTP
  const host = process.env.EMAIL_HOST || 'smtp-relay.brevo.com';
  const port = parseInt(process.env.EMAIL_PORT || '587');
  const user = process.env.EMAIL_USER || '';
  const pass = process.env.EMAIL_PASS || '';

  if (!user || !pass) {
    console.warn('Email credentials not set. Email notifications will not work.');
    // Return a dummy transporter for development
    return {
      sendMail: async () => {
        console.log('Email would be sent here if credentials were configured');
        return true;
      }
    };
  }

  return nodemailer.createTransport({
    host,
    port,
    auth: { user, pass },
    secure: false, // true for 465, false for other ports
  });
};

const transporter = createTransporter();

// Initialize Twilio
const getTwilioClient = () => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn('Twilio credentials not set. SMS functionality will not work.');
    return null;
  }
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
};

// Admin email address
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'samuelmarandi6@gmail.com';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '+918280320550';
const SITE_NAME = 'Samuel Marndi - Web Developer & Digital Marketer';

// Send email using Brevo/Sendinblue SMTP
export async function sendEmail(
  to: string, 
  subject: string, 
  html: string, 
  text?: string
): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `${SITE_NAME} <noreply@samuelmarndi.in>`,
      to,
      subject,
      html,
      text: text || ''
    });
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// Send SMS using Twilio
export async function sendSMS(to: string, message: string): Promise<boolean> {
  try {
    const client = getTwilioClient();
    if (!client) return false;
    
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER || '',
      to
    });
    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
}

// Send notification to admin when contact form submitted
export async function sendContactNotification(submission: InsertContactSubmission): Promise<boolean> {
  const subject = `New Contact Form Submission: ${submission.subject || 'No Subject'}`;
  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${submission.name}</p>
    <p><strong>Email:</strong> ${submission.email}</p>
    <p><strong>Phone:</strong> ${submission.phone || 'Not provided'}</p>
    <p><strong>Service Interest:</strong> ${submission.serviceInterest || 'Not specified'}</p>
    <p><strong>Source:</strong> ${submission.source || 'Website'}</p>
    <p><strong>Subject:</strong> ${submission.subject || 'No subject'}</p>
    <p><strong>Message:</strong></p>
    <p>${submission.message}</p>
  `;

  // Also send SMS notification
  const smsText = `New contact from ${submission.name}. Subject: ${submission.subject || 'None'}. Please check your dashboard.`;
  sendSMS(ADMIN_PHONE, smsText).catch(console.error);

  return sendEmail(ADMIN_EMAIL, subject, html);
}

// Send notification to admin when service request submitted
export async function sendServiceRequestNotification(request: InsertServiceRequest): Promise<boolean> {
  const subject = `New Service Request: ${request.projectDescription.substring(0, 30)}...`;
  const html = `
    <h2>New Service Request Submission</h2>
    <p><strong>Name:</strong> ${request.name}</p>
    <p><strong>Email:</strong> ${request.email}</p>
    <p><strong>Phone:</strong> ${request.phone || 'Not provided'}</p>
    <p><strong>Company:</strong> ${request.company || 'Not provided'}</p>
    <p><strong>Service ID:</strong> ${request.serviceId}</p>
    <p><strong>Budget:</strong> ${request.budget || 'Not specified'}</p>
    <p><strong>Timeline:</strong> ${request.timeline || 'Not specified'}</p>
    <p><strong>Project Description:</strong></p>
    <p>${request.projectDescription}</p>
  `;

  // Also send SMS notification
  const smsText = `New service request from ${request.name}. Please check your dashboard.`;
  sendSMS(ADMIN_PHONE, smsText).catch(console.error);

  return sendEmail(ADMIN_EMAIL, subject, html);
}

// Reply to contact submissions
export async function sendContactReply(
  email: string,
  name: string,
  subject: string,
  message: string
): Promise<boolean> {
  const html = `
    <h2>Hello ${name},</h2>
    <p>${message.replace(/\n/g, '<br/>')}</p>
    <p>Best regards,</p>
    <p>Samuel Marndi</p>
    <p><small>This is in response to your earlier submission.</small></p>
  `;

  return sendEmail(email, subject, html);
}

// Send email campaign to a list of recipients
export async function sendCampaignEmail(
  recipients: { email: string; name: string }[],
  subject: string,
  campaignHtml: string
): Promise<{ success: number; failed: number }> {
  let successCount = 0;
  let failedCount = 0;

  // Process in batches to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    
    const results = await Promise.all(
      batch.map(recipient => {
        const personalized = campaignHtml.replace(/{{name}}/g, recipient.name);
        return sendEmail(recipient.email, subject, personalized);
      })
    );
    
    successCount += results.filter(Boolean).length;
    failedCount += results.filter(result => !result).length;
    
    // Pause between batches to avoid hitting rate limits
    if (i + batchSize < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return { success: successCount, failed: failedCount };
}

// Send a bulk SMS campaign
export async function sendCampaignSMS(
  recipients: { phone: string; name: string }[],
  messageTemplate: string
): Promise<{ success: number; failed: number }> {
  let successCount = 0;
  let failedCount = 0;
  
  const client = getTwilioClient();
  if (!client) return { success: 0, failed: recipients.length };

  // Process in batches to avoid rate limits
  const batchSize = 5;
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    
    const results = await Promise.all(
      batch.map(recipient => {
        const personalized = messageTemplate.replace(/{{name}}/g, recipient.name);
        return sendSMS(recipient.phone, personalized);
      })
    );
    
    successCount += results.filter(Boolean).length;
    failedCount += results.filter(result => !result).length;
    
    // Pause between batches to avoid hitting rate limits
    if (i + batchSize < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return { success: successCount, failed: failedCount };
}

// Send notification for partner application submissions
export async function sendPartnerApplicationNotification(application: any): Promise<boolean> {
  const subject = `New Partner Application from ${application.name}`;
  const html = `
    <h2>New Partner Application</h2>
    <p><strong>Name:</strong> ${application.name}</p>
    <p><strong>Email:</strong> ${application.email}</p>
    <p><strong>Phone:</strong> ${application.phone || 'Not provided'}</p>
    <p><strong>Company:</strong> ${application.company || 'Not provided'}</p>
    <p><strong>Website:</strong> ${application.website || 'Not provided'}</p>
    <p><strong>Partnership Type:</strong> ${application.partnershipType || 'Not specified'}</p>
    <p><strong>Message:</strong></p>
    <p>${application.message}</p>
  `;

  // Also send SMS notification
  const smsText = `New partner application from ${application.name}. Please check your dashboard.`;
  sendSMS(ADMIN_PHONE, smsText).catch(console.error);

  return sendEmail(ADMIN_EMAIL, subject, html);
}

// Send notification for hire/job requests
export async function sendHireRequestNotification(request: any): Promise<boolean> {
  const subject = `New Hire Request from ${request.name}`;
  const html = `
    <h2>New Hire/Job Request</h2>
    <p><strong>Name:</strong> ${request.name}</p>
    <p><strong>Email:</strong> ${request.email}</p>
    <p><strong>Phone:</strong> ${request.phone || 'Not provided'}</p>
    <p><strong>Company:</strong> ${request.company || 'Not provided'}</p>
    <p><strong>Position:</strong> ${request.position || 'Not specified'}</p>
    <p><strong>Budget:</strong> ${request.budget || 'Not specified'}</p>
    <p><strong>Timeline:</strong> ${request.timeline || 'Not specified'}</p>
    <p><strong>Project Details:</strong></p>
    <p>${request.details}</p>
  `;

  // Also send SMS notification
  const smsText = `New hire request from ${request.name}. Please check your dashboard.`;
  sendSMS(ADMIN_PHONE, smsText).catch(console.error);

  return sendEmail(ADMIN_EMAIL, subject, html);
}