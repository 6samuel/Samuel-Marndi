import { useEffect } from 'react';

/**
 * Adds Google Ads click conversion tracking to the global window object
 * This is used for tracking clicks on links/buttons before a conversion
 */
export default function GoogleAdsClickTracking() {
  useEffect(() => {
    // Make sure we're running in the browser environment
    if (typeof window !== 'undefined') {
      // Add the gtag_report_conversion function to the window object
      (window as any).gtag_report_conversion = (url: string | undefined) => {
        const callback = function () {
          if (typeof(url) != 'undefined') {
            window.location.href = url;
          }
        };
        
        // Make sure global gtag function exists
        if ((window as any).gtag) {
          (window as any).gtag('event', 'conversion', {
            'send_to': 'AW-864751523/MPktCNrl17oYEKOfrJwD',
            'event_callback': callback
          });
        } else {
          console.warn('Google Ads click tracking unavailable - gtag not loaded');
          // If gtag is not available, still allow the click to function
          if (typeof url !== 'undefined') {
            window.location.href = url;
          }
        }
        
        return false;
      };
    }
  }, []);

  // This component doesn't render anything
  return null;
}

/**
 * Hook to attach Google Ads click tracking to links/buttons
 * @param url - The URL to navigate to after conversion tracking
 * @returns A click handler that tracks the conversion then navigates
 */
export function useGoogleAdsClickTracking(url?: string) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && (window as any).gtag_report_conversion) {
      return (window as any).gtag_report_conversion(url);
    } else {
      // Fallback if the tracking function is not available
      if (url) window.location.href = url;
      return false;
    }
  };
}