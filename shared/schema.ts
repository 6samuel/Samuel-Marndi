import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema with role for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user"),
  email: text("email"),
  name: text("name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  email: true,
  name: true,
});

// Services
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  iconName: text("icon_name").notNull(),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  displayOrder: integer("display_order").default(0),
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

// Portfolio items
export const portfolioItems = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  client: text("client").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  completionDate: text("completion_date"),
  technologies: text("technologies").array(),
  websiteUrl: text("website_url"),
  featured: boolean("featured").default(false),
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).omit({
  id: true,
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company"),
  role: text("role"),
  testimonial: text("testimonial").notNull(),
  imageUrl: text("image_url"),
  rating: integer("rating").default(5),
  featured: boolean("featured").default(false),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
});

// Blog posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  publishDate: timestamp("publish_date").notNull(),
  author: text("author").notNull(),
  categories: text("categories").array(),
  tags: text("tags").array(),
  featured: boolean("featured").default(false),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
});

// Contact form submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  subject: text("subject"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  serviceInterest: text("service_interest"),
  status: text("status").notNull().default("new"),
  source: text("source").default("website"),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  submittedAt: true,
  status: true,
});

// Service request submissions
export const serviceRequests = pgTable("service_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  serviceId: integer("service_id").notNull(),
  projectDescription: text("project_description").notNull(),
  budget: text("budget"),
  timeline: text("timeline"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  status: text("status").notNull().default("new"),
});

export const insertServiceRequestSchema = createInsertSchema(serviceRequests).omit({
  id: true,
  submittedAt: true,
  status: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;

export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type InsertServiceRequest = z.infer<typeof insertServiceRequestSchema>;
