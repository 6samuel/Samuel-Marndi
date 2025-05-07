import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Mail, 
  FileText, 
  Briefcase, 
  Image, 
  MessageSquare, 
  BarChart, 
  Settings, 
  FileCode, 
  LogOut, 
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { href: "/admin/forms", label: "Form Submissions", icon: <FileText className="w-5 h-5" /> },
  { href: "/admin/services", label: "Services", icon: <Briefcase className="w-5 h-5" /> },
  { href: "/admin/portfolio", label: "Portfolio", icon: <Image className="w-5 h-5" /> },
  { href: "/admin/blog", label: "Blog", icon: <FileText className="w-5 h-5" /> },
  { href: "/admin/campaigns", label: "Email Campaigns", icon: <Mail className="w-5 h-5" /> },
  { href: "/admin/tracking", label: "Ad Tracking", icon: <BarChart className="w-5 h-5" /> },
  { href: "/admin/code", label: "Custom Code", icon: <FileCode className="w-5 h-5" /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // If not an admin, redirect to login
  if (!user || user.role !== "admin") {
    return <Redirect to="/admin/login" />;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r bg-card">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/" className="flex items-center gap-2">
              <img
                className="w-8 h-8"
                src="/logo.svg"
                alt="Logo"
              />
              <span className="text-xl font-semibold tracking-wide">Sam Marndi</span>
            </Link>
          </div>
          <div className="flex flex-col flex-grow mt-5">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-primary/10"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 p-4 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center w-full px-2">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(user.name || user.username)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{user.name || user.username}</p>
                      <p className="text-xs text-muted-foreground">Admin</p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 ml-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="sm:max-w-xs">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
                <img className="w-8 h-8" src="/logo.svg" alt="Logo" />
                <span className="text-xl font-semibold tracking-wide">Sam Marndi</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-primary/10"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="p-4 mt-auto border-t">
              <Button variant="destructive" className="w-full" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <div className="relative z-10 flex h-16 bg-background shrink-0 border-b shadow-sm">
          <div className="flex justify-between flex-1 px-4 md:px-6">
            <div className="flex items-center md:hidden">
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" aria-hidden="true" />
                  <span className="sr-only">Open sidebar</span>
                </Button>
              </SheetTrigger>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" target="_blank" className="text-sm text-muted-foreground hover:text-primary">
                View Website
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="md:hidden" asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(user.name || user.username)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <main className="relative flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="px-4 mx-auto md:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}