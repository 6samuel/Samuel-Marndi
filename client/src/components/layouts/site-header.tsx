import React, { useState, useEffect } from "react";
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
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { 
  Menu, Code, BarChart2, Palette, Search, ShoppingCart, Smartphone, 
  Sun, Moon, Phone, Mail, Linkedin, Twitter, Github, Facebook,
  CreditCard, ChevronDown, Briefcase, PaintBucket, Bot, Database,
  CloudLightning, BrainCircuit, GanttChart, LayoutGrid, Languages,
  Presentation, ScrollText, ScanFace, Zap, Bolt, Heart, Code2, Wrench,
  ChevronRight, Calendar
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
});
ListItem.displayName = "ListItem";

const SiteHeader = () => {
  const [location] = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "IT Services", href: "/services" },
    { name: "Partner", href: "/partners" },
    { name: "Contact", href: "/contact" },
  ];
  
  // Additional navigation items that will appear in mobile menu only
  const mobileNavItems = [
    ...navItems,
    { name: "Consultation", href: "/consultation" },
    { name: "Payment", href: "/payment" },
  ];
  
  // Service categories for mega menu
  const serviceCategories = [
    {
      name: "Web Development",
      description: "Custom website and web application development",
      href: "/services/web-development",
      icon: <Code className="h-5 w-5 text-blue-500" />,
      services: [
        { name: "Full-Stack Development", href: "/services/web-development#full-stack" },
        { name: "Front-End Development", href: "/services/web-development#front-end" },
        { name: "Back-End Development", href: "/services/web-development#back-end" },
        { name: "E-commerce Development", href: "/services/ecommerce-solutions" },
        { name: "CMS Development", href: "/services/web-development#cms" },
      ]
    },
    {
      name: "Digital Marketing",
      description: "Comprehensive digital marketing solutions",
      href: "/services/digital-marketing",
      icon: <BarChart2 className="h-5 w-5 text-green-500" />,
      services: [
        { name: "SEO Optimization", href: "/services/seo-optimization" },
        { name: "Social Media Marketing", href: "/services/digital-marketing#social" },
        { name: "Content Marketing", href: "/services/digital-marketing#content" },
        { name: "Email Marketing", href: "/services/digital-marketing#email" },
        { name: "PPC Campaigns", href: "/services/digital-marketing#ppc" },
      ]
    },
    {
      name: "App Development",
      description: "Mobile and desktop application development",
      href: "/services/mobile-app-development",
      icon: <Smartphone className="h-5 w-5 text-purple-500" />,
      services: [
        { name: "iOS Development", href: "/services/mobile-app-development#ios" },
        { name: "Android Development", href: "/services/mobile-app-development#android" },
        { name: "Cross-Platform Apps", href: "/services/mobile-app-development#cross-platform" },
        { name: "Desktop Applications", href: "/services/mobile-app-development#desktop" },
        { name: "PWA Development", href: "/services/mobile-app-development#pwa" },
      ]
    },
    {
      name: "Design Services",
      description: "Creative design solutions for digital products",
      href: "/services/ui-ux-design",
      icon: <Palette className="h-5 w-5 text-pink-500" />,
      services: [
        { name: "UI/UX Design", href: "/services/ui-ux-design" },
        { name: "Brand Identity", href: "/services/ui-ux-design#brand" },
        { name: "Logo Design", href: "/services/ui-ux-design#logo" },
        { name: "Prototyping", href: "/services/ui-ux-design#prototype" },
        { name: "Wireframing", href: "/services/ui-ux-design#wireframe" },
      ]
    },
    {
      name: "AI & Cloud Services",
      description: "Advanced AI integration and cloud solutions",
      href: "/services/ai-services",
      icon: <BrainCircuit className="h-5 w-5 text-orange-500" />,
      services: [
        { name: "AI Integration", href: "/services/ai-services" },
        { name: "Cloud Architecture", href: "/services/cloud-services" },
        { name: "DevOps Services", href: "/services/devops-services" },
        { name: "Database Management", href: "/services/database-services" },
        { name: "API Development", href: "/services/api-development" },
      ]
    }
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
    <header className="w-full z-50 sticky top-0">
      {/* Top Contact Bar */}
      <div className="bg-gray-100 dark:bg-gray-800 py-2 text-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex items-center space-x-4 mb-2 md:mb-0 overflow-x-auto">
              <a href="mailto:mail@samuelmarndi.com" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground whitespace-nowrap">
                <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="hidden sm:inline">mail@samuelmarndi.com</span>
                <span className="sm:hidden">Email</span>
              </a>
              <a href="mailto:samuelmarandi6@gmail.com" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground whitespace-nowrap">
                <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="hidden sm:inline">samuelmarandi6@gmail.com</span>
                <span className="sm:hidden">Email 2</span>
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
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b shadow-md"
          : "bg-white dark:bg-gray-900 border-b"
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Logo size="lg" />
              </Link>
            </div>

            {/* Desktop Navigation with Mega Menu */}
            {!isMobile && (
              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList>
                  {/* Home Link */}
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link 
                        href="/"
                        className={cn(
                          "inline-flex items-center px-4 py-2 text-sm font-medium transition-colors",
                          location === "/" 
                            ? "text-primary"
                            : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                        )}
                      >
                        Home
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  
                  {/* IT Services Mega Menu */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger 
                      className={cn(
                        "text-sm bg-transparent hover:bg-transparent hover:text-primary dark:hover:text-primary focus:bg-transparent",
                        location === "/services" || location.includes("/services/")
                          ? "text-primary"
                          : "text-gray-600 dark:text-gray-300"
                      )}
                    >
                      IT Services
                    </NavigationMenuTrigger>
                    
                    <NavigationMenuContent className="bg-white dark:bg-gray-900 shadow-lg">
                      <div className="grid grid-cols-5 w-[850px] gap-0 p-4">
                        <div className="col-span-2 border-r border-gray-100 dark:border-gray-800 p-4">
                          <div className="mb-2 mt-1 text-lg font-medium leading-none text-gray-900 dark:text-gray-100">
                            All Services
                          </div>
                          <p className="mb-4 text-sm leading-snug text-gray-500 dark:text-gray-400">
                            Comprehensive IT solutions for businesses of all sizes
                          </p>
                          
                          <div className="grid grid-cols-2 gap-3">
                            {serviceCategories.map((category) => (
                              <Link 
                                key={category.name} 
                                href={category.href}
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 group transition-all"
                                onClick={handleLinkClick}
                              >
                                <div className="flex-shrink-0">
                                  {category.icon}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary">
                                    {category.name}
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                    {category.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                        
                        <div className="col-span-3 p-4">
                          <div className="grid grid-cols-3 gap-4">
                            {serviceCategories.map((category) => (
                              <div key={category.name} className="space-y-2">
                                <div className="flex items-center mb-2">
                                  {category.icon}
                                  <h3 className="text-sm font-semibold ml-2 text-gray-900 dark:text-gray-100">
                                    {category.name}
                                  </h3>
                                </div>
                                <ul className="space-y-1">
                                  {category.services.map((service) => (
                                    <li key={service.name}>
                                      <Link
                                        href={service.href}
                                        className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-foreground"
                                        onClick={handleLinkClick}
                                      >
                                        {service.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 w-full p-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Need a custom solution?
                          </div>
                          <Link 
                            href="/contact" 
                            className="text-sm flex items-center font-medium text-primary hover:text-primary/80"
                          >
                            Get a free consultation
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  {/* Partner Link */}
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link 
                        href="/partners"
                        className={cn(
                          "inline-flex items-center px-4 py-2 text-sm font-medium transition-colors",
                          location === "/partners" 
                            ? "text-primary"
                            : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                        )}
                      >
                        Partner
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  
                  {/* Contact Link */}
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link 
                        href="/contact"
                        className={cn(
                          "inline-flex items-center px-4 py-2 text-sm font-medium transition-colors",
                          location === "/contact" 
                            ? "text-primary"
                            : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                        )}
                      >
                        Contact
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
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
                  <Link href="/consultation" className="mr-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Consultation</span>
                    </Button>
                  </Link>
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
                      {mobileNavItems.map((item) => (
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
                    <div className="mt-8 space-y-2">
                      <Link href="/consultation" onClick={handleLinkClick} className="w-full">
                        <Button variant="outline" className="w-full flex items-center justify-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Book Consultation</span>
                        </Button>
                      </Link>
                      <div className="flex space-x-2">
                        <Link href="/contact" onClick={handleLinkClick} className="flex-1">
                          <Button className="w-full">Get a Quote</Button>
                        </Link>
                        <Link href="/hire" onClick={handleLinkClick} className="flex-1">
                          <Button variant="default" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">Hire Me</Button>
                        </Link>
                      </div>
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