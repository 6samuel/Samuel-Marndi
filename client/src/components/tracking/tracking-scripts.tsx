import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface TrackingSettings {
  googleAnalyticsId: string | null;
  facebookPixelId: string | null;
  microsoftAdsId: string | null;
  linkedInInsightId: string | null;
  googleTagManagerId: string | null;
  tiktokPixelId: string | null;
  twitterPixelId: string | null;
  snapchatPixelId: string | null;
  hotjarId: string | null;
  clarityId: string | null;
}

interface TrackingScriptsProps {
  customDataLayer?: Record<string, any>;
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
  const TIKTOK_PIXEL_ID = trackingSettings?.tiktokPixelId || "";
  const TWITTER_PIXEL_ID = trackingSettings?.twitterPixelId || "";
  const SNAPCHAT_PIXEL_ID = trackingSettings?.snapchatPixelId || "";
  const HOTJAR_ID = trackingSettings?.hotjarId || "";
  const CLARITY_ID = trackingSettings?.clarityId || "";

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
  
  // Track page views for TikTok Pixel
  useEffect(() => {
    if (typeof window !== "undefined" && window.ttq && TIKTOK_PIXEL_ID) {
      window.ttq.track("PageView");
    }
  }, [location, TIKTOK_PIXEL_ID]);
  
  // Track page views for Twitter Pixel
  useEffect(() => {
    if (typeof window !== "undefined" && window.twq && TWITTER_PIXEL_ID) {
      window.twq("track", "PageView");
    }
  }, [location, TWITTER_PIXEL_ID]);
  
  // Track page views for Snapchat Pixel
  useEffect(() => {
    if (typeof window !== "undefined" && window.snaptr && SNAPCHAT_PIXEL_ID) {
      window.snaptr("track", "PAGE_VIEW");
    }
  }, [location, SNAPCHAT_PIXEL_ID]);

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

      {/* TikTok Pixel */}
      {TIKTOK_PIXEL_ID ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;
                var ttq=w[t]=w[t]||[];
                ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
                ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
                for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
                ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
                ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
                ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
                var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;
                var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                ttq.load('${TIKTOK_PIXEL_ID}');
                ttq.page();
              }(window, document, 'ttq');
            `,
          }}
        />
      ) : null}

      {/* Twitter Pixel */}
      {TWITTER_PIXEL_ID ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
              },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='//static.ads-twitter.com/uwt.js',
              a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
              twq('init', '${TWITTER_PIXEL_ID}');
              twq('track', 'PageView');
            `,
          }}
        />
      ) : null}

      {/* Snapchat Pixel */}
      {SNAPCHAT_PIXEL_ID ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
              {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
              a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
              r.src=n;var c=t.getElementsByTagName(s)[0];
              c.parentNode.insertBefore(r,c);})(window,document,
              'https://sc-static.net/scevent.min.js');
              snaptr('init', '${SNAPCHAT_PIXEL_ID}', {
                'user_email': '_'
              });
              snaptr('track', 'PAGE_VIEW');
            `,
          }}
        />
      ) : null}

      {/* Microsoft Clarity */}
      {CLARITY_ID ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_ID}");
            `,
          }}
        />
      ) : null}

      {/* Hotjar */}
      {HOTJAR_ID ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${HOTJAR_ID},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
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
        {SNAPCHAT_PIXEL_ID && (
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt="Snapchat Pixel"
            src={`https://tr.snapchat.com/p?pid=${SNAPCHAT_PIXEL_ID}&ev=PAGE_VIEW&noscript=1`}
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
        googleTagManagerId: null,
        tiktokPixelId: null,
        twitterPixelId: null,
        snapchatPixelId: null,
        hotjarId: null,
        clarityId: null
      };
    });
};

// Helper functions for conversion tracking
const trackConversionObj = {
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
  
  // TikTok Pixel conversion
  tiktokPixel: async (event: string, data?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.ttq) {
      const settings = await getTrackingSettings();
      if (settings.tiktokPixelId) {
        window.ttq.track(event, data || {});
      }
    }
  },
  
  // Twitter Pixel conversion
  twitterPixel: async (event: string, data?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.twq) {
      const settings = await getTrackingSettings();
      if (settings.twitterPixelId) {
        window.twq('track', event, data || {});
      }
    }
  },
  
  // Snapchat Pixel conversion
  snapchatPixel: async (event: string, data?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.snaptr) {
      const settings = await getTrackingSettings();
      if (settings.snapchatPixelId) {
        window.snaptr('track', event, data || {});
      }
    }
  },
  
  // Microsoft Clarity event
  msClarity: async (event: string, data?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.clarity) {
      const settings = await getTrackingSettings();
      if (settings.clarityId) {
        window.clarity('event', event, data || {});
      }
    }
  },
  
  // Hotjar event
  hotjar: async (event: string, data?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.hj) {
      const settings = await getTrackingSettings();
      if (settings.hotjarId) {
        window.hj('event', event, data || {});
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

// Reference to more specialized tracking methods for use in the all method
const additionalTrackingMethods = {
  tiktokPixel: trackConversionObj.tiktokPixel,
  twitterPixel: trackConversionObj.twitterPixel,
  snapchatPixel: trackConversionObj.snapchatPixel,
  msClarity: trackConversionObj.msClarity,
  hotjar: trackConversionObj.hotjar
};

// Update the all method to include new platforms
const originalAll = trackConversionObj.all;
trackConversionObj.all = async (
  name: string, 
  value?: number, 
  currency: string = "USD",
  additionalData?: Record<string, any>
) => {
  // Call the original implementation for basic platforms
  await originalAll(name, value, currency, additionalData);
  
  // Get settings once for all calls
  const settings = await getTrackingSettings();
  
  // TikTok Pixel
  if (settings.tiktokPixelId && typeof window !== "undefined" && window.ttq) {
    additionalTrackingMethods.tiktokPixel(name, {
      value: value,
      currency: currency,
      ...additionalData
    });
  }
  
  // Twitter Pixel
  if (settings.twitterPixelId && typeof window !== "undefined" && window.twq) {
    additionalTrackingMethods.twitterPixel(name, {
      value: value,
      currency: currency,
      ...additionalData
    });
  }
  
  // Snapchat Pixel
  if (settings.snapchatPixelId && typeof window !== "undefined" && window.snaptr) {
    additionalTrackingMethods.snapchatPixel(name, {
      value: value,
      currency: currency,
      ...additionalData
    });
  }
  
  // Microsoft Clarity
  if (settings.clarityId && typeof window !== "undefined" && window.clarity) {
    additionalTrackingMethods.msClarity(name, {
      value: value,
      currency: currency,
      ...additionalData
    });
  }
  
  // Hotjar
  if (settings.hotjarId && typeof window !== "undefined" && window.hj) {
    additionalTrackingMethods.hotjar(name, additionalData);
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
    ttq: any; // TikTok
    twq: any; // Twitter
    snaptr: any; // Snapchat
    clarity: any; // Microsoft Clarity
    hj: any; // Hotjar
  }
}

// Export tracking conversion methods for use in other components
export const trackConversion = trackConversionObj;

export default TrackingScripts;