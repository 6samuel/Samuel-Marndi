import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";
import { 
  insertServiceRequestSchema, 
  insertContactSubmissionSchema,
  insertCampaignSchema,
  insertRecipientSchema,
  insertAdTrackerSchema,
  insertAdTrackerHitSchema
} from "@shared/schema";
import { ZodError, z } from "zod";
import { fromZodError } from "zod-validation-error";
import { 
  sendContactNotification, 
  sendServiceRequestNotification,
  sendPartnerApplicationNotification,
  sendHireRequestNotification,
  sendContactReply
} from "./email-service";
import { setupAuth, isAuthenticated, isAdmin } from "./auth";

// Import sitemap generator functions
import { generateSitemap, generateRobotsTxt } from './sitemap-generator';
import { getAnalyticsOverview, getTrackerAnalytics, getAnalyticsDashboardData, getConversionAnalytics } from './analytics';

// Import payment gateway handlers
import {
  initPaymentGateways,
  getPaymentGatewaysStatus,
  createPaymentIntent,
  handleWebhook as handleStripeWebhook,
  createPaypalOrder,
  capturePaypalOrder,
  setupPaypalClient,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayPaymentDetails,
  upiHandler
} from './payment';

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // API base prefix
  const apiRoute = '/api';
  
  // Generate sitemap and robots.txt on startup
  try {
    await generateSitemap();
    generateRobotsTxt();
    console.log('Generated SEO assets (sitemap.xml, robots.txt)');
  } catch (error) {
    console.error('Error generating SEO assets:', error);
  }

  // Handle Zod validation errors
  const handleValidationError = (error: unknown, res: Response) => {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ 
        message: "Validation error",
        details: validationError.message 
      });
    }
    console.error("Unexpected error:", error);
    return res.status(500).json({ message: "Internal server error" });
  };

  // Services endpoints
  app.get(`${apiRoute}/services`, async (_req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get(`${apiRoute}/services/featured`, async (_req, res) => {
    try {
      const services = await storage.getFeaturedServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching featured services:", error);
      res.status(500).json({ message: "Failed to fetch featured services" });
    }
  });

  app.get(`${apiRoute}/services/:slug`, async (req, res) => {
    try {
      const service = await storage.getServiceBySlug(req.params.slug);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      console.error(`Error fetching service with slug ${req.params.slug}:`, error);
      res.status(500).json({ message: "Failed to fetch service" });
    }
  });

  // Portfolio endpoints
  app.get(`${apiRoute}/portfolio-items`, async (_req, res) => {
    try {
      const portfolioItems = await storage.getPortfolioItems();
      res.json(portfolioItems);
    } catch (error) {
      console.error("Error fetching portfolio items:", error);
      res.status(500).json({ message: "Failed to fetch portfolio items" });
    }
  });
  
  // For backwards compatibility
  app.get(`${apiRoute}/portfolio`, async (_req, res) => {
    try {
      const portfolioItems = await storage.getPortfolioItems();
      res.json(portfolioItems);
    } catch (error) {
      console.error("Error fetching portfolio items:", error);
      res.status(500).json({ message: "Failed to fetch portfolio items" });
    }
  });

  app.get(`${apiRoute}/portfolio/featured`, async (_req, res) => {
    try {
      const portfolioItems = await storage.getFeaturedPortfolioItems();
      res.json(portfolioItems);
    } catch (error) {
      console.error("Error fetching featured portfolio items:", error);
      res.status(500).json({ message: "Failed to fetch featured portfolio items" });
    }
  });

  app.get(`${apiRoute}/portfolio/category/:category`, async (req, res) => {
    try {
      const portfolioItems = await storage.getPortfolioItemsByCategory(req.params.category);
      res.json(portfolioItems);
    } catch (error) {
      console.error(`Error fetching portfolio items for category ${req.params.category}:`, error);
      res.status(500).json({ message: "Failed to fetch portfolio items by category" });
    }
  });

  app.get(`${apiRoute}/portfolio/:slug`, async (req, res) => {
    try {
      const portfolioItem = await storage.getPortfolioItemBySlug(req.params.slug);
      if (!portfolioItem) {
        return res.status(404).json({ message: "Portfolio item not found" });
      }
      res.json(portfolioItem);
    } catch (error) {
      console.error(`Error fetching portfolio item with slug ${req.params.slug}:`, error);
      res.status(500).json({ message: "Failed to fetch portfolio item" });
    }
  });

  // Testimonials endpoints
  app.get(`${apiRoute}/testimonials`, async (_req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.get(`${apiRoute}/testimonials/featured`, async (_req, res) => {
    try {
      const testimonials = await storage.getFeaturedTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching featured testimonials:", error);
      res.status(500).json({ message: "Failed to fetch featured testimonials" });
    }
  });

  // Blog endpoints
  app.get(`${apiRoute}/blog`, async (_req, res) => {
    try {
      const blogPosts = await storage.getBlogPosts();
      res.json(blogPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get(`${apiRoute}/blog/featured`, async (_req, res) => {
    try {
      const blogPosts = await storage.getFeaturedBlogPosts();
      res.json(blogPosts);
    } catch (error) {
      console.error("Error fetching featured blog posts:", error);
      res.status(500).json({ message: "Failed to fetch featured blog posts" });
    }
  });

  app.get(`${apiRoute}/blog/category/:category`, async (req, res) => {
    try {
      const blogPosts = await storage.getBlogPostsByCategory(req.params.category);
      res.json(blogPosts);
    } catch (error) {
      console.error(`Error fetching blog posts for category ${req.params.category}:`, error);
      res.status(500).json({ message: "Failed to fetch blog posts by category" });
    }
  });

  app.get(`${apiRoute}/blog/tag/:tag`, async (req, res) => {
    try {
      const blogPosts = await storage.getBlogPostsByTag(req.params.tag);
      res.json(blogPosts);
    } catch (error) {
      console.error(`Error fetching blog posts for tag ${req.params.tag}:`, error);
      res.status(500).json({ message: "Failed to fetch blog posts by tag" });
    }
  });

  app.get(`${apiRoute}/blog/:slug`, async (req, res) => {
    try {
      const blogPost = await storage.getBlogPostBySlug(req.params.slug);
      if (!blogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(blogPost);
    } catch (error) {
      console.error(`Error fetching blog post with slug ${req.params.slug}:`, error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Contact form submission endpoint
  app.post(`${apiRoute}/contact`, async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      
      // Send email notification
      await sendContactNotification(validatedData);
      
      res.status(201).json({ 
        message: "Contact form submission received",
        id: submission.id 
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });
  
  // Quick quote form submission endpoint
  app.post(`${apiRoute}/contact/submit`, async (req, res) => {
    try {
      // Create a submission with the quick quote data
      const submission = await storage.createContactSubmission({
        ...req.body,
        subject: 'Quick Quote Request',
        type: 'quick-quote',
        status: 'new',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Send notification email to administrator
      await sendContactNotification({
        ...req.body,
        subject: 'Quick Quote Request',
      });
      
      res.status(201).json(submission);
    } catch (error) {
      console.error('Quick quote submission error:', error);
      res.status(500).json({ error: 'Failed to submit quote request' });
    }
  });

  // Service request submission endpoint
  app.post(`${apiRoute}/service-request`, async (req, res) => {
    try {
      const validatedData = insertServiceRequestSchema.parse(req.body);
      const request = await storage.createServiceRequest(validatedData);
      
      // Send email notification
      await sendServiceRequestNotification(validatedData);
      
      res.status(201).json({ 
        message: "Service request received",
        id: request.id 
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });
  
  // Partner application submission endpoint
  const partnerFormSchema = z.object({
    companyName: z.string().min(2, "Company name must be at least 2 characters"),
    contactName: z.string().min(2, "Contact name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    website: z.string().url("Please enter a valid URL").optional(),
    businessType: z.string().min(2, "Please specify your business type"),
    services: z.string().min(5, "Please describe the services you're interested in"),
    expectations: z.string().min(5, "Please describe your expectations from the partnership"),
  });
  
  app.post(`${apiRoute}/partner-applications`, async (req, res) => {
    try {
      const validatedData = partnerFormSchema.parse(req.body);
      
      // Store in database
      const partnerApplication = await storage.createPartnerApplication(validatedData);
      
      // Send email notification
      await sendPartnerApplicationNotification(validatedData);
      
      res.status(201).json({ 
        message: "Partnership application received",
        success: true,
        partnerApplication
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });
  
  // Get all partner applications (admin only)
  app.get(`${apiRoute}/partner-applications`, isAdmin, async (req, res) => {
    try {
      const applications = await storage.getPartnerApplications();
      res.json(applications);
    } catch (error) {
      console.error('Error getting partner applications:', error);
      res.status(500).json({ error: 'Failed to retrieve partner applications' });
    }
  });
  
  // Hire request submission endpoint
  const hireFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    company: z.string().optional(),
    projectType: z.string().min(1, "Please select a project type"),
    engagementType: z.string().min(1, "Please select an engagement type"),
    servicesNeeded: z.string().min(5, "Please describe the services needed"),
    budget: z.string().optional(),
    timeframe: z.string().optional(),
    additionalInfo: z.string().optional(),
  });
  
  app.post(`${apiRoute}/hire-requests`, async (req, res) => {
    try {
      const validatedData = hireFormSchema.parse(req.body);
      
      // Send email notification
      await sendHireRequestNotification(validatedData);
      
      res.status(201).json({ 
        message: "Hire request received",
        success: true 
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });
  
  // Admin API endpoints - protected with authentication middleware
  
  // Get all contact submissions
  app.get(`${apiRoute}/contact-submissions`, isAuthenticated, isAdmin, async (_req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ message: "Failed to fetch contact submissions" });
    }
  });
  
  // Get contact submission by ID
  app.get(`${apiRoute}/contact-submissions/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const submission = await storage.getContactSubmissionById(id);
      if (!submission) {
        return res.status(404).json({ message: "Contact submission not found" });
      }
      
      res.json(submission);
    } catch (error) {
      console.error(`Error fetching contact submission with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch contact submission" });
    }
  });
  
  // Update contact submission status
  app.patch(`${apiRoute}/contact-submissions/:id/status`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const { status } = req.body;
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const updatedSubmission = await storage.updateContactSubmissionStatus(id, status);
      if (!updatedSubmission) {
        return res.status(404).json({ message: "Contact submission not found" });
      }
      
      res.json(updatedSubmission);
    } catch (error) {
      console.error(`Error updating contact submission status with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update contact submission status" });
    }
  });
  
  // Get all service requests
  app.get(`${apiRoute}/service-requests`, isAuthenticated, isAdmin, async (_req, res) => {
    try {
      const requests = await storage.getServiceRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching service requests:", error);
      res.status(500).json({ message: "Failed to fetch service requests" });
    }
  });
  
  // Get service request by ID
  app.get(`${apiRoute}/service-requests/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const request = await storage.getServiceRequestById(id);
      if (!request) {
        return res.status(404).json({ message: "Service request not found" });
      }
      
      res.json(request);
    } catch (error) {
      console.error(`Error fetching service request with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch service request" });
    }
  });
  
  // Update service request status
  app.patch(`${apiRoute}/service-requests/:id/status`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const { status } = req.body;
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const updatedRequest = await storage.updateServiceRequestStatus(id, status);
      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }
      
      res.json(updatedRequest);
    } catch (error) {
      console.error(`Error updating service request status with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update service request status" });
    }
  });
  
  // Update partner application status
  app.patch(`${apiRoute}/partner-applications/:id/status`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const { status } = req.body;
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const updatedApplication = await storage.updatePartnerApplicationStatus(id, status);
      if (!updatedApplication) {
        return res.status(404).json({ message: "Partner application not found" });
      }
      
      res.json(updatedApplication);
    } catch (error) {
      console.error(`Error updating partner application status with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update partner application status" });
    }
  });
  
  // Delete contact submission
  app.delete(`${apiRoute}/contact-submissions/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteContactSubmission(id);
      if (!success) {
        return res.status(404).json({ message: "Contact submission not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting contact submission with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to delete contact submission" });
    }
  });
  
  // Delete service request
  app.delete(`${apiRoute}/service-requests/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteServiceRequest(id);
      if (!success) {
        return res.status(404).json({ message: "Service request not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting service request with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to delete service request" });
    }
  });
  
  // Delete partner application
  app.delete(`${apiRoute}/partner-applications/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deletePartnerApplication(id);
      if (!success) {
        return res.status(404).json({ message: "Partner application not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting partner application with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to delete partner application" });
    }
  });
  
  // Send reply to form submissions
  app.post(`${apiRoute}/send-reply`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { type, id, email, name, subject, message } = req.body;
      
      if (!type || !id || !email || !name || !subject || !message) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Check if the submission exists
      let exists = false;
      
      if (type === 'contact') {
        const submission = await storage.getContactSubmissionById(id);
        exists = !!submission;
        
        // Send reply email using the contactReply function
        if (exists) {
          const success = await sendContactReply(email, name, subject, message);
          if (!success) {
            return res.status(500).json({ message: "Failed to send email reply" });
          }
        }
      } else if (type === 'service') {
        const request = await storage.getServiceRequestById(id);
        exists = !!request;
        
        // Send reply email using the service request notification function
        if (exists) {
          const success = await sendContactReply(email, name, subject, message);
          if (!success) {
            return res.status(500).json({ message: "Failed to send email reply" });
          }
        }
      } else if (type === 'partner') {
        const application = await storage.getPartnerApplicationById(id);
        exists = !!application;
        
        // Send reply email using the partner application notification function
        if (exists) {
          const success = await sendContactReply(email, name, subject, message);
          if (!success) {
            return res.status(500).json({ message: "Failed to send email reply" });
          }
        }
      } else {
        return res.status(400).json({ message: "Invalid type" });
      }
      
      if (!exists) {
        return res.status(404).json({ message: `${type} with ID ${id} not found` });
      }
      
      res.json({ message: "Reply sent successfully" });
    } catch (error) {
      console.error("Error sending reply:", error);
      res.status(500).json({ message: "Failed to send reply" });
    }
  });

  // Campaign Management API endpoints
  // All campaign endpoints are protected with admin authentication
  
  // Get all campaigns
  app.get(`${apiRoute}/campaigns`, isAuthenticated, isAdmin, async (_req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  // Get campaigns by type (email or SMS)
  app.get(`${apiRoute}/campaigns/type/:type`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { type } = req.params;
      if (!type || (type !== 'email' && type !== 'sms')) {
        return res.status(400).json({ message: "Invalid campaign type. Must be 'email' or 'sms'" });
      }
      
      const campaigns = await storage.getCampaignsByType(type);
      res.json(campaigns);
    } catch (error) {
      console.error(`Error fetching ${req.params.type} campaigns:`, error);
      res.status(500).json({ message: `Failed to fetch ${req.params.type} campaigns` });
    }
  });

  // Get campaign by ID
  app.get(`${apiRoute}/campaigns/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const campaign = await storage.getCampaignById(id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      res.json(campaign);
    } catch (error) {
      console.error(`Error fetching campaign with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  // Create new campaign
  app.post(`${apiRoute}/campaigns`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(validatedData);
      
      res.status(201).json({
        message: "Campaign created successfully",
        campaign
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // Update campaign
  app.patch(`${apiRoute}/campaigns/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const campaign = await storage.getCampaignById(id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      // Only allow updating certain fields based on status
      if (campaign.status !== 'draft' && campaign.status !== 'scheduled') {
        return res.status(400).json({ 
          message: "Cannot update campaign that has already been sent or is in progress" 
        });
      }
      
      const validatedData = insertCampaignSchema.partial().parse(req.body);
      const updatedCampaign = await storage.updateCampaign(id, validatedData);
      
      res.json({
        message: "Campaign updated successfully",
        campaign: updatedCampaign
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // Update campaign status
  app.patch(`${apiRoute}/campaigns/:id/status`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const { status } = req.body;
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Status is required" });
      }
      
      // Validate status value
      const validStatuses = ['draft', 'scheduled', 'sending', 'sent', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
        });
      }
      
      const updatedCampaign = await storage.updateCampaignStatus(id, status);
      if (!updatedCampaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      res.json({
        message: "Campaign status updated successfully",
        campaign: updatedCampaign
      });
    } catch (error) {
      console.error(`Error updating campaign status with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update campaign status" });
    }
  });

  // Delete campaign
  app.delete(`${apiRoute}/campaigns/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const campaign = await storage.getCampaignById(id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      // Only allow deleting campaigns that are in draft or scheduled status
      if (campaign.status !== 'draft' && campaign.status !== 'scheduled') {
        return res.status(400).json({ 
          message: "Cannot delete campaign that has already been sent or is in progress" 
        });
      }
      
      const success = await storage.deleteCampaign(id);
      if (!success) {
        return res.status(500).json({ message: "Failed to delete campaign" });
      }
      
      res.json({ message: "Campaign deleted successfully" });
    } catch (error) {
      console.error(`Error deleting campaign with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to delete campaign" });
    }
  });

  // Get campaign results
  app.get(`${apiRoute}/campaigns/:id/results`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const results = await storage.getCampaignResults(id);
      
      // Get analytics
      const totalCount = await storage.getCampaignResultsCount(id);
      const openRate = await storage.getCampaignOpenRate(id);
      const clickRate = await storage.getCampaignClickRate(id);
      
      res.json({
        results,
        analytics: {
          totalCount,
          openRate,
          clickRate
        }
      });
    } catch (error) {
      console.error(`Error fetching campaign results for ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch campaign results" });
    }
  });

  // Recipient Management API endpoints

  // Get all recipients
  app.get(`${apiRoute}/recipients`, isAuthenticated, isAdmin, async (_req, res) => {
    try {
      const recipients = await storage.getRecipients();
      res.json(recipients);
    } catch (error) {
      console.error("Error fetching recipients:", error);
      res.status(500).json({ message: "Failed to fetch recipients" });
    }
  });

  // Get active recipients (not unsubscribed)
  app.get(`${apiRoute}/recipients/active`, isAuthenticated, isAdmin, async (_req, res) => {
    try {
      const recipients = await storage.getActiveRecipients();
      res.json(recipients);
    } catch (error) {
      console.error("Error fetching active recipients:", error);
      res.status(500).json({ message: "Failed to fetch active recipients" });
    }
  });

  // Get recipients by tag
  app.get(`${apiRoute}/recipients/tag/:tag`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const recipients = await storage.getRecipientsByTag(req.params.tag);
      res.json(recipients);
    } catch (error) {
      console.error(`Error fetching recipients with tag ${req.params.tag}:`, error);
      res.status(500).json({ message: "Failed to fetch recipients by tag" });
    }
  });

  // Get recipient by ID
  app.get(`${apiRoute}/recipients/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const recipient = await storage.getRecipientById(id);
      if (!recipient) {
        return res.status(404).json({ message: "Recipient not found" });
      }
      
      res.json(recipient);
    } catch (error) {
      console.error(`Error fetching recipient with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch recipient" });
    }
  });

  // Create new recipient
  app.post(`${apiRoute}/recipients`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertRecipientSchema.parse(req.body);
      
      // Check if recipient with this email already exists
      const existingRecipient = await storage.getRecipientByEmail(validatedData.email);
      if (existingRecipient) {
        return res.status(400).json({ message: "A recipient with this email already exists" });
      }
      
      const recipient = await storage.createRecipient(validatedData);
      
      res.status(201).json({
        message: "Recipient added successfully",
        recipient
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // Update recipient
  app.patch(`${apiRoute}/recipients/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const validatedData = insertRecipientSchema.partial().parse(req.body);
      
      // If email is being updated, check it doesn't conflict
      if (validatedData.email) {
        const existingRecipient = await storage.getRecipientByEmail(validatedData.email);
        if (existingRecipient && existingRecipient.id !== id) {
          return res.status(400).json({ message: "A recipient with this email already exists" });
        }
      }
      
      const updatedRecipient = await storage.updateRecipient(id, validatedData);
      if (!updatedRecipient) {
        return res.status(404).json({ message: "Recipient not found" });
      }
      
      res.json({
        message: "Recipient updated successfully",
        recipient: updatedRecipient
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // Update recipient unsubscribe status
  app.patch(`${apiRoute}/recipients/:id/unsubscribe`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const { unsubscribed } = req.body;
      if (typeof unsubscribed !== 'boolean') {
        return res.status(400).json({ message: "Unsubscribed status must be a boolean" });
      }
      
      const updatedRecipient = await storage.updateUnsubscribeStatus(id, unsubscribed);
      if (!updatedRecipient) {
        return res.status(404).json({ message: "Recipient not found" });
      }
      
      res.json({
        message: unsubscribed ? "Successfully unsubscribed" : "Successfully resubscribed",
        recipient: updatedRecipient
      });
    } catch (error) {
      console.error(`Error updating unsubscribe status for recipient ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update unsubscribe status" });
    }
  });

  // Delete recipient
  app.delete(`${apiRoute}/recipients/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteRecipient(id);
      if (!success) {
        return res.status(404).json({ message: "Recipient not found or could not be deleted" });
      }
      
      res.json({ message: "Recipient deleted successfully" });
    } catch (error) {
      console.error(`Error deleting recipient with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to delete recipient" });
    }
  });

  // Ad Tracking middleware
  const trackingMiddleware = (req: Request, res: Response, next: Function) => {
    // Skip for API routes - we only want to track page views
    if (req.path.startsWith('/api/')) {
      return next();
    }
    
    // Extract tracking code from query parameters
    const trackingId = req.query.utm_id as string;
    if (!trackingId) {
      return next();
    }
    
    // Store the tracking hit asynchronously (don't wait for completion)
    (async () => {
      try {
        const trackerId = parseInt(trackingId);
        if (isNaN(trackerId)) return;
        
        // Get the tracker to make sure it exists
        const tracker = await storage.getAdTrackerById(trackerId);
        if (!tracker || !tracker.active) return;
        
        // Create a hit record
        await storage.createAdTrackerHit({
          trackerId: trackerId,
          sourcePlatform: req.query.utm_source as string || 'unknown',
          sourceUrl: req.headers.referer || null,
          pageUrl: req.originalUrl,
          ipAddress: req.ip || null,
          userAgent: req.headers['user-agent'] || null,
          deviceType: detectDeviceType(req.headers['user-agent'] || ''),
          converted: false,
          conversionType: null,
          sessionId: req.query.utm_session as string || null,
          extraData: {}
        });
      } catch (error) {
        console.error('Error recording tracking hit:', error);
      }
    })();
    
    next();
  };
  
  // Helper function to detect device type from user agent
  function detectDeviceType(userAgent: string): string | null {
    if (!userAgent) return null;
    
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone') || ua.includes('ipad')) {
      return 'mobile';
    } else if (ua.includes('tablet')) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }
  
  // Register middleware
  app.use(trackingMiddleware);
  
  // Sitemap and SEO endpoints
  app.post(`${apiRoute}/sitemap/generate`, isAuthenticated, isAdmin, async (_req, res) => {
    try {
      const result = await generateSitemap();
      if (result.success) {
        res.json({ 
          message: "Sitemap generated successfully", 
          path: result.path 
        });
      } else {
        res.status(500).json({ 
          message: "Failed to generate sitemap", 
          error: result.error 
        });
      }
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).json({ message: "Failed to generate sitemap" });
    }
  });

  // Manually get sitemaps and robots.txt statuses
  app.get(`${apiRoute}/seo/status`, isAuthenticated, isAdmin, (_req, res) => {
    try {
      const publicDir = path.resolve(process.cwd(), 'public');
      const sitemapPath = path.join(publicDir, 'sitemap.xml');
      const robotsPath = path.join(publicDir, 'robots.txt');
      
      const sitemapExists = fs.existsSync(sitemapPath);
      const robotsExists = fs.existsSync(robotsPath);
      
      let sitemapStats = null;
      let robotsStats = null;
      
      if (sitemapExists) {
        sitemapStats = fs.statSync(sitemapPath);
      }
      
      if (robotsExists) {
        robotsStats = fs.statSync(robotsPath);
      }
      
      res.json({
        sitemap: {
          exists: sitemapExists,
          lastModified: sitemapExists ? sitemapStats?.mtime : null,
          size: sitemapExists ? sitemapStats?.size : null,
          url: '/sitemap.xml'
        },
        robots: {
          exists: robotsExists,
          lastModified: robotsExists ? robotsStats?.mtime : null,
          size: robotsExists ? robotsStats?.size : null,
          url: '/robots.txt'
        }
      });
    } catch (error) {
      console.error("Error getting SEO status:", error);
      res.status(500).json({ message: "Failed to get SEO status" });
    }
  });

  // Ad Tracking API routes
  
  // Get all trackers
  app.get(`${apiRoute}/ad-trackers`, isAuthenticated, isAdmin, async (_req, res) => {
    try {
      const trackers = await storage.getAdTrackers();
      res.json(trackers);
    } catch (error) {
      console.error("Error fetching ad trackers:", error);
      res.status(500).json({ message: "Failed to fetch ad trackers" });
    }
  });
  
  // Get tracker by ID
  app.get(`${apiRoute}/ad-trackers/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const tracker = await storage.getAdTrackerById(id);
      if (!tracker) {
        return res.status(404).json({ message: "Ad tracker not found" });
      }
      
      res.json(tracker);
    } catch (error) {
      console.error(`Error fetching ad tracker with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch ad tracker" });
    }
  });
  
  // Create new tracker
  app.post(`${apiRoute}/ad-trackers`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertAdTrackerSchema.parse(req.body);
      const tracker = await storage.createAdTracker(validatedData);
      
      res.status(201).json({ 
        message: "Ad tracker created successfully",
        tracker 
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });
  
  // Update tracker
  app.patch(`${apiRoute}/ad-trackers/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const tracker = await storage.getAdTrackerById(id);
      if (!tracker) {
        return res.status(404).json({ message: "Ad tracker not found" });
      }
      
      const validatedData = insertAdTrackerSchema.partial().parse(req.body);
      const updatedTracker = await storage.updateAdTracker(id, validatedData);
      
      res.json({ 
        message: "Ad tracker updated successfully",
        tracker: updatedTracker 
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });
  
  // Toggle tracker active status
  app.patch(`${apiRoute}/ad-trackers/:id/toggle-status`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const tracker = await storage.getAdTrackerById(id);
      if (!tracker) {
        return res.status(404).json({ message: "Ad tracker not found" });
      }
      
      const updatedTracker = await storage.updateAdTrackerStatus(id, !tracker.active);
      
      res.json({ 
        message: `Ad tracker ${updatedTracker?.active ? 'activated' : 'deactivated'} successfully`,
        tracker: updatedTracker 
      });
    } catch (error) {
      console.error(`Error toggling tracker status for ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to toggle tracker status" });
    }
  });
  
  // Delete tracker
  app.delete(`${apiRoute}/ad-trackers/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteAdTracker(id);
      if (!success) {
        return res.status(404).json({ message: "Ad tracker not found or could not be deleted" });
      }
      
      res.json({ message: "Ad tracker deleted successfully" });
    } catch (error) {
      console.error(`Error deleting ad tracker with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to delete ad tracker" });
    }
  });
  
  // Get tracker hits
  app.get(`${apiRoute}/ad-trackers/:id/hits`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const hits = await storage.getAdTrackerHits(id);
      res.json(hits);
    } catch (error) {
      console.error(`Error fetching hits for tracker ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch tracker hits" });
    }
  });
  
  // Get tracker analytics
  app.get(`${apiRoute}/ad-trackers/:id/analytics`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const tracker = await storage.getAdTrackerById(id);
      if (!tracker) {
        return res.status(404).json({ message: "Ad tracker not found" });
      }
      
      const totalHits = await storage.getAdTrackerHitsCount(id);
      const conversionRate = await storage.getAdTrackerConversionRate(id);
      const sourcesBreakdown = await storage.getAdTrackerHitsBySources(id);
      const deviceTypeBreakdown = await storage.getAdTrackerHitsByDeviceType(id);
      
      res.json({
        trackerId: id,
        trackerName: tracker.name,
        platform: tracker.platform,
        totalHits,
        conversionRate,
        sourcesBreakdown,
        deviceTypeBreakdown
      });
    } catch (error) {
      console.error(`Error fetching analytics for tracker ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch tracker analytics" });
    }
  });
  
  // Tracking Settings API endpoints
  // Public endpoint - no authentication required since tracking scripts need access
  app.get(`${apiRoute}/settings/tracking`, async (_req, res) => {
    try {
      const settings = await storage.getTrackingSettings();
      res.json(settings);
    } catch (error) {
      console.error('Error getting tracking settings:', error);
      res.status(500).json({ message: 'Failed to get tracking settings' });
    }
  });
  
  app.put(`${apiRoute}/settings/tracking`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const settingsData = req.body;
      const updatedSettings = await storage.updateTrackingSettings(settingsData);
      res.json(updatedSettings);
    } catch (error) {
      console.error('Error updating tracking settings:', error);
      res.status(500).json({ message: 'Failed to update tracking settings' });
    }
  });
  
  // Record conversion for a tracker
  app.post(`${apiRoute}/ad-trackers/:id/conversion`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const { sessionId, conversionType = 'general' } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      
      // Find the tracking hit with the session ID
      const hits = await storage.getAdTrackerHits(id);
      const hit = hits.find(h => h.sessionId === sessionId);
      
      if (!hit) {
        return res.status(404).json({ message: "No tracking hit found for the provided session ID" });
      }
      
      // Update the hit with conversion information
      const updatedHit = await storage.updateAdTrackerHitConversion(hit.id, true, conversionType);
      
      res.json({ 
        message: "Conversion recorded successfully",
        hit: updatedHit
      });
    } catch (error) {
      console.error(`Error recording conversion for tracker ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to record conversion" });
    }
  });
  
  // Analytics API endpoints
  app.get(`${apiRoute}/analytics/overview`, isAuthenticated, isAdmin, async (req, res) => {
    await getAnalyticsOverview(req, res);
  });
  
  app.get(`${apiRoute}/analytics/tracker/:trackerId`, isAuthenticated, isAdmin, async (req, res) => {
    await getTrackerAnalytics(req, res);
  });
  
  app.get(`${apiRoute}/analytics/dashboard`, isAuthenticated, isAdmin, async (req, res) => {
    await getAnalyticsDashboardData(req, res);
  });
  
  app.get(`${apiRoute}/analytics/conversions`, isAuthenticated, isAdmin, async (req, res) => {
    await getConversionAnalytics(req, res);
  });
  
  // Marketing Goals routes
  app.get(`${apiRoute}/goals`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const goals = await storage.getMarketingGoals();
      res.json(goals || []);
    } catch (error) {
      console.error("Error fetching marketing goals:", error);
      res.status(500).json({ message: "Failed to fetch marketing goals" });
    }
  });
  
  app.get(`${apiRoute}/goals/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const goal = await storage.getMarketingGoalById(id);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      
      res.json(goal);
    } catch (error) {
      console.error(`Error fetching goal with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch goal" });
    }
  });
  
  app.post(`${apiRoute}/goals`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const goal = await storage.createMarketingGoal(req.body);
      res.status(201).json(goal);
    } catch (error) {
      console.error("Error creating marketing goal:", error);
      res.status(500).json({ message: "Failed to create marketing goal" });
    }
  });
  
  app.put(`${apiRoute}/goals/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const goal = await storage.updateMarketingGoal(id, req.body);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      
      res.json(goal);
    } catch (error) {
      console.error(`Error updating goal with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update goal" });
    }
  });
  
  app.delete(`${apiRoute}/goals/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteMarketingGoal(id);
      if (!success) {
        return res.status(404).json({ message: "Goal not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting goal with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to delete goal" });
    }
  });
  
  // Marketing Activities routes
  app.get(`${apiRoute}/marketing-activities`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const activities = await storage.getMarketingActivities();
      res.json(activities || []);
    } catch (error) {
      console.error("Error fetching marketing activities:", error);
      res.status(500).json({ message: "Failed to fetch marketing activities" });
    }
  });
  
  app.get(`${apiRoute}/marketing-activities/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const activity = await storage.getMarketingActivityById(id);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      
      res.json(activity);
    } catch (error) {
      console.error(`Error fetching activity with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch activity" });
    }
  });
  
  app.post(`${apiRoute}/marketing-activities`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const activity = await storage.createMarketingActivity(req.body);
      res.status(201).json(activity);
    } catch (error) {
      console.error("Error creating marketing activity:", error);
      res.status(500).json({ message: "Failed to create marketing activity" });
    }
  });
  
  app.put(`${apiRoute}/marketing-activities/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const activity = await storage.updateMarketingActivity(id, req.body);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      
      res.json(activity);
    } catch (error) {
      console.error(`Error updating activity with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update activity" });
    }
  });
  
  app.delete(`${apiRoute}/marketing-activities/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteMarketingActivity(id);
      if (!success) {
        return res.status(404).json({ message: "Activity not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting activity with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to delete activity" });
    }
  });
  
  // A/B Testing routes
  app.get(`${apiRoute}/ab-tests`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const tests = await storage.getABTests();
      res.json(tests || []);
    } catch (error) {
      console.error("Error fetching A/B tests:", error);
      res.status(500).json({ message: "Failed to fetch A/B tests" });
    }
  });
  
  app.get(`${apiRoute}/ab-tests/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const test = await storage.getABTestById(id);
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
      
      res.json(test);
    } catch (error) {
      console.error(`Error fetching test with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch test" });
    }
  });
  
  app.post(`${apiRoute}/ab-tests`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const test = await storage.createABTest(req.body);
      res.status(201).json(test);
    } catch (error) {
      console.error("Error creating A/B test:", error);
      res.status(500).json({ message: "Failed to create A/B test" });
    }
  });
  
  app.put(`${apiRoute}/ab-tests/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const test = await storage.updateABTest(id, req.body);
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
      
      res.json(test);
    } catch (error) {
      console.error(`Error updating test with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update test" });
    }
  });
  
  app.patch(`${apiRoute}/ab-tests/:id/status`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const { status } = req.body;
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const test = await storage.updateABTestStatus(id, status);
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
      
      res.json(test);
    } catch (error) {
      console.error(`Error updating status for test with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update test status" });
    }
  });
  
  app.delete(`${apiRoute}/ab-tests/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteABTest(id);
      if (!success) {
        return res.status(404).json({ message: "Test not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting test with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to delete test" });
    }
  });
  
  // A/B Test Variants routes
  app.get(`${apiRoute}/ab-tests/:testId/variants`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const testId = parseInt(req.params.testId);
      if (isNaN(testId)) {
        return res.status(400).json({ message: "Invalid test ID format" });
      }
      
      const variants = await storage.getABTestVariants(testId);
      res.json(variants || []);
    } catch (error) {
      console.error(`Error fetching variants for test ID ${req.params.testId}:`, error);
      res.status(500).json({ message: "Failed to fetch test variants" });
    }
  });
  
  app.post(`${apiRoute}/ab-tests/:testId/variants`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const testId = parseInt(req.params.testId);
      if (isNaN(testId)) {
        return res.status(400).json({ message: "Invalid test ID format" });
      }
      
      const variant = await storage.createABTestVariant({ ...req.body, testId });
      res.status(201).json(variant);
    } catch (error) {
      console.error("Error creating test variant:", error);
      res.status(500).json({ message: "Failed to create test variant" });
    }
  });
  
  app.put(`${apiRoute}/ab-tests/:testId/variants/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const testId = parseInt(req.params.testId);
      const id = parseInt(req.params.id);
      if (isNaN(testId) || isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const variant = await storage.updateABTestVariant(id, testId, req.body);
      if (!variant) {
        return res.status(404).json({ message: "Variant not found" });
      }
      
      res.json(variant);
    } catch (error) {
      console.error(`Error updating variant with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update variant" });
    }
  });
  
  app.delete(`${apiRoute}/ab-tests/:testId/variants/:id`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const testId = parseInt(req.params.testId);
      const id = parseInt(req.params.id);
      if (isNaN(testId) || isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteABTestVariant(id, testId);
      if (!success) {
        return res.status(404).json({ message: "Variant not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting variant with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to delete variant" });
    }
  });
  
  // A/B Test tracking and results routes
  app.post(`${apiRoute}/ab-tests/variants/:variantId/impression`, async (req, res) => {
    try {
      const variantId = parseInt(req.params.variantId);
      if (isNaN(variantId)) {
        return res.status(400).json({ message: "Invalid variant ID format" });
      }
      
      const hit = await storage.recordABTestImpression(variantId, req.body);
      res.status(201).json(hit);
    } catch (error) {
      console.error("Error recording A/B test impression:", error);
      res.status(500).json({ message: "Failed to record impression" });
    }
  });
  
  app.post(`${apiRoute}/ab-tests/variants/:variantId/conversion`, async (req, res) => {
    try {
      const variantId = parseInt(req.params.variantId);
      if (isNaN(variantId)) {
        return res.status(400).json({ message: "Invalid variant ID format" });
      }
      
      const hit = await storage.recordABTestConversion(variantId, req.body.sessionId);
      if (!hit) {
        return res.status(404).json({ message: "No matching impression found for this session" });
      }
      
      res.json(hit);
    } catch (error) {
      console.error("Error recording A/B test conversion:", error);
      res.status(500).json({ message: "Failed to record conversion" });
    }
  });
  
  app.get(`${apiRoute}/ab-tests/:testId/results`, isAuthenticated, isAdmin, async (req, res) => {
    try {
      const testId = parseInt(req.params.testId);
      if (isNaN(testId)) {
        return res.status(400).json({ message: "Invalid test ID format" });
      }
      
      const results = await storage.getABTestResults(testId);
      res.json(results);
    } catch (error) {
      console.error(`Error fetching results for test ID ${req.params.testId}:`, error);
      res.status(500).json({ message: "Failed to fetch test results" });
    }
  });

  // Initialize all payment gateways
  const paymentGateways = initPaymentGateways();
  console.log('Payment gateways initialized:', 
    Object.entries(paymentGateways)
      .filter(([key]) => key !== 'anyInitialized')
      .map(([key, value]) => `${key}: ${value ? 'Yes' : 'No'}`)
      .join(', ')
  );

  // Payment gateways status endpoint
  app.get(`${apiRoute}/payment/status`, (req, res) => {
    getPaymentGatewaysStatus(req, res);
  });

  // Stripe payment endpoints
  app.post(`${apiRoute}/payment/stripe/create-intent`, (req, res) => {
    createPaymentIntent(req, res);
  });

  app.post(`${apiRoute}/payment/stripe/webhook`, (req, res) => {
    handleStripeWebhook(req, res);
  });

  // PayPal payment endpoints
  app.get(`${apiRoute}/payment/paypal/setup`, (req, res) => {
    setupPaypalClient(req, res);
  });

  app.post(`${apiRoute}/payment/paypal/create-order`, (req, res) => {
    createPaypalOrder(req, res);
  });

  app.post(`${apiRoute}/payment/paypal/capture/:orderID`, (req, res) => {
    capturePaypalOrder(req, res);
  });

  // Razorpay payment endpoints
  app.post(`${apiRoute}/payment/razorpay/create-order`, (req, res) => {
    createRazorpayOrder(req, res);
  });

  app.post(`${apiRoute}/payment/razorpay/verify`, (req, res) => {
    verifyRazorpayPayment(req, res);
  });

  app.get(`${apiRoute}/payment/razorpay/payment/:payment_id`, (req, res) => {
    getRazorpayPaymentDetails(req, res);
  });
  
  // UPI direct payment endpoints
  app.get(`${apiRoute}/payment/upi/info`, (req, res) => {
    upiHandler.getUpiInfo(req, res);
  });
  
  app.post(`${apiRoute}/payment/upi/verify`, (req, res) => {
    upiHandler.verifyPayment(req, res);
  });
  
  app.get(`${apiRoute}/payment/upi/status/:transactionId`, (req, res) => {
    upiHandler.getPaymentStatus(req, res);
  });

  const httpServer = createServer(app);
  return httpServer;
}
