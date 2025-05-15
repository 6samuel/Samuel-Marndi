import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

interface CampaignTrackerProps {
  trackerId: string | number;
}

/**
 * Campaign Tracker Component for tracking marketing campaign visits and conversions
 * 
 * This component automatically tracks user visits from marketing campaigns by:
 * 1. Detecting UTM parameters in the URL
 * 2. Sending tracking data to the backend API
 * 3. Setting up local storage to track return visits and conversions
 * 
 * @param trackerId - The tracker ID to associate hits with
 */
export default function CampaignTracker({ trackerId }: CampaignTrackerProps) {
  const hasTrackedRef = useRef(false);
  const [location] = useLocation();
  
  useEffect(() => {
    // Only track once per page view
    if (hasTrackedRef.current) return;
    hasTrackedRef.current = true;

    // Get campaign parameters from UTM tags
    const trackVisit = async () => {
      try {
        // Create a unique session ID if one doesn't exist
        let sessionId = localStorage.getItem('campaign_session_id');
        if (!sessionId) {
          sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
          localStorage.setItem('campaign_session_id', sessionId);
        }

        // Get UTM parameters from URL
        const url = new URL(window.location.href);
        const utmSource = url.searchParams.get('utm_source') || null;
        const utmMedium = url.searchParams.get('utm_medium') || null;
        const utmCampaign = url.searchParams.get('utm_campaign') || null;
        const utmTerm = url.searchParams.get('utm_term') || null;
        const utmContent = url.searchParams.get('utm_content') || null;

        // Get referrer and device info
        const referrer = document.referrer || null;
        const userAgent = navigator.userAgent;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isTablet = /iPad|Android/i.test(userAgent) && !/Mobile/i.test(userAgent);
        
        let deviceType = 'desktop';
        if (isMobile) deviceType = 'mobile';
        if (isTablet) deviceType = 'tablet';

        // Determine source platform
        let sourcePlatform = 'direct';
        if (utmSource) {
          sourcePlatform = utmSource;
        } else if (referrer) {
          const referrerDomain = new URL(referrer).hostname;
          // Check if referrer is a search engine
          if (/google|bing|yahoo|duckduckgo/.test(referrerDomain)) {
            sourcePlatform = 'organic';
          } else if (/facebook|instagram|twitter|linkedin|youtube/.test(referrerDomain)) {
            sourcePlatform = 'social';
          } else {
            sourcePlatform = 'referral';
          }
        }

        // Prepare tracking data
        const trackingData = {
          trackerId,
          sessionId,
          pageUrl: window.location.href,
          sourcePlatform,
          sourceUrl: referrer,
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
          deviceType,
          ipAddress: null, // Will be determined on the server side
        };

        // Track UTM parameters in local storage for conversion tracking
        if (utmSource || utmMedium || utmCampaign) {
          localStorage.setItem('utm_source', utmSource || '');
          localStorage.setItem('utm_medium', utmMedium || '');
          localStorage.setItem('utm_campaign', utmCampaign || '');
          localStorage.setItem('utm_term', utmTerm || '');
          localStorage.setItem('utm_content', utmContent || '');
        }

        // Send tracking data to your backend API
        const response = await fetch(`/api/ad-trackers/${trackerId}/hit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(trackingData)
        });

        if (!response.ok) {
          throw new Error(`Failed to track campaign visit: ${response.statusText}`);
        }

        console.log('Campaign visit tracked successfully');
      } catch (error) {
        console.error('Error tracking campaign visit:', error);
      }
    };

    // Execute the tracking function
    trackVisit();
  }, [trackerId, location]);

  // This component doesn't render anything visible
  return null;
}

/**
 * Record a conversion for a tracked marketing campaign
 * 
 * @param trackerId - The ID of the tracker to associate the conversion with
 * @param conversionType - Optional type of conversion (e.g., 'purchase', 'signup', 'contact')
 * @returns Promise resolving to success or failure
 */
export async function recordConversion(
  trackerId: number | string,
  conversionType: string = 'default'
): Promise<boolean> {
  try {
    // Get stored session ID or exit if none exists
    const sessionId = localStorage.getItem('campaign_session_id');
    if (!sessionId) {
      console.warn('No campaign session found for conversion tracking');
      return false;
    }

    // Get any stored UTM parameters
    const utmSource = localStorage.getItem('utm_source') || null;
    const utmMedium = localStorage.getItem('utm_medium') || null;
    const utmCampaign = localStorage.getItem('utm_campaign') || null;

    // Prepare conversion data
    const conversionData = {
      trackerId,
      sessionId,
      conversionType,
      utmSource,
      utmMedium,
      utmCampaign,
      pageUrl: window.location.href,
    };

    // Send conversion data to backend
    const response = await fetch(`/api/ad-trackers/${trackerId}/conversion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(conversionData)
    });

    if (!response.ok) {
      throw new Error(`Failed to record conversion: ${response.statusText}`);
    }

    console.log('Conversion tracked successfully:', conversionType);
    return true;
  } catch (error) {
    console.error('Error recording conversion:', error);
    return false;
  }
}