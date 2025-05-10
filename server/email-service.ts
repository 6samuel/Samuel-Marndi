import nodemailer from 'nodemailer';
import twilio from 'twilio';
import type { InsertContactSubmission, InsertServiceRequest } from '@shared/schema';

// Brevo (formerly Sendinblue) SMTP configuration - has generous free tier (300 emails/day)
const createTransporter = () => {
  // Check if Brevo API key is available
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ Brevo API key not set. Email notifications will not work.');
    // Return a dummy transporter for development
    return {
      sendMail: async () => {
        console.log('📧 Email would be sent here if BREVO_API_KEY was configured');
        return { messageId: 'dummy-id-for-development' };
      }
    };
  }
  
  console.log('🔑 Brevo API key is configured. Setting up SMTP transporter.');

  // Use Brevo API key for authentication
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: 'mail@samuelmarndi.com', // Use the verified sender email
        pass: apiKey,   // Use the Brevo API key
      },
      secure: false, // true for 465, false for other ports
    });
    
    console.log('📧 Brevo SMTP transporter created successfully');
    return transporter;
  } catch (error) {
    console.error('❌ Failed to create email transporter:', error);
    throw error;
  }
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

// Admin email address - guaranteed delivery for notifications
const ADMIN_EMAIL = 'samuelmarandi6@gmail.com'; // Direct setting to ensure delivery
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
    // First check if API key is available
    if (!process.env.BREVO_API_KEY) {
      console.error('Email sending failed: Missing BREVO_API_KEY. Please configure your Brevo API key in environment variables.');
      return false;
    }
    
    // Log attempt to help with debugging
    console.log(`Attempting to send email: To: ${to}, Subject: ${subject} using Brevo SMTP`);
    
    // Send the email using the transporter
    const info = await transporter.sendMail({
      from: `${SITE_NAME} <mail@samuelmarndi.com>`,
      to,
      subject,
      html,
      text: text || ''
    });
    
    // Log the successful email send
    console.log('Email sent successfully. Response:', JSON.stringify(info));
    return true;
  } catch (error) {
    console.error('Failed to send email - DETAILED ERROR:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
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

// Email template for submission confirmations
const generateSubmissionConfirmationEmail = (name: string, type: string, details: any) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Common template
  let detailsHtml = '';
  Object.entries(details).forEach(([key, value]) => {
    if (key !== 'name' && key !== 'email' && value && typeof value === 'string') {
      const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
      detailsHtml += `<p><strong>${formattedKey}:</strong> ${value}</p>`;
    }
  });
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Submission Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; }
    .logo { max-width: 150px; height: auto; }
    .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
    .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #888; }
    .highlight { color: #f97316; font-weight: bold; }
    .details { background-color: #fff; padding: 15px; border-left: 3px solid #f97316; margin: 15px 0; }
    .button { display: inline-block; background-color: #f97316; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="header">
    <h2>Samuel Marndi <span class="highlight">Digital Services</span></h2>
  </div>
  
  <div class="content">
    <h2>Thank You for Your Submission!</h2>
    <p>Hello ${name},</p>
    <p>I've received your ${type} submission on ${currentDate}. Thank you for reaching out!</p>
    <p><strong>I will contact you as soon as possible</strong> - typically within 24 hours. Your request is important to me, and I'm already reviewing your details.</p>
    
    <div class="details">
      <h3>Your submission details:</h3>
      ${detailsHtml}
    </div>
    
    <p>If you have any questions in the meantime or need an immediate response, feel free to:</p>
    <ul style="list-style-type: none; padding-left: 0;">
      <li>📞 Call or WhatsApp: <strong>+91 82803 20550</strong></li>
      <li>📧 Email directly: <strong>samuelmarandi6@gmail.com</strong></li>
    </ul>
    
    <p>I'm excited to discuss how I can help with your project and will be in touch very soon.</p>
    
    <p>Best regards,<br>
    <strong>Samuel Marndi</strong><br>
    Web Developer & Digital Marketer</p>
    
    <a href="https://samuelmarndi.com/services" class="button">Explore My Services</a>
  </div>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} Samuel Marndi. All rights reserved.</p>
    <p>This is an automated confirmation of your submission. Please do not reply to this email with sensitive information.</p>
  </div>
</body>
</html>`;
};

// Send confirmation email to the user who submitted a form
export async function sendSubmissionConfirmation(submission: any): Promise<boolean> {
  // Extract the data
  const { name, email, type = 'contact form', subject } = submission;
  
  if (!email) {
    console.error('Cannot send confirmation: No email provided');
    return false;
  }
  
  // Determine confirmation subject based on submission type
  let confirmationSubject = 'Thank you for your submission';
  if (type === 'quick-quote' || type === 'quote') {
    confirmationSubject = 'Your Quote Request Has Been Received';
  } else if (type === 'contact') {
    confirmationSubject = 'Thank You for Contacting Samuel Marndi';
  } else if (type === 'service-request') {
    confirmationSubject = 'Your Service Request Has Been Received';
  } else if (subject) {
    confirmationSubject = `Regarding: ${subject}`;
  }
  
  // Generate HTML email
  const html = generateSubmissionConfirmationEmail(name, type, submission);
  
  // Send email
  return sendEmail(email, confirmationSubject, html);
}

// Send notification to admin when contact form submitted
export async function sendContactNotification(submission: InsertContactSubmission): Promise<boolean> {
  console.log('📧 Processing contact notification for submission:', JSON.stringify(submission, null, 2));
  
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

  console.log(`📱 Attempting to send SMS notification to admin phone: ${ADMIN_PHONE}`);
  // Also send SMS notification
  const smsText = `New contact from ${submission.name}. Subject: ${submission.subject || 'None'}. Please check your dashboard.`;
  try {
    await sendSMS(ADMIN_PHONE, smsText);
    console.log('📱 SMS notification sent successfully');
  } catch (error) {
    console.error('Failed to send SMS notification:', error);
  }
  
  // Send confirmation email to the user
  let userEmailSent = false;
  if (submission.email) {
    console.log(`📧 Sending confirmation email to user: ${submission.email}`);
    try {
      userEmailSent = await sendSubmissionConfirmation(submission);
      console.log(`📧 User confirmation email ${userEmailSent ? 'sent successfully' : 'failed to send'}`);
    } catch (err) {
      console.error('Failed to send confirmation email:', err);
    }
  }

  console.log(`📧 Sending admin notification email to: ${ADMIN_EMAIL}`);
  const adminEmailSent = await sendEmail(ADMIN_EMAIL, subject, html);
  console.log(`📧 Admin notification email ${adminEmailSent ? 'sent successfully' : 'failed to send'}`);
  
  // Return true if either admin email or user confirmation was sent successfully
  return adminEmailSent || userEmailSent;
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
  
  // Send confirmation email to the user
  if (request.email) {
    sendSubmissionConfirmation({
      ...request,
      type: 'service-request'
    }).catch(err => {
      console.error('Failed to send service request confirmation email:', err);
    });
  }

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
  
  // Send confirmation email to the user
  if (application.email) {
    sendSubmissionConfirmation({
      ...application,
      type: 'partnership',
      subject: 'Partnership Application'
    }).catch(err => {
      console.error('Failed to send partner application confirmation email:', err);
    });
  }

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
    <p>${request.details || request.servicesNeeded || request.message || ''}</p>
  `;

  // Also send SMS notification
  const smsText = `New hire request from ${request.name}. Please check your dashboard.`;
  sendSMS(ADMIN_PHONE, smsText).catch(console.error);
  
  // Send confirmation email to the user
  if (request.email) {
    sendSubmissionConfirmation({
      ...request,
      type: 'hire-request',
      subject: 'Hire Request Submission'
    }).catch(err => {
      console.error('Failed to send hire request confirmation email:', err);
    });
  }

  return sendEmail(ADMIN_EMAIL, subject, html);
}

// Send consultation confirmation email
export async function sendConsultationConfirmation(consultation: any): Promise<boolean> {
  const meetingLinkText = consultation.meetingLink 
    ? `<p>You can join the consultation using this link: <a href="${consultation.meetingLink}" style="color: #007bff;">${consultation.meetingLink}</a></p>` 
    : '<p>A meeting link will be shared with you closer to the appointment time.</p>';

  const paymentStatusText = consultation.paymentStatus === 'paid' 
    ? '<p style="color: #28a745;">✓ Payment Received</p>' 
    : '<p style="color: #dc3545;">⚠ Payment Pending - Please complete your payment to confirm the consultation.</p>';

  const messageHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Your Consultation is Confirmed</h2>
      <p>Hello ${consultation.name},</p>
      <p>Your consultation has been confirmed. Here are the details:</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Date:</strong> ${new Date(consultation.date).toDateString()}</p>
        <p><strong>Time:</strong> ${consultation.timeSlot}</p>
        <p><strong>Topic:</strong> ${consultation.topic}</p>
        ${paymentStatusText}
      </div>
      ${meetingLinkText}
      <p>If you need to reschedule or have any questions, please reply to this email or contact me directly.</p>
      <p>I'm looking forward to our meeting!</p>
      <p>Best regards,<br>Samuel Marndi</p>
    </div>
  `;

  return await sendEmail(
    consultation.email,
    "Your Consultation is Confirmed", 
    messageHtml
  );
}

// Send consultation reminder email
export async function sendConsultationReminder(consultation: any): Promise<boolean> {
  const meetingLinkText = consultation.meetingLink 
    ? `<p>You can join the consultation using this link: <a href="${consultation.meetingLink}" style="color: #007bff;">${consultation.meetingLink}</a></p>` 
    : '<p>A meeting link will be shared with you before the appointment time.</p>';

  const paymentStatusText = consultation.paymentStatus === 'paid' 
    ? '<p style="color: #28a745;">✓ Payment Received</p>' 
    : '<p style="color: #dc3545;">⚠ Payment Pending - Please complete your payment as soon as possible to avoid cancellation.</p>';

  const messageHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Reminder: Upcoming Consultation</h2>
      <p>Hello ${consultation.name},</p>
      <p>This is a friendly reminder about your upcoming consultation. Here are the details:</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Date:</strong> ${new Date(consultation.date).toDateString()}</p>
        <p><strong>Time:</strong> ${consultation.timeSlot}</p>
        <p><strong>Topic:</strong> ${consultation.topic}</p>
        ${paymentStatusText}
      </div>
      ${meetingLinkText}
      <p>If you need to reschedule or have any questions, please reply to this email or contact me directly.</p>
      <p>I'm looking forward to our meeting!</p>
      <p>Best regards,<br>Samuel Marndi</p>
    </div>
  `;

  return await sendEmail(
    consultation.email,
    "Reminder: Upcoming Consultation",
    messageHtml
  );
}