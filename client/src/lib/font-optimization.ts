// Font optimization utilities

/**
 * Adds proper font display settings and preconnect hints
 * This ensures text remains visible during font loading
 */
export function optimizeFontLoading() {
  if (typeof window === 'undefined') return;
  
  // Add preconnect for Google Fonts if you're using them
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  
  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
  
  // Set proper font-display on all font-face rules
  const styleSheets = Array.from(document.styleSheets);
  
  try {
    styleSheets.forEach(sheet => {
      try {
        if (sheet.href && (sheet.href.includes('fonts.googleapis.com') || sheet.href.includes('fonts'))) {
          const rules = Array.from(sheet.cssRules || []);
          rules.forEach(rule => {
            if (rule instanceof CSSFontFaceRule) {
              // Add font-display: swap to show text while fonts are loading
              (rule as any).style.fontDisplay = 'swap';
            }
          });
        }
      } catch (error) {
        // CORS might prevent reading some external stylesheets
        console.log('Could not optimize fonts in external stylesheet');
      }
    });
  } catch (error) {
    console.log('Error optimizing fonts:', error);
  }
}

/**
 * Loads only the font weights and styles that are actually used
 * This reduces the amount of font data that needs to be downloaded
 */
export function loadOptimizedFonts() {
  // This is a utility to inject optimized font loading
  // Replace the default Google Fonts CSS with a more optimized one
  const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
  
  fontLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.includes('text=')) {
      // Extract font information and rebuild with only necessary characters
      // Example optimization for Latin only
      const optimizedHref = href.includes('?') 
        ? `${href}&display=swap&text=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,;:!?@#%&-_+="'()` 
        : `${href}?display=swap&text=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,;:!?@#%&-_+="'()`;
      
      link.setAttribute('href', optimizedHref);
    }
  });
}