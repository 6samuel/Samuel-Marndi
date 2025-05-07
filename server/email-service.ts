import { MailService } from '@sendgrid/mail';
import { InsertContactSubmission, InsertServiceRequest } from '../shared/schema';

// Initialize SendGrid client
const mailService = new MailService();

// Check if SendGrid API key is set
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('SENDGRID_API_KEY not set. Email notifications will not be sent.');
}

// Recipient email address (Samuel's email)
const RECIPIENT_EMAIL = 'samuelmarandi6@gmail.com';
const SENDER_EMAIL = 'noreply@samuelmarndi.in'; // Replace with your actual domain

// Function to send contact form submission notification
export async function sendContactNotification(submission: InsertContactSubmission): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY not set. Email notification not sent for contact submission.');
    return false;
  }

  try {
    const phoneInfo = submission.phone ? `Phone: ${submission.phone}` : 'Phone: Not provided';
    
    await mailService.send({
      to: RECIPIENT_EMAIL,
      from: SENDER_EMAIL,
      subject: `New Contact Form Submission: ${submission.subject || 'General Inquiry'}`,
      html: `
        <h2>You have a new contact form submission</h2>
        <p><strong>Name:</strong> ${submission.name}</p>
        <p><strong>Email:</strong> ${submission.email}</p>
        <p><strong>${phoneInfo}</strong></p>
        <p><strong>Subject:</strong> ${submission.subject || 'Not specified'}</p>
        <p><strong>Service Interest:</strong> ${submission.serviceInterest || 'Not specified'}</p>
        <p><strong>Source:</strong> ${submission.source || 'Direct website visit'}</p>
        <h3>Message:</h3>
        <p>${submission.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>This is an automated notification from your website.</em></p>
      `,
    });
    
    console.log('Contact form submission notification email sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send contact form notification email:', error);
    return false;
  }
}

// Function to send service request notification
export async function sendServiceRequestNotification(request: InsertServiceRequest): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY not set. Email notification not sent for service request.');
    return false;
  }

  try {
    const phoneInfo = request.phone ? `Phone: ${request.phone}` : 'Phone: Not provided';
    const companyInfo = request.company ? `Company: ${request.company}` : 'Company: Not provided';
    const budgetInfo = request.budget ? `Budget: ${request.budget}` : 'Budget: Not specified';
    const timelineInfo = request.timeline ? `Timeline: ${request.timeline}` : 'Timeline: Not specified';
    
    await mailService.send({
      to: RECIPIENT_EMAIL,
      from: SENDER_EMAIL,
      subject: `New Service Request: Service ID #${request.serviceId}`,
      html: `
        <h2>You have a new service request</h2>
        <p><strong>Name:</strong> ${request.name}</p>
        <p><strong>Email:</strong> ${request.email}</p>
        <p><strong>${phoneInfo}</strong></p>
        <p><strong>${companyInfo}</strong></p>
        <p><strong>Service ID:</strong> ${request.serviceId}</p>
        <p><strong>${budgetInfo}</strong></p>
        <p><strong>${timelineInfo}</strong></p>
        <h3>Project Description:</h3>
        <p>${request.projectDescription.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>This is an automated notification from your website.</em></p>
      `,
    });
    
    console.log('Service request notification email sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send service request notification email:', error);
    return false;
  }
}

// Function to send partner application notification
export async function sendPartnerApplicationNotification(
  partnerData: {
    companyName: string;
    contactName: string;
    email: string;
    phone?: string;
    website?: string;
    businessType: string;
    services: string;
    expectations: string;
  }
): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY not set. Email notification not sent for partner application.');
    return false;
  }

  try {
    const phoneInfo = partnerData.phone ? `Phone: ${partnerData.phone}` : 'Phone: Not provided';
    const websiteInfo = partnerData.website ? `Website: ${partnerData.website}` : 'Website: Not provided';
    
    await mailService.send({
      to: RECIPIENT_EMAIL,
      from: SENDER_EMAIL,
      subject: `New Partnership Application: ${partnerData.companyName}`,
      html: `
        <h2>You have a new partnership application</h2>
        <p><strong>Company Name:</strong> ${partnerData.companyName}</p>
        <p><strong>Contact Name:</strong> ${partnerData.contactName}</p>
        <p><strong>Email:</strong> ${partnerData.email}</p>
        <p><strong>${phoneInfo}</strong></p>
        <p><strong>${websiteInfo}</strong></p>
        <p><strong>Business Type:</strong> ${partnerData.businessType}</p>
        <h3>Services Interested In:</h3>
        <p>${partnerData.services.replace(/\n/g, '<br>')}</p>
        <h3>Partnership Expectations:</h3>
        <p>${partnerData.expectations.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>This is an automated notification from your website.</em></p>
      `,
    });
    
    console.log('Partner application notification email sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send partner application notification email:', error);
    return false;
  }
}

// Function to send hire request notification
export async function sendHireRequestNotification(
  hireData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    projectType: string;
    engagementType: string;
    servicesNeeded: string;
    budget?: string;
    timeframe?: string;
    additionalInfo?: string;
  }
): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY not set. Email notification not sent for hire request.');
    return false;
  }

  try {
    const phoneInfo = hireData.phone ? `Phone: ${hireData.phone}` : 'Phone: Not provided';
    const companyInfo = hireData.company ? `Company: ${hireData.company}` : 'Company: Not provided';
    const budgetInfo = hireData.budget ? `Budget: ${hireData.budget}` : 'Budget: Not specified';
    const timeframeInfo = hireData.timeframe ? `Timeframe: ${hireData.timeframe}` : 'Timeframe: Not specified';
    const additionalInfo = hireData.additionalInfo ? 
      `<h3>Additional Information:</h3><p>${hireData.additionalInfo.replace(/\n/g, '<br>')}</p>` : '';
    
    await mailService.send({
      to: RECIPIENT_EMAIL,
      from: SENDER_EMAIL,
      subject: `New Hire Request: ${hireData.engagementType} - ${hireData.projectType}`,
      html: `
        <h2>You have a new hire request</h2>
        <p><strong>Name:</strong> ${hireData.name}</p>
        <p><strong>Email:</strong> ${hireData.email}</p>
        <p><strong>${phoneInfo}</strong></p>
        <p><strong>${companyInfo}</strong></p>
        <p><strong>Project Type:</strong> ${hireData.projectType}</p>
        <p><strong>Engagement Type:</strong> ${hireData.engagementType}</p>
        <p><strong>${budgetInfo}</strong></p>
        <p><strong>${timeframeInfo}</strong></p>
        <h3>Services Needed:</h3>
        <p>${hireData.servicesNeeded.replace(/\n/g, '<br>')}</p>
        ${additionalInfo}
        <hr>
        <p><em>This is an automated notification from your website.</em></p>
      `,
    });
    
    console.log('Hire request notification email sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send hire request notification email:', error);
    return false;
  }
}