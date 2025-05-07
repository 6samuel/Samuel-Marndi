import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertServiceRequestSchema, 
  insertContactSubmissionSchema 
} from "@shared/schema";
import { ZodError, z } from "zod";
import { fromZodError } from "zod-validation-error";
import { 
  sendContactNotification, 
  sendServiceRequestNotification,
  sendPartnerApplicationNotification,
  sendHireRequestNotification
} from "./email-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // API base prefix
  const apiRoute = '/api';

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
      
      // Send email notification
      await sendPartnerApplicationNotification(validatedData);
      
      res.status(201).json({ 
        message: "Partnership application received",
        success: true 
      });
    } catch (error) {
      handleValidationError(error, res);
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

  const httpServer = createServer(app);
  return httpServer;
}
