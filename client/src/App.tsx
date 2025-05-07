import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { HelmetProvider } from "react-helmet-async";

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

// Admin Pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminServices from "@/pages/admin/services";
import AdminPortfolio from "@/pages/admin/portfolio";
import AdminBlog from "@/pages/admin/blog";
import AdminTestimonials from "@/pages/admin/testimonials";
import AdminForms from "@/pages/admin/forms";
import AdminCampaigns from "@/pages/admin/campaigns";
import AdminTracking from "@/pages/admin/tracking";
import AdminSettings from "@/pages/admin/settings";

// Layout components
import SiteHeader from "@/components/layouts/site-header";
import SiteFooter from "@/components/layouts/site-footer";
import WhatsAppButton from "@/components/ui/whatsapp-button";

function Router() {
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
        <ProtectedRoute path="/admin/forms" component={AdminForms} adminOnly />
        <ProtectedRoute path="/admin/campaigns" component={AdminCampaigns} adminOnly />
        <ProtectedRoute path="/admin/tracking" component={AdminTracking} adminOnly />
        <ProtectedRoute path="/admin/settings" component={AdminSettings} adminOnly />
        
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
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="sm-theme">
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
