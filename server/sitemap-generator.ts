import fs from 'fs';
import path from 'path';
import { storage } from './storage';

// Base URL for the site
const SITE_URL = 'https://samuelmarndi.in';

// Priority settings for different types of pages
const PAGE_PRIORITIES = {
  home: 1.0,
  services: 0.9,
  serviceDetail: 0.8,
  portfolio: 0.8,
  portfolioItem: 0.7,
  blog: 0.8,
  blogPost: 0.7,
  about: 0.6,
  contact: 0.6,
  partners: 0.5,
  hire: 0.6
};

// Changefreq settings for different types of pages
const PAGE_CHANGEFREQ = {
  home: 'daily',
  services: 'weekly',
  serviceDetail: 'weekly',
  portfolio: 'weekly',
  portfolioItem: 'monthly',
  blog: 'daily',
  blogPost: 'weekly',
  about: 'monthly',
  contact: 'monthly',
  partners: 'monthly',
  hire: 'monthly'
};

// Date formatter helper
const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

// XML entry generator
const generateUrlEntry = (url: string, lastmod: string, changefreq: string, priority: number) => {
  return `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
};

// Main sitemap generator function
export async function generateSitemap() {
  try {
    const today = formatDate(new Date());
    const urls: string[] = [];

    // Static pages
    urls.push(generateUrlEntry(
      `${SITE_URL}/`,
      today,
      PAGE_CHANGEFREQ.home,
      PAGE_PRIORITIES.home
    ));

    urls.push(generateUrlEntry(
      `${SITE_URL}/about`,
      today,
      PAGE_CHANGEFREQ.about,
      PAGE_PRIORITIES.about
    ));

    urls.push(generateUrlEntry(
      `${SITE_URL}/services`,
      today,
      PAGE_CHANGEFREQ.services,
      PAGE_PRIORITIES.services
    ));

    urls.push(generateUrlEntry(
      `${SITE_URL}/portfolio`,
      today,
      PAGE_CHANGEFREQ.portfolio,
      PAGE_PRIORITIES.portfolio
    ));

    urls.push(generateUrlEntry(
      `${SITE_URL}/blog`,
      today,
      PAGE_CHANGEFREQ.blog,
      PAGE_PRIORITIES.blog
    ));

    urls.push(generateUrlEntry(
      `${SITE_URL}/contact`,
      today,
      PAGE_CHANGEFREQ.contact,
      PAGE_PRIORITIES.contact
    ));

    urls.push(generateUrlEntry(
      `${SITE_URL}/partners`,
      today,
      PAGE_CHANGEFREQ.partners,
      PAGE_PRIORITIES.partners
    ));

    urls.push(generateUrlEntry(
      `${SITE_URL}/hire`,
      today,
      PAGE_CHANGEFREQ.hire,
      PAGE_PRIORITIES.hire
    ));

    // Dynamic pages from database
    
    // Services
    const services = await storage.getServices();
    for (const service of services) {
      urls.push(generateUrlEntry(
        `${SITE_URL}/services/${service.slug}`,
        formatDate(new Date()), // Consider storing and using updatedAt field
        PAGE_CHANGEFREQ.serviceDetail,
        PAGE_PRIORITIES.serviceDetail
      ));
    }

    // Portfolio items
    const portfolioItems = await storage.getPortfolioItems();
    for (const item of portfolioItems) {
      urls.push(generateUrlEntry(
        `${SITE_URL}/portfolio/${item.slug}`,
        formatDate(new Date()), // Consider storing and using updatedAt field
        PAGE_CHANGEFREQ.portfolioItem,
        PAGE_PRIORITIES.portfolioItem
      ));
    }

    // Blog posts
    const blogPosts = await storage.getBlogPosts();
    for (const post of blogPosts) {
      urls.push(generateUrlEntry(
        `${SITE_URL}/blog/${post.slug}`,
        formatDate(post.publishDate),
        PAGE_CHANGEFREQ.blogPost,
        PAGE_PRIORITIES.blogPost
      ));
    }

    // Generate the final XML content
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}
</urlset>`;

    // Write to public directory
    const publicDir = path.resolve(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xmlContent);
    console.log('Sitemap generated successfully at /public/sitemap.xml');
    
    return { success: true, path: '/sitemap.xml' };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return { success: false, error };
  }
}

// Generate robots.txt
export function generateRobotsTxt() {
  try {
    const content = `# robots.txt file for samuelmarndi.in
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml`;

    const publicDir = path.resolve(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDir, 'robots.txt'), content);
    console.log('robots.txt generated successfully at /public/robots.txt');
    
    return { success: true, path: '/robots.txt' };
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    return { success: false, error };
  }
}