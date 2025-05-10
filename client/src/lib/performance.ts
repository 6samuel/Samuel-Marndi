/**
 * Utility functions for performance optimization
 */

/**
 * Lazy loads an external script after the page has loaded
 */
export function loadScriptDeferred(src: string, id: string, async = true, defer = true): Promise<HTMLScriptElement> {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    if (document.getElementById(id)) {
      resolve(document.getElementById(id) as HTMLScriptElement);
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = async;
    script.defer = defer;
    
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    
    // Add to document
    document.body.appendChild(script);
  });
}

/**
 * Loads third-party tracking scripts only after the initial page render 
 * to prioritize core content loading
 */
export function loadTrackingScripts() {
  // Wait for page to be fully loaded and idle
  if (document.readyState === 'complete') {
    setTimeout(() => {
      // Load analytics, marketing scripts, etc.
      // These will be loaded on demand when needed
      // and only after the main content is displayed
    }, 2000); // 2 second delay after page is loaded
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => {
        // Same as above but waits for load event first
      }, 2000);
    });
  }
}

/**
 * Applies content-visibility: auto to elements below the fold
 * to improve initial render performance
 */
export function optimizeBelowFoldContent() {
  // Add a class to elements that are likely below the fold
  const markBelowFoldElements = () => {
    // Get viewport height
    const viewportHeight = window.innerHeight;
    
    // Find elements that start below viewport
    document.querySelectorAll('section, .section').forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.top > viewportHeight) {
        element.classList.add('deferred-section');
      }
    });
  };

  // Run after initial render
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(markBelowFoldElements, 100);
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(markBelowFoldElements, 100); 
    });
  }
}