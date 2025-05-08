/**
 * Font optimization script that adds preconnect links for Google Fonts
 * and dynamically inserts font-display: swap CSS for better performance
 */

export function optimizeFontLoading(): void {
  // Add preconnect links for Google Fonts
  const preconnectHosts = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];

  preconnectHosts.forEach(host => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = host;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // Insert CSS rule to ensure all fonts use font-display: swap
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-display: swap !important;
    }
  `;
  document.head.appendChild(style);
  
  // For Google Fonts specifically - modify their URLs to include display=swap parameter
  const links = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.includes('display=swap')) {
      const separator = href.includes('?') ? '&' : '?';
      link.setAttribute('href', `${href}${separator}display=swap`);
    }
  });
}

/**
 * Preload critical fonts to improve page load performance
 * @param fontUrls Array of font URLs to preload
 */
export function preloadCriticalFonts(fontUrls: string[]): void {
  fontUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}