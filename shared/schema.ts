import { pgTable, text, serial, integer, boolean, timestamp, varchar, date, jsonb } from "drizzle-orm/pg-core";
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

// Partner applications
export const partnerApplications = pgTable("partner_applications", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  website: text("website"),
  businessType: text("business_type").notNull(),
  services: text("services").notNull(),
  expectations: text("expectations").notNull(),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  status: text("status").notNull().default("new"),
});

export const insertPartnerApplicationSchema = createInsertSchema(partnerApplications).omit({
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

export type PartnerApplication = typeof partnerApplications.$inferSelect;
export type InsertPartnerApplication = z.infer<typeof insertPartnerApplicationSchema>;

// Marketing Recipients
export const recipients = pgTable("recipients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  added: timestamp("added").notNull().defaultNow(),
  source: text("source").notNull().default("website"),
  tags: text("tags").array(),
  unsubscribed: boolean("unsubscribed").notNull().default(false),
  metadata: jsonb("metadata"),
});

export const insertRecipientSchema = createInsertSchema(recipients).omit({
  id: true,
  added: true,
});

// Marketing Campaigns
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'email' or 'sms'
  subject: text("subject"),
  content: text("content").notNull(),
  recipientFilter: text("recipient_filter").notNull().default("all"),
  recipientCount: integer("recipient_count").default(0),
  sentAt: timestamp("sent_at"),
  scheduledFor: timestamp("scheduled_for"),
  status: text("status").notNull().default("draft"), // 'draft', 'sent', 'scheduled'
  openRate: integer("open_rate"),
  clickRate: integer("click_rate"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: integer("created_by").notNull(), // user ID
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  sentAt: true,
  recipientCount: true,
  openRate: true,
  clickRate: true,
  createdAt: true,
});

// Campaign results
export const campaignResults = pgTable("campaign_results", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull(),
  recipientId: integer("recipient_id").notNull(),
  status: text("status").notNull().default("sent"), // 'sent', 'delivered', 'opened', 'clicked', 'failed'
  sentAt: timestamp("sent_at").notNull().defaultNow(),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  failureReason: text("failure_reason"),
});

export const insertCampaignResultSchema = createInsertSchema(campaignResults).omit({
  id: true,
  sentAt: true,
});

export type Recipient = typeof recipients.$inferSelect;
export type InsertRecipient = z.infer<typeof insertRecipientSchema>;

export type Campaign = typeof campaigns.$inferSelect; 
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;

export type CampaignResult = typeof campaignResults.$inferSelect;
export type InsertCampaignResult = z.infer<typeof insertCampaignResultSchema>;

