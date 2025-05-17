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
  campaignResults, CampaignResult, InsertCampaignResult,
  adTrackers, AdTracker, InsertAdTracker,
  adTrackerHits, AdTrackerHit, InsertAdTrackerHit,
  trackingSettings, TrackingSettings, InsertTrackingSettings,
  consultations, Consultation, InsertConsultation,
  landingPages, LandingPage, InsertLandingPage
} from "@shared/schema";
import { sampleData } from "./sample-data";

// Interface for all storage operations
export interface IStorage {
  // User operations (kept from original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Services operations
  getServices(): Promise<Service[]>;
  getServiceById(id: number): Promise<Service | undefined>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  getFeaturedServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;

  // Portfolio operations
  getPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItemById(id: number): Promise<PortfolioItem | undefined>;
  getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | undefined>;
  getFeaturedPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItemsByCategory(category: string): Promise<PortfolioItem[]>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  updatePortfolioItem(id: number, item: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined>;
  deletePortfolioItem(id: number): Promise<boolean>;

  // Testimonials operations
  getTestimonials(): Promise<Testimonial[]>;
  getTestimonialById(id: number): Promise<Testimonial | undefined>;
  getFeaturedTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;

  // Blog operations
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getFeaturedBlogPosts(): Promise<BlogPost[]>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
  getBlogPostsByTag(tag: string): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Contact submissions operations
  getContactSubmissions(): Promise<ContactSubmission[]>;
  getContactSubmissionById(id: number): Promise<ContactSubmission | undefined>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  updateContactSubmissionStatus(id: number, status: string): Promise<ContactSubmission | undefined>;
  deleteContactSubmission(id: number): Promise<boolean>;

  // Service requests operations
  getServiceRequests(): Promise<ServiceRequest[]>;
  getServiceRequestById(id: number): Promise<ServiceRequest | undefined>;
  createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest>;
  updateServiceRequestStatus(id: number, status: string): Promise<ServiceRequest | undefined>;
  deleteServiceRequest(id: number): Promise<boolean>;
  
  // Partner applications operations
  getPartnerApplications(): Promise<PartnerApplication[]>;
  getPartnerApplicationById(id: number): Promise<PartnerApplication | undefined>;
  createPartnerApplication(application: InsertPartnerApplication): Promise<PartnerApplication>;
  updatePartnerApplicationStatus(id: number, status: string): Promise<PartnerApplication | undefined>;
  deletePartnerApplication(id: number): Promise<boolean>;
  
  // Campaign operations
  getCampaigns(): Promise<Campaign[]>;
  getCampaignsByType(type: string): Promise<Campaign[]>;
  getCampaignById(id: number): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, campaign: Partial<InsertCampaign>): Promise<Campaign | undefined>;
  updateCampaignStatus(id: number, status: string): Promise<Campaign | undefined>;
  deleteCampaign(id: number): Promise<boolean>;
  
  // Recipient operations
  getRecipients(): Promise<Recipient[]>;
  getActiveRecipients(): Promise<Recipient[]>;
  getRecipientsByTag(tag: string): Promise<Recipient[]>;
  getRecipientById(id: number): Promise<Recipient | undefined>;
  getRecipientByEmail(email: string): Promise<Recipient | undefined>;
  createRecipient(recipient: InsertRecipient): Promise<Recipient>;
  updateRecipient(id: number, recipient: Partial<InsertRecipient>): Promise<Recipient | undefined>;
  updateUnsubscribeStatus(id: number, unsubscribed: boolean): Promise<Recipient | undefined>;
  deleteRecipient(id: number): Promise<boolean>;
  
  // Campaign results operations
  getCampaignResults(campaignId: number): Promise<CampaignResult[]>;
  createCampaignResult(result: InsertCampaignResult): Promise<CampaignResult>;
  updateCampaignResultStatus(id: number, status: string): Promise<CampaignResult | undefined>;
  getCampaignResultsCount(campaignId: number): Promise<number>;
  getCampaignOpenRate(campaignId: number): Promise<number>;
  getCampaignClickRate(campaignId: number): Promise<number>;
  
