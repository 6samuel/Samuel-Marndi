import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface TrackingSettings {
  googleAnalyticsId: string | null;
  facebookPixelId: string | null;
  microsoftAdsId: string | null;
  linkedInInsightId: string | null;
  googleTagManagerId: string | null;
}

interface TrackingScriptsProps {
  // Add any props if needed
}

const TrackingScripts: React.FC<TrackingScriptsProps> = () => {
  const [location] = useLocation();
  
  // Fetch tracking settings from the API
  const { data: trackingSettings } = useQuery<TrackingSettings>({
    queryKey: ['/api/settings/tracking'],
    // Don't refetch on window focus for tracking scripts
    refetchOnWindowFocus: false,
  });
  
  // Use IDs from the database or fall back to empty strings
  const GA_MEASUREMENT_ID = trackingSettings?.googleAnalyticsId || "";
  const FB_PIXEL_ID = trackingSettings?.facebookPixelId || "";
  const MS_ADVERTISING_TAG_ID = trackingSettings?.microsoftAdsId || "";
  const LINKEDIN_INSIGHT_TAG_ID = trackingSettings?.linkedInInsightId || "";
  const GTM_ID = trackingSettings?.googleTagManagerId || "";

  // Track page views for Google Analytics
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: location,
      });
    }
  }, [location, GA_MEASUREMENT_ID]);

  // Track page views for Facebook Pixel
  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq && FB_PIXEL_ID) {
      window.fbq("track", "PageView");
    }
  }, [location, FB_PIXEL_ID]);

  return (
    <>
      {/* Google Analytics 4 */}
      {GA_MEASUREMENT_ID ? (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `,
            }}
          />
        </>
      ) : null}

      {/* Facebook Pixel */}
      {FB_PIXEL_ID ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
      ) : null}

      {/* Microsoft Advertising UET Tag */}
      {MS_ADVERTISING_TAG_ID ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"${MS_ADVERTISING_TAG_ID}"};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");
            `,
          }}
        />
      ) : null}

      {/* LinkedIn Insight Tag */}
      {LINKEDIN_INSIGHT_TAG_ID ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              _linkedin_partner_id = "${LINKEDIN_INSIGHT_TAG_ID}";
              window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
              window._linkedin_data_partner_ids.push(_linkedin_partner_id);
              (function(l) {
                if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                window.lintrk.q=[]}
                var s = document.getElementsByTagName("script")[0];
                var b = document.createElement("script");
                b.type = "text/javascript";b.async = true;
                b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                s.parentNode.insertBefore(b, s);})(window.lintrk);
            `,
          }}
        />
      ) : null}

      {/* Google Tag Manager */}
      {GTM_ID ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      ) : null}

      {/* No-Script fallbacks */}
      <noscript>
        {FB_PIXEL_ID && (
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            alt="Facebook Pixel"
          />
        )}
        {LINKEDIN_INSIGHT_TAG_ID && (
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt="LinkedIn Insight Tag"
            src={`https://px.ads.linkedin.com/collect/?pid=${LINKEDIN_INSIGHT_TAG_ID}&fmt=gif`}
          />
        )}
      </noscript>
    </>
  );
};

// Get tracking settings singleton for conversion tracking functions
const getTrackingSettings = (): Promise<TrackingSettings> => {
  return fetch('/api/settings/tracking')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load tracking settings');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error loading tracking settings:', error);
      // Return empty settings as fallback
      return {
        googleAnalyticsId: null,
        facebookPixelId: null,
        microsoftAdsId: null,
        linkedInInsightId: null,
        googleTagManagerId: null
      };
    });
};

// Helper functions for conversion tracking
export const trackConversion = {
  // Google Analytics conversion
  googleAnalytics: async (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== "undefined" && window.gtag) {
      const settings = await getTrackingSettings();
      if (settings.googleAnalyticsId) {
        window.gtag("event", action, {
          event_category: category,
          event_label: label,
          value: value,
        });
      }
    }
  },

  // Facebook Pixel conversion
  facebookPixel: async (event: string, data?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.fbq) {
      const settings = await getTrackingSettings();
      if (settings.facebookPixelId) {
        window.fbq("track", event, data);
      }
    }
  },

  // Microsoft Advertising conversion
  microsoftAds: async (event: string, data?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.uetq) {
      const settings = await getTrackingSettings();
      if (settings.microsoftAdsId) {
        window.uetq.push("event", event, data);
      }
    }
  },

  // LinkedIn Insight Tag conversion
  linkedInInsight: async (conversionId: string, value?: number) => {
    if (typeof window !== "undefined" && window.lintrk) {
      const settings = await getTrackingSettings();
      if (settings.linkedInInsightId) {
        window.lintrk("track", { conversion_id: conversionId, value: value });
      }
    }
  },

  // Track conversion across all platforms
  all: async (
    name: string, 
    value?: number, 
    currency: string = "USD",
    additionalData?: Record<string, any>
  ) => {
    // Get settings once for all calls
    const settings = await getTrackingSettings();
    
    // Google Analytics
    if (settings.googleAnalyticsId && typeof window !== "undefined" && window.gtag) {
      window.gtag("event", name, {
        event_category: "conversion",
        value: value,
      });
    }
    
    // Facebook Pixel
    if (settings.facebookPixelId && typeof window !== "undefined" && window.fbq) {
      window.fbq("track", name, {
        value: value,
        currency: currency,
        ...additionalData
      });
    }
    
    // Microsoft Advertising
    if (settings.microsoftAdsId && typeof window !== "undefined" && window.uetq) {
      window.uetq.push("event", name, {
        revenue_value: value,
        currency: currency,
        ...additionalData
      });
    }
    
    // LinkedIn
    if (settings.linkedInInsightId && typeof window !== "undefined" && window.lintrk) {
      window.lintrk("track", { conversion_id: name, value: value });
    }
  }
};

// Extend Window interface to include tracking tools
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    uetq: any;
    lintrk: any;
    dataLayer: any[];
  }
}

export default TrackingScripts;