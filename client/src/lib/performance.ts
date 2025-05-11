/**
 * Performance optimization utilities
 * These functions help improve website loading speed and user experience
 */

/**
 * Sets up lazy loading for images throughout the application
 * This reduces initial load time by only loading images when they're about to enter the viewport
 */
export function setupLazyLoading() {
  if (typeof window === 'undefined') return;

  // Use native lazy loading if available
  const supportsLazyLoading = 'loading' in HTMLImageElement.prototype;
  
  if (supportsLazyLoading) {
    // Add loading="lazy" to all images that don't have it
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
  } else {
    // Fallback for browsers that don't support native lazy loading
    // Use Intersection Observer API
    const loadImage = (image: HTMLImageElement) => {
      const src = image.getAttribute('data-src');
      if (src) {
        image.src = src;
        image.removeAttribute('data-src');
      }
    };

    const handleIntersection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage(entry.target as HTMLImageElement);
          observer.unobserve(entry.target);
        }
      });
    };

    // Create and configure the intersection observer
    const imgObserver = new IntersectionObserver(handleIntersection, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Find all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imgObserver.observe(img));
  }
}

/**
 * Defer non-critical scripts loading
 * @param scriptUrls Array of script URLs to load after page rendering
 */
export function loadDeferredScripts(scriptUrls: string[]) {
  if (typeof window === 'undefined') return;
  
  // Detect when the page has finished loading
  if (document.readyState === 'complete') {
    loadScripts(scriptUrls);
  } else {
    window.addEventListener('load', () => loadScripts(scriptUrls));
  }
}

function loadScripts(scriptUrls: string[]) {
  scriptUrls.forEach(url => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    document.body.appendChild(script);
  });
}

/**
 * Optimizes critical rendering path by preloading essential resources
 */
export function optimizeCriticalRendering() {
  if (typeof window === 'undefined') return;

  // High priority resources that should be preloaded
  const criticalResources: string[] = [
    // Add critical resources here (logo, hero images, etc.)
    // For example:
    // '/logo.svg',
    // '/hero-image.webp'
  ];

  criticalResources.forEach(resource => {
    if (resource.endsWith('.css')) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = resource;
      document.head.appendChild(link);
    } else if (resource.endsWith('.js')) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = resource;
      document.head.appendChild(link);
    } else if (/\.(jpe?g|png|gif|svg|webp)$/i.test(resource)) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = resource;
      document.head.appendChild(link);
    }
  });

  // Add a preconnect for domains from which resources will be fetched
  const domainsToPreconnect: string[] = [
    // Add domains here that are important for first render
    // For example:
    // 'https://fonts.googleapis.com',
    // 'https://images.unsplash.com'
  ];

  domainsToPreconnect.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    document.head.appendChild(link);
  });
}

/**
 * Measure and log performance metrics
 */
export function trackPagePerformance() {
  if (typeof window === 'undefined' || !window.performance || !window.performance.timing) {
    return;
  }

  // Wait for the page to fully load before calculating metrics
  window.addEventListener('load', () => {
    setTimeout(() => {
      const timing = window.performance.timing;
      
      // Calculate important metrics
      const dcl = timing.domContentLoadedEventEnd - timing.navigationStart;
      const load = timing.loadEventEnd - timing.navigationStart;
      const fcp = performance.getEntriesByName('first-contentful-paint')?.[0]?.startTime || 0;
      
      // Log performance metrics
      console.info('⚡️ Performance metrics:');
      console.info(`  • DOMContentLoaded: ${dcl}ms`);
      console.info(`  • Load Time: ${load}ms`);
      console.info(`  • First Contentful Paint: ${Math.round(fcp)}ms`);
      
      // Report to analytics service if needed
      // This could be expanded to send performance data to your analytics platform
    }, 0);
  });

  // We could track Core Web Vitals here if we had the web-vitals package
  // For now, we'll use the basic performance metrics above
  console.info('Core Web Vitals tracking would require the web-vitals package');
}

/**
 * Optimize CSS delivery
 * Extracts critical CSS and inlines it for faster rendering
 */
export function optimizeCSSDelivery() {
  // This is a placeholder for potential future implementation
  // Typically requires server-side setup or build-time processing
  console.log('CSS delivery optimization should be handled at build time');
}

/**
 * Implements resource hints to improve page loading speed
 * @param {Object} options Configuration object for resource hints
 */
export function addResourceHints(options: {
  preconnect?: string[],
  prefetch?: string[],
  preload?: {url: string, as: string}[]
}) {
  if (typeof window === 'undefined') return;
  
  const { preconnect = [], prefetch = [], preload = [] } = options;
  
  // Add preconnect links
  preconnect.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    document.head.appendChild(link);
  });
  
  // Add prefetch links (for resources likely needed for the next navigation)
  prefetch.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
  
  // Add preload links (for resources needed in the current page)
  preload.forEach(({ url, as }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    document.head.appendChild(link);
  });
}