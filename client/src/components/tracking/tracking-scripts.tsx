import React, { useEffect } from "react";
import { useLocation } from "wouter";

// Google Analytics 4 Measurement ID
const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID || "G-MEASUREMENT_ID"; // Replace in production

// Facebook Pixel ID
const FB_PIXEL_ID = process.env.FB_PIXEL_ID || "PIXEL_ID"; // Replace in production

// Microsoft Advertising (Bing) UET Tag ID
const MS_ADVERTISING_TAG_ID = process.env.MS_ADVERTISING_TAG_ID || "TAG_ID"; // Replace in production

// LinkedIn Insight Tag ID
const LINKEDIN_INSIGHT_TAG_ID = process.env.LINKEDIN_INSIGHT_TAG_ID || "TAG_ID"; // Replace in production

interface TrackingScriptsProps {
  // Add any props if needed
}

const TrackingScripts: React.FC<TrackingScriptsProps> = () => {
  const [location] = useLocation();

  // Track page views for Google Analytics
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: location,
      });
    }
  }, [location]);

  // Track page views for Facebook Pixel
  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [location]);

  return (
    <>
      {/* Google Analytics 4 */}
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

      {/* Facebook Pixel */}
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

      {/* Microsoft Advertising UET Tag */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"${MS_ADVERTISING_TAG_ID}"};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");
          `,
        }}
      />

      {/* LinkedIn Insight Tag */}
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

      {/* Google Tag Manager (alternative approach) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-XXXXXXX');
          `,
        }}
      />

      {/* No-Script fallbacks */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt="Facebook Pixel"
        />
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt="LinkedIn Insight Tag"
          src={`https://px.ads.linkedin.com/collect/?pid=${LINKEDIN_INSIGHT_TAG_ID}&fmt=gif`}
        />
      </noscript>
    </>
  );
};

// Helper functions for conversion tracking
export const trackConversion = {
  // Google Analytics conversion
  googleAnalytics: (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  },

  // Facebook Pixel conversion
  facebookPixel: (event: string, data?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", event, data);
    }
  },

  // Microsoft Advertising conversion
  microsoftAds: (event: string, data?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.uetq) {
      window.uetq.push("event", event, data);
    }
  },

  // LinkedIn Insight Tag conversion
  linkedInInsight: (conversionId: string, value?: number) => {
    if (typeof window !== "undefined" && window.lintrk) {
      window.lintrk("track", { conversion_id: conversionId, value: value });
    }
  },

  // Track conversion across all platforms
  all: (
    name: string, 
    value?: number, 
    currency: string = "USD",
    additionalData?: Record<string, any>
  ) => {
    // Google Analytics
    trackConversion.googleAnalytics(name, "conversion", undefined, value);
    
    // Facebook Pixel
    trackConversion.facebookPixel(name, {
      value: value,
      currency: currency,
      ...additionalData
    });
    
    // Microsoft Advertising
    trackConversion.microsoftAds(name, {
      revenue_value: value,
      currency: currency,
      ...additionalData
    });
    
    // LinkedIn
    trackConversion.linkedInInsight(name, value);
  }
};

// Extend Window interface to include tracking tools
declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
    fbq: (command: string, ...args: any[]) => void;
    uetq: any;
    lintrk: any;
    dataLayer: any[];
  }
}

export default TrackingScripts;