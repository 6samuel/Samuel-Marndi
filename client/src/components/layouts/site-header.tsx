import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Menu, Code, BarChart2, Palette, Search, ShoppingCart, Smartphone, 
  Sun, Moon, Phone, Mail, Linkedin, Twitter, Github, Facebook
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
    { name: "Partner", href: "/partners" },
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
    <header className="w-full z-40">
      {/* Top Contact Bar */}
      <div className="bg-gray-100 dark:bg-gray-800 py-2 text-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex items-center space-x-4 mb-2 md:mb-0 overflow-x-auto">
              <a href="mailto:samuelmarandi6@gmail.com" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground whitespace-nowrap">
                <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="hidden sm:inline">samuelmarandi6@gmail.com</span>
                <span className="sm:hidden">Email</span>
              </a>
              <a href="https://wa.me/+918280320550" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground whitespace-nowrap">
                <Phone className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>+91 8280320550</span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://www.linkedin.com/in/samuel-marndi/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://twitter.com/SamuelMarndi" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://github.com/6samuel" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://www.facebook.com/samuel.marndi/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className={`transition-all duration-200 ${
        isScrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b shadow-sm"
          : "bg-white dark:bg-gray-900"
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Logo size="lg" />
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

              {/* Action Buttons (Desktop) */}
              {!isMobile && (
                <div className="flex items-center space-x-2">
                  <Link href="/contact">
                    <Button>Get a Quote</Button>
                  </Link>
                  <Link href="/hire">
                    <Button variant="default" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">Hire Me</Button>
                  </Link>
                </div>
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
                    <div className="mt-8 flex space-x-2">
                      <Link href="/contact" onClick={handleLinkClick} className="flex-1">
                        <Button className="w-full">Get a Quote</Button>
                      </Link>
                      <Link href="/hire" onClick={handleLinkClick} className="flex-1">
                        <Button variant="default" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">Hire Me</Button>
                      </Link>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;