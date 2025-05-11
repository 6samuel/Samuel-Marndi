import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { optimizeFontLoading, loadOptimizedFonts } from "@/lib/font-optimization";
import { loadDeferredScripts, setupLazyLoading } from "@/lib/performance";

// Performance optimization
if (typeof window !== 'undefined') {
  // Execute critical optimizations immediately
  const startTime = performance.now();
  
  // Execute after the window loads to not block initial rendering
  window.addEventListener('load', () => {
    optimizeFontLoading();
    
    // Optimize font loading
    loadOptimizedFonts();
    
    // Apply lazy loading to images
    setupLazyLoading();
    
    // Deferred loading of non-critical scripts
    loadDeferredScripts([
      // Add any third-party scripts here
    ]);
    
    // Log performance metrics (helpful for development)
    console.log(`Page fully loaded in ${(performance.now() - startTime).toFixed(0)}ms`);
    
    // Report performance metrics
    if ('performance' in window && 'getEntriesByType' in performance) {
      // Wait for LCP to be calculated
      setTimeout(() => {
        const paintMetrics = performance.getEntriesByType('paint');
        const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navEntry) {
          const fcp = paintMetrics.find(({ name }) => name === 'first-contentful-paint')?.startTime;
          console.log(`First Contentful Paint: ${fcp?.toFixed(0)}ms`);
          console.log(`DOM Content Loaded: ${(navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart).toFixed(0)}ms`);
          console.log(`Time to Interactive: ${(navEntry.domInteractive - navEntry.fetchStart).toFixed(0)}ms`);
        }
      }, 3000);
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <Helmet>
      <meta name="description" content="Professional web development and digital marketing services by Samuel Marndi. Custom websites, SEO, UI/UX design, and more." />
      <meta property="og:title" content="Samuel Marndi | Web Development & Digital Marketing" />
      <meta property="og:description" content="Professional web development and digital marketing services. Custom websites, SEO, UI/UX design, and more." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://samuelmarndi.com" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Samuel Marndi | Web Development & Digital Marketing" />
      <meta name="twitter:description" content="Professional web development and digital marketing services. Custom websites, SEO, UI/UX design, and more." />
    </Helmet>
    <App />
  </HelmetProvider>
);
