import { useEffect } from 'react';

/**
 * Component to track Google Ads conversions on form submission/thank you pages
 * This is used on pages that a user reaches after completing a conversion action
 */
export default function GoogleAdsConversion() {
  useEffect(() => {
    // Make sure global gtag function exists
    if (typeof window !== 'undefined' && (window as any).gtag) {
      // Fire conversion event
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-864751523/MPktCNrl17oYEKOfrJwD'
      });
    } else {
      console.warn('Google Ads conversion tracking unavailable - gtag not loaded');
    }
  }, []);

  // This component doesn't render anything
  return null;
}