  // Ad Tracking operations
  getAdTrackers(): Promise<AdTracker[]>;
  getAdTrackerById(id: number): Promise<AdTracker | undefined>;
  getAdTrackersByPlatform(platform: string): Promise<AdTracker[]>;
  createAdTracker(tracker: InsertAdTracker): Promise<AdTracker>;
  updateAdTracker(id: number, tracker: Partial<InsertAdTracker>): Promise<AdTracker | undefined>;
  updateAdTrackerStatus(id: number, active: boolean): Promise<AdTracker | undefined>;
  deleteAdTracker(id: number): Promise<boolean>;
  
  // Ad Tracker Hits operations
  getAdTrackerHits(trackerId: number): Promise<AdTrackerHit[]>;
  getAdTrackerHitsBySessionId(sessionId: string, trackerId: number): Promise<AdTrackerHit[]>;
  createAdTrackerHit(hit: InsertAdTrackerHit): Promise<AdTrackerHit>;
  updateAdTrackerHitConversion(id: number, converted: boolean, conversionType?: string): Promise<AdTrackerHit | undefined>;
  getAdTrackerHitsCount(trackerId: number): Promise<number>;
  getAdTrackerConversionRate(trackerId: number): Promise<number>;
  getAdTrackerHitsBySources(trackerId: number): Promise<Record<string, number>>;
  getAdTrackerHitsByDeviceType(trackerId: number): Promise<Record<string, number>>;
  deleteAdTrackerHit(id: number): Promise<boolean>;
  
  // Tracking Settings operations
  getTrackingSettings(): Promise<TrackingSettings>;
  updateTrackingSettings(settings: Partial<InsertTrackingSettings>): Promise<TrackingSettings>;
  
  // Marketing Goals operations
  getMarketingGoals(): Promise<any[]>;
  getMarketingGoalById(id: number): Promise<any | undefined>;
  createMarketingGoal(goal: any): Promise<any>;
  updateMarketingGoal(id: number, goal: any): Promise<any | undefined>;
  deleteMarketingGoal(id: number): Promise<boolean>;
  
  // Marketing Activities operations
  getMarketingActivities(): Promise<any[]>;
  getMarketingActivityById(id: number): Promise<any | undefined>;
  createMarketingActivity(activity: any): Promise<any>;
  updateMarketingActivity(id: number, activity: any): Promise<any | undefined>;
  deleteMarketingActivity(id: number): Promise<boolean>;
  
  // A/B Testing operations
  getABTests(): Promise<any[]>;
  getABTestById(id: number): Promise<any | undefined>;
  createABTest(test: any): Promise<any>;
  updateABTest(id: number, test: any): Promise<any | undefined>;
  updateABTestStatus(id: number, status: string): Promise<any | undefined>;
  deleteABTest(id: number): Promise<boolean>;
  
  // A/B Test Variants operations
  getABTestVariants(testId: number): Promise<any[]>;
  createABTestVariant(variant: any): Promise<any>;
  updateABTestVariant(id: number, testId: number, variant: any): Promise<any | undefined>;
  deleteABTestVariant(id: number, testId: number): Promise<boolean>;
  
  // A/B Test Tracking operations
  recordABTestImpression(variantId: number, data: any): Promise<any>;
  recordABTestConversion(variantId: number, sessionId: string): Promise<any | undefined>;
  getABTestResults(testId: number): Promise<any>;
  
