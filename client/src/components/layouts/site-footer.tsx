import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isValidEmail } from "@/lib/utils";
import { FaLinkedin, FaTwitter, FaGithub, FaInstagram } from "react-icons/fa";

const SiteFooter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/subscribe", { email });
      toast({
        title: "Success!",
        description: "You've been added to the newsletter.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Unable to subscribe at this time. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Brand and info */}
          <div className="md:col-span-4">
            <Link to="/">
              <span className="text-xl font-bold text-primary">Samuel Marndi</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              Professional web development and digital marketing services to help businesses achieve their online goals.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-foreground transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <FaTwitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-foreground transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-foreground transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-foreground transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <FaInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Services Links */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">
              Services
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/services/web-development" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-foreground">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/services/digital-marketing" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-foreground">
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link to="/services/ui-ux-design" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-foreground">
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link to="/services/seo-optimization" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-foreground">
                  SEO Optimization
                </Link>
              </li>
              <li>
                <Link to="/services/ecommerce-solutions" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-foreground">
                  E-commerce Solutions
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company Links */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-foreground">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Client Actions */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">
              Client Resources
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/payment" className="inline-flex items-center text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-foreground space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  <span>Make a Payment</span>
                </Link>
              </li>
              <li>
                <Link to="/consultation" className="inline-flex items-center text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-foreground space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>Book Consultation</span>
                </Link>
              </li>
              <li>
                <Link to="/partners" className="inline-flex items-center text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-foreground space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span>Partner Program</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="md:col-span-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">
              Subscribe to newsletter
            </h3>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Get the latest news and articles to your inbox every month.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 sm:flex">
              <Input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col sm:flex-row justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} Samuel Marndi. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-6">
            <Link to="/terms-conditions" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
              Terms of Service
            </Link>
            <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link to="/cookie-policy" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
              Cookie Policy
            </Link>
            <Link to="/refund-policy" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
