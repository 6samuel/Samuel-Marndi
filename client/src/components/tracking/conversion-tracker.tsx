import React, { useEffect } from 'react';

interface ConversionTrackerProps {
  conversionType: string;
  value?: number;
  currency?: string;
  orderId?: string;
  metadata?: Record<string, string | number>;
}

/**
 * Component to track conversions for various analytics platforms
 * This component doesn't render anything but triggers tracking events
 */
const ConversionTracker: React.FC<ConversionTrackerProps> = ({
  conversionType,
  value,
  currency = 'USD',
  orderId,
  metadata = {}
}) => {
  useEffect(() => {
    const trackConversion = () => {
      try {
        // Track Google Analytics conversion
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'conversion', {
            'send_to': 'conversion', 
            'event_category': 'conversion',
            'event_label': conversionType,
            'value': value,
            'currency': currency,
            'transaction_id': orderId,
            ...metadata
          });
        }

        // Track Facebook Pixel conversion
        if (typeof window.fbq === 'function') {
          window.fbq('track', conversionType, {
            currency: currency,
            value: value,
            order_id: orderId,
            ...metadata
          });
        }

        // Track Twitter Pixel conversion
        if (typeof window.twq === 'function') {
          window.twq('track', conversionType, {
            currency: currency,
            value: value,
            order_id: orderId,
            ...metadata
          });
        }

        // Track Microsoft Clarity custom event
        if (typeof window.clarity === 'function') {
          window.clarity('set', `conversion_${conversionType}`, 'true');
          if (value) window.clarity('set', `conversion_value`, value.toString());
          if (orderId) window.clarity('set', `order_id`, orderId);
        }

        console.log(`Conversion tracked: ${conversionType}`, { value, currency, orderId, metadata });
      } catch (error) {
        console.error('Error tracking conversion:', error);
      }
    };

    trackConversion();
  }, [conversionType, value, currency, orderId, metadata]);

  return null;
};

// Note: Window interface is already declared in tracking-scripts.tsx

export default ConversionTracker;