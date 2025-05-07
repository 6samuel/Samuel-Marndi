import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Menu, X, Code, BarChart2, Palette, Search, ShoppingCart, Smartphone, 
  Sun, Moon, Server, Shield, HeadphonesIcon, Binary, BrainCircuit, BoxesIcon,
  Laptop, Building, Network, Users, Construction, Blocks
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";

const SiteHeader = () => {
  const [location] = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Partners", href: "/partners" },
    { name: "Hire Me", href: "/hire" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLinkClick = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b shadow-sm"
          : "bg-white dark:bg-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <img 
                src="/images/logo-icon.png" 
                alt="Samuel Marndi Logo" 
                className="h-8 w-auto" 
              />
              <span className="font-bold text-xl text-gray-800 dark:text-white">
                SAMUEL MARNDI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex md:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                    location === item.href
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Theme Toggle and Mobile Menu */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Get Quote Button (Desktop) */}
            {!isMobile && (
              <Link href="/contact">
                <Button>Get a Quote</Button>
              </Link>
            )}

            {/* Mobile Menu */}
            {isMobile && (
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Menu">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader className="pb-6">
                    <SheetTitle className="text-left">Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`px-2 py-1 rounded-md ${
                          location === item.href
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-medium mb-2">Services</h3>
                    <div className="space-y-2">
                      <Link
                        href="/services/web-development"
                        onClick={handleLinkClick}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <Code className="h-4 w-4" />
                        <span>Web Development</span>
                      </Link>
                      <Link
                        href="/services/digital-marketing"
                        onClick={handleLinkClick}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <BarChart2 className="h-4 w-4" />
                        <span>Digital Marketing</span>
                      </Link>
                      <Link
                        href="/services/ui-ux-design"
                        onClick={handleLinkClick}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <Palette className="h-4 w-4" />
                        <span>UI/UX Design</span>
                      </Link>
                      <Link
                        href="/services/seo-optimization"
                        onClick={handleLinkClick}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <Search className="h-4 w-4" />
                        <span>SEO Optimization</span>
                      </Link>
                      <Link
                        href="/services/ecommerce-solutions"
                        onClick={handleLinkClick}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>E-commerce Solutions</span>
                      </Link>
                      <Link
                        href="/services/mobile-app-development"
                        onClick={handleLinkClick}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <Smartphone className="h-4 w-4" />
                        <span>Mobile App Development</span>
                      </Link>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Link href="/contact" onClick={handleLinkClick}>
                      <Button className="w-full">Get a Quote</Button>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
