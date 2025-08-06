import { mysqlTable, text, int, boolean, timestamp, varchar, date, json } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema with role for authentication
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
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
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  iconName: text("icon_name").notNull(),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  displayOrder: int("display_order").default(0),
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

// Portfolio items
export const portfolioItems = mysqlTable("portfolio_items", {
  id: int("id").autoincrement().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  client: text("client").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  completionDate: text("completion_date"),
  technologies: json("technologies"),
  websiteUrl: text("website_url"),
  featured: boolean("featured").default(false),
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).omit({
  id: true,
});

// Testimonials
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  company: text("company"),
  role: text("role"),
  testimonial: text("testimonial").notNull(),
  imageUrl: text("image_url"),
  rating: int("rating").default(5),
  featured: boolean("featured").default(false),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
});

// Blog posts
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  publishDate: timestamp("publish_date").notNull(),
  author: text("author").notNull(),
  categories: json("categories"),
  tags: json("tags"),
  featured: boolean("featured").default(false),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
});

// Contact form submissions
export const contactSubmissions = mysqlTable("contact_submissions", {
  id: int("id").autoincrement().primaryKey(),
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
export const serviceRequests = mysqlTable("service_requests", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  serviceId: int("service_id").notNull(),
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
export const partnerApplications = mysqlTable("partner_applications", {
  id: int("id").autoincrement().primaryKey(),
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
export const recipients = mysqlTable("recipients", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  added: timestamp("added").notNull().defaultNow(),
  source: text("source").notNull().default("website"),
  tags: json("tags"),
  unsubscribed: boolean("unsubscribed").notNull().default(false),
  metadata: json("metadata"),
});

export const insertRecipientSchema = createInsertSchema(recipients).omit({
  id: true,
  added: true,
});

// Marketing Campaigns
export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'email' or 'sms'
  subject: text("subject"),
  content: text("content").notNull(),
  recipientFilter: text("recipient_filter").notNull().default("all"),
  recipientCount: int("recipient_count").default(0),
  sentAt: timestamp("sent_at"),
  scheduledFor: timestamp("scheduled_for"),
  status: text("status").notNull().default("draft"), // 'draft', 'sent', 'scheduled'
  openRate: int("open_rate"),
  clickRate: int("click_rate"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: int("created_by").notNull(), // user ID
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
export const campaignResults = mysqlTable("campaign_results", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaign_id").notNull(),
  recipientId: int("recipient_id").notNull(),
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
export const adTrackers = mysqlTable("ad_trackers", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  platform: text("platform").notNull(), // google, facebook, bing, etc.
  campaignId: text("campaign_id").notNull(),
  parameters: json("parameters"), // UTM parameters and other tracking data
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
export const adTrackerHits = mysqlTable("ad_tracker_hits", {
  id: int("id").autoincrement().primaryKey(),
  trackerId: int("tracker_id").notNull(),
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
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmTerm: text("utm_term"),
  utmContent: text("utm_content"),
  extraData: json("extra_data"),
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
export const trackingSettings = mysqlTable("tracking_settings", {
  id: int("id").autoincrement().primaryKey(),
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
export const marketingGoals = mysqlTable("marketing_goals", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // visits, conversions, rate, custom
  target: int("target").notNull(),
  current: int("current").default(0),
  period: text("period").notNull(), // daily, weekly, monthly, quarterly, yearly, custom
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  trackerId: int("tracker_id"),
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
export const marketingActivities = mysqlTable("marketing_activities", {
  id: int("id").autoincrement().primaryKey(),
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
export const abTests = mysqlTable("ab_tests", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // landing, cta, headline, image, content, layout, color, custom
  status: text("status").default("draft").notNull(), // draft, running, paused, completed
  trackerId: int("tracker_id"),
  pageUrl: text("page_url").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  conversionMetric: text("conversion_metric").notNull(), // clicks, forms, signups, purchases, custom
  targetSampleSize: int("target_sample_size").default(1000),
  minimumConfidence: int("minimum_confidence").default(95),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAbTestSchema = createInsertSchema(abTests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const abTestVariants = mysqlTable("ab_test_variants", {
  id: int("id").autoincrement().primaryKey(),
  testId: int("test_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  isControl: boolean("is_control").default(false),
  content: text("content"),
  customProperties: json("custom_properties"),
  impressions: int("impressions").default(0),
  conversions: int("conversions").default(0),
  conversionRate: int("conversion_rate").default(0),
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

export const abTestHits = mysqlTable("ab_test_hits", {
  id: int("id").autoincrement().primaryKey(),
  variantId: int("variant_id").notNull(),
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
export const consultations = mysqlTable("consultations", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  date: date("date").notNull(),
  timeSlot: text("time_slot").notNull(),
  topic: text("topic").notNull(),
  message: text("message"),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, completed, failed, refunded
  paymentId: text("payment_id"),
  paymentAmount: int("payment_amount").notNull().default(1000), // Price in INR
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  status: text("status").notNull().default("scheduled"), // scheduled, completed, cancelled, rescheduled
  meetingLink: text("meeting_link"),
  notes: text("notes"),
  duration: int("duration").default(1), // Duration in hours
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