// Ad Tracking
export const adTrackers = pgTable("ad_trackers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  platform: text("platform").notNull(), // google, facebook, bing, etc.
  campaignId: text("campaign_id").notNull(),
  parameters: jsonb("parameters"), // UTM parameters and other tracking data
  conversionGoal: text("conversion_goal").notNull(), // form_submission, service_request, etc.
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAdTrackerSchema = createInsertSchema(adTrackers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Ad Tracking Hits
export const adTrackerHits = pgTable("ad_tracker_hits", {
  id: serial("id").primaryKey(),
  trackerId: integer("tracker_id").notNull(),
  sourcePlatform: text("source_platform").notNull(),
  sourceUrl: text("source_url"),
  pageUrl: text("page_url").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  deviceType: text("device_type"),
  converted: boolean("converted").default(false),
  conversionType: text("conversion_type"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  sessionId: text("session_id"),
  extraData: jsonb("extra_data"),
});

export const insertAdTrackerHitSchema = createInsertSchema(adTrackerHits).omit({
  id: true,
  timestamp: true,
});

export type AdTracker = typeof adTrackers.$inferSelect;
export type InsertAdTracker = z.infer<typeof insertAdTrackerSchema>;

export type AdTrackerHit = typeof adTrackerHits.$inferSelect;
export type InsertAdTrackerHit = z.infer<typeof insertAdTrackerHitSchema>;

// Tracking Settings
export const trackingSettings = pgTable("tracking_settings", {
  id: serial("id").primaryKey(),
  googleAnalyticsId: text("google_analytics_id"),
  facebookPixelId: text("facebook_pixel_id"),
  microsoftAdsId: text("microsoft_ads_id"),
  linkedInInsightId: text("linkedin_insight_id"),
  googleTagManagerId: text("google_tag_manager_id"),
  tiktokPixelId: text("tiktok_pixel_id"),
  twitterPixelId: text("twitter_pixel_id"),
  snapchatPixelId: text("snapchat_pixel_id"),
  hotjarId: text("hotjar_id"),
  clarityId: text("clarity_id"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertTrackingSettingsSchema = createInsertSchema(trackingSettings).omit({
  id: true,
  updatedAt: true,
});

export type TrackingSettings = typeof trackingSettings.$inferSelect;
export type InsertTrackingSettings = z.infer<typeof insertTrackingSettingsSchema>;

// Marketing goals table
export const marketingGoals = pgTable("marketing_goals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // visits, conversions, rate, custom
  target: integer("target").notNull(),
  current: integer("current").default(0),
  period: text("period").notNull(), // daily, weekly, monthly, quarterly, yearly, custom
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  trackerId: integer("tracker_id").references(() => adTrackers.id, { onDelete: "set null" }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMarketingGoalSchema = createInsertSchema(marketingGoals).omit({
  id: true,
  current: true,
  createdAt: true,
  updatedAt: true,
});

// Marketing activities table
export const marketingActivities = pgTable("marketing_activities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // campaign, social, email, content, other
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  status: text("status").notNull(), // planned, in_progress, completed, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMarketingActivitySchema = createInsertSchema(marketingActivities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// A/B Testing tables
export const abTests = pgTable("ab_tests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // landing, cta, headline, image, content, layout, color, custom
  status: text("status").default("draft").notNull(), // draft, running, paused, completed
  trackerId: integer("tracker_id").references(() => adTrackers.id, { onDelete: "set null" }),
  pageUrl: text("page_url").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  conversionMetric: text("conversion_metric").notNull(), // clicks, forms, signups, purchases, custom
  targetSampleSize: integer("target_sample_size").default(1000),
  minimumConfidence: integer("minimum_confidence").default(95),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAbTestSchema = createInsertSchema(abTests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const abTestVariants = pgTable("ab_test_variants", {
  id: serial("id").primaryKey(),
  testId: integer("test_id").notNull().references(() => abTests.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  isControl: boolean("is_control").default(false),
  content: text("content"),
  customProperties: jsonb("custom_properties"),
  impressions: integer("impressions").default(0),
  conversions: integer("conversions").default(0),
  conversionRate: integer("conversion_rate").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAbTestVariantSchema = createInsertSchema(abTestVariants).omit({
  id: true,
  impressions: true,
  conversions: true,
  conversionRate: true,
  createdAt: true,
  updatedAt: true,
});

export const abTestHits = pgTable("ab_test_hits", {
  id: serial("id").primaryKey(),
  variantId: integer("variant_id").notNull().references(() => abTestVariants.id, { onDelete: "cascade" }),
  sessionId: text("session_id").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  deviceType: text("device_type"),
  converted: boolean("converted").default(false),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertAbTestHitSchema = createInsertSchema(abTestHits).omit({
  id: true,
  timestamp: true,
});

// Type exports for new tables
export type MarketingGoal = typeof marketingGoals.$inferSelect;
export type InsertMarketingGoal = z.infer<typeof insertMarketingGoalSchema>;

export type MarketingActivity = typeof marketingActivities.$inferSelect;
export type InsertMarketingActivity = z.infer<typeof insertMarketingActivitySchema>;

export type ABTest = typeof abTests.$inferSelect;
export type InsertABTest = z.infer<typeof insertAbTestSchema>;

export type ABTestVariant = typeof abTestVariants.$inferSelect;
export type InsertABTestVariant = z.infer<typeof insertAbTestVariantSchema>;

export type ABTestHit = typeof abTestHits.$inferSelect;
export type InsertABTestHit = z.infer<typeof insertAbTestHitSchema>;

// Consultations
export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  date: date("date").notNull(),
  timeSlot: text("time_slot").notNull(),
  topic: text("topic").notNull(),
  message: text("message"),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, completed, failed, refunded
  paymentId: text("payment_id"),
  paymentAmount: integer("payment_amount").notNull().default(1000), // Price in INR
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  status: text("status").notNull().default("scheduled"), // scheduled, completed, cancelled, rescheduled
  meetingLink: text("meeting_link"),
  notes: text("notes"),
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  paymentId: true,
  meetingLink: true,
  status: true,
});

export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