  // Consultation operations
  getConsultations(): Promise<Consultation[]>;
  getConsultationById(id: number): Promise<Consultation | undefined>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  updateConsultation(id: number, consultation: Partial<InsertConsultation>): Promise<Consultation | undefined>;
  updateConsultationStatus(id: number, status: string): Promise<Consultation | undefined>;
  updateConsultationPaymentStatus(id: number, paymentStatus: string, paymentId?: string, paymentMethod?: string): Promise<Consultation | undefined>;
  deleteConsultation(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private services: Map<number, Service>;
  private portfolioItems: Map<number, PortfolioItem>;
  private testimonials: Map<number, Testimonial>;
  private blogPosts: Map<number, BlogPost>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private serviceRequests: Map<number, ServiceRequest>;
  private partnerApplications: Map<number, PartnerApplication>;
  private campaigns: Map<number, Campaign>;
  private recipients: Map<number, Recipient>;
  private campaignResults: Map<number, CampaignResult>;
  private adTrackers: Map<number, AdTracker>;
  private adTrackerHits: Map<number, AdTrackerHit>;
  private consultations: Map<number, Consultation>;
  
  private userId: number = 1;
  private serviceId: number = 1;
  private portfolioId: number = 1;
  private testimonialId: number = 1;
  private blogPostId: number = 1;
  private contactSubmissionId: number = 1;
  private serviceRequestId: number = 1;
  private partnerApplicationId: number = 1;
  private campaignId: number = 1;
  private recipientId: number = 1;
  private campaignResultId: number = 1;
  private adTrackerId: number = 1;
  private adTrackerHitId: number = 1;
  private consultationId: number = 1;

  constructor() {
    this.users = new Map();
    this.services = new Map();
    this.portfolioItems = new Map();
    this.testimonials = new Map();
    this.blogPosts = new Map();
    this.contactSubmissions = new Map();
    this.serviceRequests = new Map();
    this.partnerApplications = new Map();
    this.campaigns = new Map();
    this.recipients = new Map();
    this.campaignResults = new Map();
    this.adTrackers = new Map();
    this.adTrackerHits = new Map();
    this.consultations = new Map();
    
    // Initialize with sample data
    this.initializeData();
  }

  // Initialize with sample data
  private initializeData() {
    // Add sample services
    sampleData.services.forEach(service => {
      this.createService(service);
    });

    // Add sample portfolio items
    sampleData.portfolioItems.forEach(item => {
      this.createPortfolioItem(item);
    });

    // Add sample testimonials
    sampleData.testimonials.forEach(testimonial => {
      this.createTestimonial(testimonial);
    });

    // Add sample blog posts
    sampleData.blogPosts.forEach(post => {
      this.createBlogPost(post);
    });
  }

  // User operations (kept from original)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Services operations
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getServiceById(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    return Array.from(this.services.values()).find(
      (service) => service.slug === slug,
    );
  }

  async getFeaturedServices(): Promise<Service[]> {
    return Array.from(this.services.values())
      .filter(service => service.featured)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.serviceId++;
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }

  async updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined> {
    const service = this.services.get(id);
    if (!service) return undefined;
    
    const updatedService: Service = { ...service, ...serviceData };
    this.services.set(id, updatedService);
    return updatedService;
  }

  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
  }

  // Portfolio operations
  async getPortfolioItems(): Promise<PortfolioItem[]> {
    return Array.from(this.portfolioItems.values());
  }

  async getPortfolioItemById(id: number): Promise<PortfolioItem | undefined> {
    return this.portfolioItems.get(id);
  }

  async getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | undefined> {
    return Array.from(this.portfolioItems.values()).find(
      (item) => item.slug === slug,
    );
  }

  async getFeaturedPortfolioItems(): Promise<PortfolioItem[]> {
    return Array.from(this.portfolioItems.values()).filter(item => item.featured);
  }

  async getPortfolioItemsByCategory(category: string): Promise<PortfolioItem[]> {
    return Array.from(this.portfolioItems.values()).filter(
      (item) => item.category === category,
    );
  }

  async createPortfolioItem(insertItem: InsertPortfolioItem): Promise<PortfolioItem> {
    const id = this.portfolioId++;
    const item: PortfolioItem = { ...insertItem, id };
    this.portfolioItems.set(id, item);
    return item;
  }

