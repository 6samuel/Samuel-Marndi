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
  partnerApplications, PartnerApplication, InsertPartnerApplication
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
}