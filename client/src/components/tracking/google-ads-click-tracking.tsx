import React, { useState, useEffect, useRef } from 'react';

interface GoogleAdsClickTrackingProps {
  conversionId: string;
  conversionLabel: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * GoogleAdsClickTracking wraps elements to track clicks as Google Ads conversions
 * 
 * @param conversionId - Your Google Ads conversion ID
 * @param conversionLabel - The conversion label for this action
 * @param children - React children to render inside the wrapper
 * @param onClick - Optional additional onClick handler
 * @param className - Optional class name to apply to the wrapper
 * @param style - Optional inline styles to apply to the wrapper
 */
export default function GoogleAdsClickTracking({
  conversionId,
  conversionLabel,
  children,
  onClick,
  className,
  style
}: GoogleAdsClickTrackingProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Only load the script once
    if (scriptLoadedRef.current) {
      setIsScriptLoaded(true);
      return;
    }

    // Check if gtag is already available
    if (typeof window !== 'undefined' && window.gtag) {
      scriptLoadedRef.current = true;
      setIsScriptLoaded(true);
      return;
    }

    // Load Google Ads script if not already loaded
    const existingScript = document.getElementById('google-ads-tracking-script');
    
    if (existingScript) {
      scriptLoadedRef.current = true;
      setIsScriptLoaded(true);
      return;
    }
    
    const script = document.createElement('script');
    script.id = 'google-ads-tracking-script';
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
      
      scriptLoadedRef.current = true;
      setIsScriptLoaded(true);
    };
    
    document.head.appendChild(script);
  }, [conversionId]);

  /**
   * Handle click event and track conversion
   */
  const handleClick = (e: React.MouseEvent) => {
    // Execute the user-provided onClick handler if present
    if (onClick) {
      onClick(e);
    }

    // Track the conversion
    if (isScriptLoaded && typeof window !== 'undefined' && window.gtag) {
      try {
        window.gtag('event', 'conversion', {
          send_to: `${conversionId}/${conversionLabel}`,
        });
        console.log('Google Ads click conversion tracked:', {
          conversionId,
          conversionLabel
        });
      } catch (error) {
        console.error('Google Ads click conversion tracking error:', error);
      }
    } else {
      console.warn('Google Ads click tracking not ready yet');
    }
  };

  return (
    <div 
      onClick={handleClick} 
      className={className}
      style={{ 
        cursor: 'pointer',
        ...style
      }}
    >
      {children}
    </div>
  );
}

// Add global type definitions if not already added elsewhere
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}