/**
 * Campaign tracking utility functions for tracking page visits and conversions
 * 
 * These functions help with implementing tracking for marketing campaigns,
 * using the CampaignTracker component and recordConversion utility.
 */

/**
 * Get the campaign tracker ID to use based on settings
 * This could be extended to dynamically choose different trackers
 * based on the page or campaign.
 */
export function getDefaultTrackerId(): number {
  // Default tracker ID - you can make this dynamic if needed
  // For example, load from environment or page-specific settings
  return 1;
}

/**
 * Get all UTM parameters from the current URL
 * @returns Object containing all UTM parameters
 */
export function getUtmParameters(): Record<string, string | null> {
  if (typeof window === 'undefined') {
    return {};
  }

  const url = new URL(window.location.href);
  return {
    utm_source: url.searchParams.get('utm_source'),
    utm_medium: url.searchParams.get('utm_medium'),
    utm_campaign: url.searchParams.get('utm_campaign'),
    utm_term: url.searchParams.get('utm_term'),
    utm_content: url.searchParams.get('utm_content'),
  };
}

/**
 * Check if the current visit is from a marketing campaign
 * @returns Boolean indicating whether the current visit is from a campaign
 */
export function isFromMarketingCampaign(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const { utm_source, utm_medium, utm_campaign } = getUtmParameters();
  return Boolean(utm_source || utm_medium || utm_campaign);
}

/**
 * Get the unique session ID for campaign tracking
 * Creates one if it doesn't exist
 * @returns The session ID string
 */
export function getCampaignSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  let sessionId = localStorage.getItem('campaign_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem('campaign_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Store UTM parameters in localStorage for future conversion tracking
 * on pages that don't have the UTM parameters in the URL
 */
export function storeUtmParameters(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const utmParams = getUtmParameters();
  
  // Only store if at least one parameter exists
  if (utmParams.utm_source || utmParams.utm_medium || utmParams.utm_campaign) {
    localStorage.setItem('utm_source', utmParams.utm_source || '');
    localStorage.setItem('utm_medium', utmParams.utm_medium || '');
    localStorage.setItem('utm_campaign', utmParams.utm_campaign || '');
    localStorage.setItem('utm_term', utmParams.utm_term || '');
    localStorage.setItem('utm_content', utmParams.utm_content || '');
  }
}

/**
 * Get stored UTM parameters from localStorage
 * @returns Object containing stored UTM parameters
 */
export function getStoredUtmParameters(): Record<string, string | null> {
  if (typeof window === 'undefined') {
    return {};
  }

  return {
    utm_source: localStorage.getItem('utm_source'),
    utm_medium: localStorage.getItem('utm_medium'),
    utm_campaign: localStorage.getItem('utm_campaign'),
    utm_term: localStorage.getItem('utm_term'),
    utm_content: localStorage.getItem('utm_content'),
  };
}

/**
 * Create a URL with UTM parameters
 * @param baseUrl The base URL to add parameters to
 * @param params The UTM parameters to add
 * @returns The URL with UTM parameters
 */
export function createUtmUrl(
  baseUrl: string, 
  params: {
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_term?: string;
    utm_content?: string;
  }
): string {
  const url = new URL(baseUrl);
  
  // Add each parameter to the URL
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
}

/**
 * Detect the device type based on user agent
 * @returns 'mobile', 'tablet', or 'desktop'
 */
export function detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') {
    return 'desktop';
  }

  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad/i.test(userAgent) || 
                  (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent));
  
  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
}