  async updatePortfolioItem(id: number, itemData: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined> {
    const item = this.portfolioItems.get(id);
    if (!item) return undefined;
    
    const updatedItem: PortfolioItem = { ...item, ...itemData };
    this.portfolioItems.set(id, updatedItem);
    return updatedItem;
  }

  async deletePortfolioItem(id: number): Promise<boolean> {
    return this.portfolioItems.delete(id);
  }

  // Testimonials operations
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getTestimonialById(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter(testimonial => testimonial.featured);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialId++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  async updateTestimonial(id: number, testimonialData: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const testimonial = this.testimonials.get(id);
    if (!testimonial) return undefined;
    
    const updatedTestimonial: Testimonial = { ...testimonial, ...testimonialData };
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    return this.testimonials.delete(id);
  }

  // Blog operations
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug,
    );
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.featured)
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.categories.includes(category))
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }

  async getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.tags.includes(tag))
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostId++;
    const post: BlogPost = { ...insertPost, id };
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: number, postData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;
    
    const updatedPost: BlogPost = { ...post, ...postData };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Contact submissions operations
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values())
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  async getContactSubmissionById(id: number): Promise<ContactSubmission | undefined> {
    return this.contactSubmissions.get(id);
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.contactSubmissionId++;
    const submittedAt = new Date();
    const submission: ContactSubmission = { 
      ...insertSubmission, 
      id, 
      submittedAt,
      status: "new" 
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async updateContactSubmissionStatus(id: number, status: string): Promise<ContactSubmission | undefined> {
    const submission = this.contactSubmissions.get(id);
    if (!submission) return undefined;
    
    const updatedSubmission: ContactSubmission = { ...submission, status };
    this.contactSubmissions.set(id, updatedSubmission);
    return updatedSubmission;
  }

  async deleteContactSubmission(id: number): Promise<boolean> {
    return this.contactSubmissions.delete(id);
  }

  // Service requests operations
  async getServiceRequests(): Promise<ServiceRequest[]> {
    return Array.from(this.serviceRequests.values())
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  async getServiceRequestById(id: number): Promise<ServiceRequest | undefined> {
    return this.serviceRequests.get(id);
  }

  async createServiceRequest(insertRequest: InsertServiceRequest): Promise<ServiceRequest> {
    const id = this.serviceRequestId++;
    const submittedAt = new Date();
    const request: ServiceRequest = { 
      ...insertRequest, 
      id, 
      submittedAt,
      status: "new" 
    };
    this.serviceRequests.set(id, request);
    return request;
  }

  async updateServiceRequestStatus(id: number, status: string): Promise<ServiceRequest | undefined> {
    const request = this.serviceRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest: ServiceRequest = { ...request, status };
    this.serviceRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  async deleteServiceRequest(id: number): Promise<boolean> {
    return this.serviceRequests.delete(id);
  }
  
  // Partner application operations
  async getPartnerApplications(): Promise<PartnerApplication[]> {
    return Array.from(this.partnerApplications.values())
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  async getPartnerApplicationById(id: number): Promise<PartnerApplication | undefined> {
    return this.partnerApplications.get(id);
  }

  async createPartnerApplication(insertApplication: InsertPartnerApplication): Promise<PartnerApplication> {
    const id = this.partnerApplicationId++;
    const submittedAt = new Date();
    const application: PartnerApplication = { 
      ...insertApplication, 
      id, 
      submittedAt,
      status: "new" 
    };
    this.partnerApplications.set(id, application);
    return application;
  }

  async updatePartnerApplicationStatus(id: number, status: string): Promise<PartnerApplication | undefined> {
    const application = this.partnerApplications.get(id);
    if (!application) return undefined;
    
    const updatedApplication: PartnerApplication = { ...application, status };
    this.partnerApplications.set(id, updatedApplication);
    return updatedApplication;
  }

  async deletePartnerApplication(id: number): Promise<boolean> {
    return this.partnerApplications.delete(id);
  }
  
  // Campaign operations
  async getCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getCampaignsByType(type: string): Promise<Campaign[]> {
    return Array.from(this.campaigns.values())
      .filter(campaign => campaign.type === type)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getCampaignById(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = this.campaignId++;
    const createdAt = new Date();
    const campaign: Campaign = { 
      ...insertCampaign, 
      id, 
      createdAt, 
      status: insertCampaign.status || 'draft',
      sendDate: insertCampaign.sendDate || null,
      sentCount: 0,
      openCount: 0,
      clickCount: 0 
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async updateCampaign(id: number, campaignData: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    
    const updatedCampaign: Campaign = { ...campaign, ...campaignData };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  async updateCampaignStatus(id: number, status: string): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    
    const updatedCampaign: Campaign = { ...campaign, status };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  async deleteCampaign(id: number): Promise<boolean> {
    return this.campaigns.delete(id);
  }

  // Recipient operations
  async getRecipients(): Promise<Recipient[]> {
    return Array.from(this.recipients.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getActiveRecipients(): Promise<Recipient[]> {
    return Array.from(this.recipients.values())
      .filter(recipient => !recipient.unsubscribed)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getRecipientsByTag(tag: string): Promise<Recipient[]> {
    return Array.from(this.recipients.values())
      .filter(recipient => recipient.tags?.includes(tag))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getRecipientById(id: number): Promise<Recipient | undefined> {
    return this.recipients.get(id);
  }

  async getRecipientByEmail(email: string): Promise<Recipient | undefined> {
    return Array.from(this.recipients.values()).find(
      (recipient) => recipient.email === email
    );
  }

  async createRecipient(insertRecipient: InsertRecipient): Promise<Recipient> {
    const id = this.recipientId++;
    const createdAt = new Date();
    const recipient: Recipient = { 
      ...insertRecipient, 
      id, 
      createdAt,
      unsubscribed: false
    };
    this.recipients.set(id, recipient);
    return recipient;
  }

  async updateRecipient(id: number, recipientData: Partial<InsertRecipient>): Promise<Recipient | undefined> {
    const recipient = this.recipients.get(id);
    if (!recipient) return undefined;
    
    const updatedRecipient: Recipient = { ...recipient, ...recipientData };
    this.recipients.set(id, updatedRecipient);
    return updatedRecipient;
  }

  async updateUnsubscribeStatus(id: number, unsubscribed: boolean): Promise<Recipient | undefined> {
    const recipient = this.recipients.get(id);
    if (!recipient) return undefined;
    
    const updatedRecipient: Recipient = { ...recipient, unsubscribed };
    this.recipients.set(id, updatedRecipient);
    return updatedRecipient;
  }

  async deleteRecipient(id: number): Promise<boolean> {
    return this.recipients.delete(id);
  }

  // Campaign results operations
  async getCampaignResults(campaignId: number): Promise<CampaignResult[]> {
    return Array.from(this.campaignResults.values())
      .filter(result => result.campaignId === campaignId)
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
  }

  async createCampaignResult(insertResult: InsertCampaignResult): Promise<CampaignResult> {
    const id = this.campaignResultId++;
    const sentAt = new Date();
    const result: CampaignResult = { 
      ...insertResult, 
      id, 
      sentAt,
      openedAt: null,
      clickedAt: null 
    };
    this.campaignResults.set(id, result);
    return result;
  }

  async updateCampaignResultStatus(id: number, status: string): Promise<CampaignResult | undefined> {
    const result = this.campaignResults.get(id);
    if (!result) return undefined;
    
    let updatedResult: CampaignResult;
    
    if (status === 'opened' && !result.openedAt) {
      updatedResult = { ...result, openedAt: new Date() };
    } else if (status === 'clicked' && !result.clickedAt) {
      updatedResult = { 
        ...result, 
        clickedAt: new Date(),
        openedAt: result.openedAt || new Date() // If opened for the first time via click
      };
    } else {
      updatedResult = result;
    }
    
    this.campaignResults.set(id, updatedResult);
    return updatedResult;
  }

  async getCampaignResultsCount(campaignId: number): Promise<number> {
    return Array.from(this.campaignResults.values())
      .filter(result => result.campaignId === campaignId)
      .length;
  }

  async getCampaignOpenRate(campaignId: number): Promise<number> {
    const results = Array.from(this.campaignResults.values())
      .filter(result => result.campaignId === campaignId);
    
    if (results.length === 0) return 0;
    
    const openedCount = results.filter(result => result.openedAt !== null).length;
    return (openedCount / results.length) * 100;
  }

  async getCampaignClickRate(campaignId: number): Promise<number> {
    const results = Array.from(this.campaignResults.values())
      .filter(result => result.campaignId === campaignId);
    
    if (results.length === 0) return 0;
    
    const clickedCount = results.filter(result => result.clickedAt !== null).length;
    return (clickedCount / results.length) * 100;
  }

  // Ad Tracking operations
  async getAdTrackers(): Promise<AdTracker[]> {
    return Array.from(this.adTrackers.values());
  }

  async getAdTrackerById(id: number): Promise<AdTracker | undefined> {
    return this.adTrackers.get(id);
  }

  async getAdTrackersByPlatform(platform: string): Promise<AdTracker[]> {
    return Array.from(this.adTrackers.values()).filter(
      tracker => tracker.platform === platform
    );
  }

  async createAdTracker(insertTracker: InsertAdTracker): Promise<AdTracker> {
    const id = this.adTrackerId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const tracker: AdTracker = { 
      ...insertTracker, 
      id, 
      createdAt,
      updatedAt
    };
    this.adTrackers.set(id, tracker);
    return tracker;
  }

  async updateAdTracker(id: number, trackerData: Partial<InsertAdTracker>): Promise<AdTracker | undefined> {
    const tracker = this.adTrackers.get(id);
    if (!tracker) return undefined;
    
    const updatedTracker: AdTracker = { 
      ...tracker, 
      ...trackerData, 
      updatedAt: new Date() 
    };
    this.adTrackers.set(id, updatedTracker);
    return updatedTracker;
  }

  async updateAdTrackerStatus(id: number, active: boolean): Promise<AdTracker | undefined> {
    const tracker = this.adTrackers.get(id);
    if (!tracker) return undefined;
    
    const updatedTracker: AdTracker = { 
      ...tracker, 
      active,
      updatedAt: new Date()
    };
    this.adTrackers.set(id, updatedTracker);
    return updatedTracker;
  }

  async deleteAdTracker(id: number): Promise<boolean> {
    return this.adTrackers.delete(id);
  }
  
  // Ad Tracker Hits operations
  async getAdTrackerHits(trackerId: number): Promise<AdTrackerHit[]> {
    return Array.from(this.adTrackerHits.values())
      .filter(hit => hit.trackerId === trackerId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  async getAdTrackerHitsBySessionId(sessionId: string, trackerId: number): Promise<AdTrackerHit[]> {
    return Array.from(this.adTrackerHits.values())
      .filter(hit => hit.trackerId === trackerId && hit.sessionId === sessionId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createAdTrackerHit(insertHit: InsertAdTrackerHit): Promise<AdTrackerHit> {
    const id = this.adTrackerHitId++;
    const timestamp = new Date();
    const hit: AdTrackerHit = { 
      ...insertHit, 
      id, 
      timestamp 
    };
    this.adTrackerHits.set(id, hit);
    return hit;
  }

  async updateAdTrackerHitConversion(id: number, converted: boolean, conversionType?: string): Promise<AdTrackerHit | undefined> {
    const hit = this.adTrackerHits.get(id);
    if (!hit) return undefined;
    
    const updatedHit: AdTrackerHit = { 
      ...hit, 
      converted,
      conversionType: conversionType || hit.conversionType
    };
    this.adTrackerHits.set(id, updatedHit);
    return updatedHit;
  }

  async getAdTrackerHitsCount(trackerId: number): Promise<number> {
    return (await this.getAdTrackerHits(trackerId)).length;
  }

  async getAdTrackerConversionRate(trackerId: number): Promise<number> {
    const hits = await this.getAdTrackerHits(trackerId);
    const totalCount = hits.length;
    
    if (totalCount === 0) return 0;
    
    const conversionCount = hits.filter(hit => hit.converted).length;
    
    return Math.floor((conversionCount / totalCount) * 100);
  }

  async getAdTrackerHitsBySources(trackerId: number): Promise<Record<string, number>> {
    const hits = await this.getAdTrackerHits(trackerId);
    const sourceCounts: Record<string, number> = {};
    
    hits.forEach(hit => {
      const source = hit.sourcePlatform;
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });
    
    return sourceCounts;
  }

  async getAdTrackerHitsByDeviceType(trackerId: number): Promise<Record<string, number>> {
    const hits = await this.getAdTrackerHits(trackerId);
    const deviceCounts: Record<string, number> = {};
    
    hits.forEach(hit => {
      if (hit.deviceType) {
        const device = hit.deviceType;
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      }
    });
    
    return deviceCounts;
  }

  async deleteAdTrackerHit(id: number): Promise<boolean> {
    return this.adTrackerHits.delete(id);
  }
  
  // Tracking Settings operations
  async getTrackingSettings(): Promise<TrackingSettings> {
    // In-memory implementation - return default settings
    return {
      id: 1,
      updatedAt: new Date(),
      googleAnalyticsId: null,
      facebookPixelId: null,
      microsoftAdsId: null,
      linkedInInsightId: null,
      googleTagManagerId: null
    };
  }
  
  async updateTrackingSettings(settingsData: Partial<InsertTrackingSettings>): Promise<TrackingSettings> {
    // In-memory implementation - just return the settings that were sent
    // In a real implementation, we would save these to the database
    return {
      id: 1,
      updatedAt: new Date(),
      googleAnalyticsId: settingsData.googleAnalyticsId || null,
      facebookPixelId: settingsData.facebookPixelId || null,
      microsoftAdsId: settingsData.microsoftAdsId || null,
      linkedInInsightId: settingsData.linkedInInsightId || null,
      googleTagManagerId: settingsData.googleTagManagerId || null,
      tiktokPixelId: settingsData.tiktokPixelId || null,
      twitterPixelId: settingsData.twitterPixelId || null,
      snapchatPixelId: settingsData.snapchatPixelId || null,
      hotjarId: settingsData.hotjarId || null,
      clarityId: settingsData.clarityId || null
    };
  }
  
  // Marketing Goals operations
  async getMarketingGoals(): Promise<any[]> {
    return [];
  }
  
  async getMarketingGoalById(id: number): Promise<any | undefined> {
    return undefined;
  }
  
  async createMarketingGoal(goal: any): Promise<any> {
    return { id: 1, ...goal, createdAt: new Date(), updatedAt: new Date() };
  }
  
  async updateMarketingGoal(id: number, goal: any): Promise<any | undefined> {
    return { id, ...goal, updatedAt: new Date() };
  }
  
  async deleteMarketingGoal(id: number): Promise<boolean> {
    return true;
  }
  
  // Marketing Activities operations
  async getMarketingActivities(): Promise<any[]> {
    return [];
  }
  
  async getMarketingActivityById(id: number): Promise<any | undefined> {
    return undefined;
  }
  
  async createMarketingActivity(activity: any): Promise<any> {
    return { id: 1, ...activity, createdAt: new Date(), updatedAt: new Date() };
  }
  
  async updateMarketingActivity(id: number, activity: any): Promise<any | undefined> {
    return { id, ...activity, updatedAt: new Date() };
  }
  
  async deleteMarketingActivity(id: number): Promise<boolean> {
    return true;
  }
  
  // A/B Testing operations
  async getABTests(): Promise<any[]> {
    return [];
  }
  
  async getABTestById(id: number): Promise<any | undefined> {
    return undefined;
  }
  
  async createABTest(test: any): Promise<any> {
    return { id: 1, ...test, createdAt: new Date(), updatedAt: new Date() };
  }
  
  async updateABTest(id: number, test: any): Promise<any | undefined> {
    return { id, ...test, updatedAt: new Date() };
  }
  
  async updateABTestStatus(id: number, status: string): Promise<any | undefined> {
    return { id, status, updatedAt: new Date() };
  }
  
  async deleteABTest(id: number): Promise<boolean> {
    return true;
  }
  
  // A/B Test Variants operations
  async getABTestVariants(testId: number): Promise<any[]> {
    return [];
  }
  
  async createABTestVariant(variant: any): Promise<any> {
    return { id: 1, ...variant, impressions: 0, conversions: 0, conversionRate: 0 };
  }
  
  async updateABTestVariant(id: number, testId: number, variant: any): Promise<any | undefined> {
    return { id, testId, ...variant };
  }
  
  async deleteABTestVariant(id: number, testId: number): Promise<boolean> {
    return true;
  }
  
  // A/B Test Tracking operations
  async recordABTestImpression(variantId: number, data: any): Promise<any> {
    return {
      id: 1,
      variantId,
      sessionId: data.sessionId,
      timestamp: new Date(),
      referrer: data.referrer || null,
      device: data.device || null,
      converted: false
    };
  }
  
  async recordABTestConversion(variantId: number, sessionId: string): Promise<any | undefined> {
    return {
      id: 1,
      variantId,
      sessionId,
      timestamp: new Date(),
      converted: true,
      conversionTimestamp: new Date()
    };
  }
  
  async getABTestResults(testId: number): Promise<any> {
    return {
      test: { id: testId, name: "Sample Test", status: "running" },
      variants: [],
      metrics: {
        totalImpressions: 0,
        totalConversions: 0,
        overallConversionRate: 0,
        bestVariant: null,
        improvement: 0,
        isSignificant: false,
        confidenceLevel: 0
      },
      status: "running"
    };
  }

  // Consultation operations
  async getConsultations(): Promise<Consultation[]> {
    return Array.from(this.consultations.values())
      .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  }

  async getConsultationById(id: number): Promise<Consultation | undefined> {
    return this.consultations.get(id);
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const id = this.consultationId++;
    const consultation: Consultation = {
      ...insertConsultation,
      id,
      requestedAt: new Date(),
      status: "pending",
      paymentStatus: "unpaid"
    };
    this.consultations.set(id, consultation);
    return consultation;
  }

  async updateConsultation(id: number, consultationData: Partial<InsertConsultation>): Promise<Consultation | undefined> {
    const consultation = this.consultations.get(id);
    if (!consultation) return undefined;
    
    const updatedConsultation: Consultation = { ...consultation, ...consultationData };
    this.consultations.set(id, updatedConsultation);
    return updatedConsultation;
  }

  async updateConsultationStatus(id: number, status: string): Promise<Consultation | undefined> {
    const consultation = this.consultations.get(id);
    if (!consultation) return undefined;
    
    const updatedConsultation: Consultation = { ...consultation, status };
    this.consultations.set(id, updatedConsultation);
    return updatedConsultation;
  }

  async updateConsultationPaymentStatus(
    id: number, 
    paymentStatus: string, 
    paymentId?: string, 
    paymentMethod?: string
  ): Promise<Consultation | undefined> {
    const consultation = this.consultations.get(id);
    if (!consultation) return undefined;
    
    const updatedConsultation: Consultation = { 
      ...consultation, 
      paymentStatus,
      paymentId,
      paymentMethod 
    };
    this.consultations.set(id, updatedConsultation);
    return updatedConsultation;
  }

  async deleteConsultation(id: number): Promise<boolean> {
    return this.consultations.delete(id);
  }
  
  // Landing page operations
  async getLandingPages(): Promise<LandingPage[]> {
    return [];
  }
  
  async getLandingPage(id: number): Promise<LandingPage | undefined> {
    return undefined;
  }
  
  async getLandingPageBySlug(slug: string): Promise<LandingPage | undefined> {
    return undefined;
  }
  
  async createLandingPage(landingPage: InsertLandingPage): Promise<LandingPage> {
    throw new Error("Method not implemented.");
  }
  
  async updateLandingPage(id: number, landingPage: Partial<InsertLandingPage>): Promise<LandingPage | undefined> {
    return undefined;
  }
  
  async deleteLandingPage(id: number): Promise<boolean> {
    return false;
  }
}

// Import database storage
import { DatabaseStorage } from "./database-storage";

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();
