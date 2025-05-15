import { useEffect, useRef } from 'react';

interface GoogleAdsConversionProps {
  conversionId: string;
  conversionLabel: string;
  conversionValue?: number;
  transactionId?: string;
  currency?: string;
  sendToServerOnly?: boolean;
}

/**
 * GoogleAdsConversion component to track conversions in Google Ads
 * 
 * @param conversionId - Your Google Ads conversion ID
 * @param conversionLabel - The conversion label associated with the action
 * @param conversionValue - The value of the conversion (optional)
 * @param transactionId - A unique transaction ID (optional)
 * @param currency - The currency code for the conversion value (optional, defaults to USD)
 * @param sendToServerOnly - If true, doesn't load the Google Ads script (for server-side tracking)
 */
export default function GoogleAdsConversion({
  conversionId,
  conversionLabel,
  conversionValue,
  transactionId,
  currency = 'USD',
  sendToServerOnly = false
}: GoogleAdsConversionProps) {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    // Only track once per component instance
    if (hasTrackedRef.current) return;
    hasTrackedRef.current = true;

    // If we're only sending to server, don't load the script or track client-side
    if (sendToServerOnly) {
      console.log(`Server-side conversion tracking: ID=${conversionId}, Label=${conversionLabel}`);
      return;
    }

    const trackConversion = () => {
      if (typeof window === 'undefined' || !window.gtag) {
        console.warn('Google Ads conversion tracking failed: gtag not available');
        return;
      }

      // Prepare conversion parameters
      const conversionParams: Record<string, any> = {
        send_to: `${conversionId}/${conversionLabel}`,
      };

      // Add optional parameters if they exist
      if (conversionValue !== undefined) {
        conversionParams.value = conversionValue;
        conversionParams.currency = currency;
      }

      if (transactionId) {
        conversionParams.transaction_id = transactionId;
      }

      // Track the conversion event
      try {
        window.gtag('event', 'conversion', conversionParams);
        console.log('Google Ads conversion tracked:', conversionParams);
      } catch (error) {
        console.error('Google Ads conversion tracking error:', error);
      }
    };

    // Check if gtag is already available
    if (typeof window !== 'undefined' && window.gtag) {
      trackConversion();
    } else {
      // Load the Google Ads script if it's not already loaded
      const existingScript = document.getElementById('google-ads-conversion-script');
      
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'google-ads-conversion-script';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${conversionId}`;
        
        script.onload = () => {
          // Initialize gtag
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            window.dataLayer.push(arguments);
          }
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', conversionId);
          
          // Track the conversion after script loads
          trackConversion();
        };
        
        document.head.appendChild(script);
      }
    }

    // Cleanup function
    return () => {
      // No cleanup needed as we don't want to remove the script
      // since it might be used by other components
    };
  }, [conversionId, conversionLabel, conversionValue, transactionId, currency, sendToServerOnly]);

  // This component doesn't render anything
  return null;
}

// Add global type definitions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}