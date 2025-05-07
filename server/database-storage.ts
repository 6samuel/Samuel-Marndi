import { eq, like, desc, and, inArray, SQL } from "drizzle-orm";
import { db } from "./db";
import { 
  users, User, InsertUser,
  services, Service, InsertService,
  portfolioItems, PortfolioItem, InsertPortfolioItem,
  testimonials, Testimonial, InsertTestimonial,
  blogPosts, BlogPost, InsertBlogPost,
  contactSubmissions, ContactSubmission, InsertContactSubmission,
  serviceRequests, ServiceRequest, InsertServiceRequest,
  partnerApplications, PartnerApplication, InsertPartnerApplication,
  campaigns, Campaign, InsertCampaign,
  recipients, Recipient, InsertRecipient,
  campaignResults, CampaignResult, InsertCampaignResult
} from "@shared/schema";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Services operations
  async getServices(): Promise<Service[]> {
    try {
      console.log('Fetching services from database...');
      const result = await db.select().from(services).orderBy(services.displayOrder);
      console.log('Services fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('Error in getServices:', error);
      throw error;
    }
  }

  async getServiceById(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.slug, slug));
    return service;
  }

  async getFeaturedServices(): Promise<Service[]> {
    return await db.select()
      .from(services)
      .where(eq(services.featured, true))
      .orderBy(services.displayOrder);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(insertService).returning();
    return service;
  }

  async updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined> {
    const [service] = await db
      .update(services)
      .set(serviceData)
      .where(eq(services.id, id))
      .returning();
    return service;
  }

  async deleteService(id: number): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id));
    return result.rowCount > 0;
  }

  // Portfolio operations
  async getPortfolioItems(): Promise<PortfolioItem[]> {
    return await db.select().from(portfolioItems);
  }

  async getPortfolioItemById(id: number): Promise<PortfolioItem | undefined> {
    const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
    return item;
  }

  async getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | undefined> {
    const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.slug, slug));
    return item;
  }

  async getFeaturedPortfolioItems(): Promise<PortfolioItem[]> {
    return await db.select()
      .from(portfolioItems)
      .where(eq(portfolioItems.featured, true));
  }

  async getPortfolioItemsByCategory(category: string): Promise<PortfolioItem[]> {
    return await db.select()
      .from(portfolioItems)
      .where(eq(portfolioItems.category, category));
  }

  async createPortfolioItem(insertItem: InsertPortfolioItem): Promise<PortfolioItem> {
    const [item] = await db.insert(portfolioItems).values(insertItem).returning();
    return item;
  }

  async updatePortfolioItem(id: number, itemData: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined> {
    const [item] = await db
      .update(portfolioItems)
      .set(itemData)
      .where(eq(portfolioItems.id, id))
      .returning();
    return item;
  }

  async deletePortfolioItem(id: number): Promise<boolean> {
    const result = await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
    return result.rowCount > 0;
  }

  // Testimonials operations
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async getTestimonialById(id: number): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial;
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return await db.select()
      .from(testimonials)
      .where(eq(testimonials.featured, true));
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values(insertTestimonial).returning();
    return testimonial;
  }

  async updateTestimonial(id: number, testimonialData: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const [testimonial] = await db
      .update(testimonials)
      .set(testimonialData)
      .where(eq(testimonials.id, id))
      .returning();
    return testimonial;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id));
    return result.rowCount > 0;
  }

  // Blog operations
  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.publishDate));
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return await db.select()
      .from(blogPosts)
      .where(eq(blogPosts.featured, true))
      .orderBy(desc(blogPosts.publishDate));
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    // Simplified for now - we'll fetch all and filter in JS
    // In a more sophisticated implementation, we'd use another table for categories with many-to-many relationship
    const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.publishDate));
    return posts.filter(post => 
      post.categories && post.categories.includes(category)
    );
  }

  async getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
    // Similar to categories, this is a simplified approach
    const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.publishDate));
    return posts.filter(post => 
      post.tags && post.tags.includes(tag)
    );
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(insertPost).returning();
    return post;
  }

  async updateBlogPost(id: number, postData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [post] = await db
      .update(blogPosts)
      .set(postData)
      .where(eq(blogPosts.id, id))
      .returning();
    return post;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount > 0;
  }

  // Contact submissions operations
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.submittedAt));
  }

  async getContactSubmissionById(id: number): Promise<ContactSubmission | undefined> {
    const [submission] = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, id));
    return submission;
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await db
      .insert(contactSubmissions)
      .values({
        ...insertSubmission,
        submittedAt: new Date(),
        status: "new" 
      })
      .returning();
    return submission;
  }

  async updateContactSubmissionStatus(id: number, status: string): Promise<ContactSubmission | undefined> {
    const [submission] = await db
      .update(contactSubmissions)
      .set({ status })
      .where(eq(contactSubmissions.id, id))
      .returning();
    return submission;
  }

  async deleteContactSubmission(id: number): Promise<boolean> {
    const result = await db
      .delete(contactSubmissions)
      .where(eq(contactSubmissions.id, id));
    return result.rowCount > 0;
  }

  // Service requests operations
  async getServiceRequests(): Promise<ServiceRequest[]> {
    return await db.select()
      .from(serviceRequests)
      .orderBy(desc(serviceRequests.submittedAt));
  }

  async getServiceRequestById(id: number): Promise<ServiceRequest | undefined> {
    const [request] = await db
      .select()
      .from(serviceRequests)
      .where(eq(serviceRequests.id, id));
    return request;
  }

  async createServiceRequest(insertRequest: InsertServiceRequest): Promise<ServiceRequest> {
    const [request] = await db
      .insert(serviceRequests)
      .values({
        ...insertRequest,
        submittedAt: new Date(),
        status: "new"
      })
      .returning();
    return request;
  }

  async updateServiceRequestStatus(id: number, status: string): Promise<ServiceRequest | undefined> {
    const [request] = await db
      .update(serviceRequests)
      .set({ status })
      .where(eq(serviceRequests.id, id))
      .returning();
    return request;
  }

  async deleteServiceRequest(id: number): Promise<boolean> {
    const result = await db
      .delete(serviceRequests)
      .where(eq(serviceRequests.id, id));
    return result.rowCount > 0;
  }

  // Partner applications operations
  async getPartnerApplications(): Promise<PartnerApplication[]> {
    return await db.select()
      .from(partnerApplications)
      .orderBy(desc(partnerApplications.submittedAt));
  }

  async getPartnerApplicationById(id: number): Promise<PartnerApplication | undefined> {
    const [application] = await db
      .select()
      .from(partnerApplications)
      .where(eq(partnerApplications.id, id));
    return application;
  }

  async createPartnerApplication(insertApplication: InsertPartnerApplication): Promise<PartnerApplication> {
    const [application] = await db
      .insert(partnerApplications)
      .values({
        ...insertApplication,
        submittedAt: new Date(),
        status: "new"
      })
      .returning();
    return application;
  }

  async updatePartnerApplicationStatus(id: number, status: string): Promise<PartnerApplication | undefined> {
    const [application] = await db
      .update(partnerApplications)
      .set({ status })
      .where(eq(partnerApplications.id, id))
      .returning();
    return application;
  }

  async deletePartnerApplication(id: number): Promise<boolean> {
    const result = await db
      .delete(partnerApplications)
      .where(eq(partnerApplications.id, id));
    return result.rowCount > 0;
  }

  // Campaign operations
  async getCampaigns(): Promise<Campaign[]> {
    return await db.select()
      .from(campaigns)
      .orderBy(desc(campaigns.createdAt));
  }

  async getCampaignsByType(type: string): Promise<Campaign[]> {
    return await db.select()
      .from(campaigns)
      .where(eq(campaigns.type, type))
      .orderBy(desc(campaigns.createdAt));
  }

  async getCampaignById(id: number): Promise<Campaign | undefined> {
    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id));
    return campaign;
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const [campaign] = await db
      .insert(campaigns)
      .values({
        ...insertCampaign,
        createdAt: new Date()
      })
      .returning();
    return campaign;
  }

  async updateCampaign(id: number, campaignData: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const [campaign] = await db
      .update(campaigns)
      .set(campaignData)
      .where(eq(campaigns.id, id))
      .returning();
    return campaign;
  }

  async updateCampaignStatus(id: number, status: string): Promise<Campaign | undefined> {
    const [campaign] = await db
      .update(campaigns)
      .set({ 
        status,
        sentAt: status === 'sent' ? new Date() : undefined
      })
      .where(eq(campaigns.id, id))
      .returning();
    return campaign;
  }

  async deleteCampaign(id: number): Promise<boolean> {
    const result = await db
      .delete(campaigns)
      .where(eq(campaigns.id, id));
    return result.rowCount > 0;
  }

  // Recipient operations
  async getRecipients(): Promise<Recipient[]> {
    return await db.select()
      .from(recipients)
      .orderBy(desc(recipients.added));
  }

  async getActiveRecipients(): Promise<Recipient[]> {
    return await db.select()
      .from(recipients)
      .where(eq(recipients.unsubscribed, false))
      .orderBy(desc(recipients.added));
  }

  async getRecipientsByTag(tag: string): Promise<Recipient[]> {
    // Similar to blog tags, this is a simplified approach
    const allRecipients = await db.select().from(recipients).orderBy(desc(recipients.added));
    return allRecipients.filter(recipient => 
      recipient.tags && recipient.tags.includes(tag)
    );
  }

  async getRecipientById(id: number): Promise<Recipient | undefined> {
    const [recipient] = await db
      .select()
      .from(recipients)
      .where(eq(recipients.id, id));
    return recipient;
  }

  async getRecipientByEmail(email: string): Promise<Recipient | undefined> {
    const [recipient] = await db
      .select()
      .from(recipients)
      .where(eq(recipients.email, email));
    return recipient;
  }

  async createRecipient(insertRecipient: InsertRecipient): Promise<Recipient> {
    // Check if recipient already exists
    const existing = await this.getRecipientByEmail(insertRecipient.email);
    if (existing) {
      // Update existing recipient
      const [updated] = await db
        .update(recipients)
        .set({
          ...insertRecipient,
          // Don't override these if they were previously set
          tags: existing.tags?.length ? [...new Set([...(existing.tags || []), ...(insertRecipient.tags || [])])] : insertRecipient.tags,
          unsubscribed: false // Reset unsubscribed status if they're signing up again
        })
        .where(eq(recipients.id, existing.id))
        .returning();
      return updated;
    }

    // Create new recipient
    const [recipient] = await db
      .insert(recipients)
      .values({
        ...insertRecipient,
        added: new Date()
      })
      .returning();
    return recipient;
  }

  async updateRecipient(id: number, recipientData: Partial<InsertRecipient>): Promise<Recipient | undefined> {
    const [recipient] = await db
      .update(recipients)
      .set(recipientData)
      .where(eq(recipients.id, id))
      .returning();
    return recipient;
  }

  async updateUnsubscribeStatus(id: number, unsubscribed: boolean): Promise<Recipient | undefined> {
    const [recipient] = await db
      .update(recipients)
      .set({ unsubscribed })
      .where(eq(recipients.id, id))
      .returning();
    return recipient;
  }

  async deleteRecipient(id: number): Promise<boolean> {
    const result = await db
      .delete(recipients)
      .where(eq(recipients.id, id));
    return result.rowCount > 0;
  }

  // Campaign result operations
  async getCampaignResults(campaignId: number): Promise<CampaignResult[]> {
    return await db.select()
      .from(campaignResults)
      .where(eq(campaignResults.campaignId, campaignId))
      .orderBy(desc(campaignResults.sentAt));
  }

  async createCampaignResult(insertResult: InsertCampaignResult): Promise<CampaignResult> {
    const [result] = await db
      .insert(campaignResults)
      .values({
        ...insertResult,
        sentAt: new Date()
      })
      .returning();
    return result;
  }

  async updateCampaignResultStatus(id: number, status: string): Promise<CampaignResult | undefined> {
    const [result] = await db
      .update(campaignResults)
      .set({ 
        status,
        openedAt: status === 'opened' ? new Date() : undefined,
        clickedAt: status === 'clicked' ? new Date() : undefined
      })
      .where(eq(campaignResults.id, id))
      .returning();
    return result;
  }

  async getCampaignResultsCount(campaignId: number): Promise<number> {
    const results = await db.select()
      .from(campaignResults)
      .where(eq(campaignResults.campaignId, campaignId));
    return results.length;
  }

  async getCampaignOpenRate(campaignId: number): Promise<number> {
    const results = await db.select()
      .from(campaignResults)
      .where(eq(campaignResults.campaignId, campaignId));
    
    if (results.length === 0) return 0;
    
    const openedCount = results.filter(r => r.openedAt !== null).length;
    return Math.round((openedCount / results.length) * 100);
  }

  async getCampaignClickRate(campaignId: number): Promise<number> {
    const results = await db.select()
      .from(campaignResults)
      .where(eq(campaignResults.campaignId, campaignId));
    
    if (results.length === 0) return 0;
    
    const clickedCount = results.filter(r => r.clickedAt !== null).length;
    return Math.round((clickedCount / results.length) * 100);
  }
}