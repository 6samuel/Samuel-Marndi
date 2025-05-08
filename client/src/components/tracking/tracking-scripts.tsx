import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// Global tracking helpers for use in other components
export const trackConversion = {
  googleAnalytics: (eventName: string, category?: string, label?: string, value?: number) => {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, {
          'event_category': category,
          'event_label': label,
          'value': value
        });
      }
    } catch (error) {
      console.error('Error tracking Google Analytics event:', error);
    }
  },
  
  facebookPixel: (eventName: string, data?: Record<string, any>) => {
    try {
      if (typeof window.fbq === 'function') {
        window.fbq('track', eventName, data);
      }
    } catch (error) {
      console.error('Error tracking Facebook Pixel event:', error);
    }
  },
  
  twitterPixel: (eventName: string, data?: Record<string, any>) => {
    try {
      if (typeof window.twq === 'function') {
        window.twq('track', eventName, data);
      }
    } catch (error) {
      console.error('Error tracking Twitter Pixel event:', error);
    }
  }
};

// Declare global window interfaces for type safety
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    twq?: (...args: any[]) => void; 
    clarity?: (command: string, value: string, options?: any) => void;
  }
}

interface TrackingSettings {
  id: number;
  googleAnalyticsId: string | null;
  facebookPixelId: string | null;
  microsoftClarityId: string | null;
  hotjarId: string | null;
  linkedInTrackingId: string | null;
  googleTagManagerId: string | null;
  twitterPixelId: string | null;
  customScripts: string | null;
}

/**
 * Lazy loads a script by injecting it into the DOM
 */
const loadScript = (src: string, id: string, async = true, defer = true): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = async;
    script.defer = defer;
    script.onload = () => resolve();
    script.onerror = (error) => reject(error);
    
    document.head.appendChild(script);
  });
};

/**
 * Injects script content directly into the DOM
 */
const injectScriptContent = (content: string, id: string): void => {
  if (document.getElementById(id)) return;
  
  const script = document.createElement('script');
  script.id = id;
  script.innerHTML = content;
  document.head.appendChild(script);
};

const TrackingScripts: React.FC = () => {
  const { data: tracking } = useQuery<TrackingSettings>({
    queryKey: ['/api/settings/tracking'],
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!tracking) return;

    // Initialize tracking scripts after page load to prioritize core content loading
    const initializeTrackingScripts = () => {
      // Google Analytics
      if (tracking.googleAnalyticsId) {
        loadScript(
          `https://www.googletagmanager.com/gtag/js?id=${tracking.googleAnalyticsId}`,
          'google-analytics'
        ).then(() => {
          injectScriptContent(`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${tracking.googleAnalyticsId}');
          `, 'google-analytics-config');
        }).catch(err => console.error('Error loading Google Analytics:', err));
      }

      // Facebook Pixel
      if (tracking.facebookPixelId) {
        injectScriptContent(`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
          document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${tracking.facebookPixelId}');
          fbq('track', 'PageView');
        `, 'facebook-pixel');
      }

      // Microsoft Clarity
      if (tracking.microsoftClarityId) {
        injectScriptContent(`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${tracking.microsoftClarityId}");
        `, 'microsoft-clarity');
      }

      // Google Tag Manager
      if (tracking.googleTagManagerId) {
        injectScriptContent(`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${tracking.googleTagManagerId}');
        `, 'google-tag-manager');
      }

      // Twitter Pixel
      if (tracking.twitterPixelId) {
        injectScriptContent(`
          !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
          },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
          a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
          twq('config','${tracking.twitterPixelId}');
        `, 'twitter-pixel');
      }

      // LinkedIn Tracking
      if (tracking.linkedInTrackingId) {
        injectScriptContent(`
          _linkedin_partner_id = "${tracking.linkedInTrackingId}";
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
        `, 'linkedin-tracking');
      }

      // Hotjar
      if (tracking.hotjarId) {
        injectScriptContent(`
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${tracking.hotjarId},hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `, 'hotjar');
      }

      // Custom scripts
      if (tracking.customScripts) {
        try {
          const customScriptsElement = document.createElement('div');
          customScriptsElement.innerHTML = tracking.customScripts;
          
          // Extract and execute scripts
          const scripts = customScriptsElement.querySelectorAll('script');
          scripts.forEach((script, index) => {
            if (script.src) {
              loadScript(script.src, `custom-script-${index}`, true, true)
                .catch(err => console.error(`Error loading custom script ${index}:`, err));
            } else if (script.innerHTML) {
              injectScriptContent(script.innerHTML, `custom-script-inline-${index}`);
            }
          });
        } catch (error) {
          console.error('Error processing custom scripts:', error);
        }
      }
    };

    // Wait until the page has fully loaded to initialize non-critical tracking scripts
    if (document.readyState === 'complete') {
      initializeTrackingScripts();
    } else {
      window.addEventListener('load', initializeTrackingScripts);
      return () => window.removeEventListener('load', initializeTrackingScripts);
    }
  }, [tracking]);

  return null; // This component doesn't render anything
};

export default TrackingScripts;