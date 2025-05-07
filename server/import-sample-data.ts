import { db } from "./db";
import { sampleData } from "./sample-data";
import { services, portfolioItems, testimonials, blogPosts } from "@shared/schema";
import { count, sql } from "drizzle-orm";

// Simple script to populate the database with sample data
async function importSampleData() {
  console.log("Starting to import sample data...");
  
  try {
    // Import services
    console.log("Importing services...");
    const existingServicesCount = await db.select({ value: count() }).from(services);
    if (existingServicesCount[0].value === 0) {
      for (const service of sampleData.services) {
        await db.insert(services).values(service);
      }
      console.log(`Imported ${sampleData.services.length} services.`);
    } else {
      console.log("Services already exist, skipping import.");
    }
    
    // Import portfolio items
    console.log("Importing portfolio items...");
    const existingPortfolioCount = await db.select({ value: count() }).from(portfolioItems);
    if (existingPortfolioCount[0].value === 0) {
      for (const item of sampleData.portfolioItems) {
        await db.insert(portfolioItems).values(item);
      }
      console.log(`Imported ${sampleData.portfolioItems.length} portfolio items.`);
    } else {
      console.log("Portfolio items already exist, skipping import.");
    }
    
    // Import testimonials
    console.log("Importing testimonials...");
    const existingTestimonialsCount = await db.select({ value: count() }).from(testimonials);
    if (existingTestimonialsCount[0].value === 0) {
      for (const testimonial of sampleData.testimonials) {
        await db.insert(testimonials).values(testimonial);
      }
      console.log(`Imported ${sampleData.testimonials.length} testimonials.`);
    } else {
      console.log("Testimonials already exist, skipping import.");
    }
    
    // Import blog posts
    console.log("Importing blog posts...");
    const existingBlogPostsCount = await db.select({ value: count() }).from(blogPosts);
    if (existingBlogPostsCount[0].value === 0) {
      for (const post of sampleData.blogPosts) {
        await db.insert(blogPosts).values({
          ...post,
          publishDate: new Date(post.publishDate)
        });
      }
      console.log(`Imported ${sampleData.blogPosts.length} blog posts.`);
    } else {
      console.log("Blog posts already exist, skipping import.");
    }
    
    console.log("Sample data import completed successfully!");
  } catch (error) {
    console.error("Error importing sample data:", error);
  }
}

// Export the function to be used in server/index.ts
export { importSampleData };