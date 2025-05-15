/**
 * Utility functions for marketing campaign tracking
 * Handles UTM parameters and conversion tracking
 */

/**
 * Generate a tracking URL with UTM parameters for marketing campaigns
 * @param baseUrl - The base URL to append parameters to
 * @param campaignParams - Custom campaign parameters to override defaults
 * @returns URL with UTM parameters
 */
export function generateTrackingUrl(
  baseUrl: string = window.location.href,
  campaignParams: {
    utm_id?: string,
    utm_source?: string,
    utm_campaign?: string,
    utm_medium?: string,
    utm_content?: string,
    utm_term?: string
  } = {}
): string {
  const trackingUrl = new URL(baseUrl);
  
  // Set default values
  const params = {
    utm_id: '1',
    utm_source: 'google',
    utm_campaign: 'leads_2025',
    utm_session: 'session_' + Math.random().toString(36).substring(2, 12),
    ...campaignParams
  };
  
  // Append all parameters to the URL
  Object.entries(params).forEach(([key, value]) => {
    trackingUrl.searchParams.append(key, value);
  });
  
  return trackingUrl.toString();
}

/**
 * Extract UTM parameters from the current URL
 * @returns Object containing UTM parameters from URL
 */
export function getUtmParams(): Record<string, string> {
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};
  
  // Extract all UTM parameters
  ['utm_id', 'utm_source', 'utm_campaign', 'utm_medium', 'utm_content', 'utm_term', 'utm_session'].forEach(param => {
    const value = urlParams.get(param);
    if (value) {
      utmParams[param] = value;
    }
  });
  
  return utmParams;
}

/**
 * Get the session ID from URL or generate a new one
 * @returns Session ID for tracking
 */
export function getTrackingSessionId(): string {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('utm_session');
  
  if (sessionId) {
    // Save session ID to sessionStorage for future use
    try {
      sessionStorage.setItem('utm_session', sessionId);
    } catch (error) {
      console.error('Error saving session ID to sessionStorage:', error);
    }
    return sessionId;
  }
  
  // Try to get from sessionStorage if not in URL
  try {
    const storedSessionId = sessionStorage.getItem('utm_session');
    if (storedSessionId) {
      return storedSessionId;
    }
  } catch (error) {
    console.error('Error retrieving session ID from sessionStorage:', error);
  }
  
  // Generate new session ID if none found
  const newSessionId = 'session_' + Math.random().toString(36).substring(2, 12);
  try {
    sessionStorage.setItem('utm_session', newSessionId);
  } catch (error) {
    console.error('Error saving new session ID to sessionStorage:', error);
  }
  
  return newSessionId;
}

/**
 * Record a conversion for tracking
 * @param trackerId - The tracker ID to record the conversion for
 * @param conversionType - Type of conversion (lead, purchase, etc.)
 * @returns Promise that resolves when conversion is recorded
 */
export async function recordConversion(
  trackerId: number = 1,
  conversionType: string = 'lead'
): Promise<boolean> {
  try {
    const sessionId = getTrackingSessionId();
    const response = await fetch(`/api/ad-trackers/${trackerId}/conversion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: sessionId,
        conversionType: conversionType,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error recording conversion: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to record conversion:', error);
    return false;
  }
}

/**
 * Record a hit/visit for a specific tracker
 * @param trackerId - The tracker ID to record the hit for
 * @returns Promise that resolves when hit is recorded
 */
export async function recordTrackerHit(trackerId: number = 1): Promise<boolean> {
  try {
    const sessionId = getTrackingSessionId();
    const utmParams = getUtmParams();
    
    const response = await fetch(`/api/ad-trackers/${trackerId}/hit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: sessionId,
        source: utmParams.utm_source || 'direct',
        campaign: utmParams.utm_campaign || 'unknown',
        medium: utmParams.utm_medium || 'website',
        content: utmParams.utm_content || '',
        term: utmParams.utm_term || '',
        // Additional data that might be useful
        referrer: document.referrer,
        device: navigator.userAgent,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error recording tracker hit: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to record tracker hit:', error);
    return false;
  }
}