import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile' | 'book';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  structuredData?: any;
  extraTags?: React.ReactNode;
}

// Base site values
export const siteName = 'Samuel Marndi - Web Developer & Digital Marketer';
export const siteUrl = 'https://samuelmarndi.in';
export const defaultDescription = 
  'Expert web development and digital marketing services by Samuel Marndi. ' +
  'Comprehensive IT solutions including web design, app development, cloud computing, ' +
  'SEO and digital marketing with proven results.';
export const defaultKeywords = [
  'web development', 'digital marketing', 'web design', 'SEO services', 'app development',
  'IT consulting', 'cloud services', 'software development', 'UI/UX design', 'e-commerce',
  'Samuel Marndi', 'freelance developer', 'tech services'
];
export const defaultOgImage = `${siteUrl}/images/samuel-marndi-og.jpg`;  // Update with actual path

export function SEO({
  title,
  description,
  keywords = defaultKeywords,
  canonical,
  ogImage = defaultOgImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData,
  extraTags,
}: SEOProps) {
  // Format page title
  const formattedTitle = title ? `${title} | ${siteName}` : siteName;
  
  // Format canonical URL
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;
  
  // Join keywords
  const keywordsString = [...defaultKeywords, ...keywords].join(', ');
  
  // Default structured data for LocalBusiness
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": siteName,
    "description": description || defaultDescription,
    "url": canonicalUrl,
    "logo": `${siteUrl}/images/logo.png`,
    "image": ogImage,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "India"
    },
    "priceRange": "₹₹₹",
    "telephone": "+918280320550",
    "email": "samuelmarandi6@gmail.com",
    "sameAs": [
      "https://www.linkedin.com/in/samuel-marndi/",
      "https://twitter.com/SamuelMarndi",
      "https://github.com/6samuel",
      "https://www.facebook.com/samuel.marndi/"
    ]
  };

  // Merge with any custom structured data
  const finalStructuredData = structuredData ? structuredData : defaultStructuredData;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="title" content={formattedTitle} />
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywordsString} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={formattedTitle} />
      <meta property="twitter:description" content={description || defaultDescription} />
      <meta property="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content="@SamuelMarndi" />
      
      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
      
      {/* Additional Tags */}
      {extraTags}
    </Helmet>
  );
}

// Helper function to generate article structured data
export function generateArticleSchema(article: {
  title: string;
  description: string;
  publishDate: string;
  modifiedDate?: string;
  authorName: string;
  authorUrl?: string;
  image?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.image || defaultOgImage,
    "datePublished": article.publishDate,
    "dateModified": article.modifiedDate || article.publishDate,
    "author": {
      "@type": "Person",
      "name": article.authorName,
      "url": article.authorUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/images/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url
    }
  };
}

// Helper function to generate service structured data
export function generateServiceSchema(service: {
  name: string;
  description: string;
  url: string;
  image?: string;
  price?: string;
  priceCurrency?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "url": service.url,
    "provider": {
      "@type": "ProfessionalService",
      "name": siteName,
      "image": `${siteUrl}/images/logo.png`,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "India"
      },
      "priceRange": "₹₹₹",
      "telephone": "+918280320550",
      "email": "samuelmarandi6@gmail.com"
    },
    "offers": service.price ? {
      "@type": "Offer",
      "price": service.price,
      "priceCurrency": service.priceCurrency || "INR"
    } : undefined,
    "image": service.image || defaultOgImage
  };
}

// Helper function to generate FAQ structured data
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}