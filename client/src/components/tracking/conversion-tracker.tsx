import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trackConversion } from './tracking-scripts';

// Session ID is used to track the same user across different page views
const generateSessionId = () => {
  return `sid_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
};

// Get existing session ID or create a new one
const getSessionId = () => {
  let sessionId = localStorage.getItem('tracking_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('tracking_session_id', sessionId);
  }
  return sessionId;
};

// Get UTM parameters from URL
const getUtmParams = () => {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};
  
  ['source', 'medium', 'campaign', 'term', 'content'].forEach(param => {
    const value = urlParams.get(`utm_${param}`);
    if (value) {
      utmParams[`utm_${param}`] = value;
    }
  });
  
  return utmParams;
};

// Extract campaign ID if present in URL
const getCampaignId = () => {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('cid');
};

// Get referrer information
const getReferrer = () => {
  if (typeof document === 'undefined') return '';
  return document.referrer || '';
};

// Detect device type
const detectDeviceType = () => {
  if (typeof navigator === 'undefined') return 'unknown';
  
  const userAgent = navigator.userAgent;
  
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    return 'mobile';
  }
  
  if (/iPad|Android|Touch/i.test(userAgent) && !/Mobile/i.test(userAgent)) {
    return 'tablet';
  }
  
  return 'desktop';
};

// API function to record a tracker hit
const recordTrackerHit = async (trackerId: number, data: any) => {
  try {
    const response = await fetch(`/api/ad-tracking/hit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trackerId,
        ...data,
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error recording tracker hit:', error);
    return null;
  }
};

// API function to record a conversion
const recordConversion = async (trackerId: number, sessionId: string, conversionType: string) => {
  try {
    const response = await fetch(`/api/ad-trackers/${trackerId}/conversion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        conversionType,
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error recording conversion:', error);
    return null;
  }
};

interface ConversionTrackerProps {
  trackingId?: string;  // Google Analytics ID
  pixelId?: string;     // Facebook Pixel ID
  uetTagId?: string;    // Microsoft Advertising UET Tag ID
  linkedInTagId?: string; // LinkedIn Insight Tag ID
  adsTrackerId?: number; // Internal ads tracker ID
  onLoad?: () => void;
}

export const ConversionTracker: React.FC<ConversionTrackerProps> = ({
  trackingId,
  pixelId,
  uetTagId,
  linkedInTagId,
  adsTrackerId,
  onLoad,
}) => {
  const [location] = useLocation();
  const [isTracked, setIsTracked] = useState(false);
  
  useEffect(() => {
    const trackPageView = async () => {
      if (isTracked) return;
      
      // Track page view in analytics platforms
      if (trackingId) {
        trackConversion.googleAnalytics('page_view', 'navigation');
      }
      
      if (pixelId) {
        trackConversion.facebookPixel('PageView');
      }
      
      if (uetTagId && window.uetq) {
        trackConversion.microsoftAds('page_view');
      }
      
      if (linkedInTagId && window.lintrk) {
        window.lintrk('track', { page_view: true });
      }
      
      // Record hit in internal tracking system
      if (adsTrackerId) {
        const sessionId = getSessionId();
        const utmParams = getUtmParams();
        const campaignId = getCampaignId();
        const referrer = getReferrer();
        const deviceType = detectDeviceType();
        
        await recordTrackerHit(adsTrackerId, {
          sessionId,
          utmSource: utmParams.utm_source || referrer,
          utmMedium: utmParams.utm_medium,
          utmCampaign: utmParams.utm_campaign,
          campaignId,
          path: location,
          referrer,
          deviceType,
        });
      }
      
      setIsTracked(true);
      if (onLoad) onLoad();
    };
    
    trackPageView();
    
    // Reset tracked state when location changes
    return () => {
      setIsTracked(false);
    };
  }, [location, trackingId, pixelId, uetTagId, linkedInTagId, adsTrackerId, isTracked, onLoad]);
  
  return null; // This component doesn't render anything
};

// Hook to track conversions
export const useConversionTracking = (adsTrackerId?: number) => {
  const sessionId = getSessionId();
  
  const trackConversionEvent = async (
    event: string,
    value?: number,
    currency: string = 'USD',
    conversionType: string = 'general',
    additionalData?: Record<string, any>
  ) => {
    // Track in all platforms
    trackConversion.all(event, value, currency, additionalData);
    
    // Record in internal tracking system
    if (adsTrackerId) {
      await recordConversion(adsTrackerId, sessionId, conversionType);
    }
  };
  
  return { trackConversionEvent };
};

export default ConversionTracker;