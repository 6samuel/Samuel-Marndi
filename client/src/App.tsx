import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense, useEffect } from "react";
import { setupLazyLoading, trackPagePerformance, loadDeferredScripts, optimizeCriticalRendering, addResourceHints } from "@/lib/performance";
import { optimizeFontLoading, loadOptimizedFonts } from "@/lib/font-optimization";

// Lazy load tracking scripts and other non-critical components
const TrackingScripts = lazy(() => 
  import("@/components/tracking/tracking-scripts").then(module => ({
    default: module.default
  }))
);

// Google Ads tracking
const GoogleAdsClickTracking = lazy(() => 
  import("@/components/tracking/google-ads-click-tracking").then(module => ({
    default: module.default
  }))
);

// Campaign tracking
const CampaignTracker = lazy(() => 
  import("@/components/tracking/campaign-tracker").then(module => ({
    default: module.default
  }))
);

// Import campaign tracking utilities
import { getDefaultTrackerId } from "@/lib/campaign-tracking";

// Pages
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Services from "@/pages/services";
import ServiceDetail from "@/pages/service-detail";
import Portfolio from "@/pages/portfolio";
import PortfolioItem from "@/pages/portfolio-item";
import Partners from "@/pages/partners";
import Hire from "@/pages/hire";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import Contact from "@/pages/contact";
import Payment from "@/pages/payment";
import Consultation from "@/pages/consultation";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsConditions from "@/pages/terms-conditions";
import RefundPolicy from "@/pages/refund-policy";
import CookiePolicy from "@/pages/cookie-policy";
import DigitalMarketing from "@/pages/digital-marketing";

// Admin Pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminServices from "@/pages/admin/services";
import AdminPortfolio from "@/pages/admin/portfolio";
import AdminBlog from "@/pages/admin/blog";
import AdminTestimonials from "@/pages/admin/testimonials";
import AdminConsultations from "@/pages/admin/consultations";
import AdminForms from "@/pages/admin/forms";
import AdminCampaigns from "@/pages/admin/campaigns";
import AdminAdTrackers from "@/pages/admin/ad-trackers";
import AdminSettings from "@/pages/admin/settings";
import AdminContentManagement from "@/pages/admin/content-management";
import AdminMarketingCampaigns from "@/pages/admin/marketing-campaigns";

// Layout components
import SiteHeader from "@/components/layouts/site-header";
import SiteFooter from "@/components/layouts/site-footer";
import WhatsAppButton from "@/components/ui/whatsapp-button";

function Router() {
  const [location] = useLocation();
  
  // Check if current route is an admin route
  const isAdminRoute = location && location.startsWith('/admin');
  
  // Apply or remove the admin route attribute on the body element
  useEffect(() => {
    if (isAdminRoute) {
      document.body.setAttribute('data-admin-route', 'true');
    } else {
      document.body.removeAttribute('data-admin-route');
    }
    
    // Cleanup function to ensure attribute is removed when component unmounts
    return () => {
      document.body.removeAttribute('data-admin-route');
    };
  }, [isAdminRoute]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Switch>
        {/* Admin routes - without the header/footer */}
        <Route path="/admin/login" component={AdminLogin} />
        <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} adminOnly />
        <ProtectedRoute path="/admin/services" component={AdminServices} adminOnly />
        <ProtectedRoute path="/admin/portfolio" component={AdminPortfolio} adminOnly />
        <ProtectedRoute path="/admin/blog" component={AdminBlog} adminOnly />
        <ProtectedRoute path="/admin/testimonials" component={AdminTestimonials} adminOnly />
        <ProtectedRoute path="/admin/consultations" component={AdminConsultations} adminOnly />
        <ProtectedRoute path="/admin/forms" component={AdminForms} adminOnly />
        <ProtectedRoute path="/admin/campaigns" component={AdminCampaigns} adminOnly />
        <ProtectedRoute path="/admin/ad-trackers" component={AdminAdTrackers} adminOnly />
        <ProtectedRoute path="/admin/settings" component={AdminSettings} adminOnly />
        <ProtectedRoute path="/admin/content" component={AdminContentManagement} adminOnly />
        <ProtectedRoute path="/admin/marketing-campaigns" component={AdminMarketingCampaigns} adminOnly />
        
        {/* Regular site routes - with header/footer */}
        <Route>
          <SiteHeader />
          <main className="flex-grow">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/services" component={Services} />
              <Route path="/services/:slug" component={ServiceDetail} />
              <Route path="/portfolio" component={Portfolio} />
              <Route path="/portfolio/:slug" component={PortfolioItem} />
              <Route path="/partners" component={Partners} />
              <Route path="/hire" component={Hire} />
              <Route path="/blog" component={Blog} />
              <Route path="/blog/:slug" component={BlogPost} />
              <Route path="/contact" component={Contact} />
              <Route path="/payment" component={Payment} />
              <Route path="/consultation" component={Consultation} />
              <Route path="/privacy-policy" component={PrivacyPolicy} />
              <Route path="/terms-conditions" component={TermsConditions} />
              <Route path="/refund-policy" component={RefundPolicy} />
              <Route path="/cookie-policy" component={CookiePolicy} />
              <Route path="/services/digital-marketing" component={DigitalMarketing} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <SiteFooter />
          <WhatsAppButton />
        </Route>
      </Switch>
    </div>
  );
}

function App() {
  // Initialize performance optimizations
  useEffect(() => {
    // Start performance tracking
    trackPagePerformance();
    
    // Set up lazy loading for images
    setupLazyLoading();
    
    // Optimize font loading
    optimizeFontLoading();
    loadOptimizedFonts();
    
    // Load non-critical scripts after page load
    loadDeferredScripts([
      // Add any third-party scripts that aren't critical for initial render
    ]);
    
    // Preload critical resources
    optimizeCriticalRendering();
    
    // Add resource hints for faster connections
    addResourceHints({
      preconnect: [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://images.unsplash.com'
      ],
      prefetch: [
        // Prefetch URLs for next navigation (like important pages)
        '/services',
        '/contact'
      ]
    });
    
    // Add scroll behavior polyfill for smoother navigation
    document.documentElement.style.scrollBehavior = 'smooth';
    
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="sm-theme" enableSystem>
            <TooltipProvider>
              <Toaster />
              <Suspense fallback={null}>
                <TrackingScripts />
                <GoogleAdsClickTracking conversionId="AW-11554500257" conversionLabel="ZTjnCL66spUYEKCn9ZAp" />
                <CampaignTracker trackerId={getDefaultTrackerId()} />
              </Suspense>
              <Router />
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
