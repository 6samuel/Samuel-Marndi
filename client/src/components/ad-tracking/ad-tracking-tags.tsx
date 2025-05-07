import React, { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Ad Tracking Tags Component
 * 
 * This component handles loading and initialization of various ad platform tracking
 * codes including Google Ads, Facebook Pixel, and Microsoft Advertising.
 * 
 * It automatically tracks page views and can be used to track conversions/events
 * from anywhere in the application.
 */

declare global {
  interface Window {
    // Google
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    
    // Facebook
    fbq: (...args: any[]) => void;
    _fbq: any;
    
    // Microsoft
    uetq: any;
    UET: any;
  }
}

// Initialize tracker IDs from environment variables or use placeholders
// These would be set in your actual production environment
const GOOGLE_ANALYTICS_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID || 'G-XXXXXXXXXX';
const GOOGLE_ADS_ID = import.meta.env.VITE_GOOGLE_ADS_ID || 'AW-XXXXXXXXXX';
const FACEBOOK_PIXEL_ID = import.meta.env.VITE_FACEBOOK_PIXEL_ID || 'XXXXXXXXXX';
const MICROSOFT_ADS_ID = import.meta.env.VITE_MICROSOFT_ADS_ID || 'XXXXXXXXXX';

/**
 * Initializes the Google Analytics and Google Ads scripts
 */
const initializeGoogleTracking = () => {
  // Skip if already initialized
  if (window.gtag) return;
  
  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());

  // Configure GA4
  window.gtag('config', GOOGLE_ANALYTICS_ID);
  
  // Configure Google Ads
  if (GOOGLE_ADS_ID !== 'AW-XXXXXXXXXX') {
    window.gtag('config', GOOGLE_ADS_ID);
  }
  
  // Load the script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
  document.head.appendChild(script);
};

/**
 * Initializes the Facebook Pixel tracking script
 */
const initializeFacebookPixel = () => {
  // Skip if already initialized or using placeholder ID
  if (window.fbq || FACEBOOK_PIXEL_ID === 'XXXXXXXXXX') return;
  
  // Initialize Facebook Pixel
  window._fbq = window._fbq || [];
  window.fbq = function() {
    window._fbq.push(arguments);
  };
  
  window.fbq('init', FACEBOOK_PIXEL_ID);
  window.fbq('track', 'PageView');
  
  // Load the script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
  
  // Add noscript fallback
  const noscript = document.createElement('noscript');
  const img = document.createElement('img');
  img.height = 1;
  img.width = 1;
  img.style.display = 'none';
  img.src = `https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`;
  noscript.appendChild(img);
  document.body.appendChild(noscript);
};

/**
 * Initializes the Microsoft Advertising UET tracking script
 */
const initializeMicrosoftAds = () => {
  // Skip if already initialized or using placeholder ID
  if (window.uetq || MICROSOFT_ADS_ID === 'XXXXXXXXXX') return;
  
  // Initialize Microsoft UET
  window.uetq = window.uetq || [];
  
  // Load the script
  const script = document.createElement('script');
  script.async = true;
  script.src = `//bat.bing.com/bat.js`;
  script.onload = () => {
    if (window.UET) {
      new window.UET({
        ti: MICROSOFT_ADS_ID,
        q: window.uetq
      });
    }
  };
  document.head.appendChild(script);
};

/**
 * Track a page view across all platforms
 * @param page The page path to track
 */
export const trackPageView = (page: string) => {
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: page
    });
  }
  
  // Facebook Pixel
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
  
  // Microsoft Ads
  if (window.uetq) {
    window.uetq.push('pageLoad');
  }
};

/**
 * Track a conversion event across all ad platforms
 * 
 * @param eventName The name of the event (e.g., 'contact_form_submit')
 * @param params Additional parameters for the event
 */
export const trackConversion = (
  eventName: string, 
  params: Record<string, any> = {}
) => {
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }
  
  // Facebook Pixel
  if (window.fbq) {
    window.fbq('track', eventName, params);
  }
  
  // Microsoft Ads
  if (window.uetq) {
    window.uetq.push({
      event: eventName,
      ...params
    });
  }
  
  console.log(`Tracked conversion event: ${eventName}`, params);
};

/**
 * Track specific conversion types with pre-configured events
 */
export const trackContactFormSubmission = (value = 0) => {
  trackConversion('contact_form_submit', { value });
  
  // Google Ads specific conversion
  if (window.gtag && GOOGLE_ADS_ID !== 'AW-XXXXXXXXXX') {
    window.gtag('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/contact`,
      value: value,
      currency: 'USD'
    });
  }
  
  // Facebook specific conversion
  if (window.fbq) {
    window.fbq('track', 'Lead', { value, currency: 'USD' });
  }
};

export const trackServiceRequest = (serviceId: number, value = 0) => {
  trackConversion('service_request', { service_id: serviceId, value });
  
  // Google Ads specific conversion
  if (window.gtag && GOOGLE_ADS_ID !== 'AW-XXXXXXXXXX') {
    window.gtag('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/service`,
      value: value,
      currency: 'USD'
    });
  }
  
  // Facebook specific conversion
  if (window.fbq) {
    window.fbq('track', 'StartTrial', { value, currency: 'USD' });
  }
};

/**
 * Component to initialize tracking and monitor route changes
 */
export const AdTrackingTags: React.FC = () => {
  const [location] = useLocation();

  // Initialize all tracking scripts
  useEffect(() => {
    initializeGoogleTracking();
    initializeFacebookPixel();
    initializeMicrosoftAds();
  }, []);
  
  // Track page views on route changes
  useEffect(() => {
    trackPageView(location);
  }, [location]);
  
  // This component doesn't render anything
  return null;
};

export default AdTrackingTags;